import pytest
from flask import Flask
from unittest.mock import Mock, patch
from flask_jwt_extended import JWTManager
from app.routes.auth_routes import auth_bp, get_phonetic_breakdown
from app.utils.auth_utils import hash_password, verify_password
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'app')))

@pytest.fixture
def app():
    app = Flask(__name__)
    app.config['JWT_SECRET_KEY'] = 'test-key'  # Set a test secret key
    app.config['TESTING'] = True  # Enable testing mode
    JWTManager(app) 
    app.register_blueprint(auth_bp)
    return app

@pytest.fixture
def client(app):
    return app.test_client()

# Test signup route
def test_signup_missing_fields(client):
    response = client.post('/signup', json={})
    assert response.status_code == 400
    assert b"Email and password are required" in response.data

def test_signup_successful(client):
    with patch('app.routes.auth_routes.user_model.find_by_email') as mock_find, \
         patch('app.routes.auth_routes.user_model.create_user') as mock_create:
        mock_find.return_value = None
        data = {
            'email': 'test@test.com',
            'password': 'password123',
            'name': 'Test User',
            'securityQuestion': 'Pet name?',
            'securityAnswer': 'Rex'
        }
        response = client.post('/signup', json=data)
        assert response.status_code == 201

# Test signin route
def test_signin_missing_fields(client):
    response = client.post('/signin', json={})
    assert response.status_code == 400
    assert b"Email and password are required" in response.data

def test_signin_successful(client):
    with patch('app.routes.auth_routes.user_model.find_by_email') as mock_find, \
         patch('app.routes.auth_routes.verify_password') as mock_verify:
        mock_find.return_value = {'_id': '123', 'password': 'hashed'}
        mock_verify.return_value = True
        data = {
            'email': 'test@test.com',
            'password': 'password123'
        }
        response = client.post('/signin', json=data)
        assert response.status_code == 200

# Test phonetic_breakdown route
def test_phonetic_breakdown_missing_word(client):
    response = client.post('/phonetic', json={})
    assert response.status_code == 400
    assert b"Word is required" in response.data

def test_phonetic_breakdown_successful(client):
    with patch('app.routes.auth_routes.get_phonetic_breakdown') as mock_phonetic:
        mock_phonetic.return_value = ['T', 'EH', 'S', 'T']
        response = client.post('/phonetic', json={'word': 'test'})
        assert response.status_code == 200


# Test get_levels route
def test_get_levels_successful(client):
    with patch('app.routes.auth_routes.level_model.get_all_levels') as mock_levels:
        mock_levels.return_value = [{'levelNumber': 1, 'title': 'Level 1'}]
        response = client.get('/levels')
        assert response.status_code == 200

def test_get_levels_error(client):
    with patch('app.routes.auth_routes.level_model.get_all_levels') as mock_levels:
        mock_levels.side_effect = Exception("Database error")
        response = client.get('/levels')
        assert response.status_code == 500

# Test get_level_words route
def test_get_level_words_successful(client):
    with patch('app.routes.auth_routes.level_model.get_level_words') as mock_words:
        mock_words.return_value = [{"words": [{"word": "test", "imageUrl": "test.jpg"}]}]
        response = client.get('/levels/1/words')
        assert response.status_code == 200

def test_get_level_words_error(client):
    with patch('app.routes.auth_routes.level_model.get_level_words') as mock_words:
        mock_words.side_effect = Exception("Database error")
        response = client.get('/levels/1/words')
        assert response.status_code == 500