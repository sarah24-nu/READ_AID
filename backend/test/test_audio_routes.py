import pytest
from flask import Flask
from unittest.mock import Mock, patch, MagicMock
import os
from app.routes.audio_routes import audio_bp, reencode_audio
from app.audioprocessing import process_audio
import sys
import io
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'app')))



@pytest.fixture
def app():
    app = Flask(__name__)
    app.register_blueprint(audio_bp)
    return app

@pytest.fixture
def client(app):
    return app.test_client()

# Test reencode_audio function
def test_reencode_audio_successful():
    with patch('subprocess.run') as mock_run:
        input_path = "test_input.wav"
        output_path = "test_output.wav"
        reencode_audio(input_path, output_path)
        mock_run.assert_called_once()

def test_reencode_audio_failed():
    with patch('subprocess.run') as mock_run:
        mock_run.side_effect = Exception("FFmpeg error")
        with pytest.raises(Exception):
            reencode_audio("input.wav", "output.wav")

def test_process_audio_route_successful(client):
    with patch('app.routes.audio_routes.process_audio') as mock_process, \
         patch('app.routes.audio_routes.extract_pitch_formants_intensity') as mock_extract, \
         patch('app.routes.audio_routes.detect_pauses') as mock_pauses, \
         patch('app.routes.audio_routes.calculate_speech_speed_and_fluency') as mock_speed, \
         patch('app.routes.audio_routes.text_to_speech_with_features') as mock_tts, \
         patch('app.routes.audio_routes.collection.insert_one') as mock_insert:

        mock_process.return_value = "test transcription"
        mock_extract.return_value = (100, 0.5)
        mock_pauses.return_value = [(0, 1)]
        mock_speed.return_value = 150
        mock_insert.return_value = Mock(inserted_id="test_id")

        # ✅ Open temp.wav as a test file
        temp_wav_path = "app/temp.wav"
        assert os.path.exists(temp_wav_path), "temp.wav does not exist in uploads/"

        with open(temp_wav_path, "rb") as audio_file:
            data = {'audio': (audio_file, 'temp.wav')}
            response = client.post('/process_audio', data=data, content_type='multipart/form-data')

        assert response.status_code == 200
        assert b"Audio processed" in response.data

def test_generate_voice_from_db_no_text(client):
    """ Test /generate_voice_from_db when no text is provided """
    response = client.post('/generate_voice_from_db', json={})  # ✅ Send valid JSON but no "text" key
    assert response.status_code == 400
    assert b"Text is required" in response.data  # ✅ Match the actual error message


def test_text_to_speech_route_successful(client):
    with patch('app.routes.audio_routes.text_to_speech_with_features') as mock_tts:
        data = {
            'text': 'Hello world',
            'pitch': 50,
            'intensity': 100,
            'speech_speed': 150
        }
        response = client.post('/generate_voice_from_db', json=data)
        assert response.status_code == 500
        assert b"Speech generated successfully!!" in response.data

# Test error handling
def test_process_audio_route_encoding_error(client):
    with patch('app.routes.audio_routes.reencode_audio') as mock_reencode:
        mock_reencode.side_effect = Exception("Encoding error")
        
        # ✅ Open temp.wav as a test file
        temp_wav_path = "app/temp.wav"
        assert os.path.exists(temp_wav_path), "temp.wav does not exist in uploads/"

        with open(temp_wav_path, "rb") as audio_file:
            data = {'audio': (audio_file, 'temp.wav')}
            response = client.post('/process_audio', data=data, content_type='multipart/form-data')

        
        assert response.status_code == 500
        assert b"Audio re-encoding failed" in response.data  # Ensure the error message is returned

def test_text_to_speech_route_error(client):
    with patch('app.routes.audio_routes.text_to_speech_with_features') as mock_tts:
        mock_tts.side_effect = Exception("TTS error")
        data = {'text': 'Hello world'}
        response = client.post('/generate_voice_from_db', json=data)
        assert response.status_code == 500