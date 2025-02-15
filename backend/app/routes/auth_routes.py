from flask import Blueprint, jsonify, request
from pymongo.errors import PyMongoError
from utils.auth_utils import hash_password, verify_password
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash, generate_password_hash
from models.user_model import UserModel
from models.level_model import LevelModel
import pronouncing  # Import the pronouncing library for phonetic breakdown

auth_bp = Blueprint('auth', __name__)
user_model = UserModel()
level_model = LevelModel()

def get_phonetic_breakdown(word):
    phones = pronouncing.phones_for_word(word)
    if phones:
        # Take the first phonetic representation if multiple exist
        phonemes = phones[0].split()

        # Remove stress markers (primary stress / and secondary stress ,)
        phonemes = [phoneme for phoneme in phonemes if not ('/' in phoneme or ',' in phoneme )]
        
        return phonemes
    else:
        return ["No phonetic breakdown found."]

@auth_bp.route('/test_db', methods=['GET'])
def test_db():
    try:
        test_data = {"test": "connection successful"}
        user_model.db["test_collection"].insert_one(test_data)
        data = user_model.db["test_collection"].find_one({"test": "connection successful"})
        return jsonify({"message": "Connected successfully!", "data": data["test"]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    securityQuestion = data.get('securityQuestion')
    securityAnswer = data.get('securityAnswer')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    if user_model.find_by_email(email):
        return jsonify({"error": "User already exists"}), 400

    hashed_password = hash_password(password)
    hashed_security_answer = hash_password(securityAnswer)

    user_model.create_user(email, hashed_password, name, securityQuestion, hashed_security_answer)
    return jsonify({"message": "User registered successfully"}), 201

@auth_bp.route('/signin', methods=['POST'])
def signin():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = user_model.find_by_email(email)
    if not user or not verify_password(password, user['password']):
        return jsonify({"error": "Invalid email or password"}), 401

    token = create_access_token(identity=str(user['_id']))
    return jsonify({"token": token, "message": "Login successful"}), 200

@auth_bp.route('/phonetic', methods=['POST'])
def phonetic_breakdown():
    """
    Route to process the word and return its phonetic breakdown.
    """
    data = request.json
    word = data.get("word")
    
    if not word:
        return jsonify({"error": "Word is required"}), 400
    
    phonetic_results = get_phonetic_breakdown(word)
    return jsonify({"word": word, "phonetic_breakdown": phonetic_results}), 200

# Other existing routes for levels, signup, signin, etc.
@auth_bp.route('/get-security-question', methods=['POST'])
def get_security_question():
    try:
        data = request.json
        email = data.get('email')

        if not email:
            return jsonify({"error": "Email is required"}), 400

        user = user_model.find_by_email(email)
        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({"securityQuestion": user["securityQuestion"]}), 200

    except PyMongoError as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    try:
        data = request.json
        email = data.get('email')
        securityAnswer = data.get('securityAnswer')
        newPassword = data.get('newPassword')

        if not email or not securityAnswer or not newPassword:
            return jsonify({"error": "All fields are required"}), 400

        user = user_model.find_by_email(email)
        if not user:
            return jsonify({"error": "User not found"}), 404

        if not check_password_hash(user["securityAnswer"], securityAnswer):
            return jsonify({"error": "Incorrect security answer"}), 400

        hashed_password = generate_password_hash(newPassword)
        user_model.update_password(email, hashed_password)

        return jsonify({"success": True, "message": "Password reset successfully"}), 200

    except PyMongoError as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500

# Level Routes
@auth_bp.route('/levels', methods=['GET'])
def get_levels():
    try:
        levels = level_model.get_all_levels()
        return jsonify({"levels": levels}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@auth_bp.route('/levels/<int:level_number>/words', methods=['GET'])
def get_level_words(level_number):
    """
    Retrieve words and their associated images for a specific level.
    """
    try:
        categories = level_model.get_level_words(level_number)
        
        words = [
            {"word": word_obj.get("word"), "imageUrl": word_obj.get("imageUrl")}
            for category in categories
            for word_obj in category.get("words", [])
        ]
        print(f"API Response for level {level_number}: {categories}")

        return jsonify({"words": words}), 200
    
    except KeyError as ke:
        print(f"KeyError in get_level_words: {ke}")
        return jsonify({"error": "Invalid data structure for level words"}), 400
    
    except Exception as e:
        print(f"Error in get_level_words: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500
