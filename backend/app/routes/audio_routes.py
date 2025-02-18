import os
from flask import Blueprint, jsonify, request, current_app,send_file
import logging
from app.audioprocessing import (
    process_audio,
    extract_pitch_formants_intensity,
    detect_pauses,
    calculate_speech_speed_and_fluency,
    text_to_speech_with_features,
)
from pymongo import MongoClient
from app.config import Config
import subprocess
from werkzeug.utils import secure_filename
from datetime import datetime
audio_global_data = ""


logging.basicConfig(level=logging.DEBUG)
audio_bp = Blueprint('audio', __name__)
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


AUDIO_FOLDER='audioUploads'
os.makedirs(AUDIO_FOLDER,exist_ok=True)

client = MongoClient(Config.MONGODB_URI, serverSelectionTimeoutMS=5000)
db = client["audio_database"]
collection = db["audio_features"]

# Re-encode audio for compatibility
def reencode_audio(input_path, output_path):
    command = ['ffmpeg', '-y', '-i', input_path, '-acodec', 'pcm_s16le', '-ar', '44100', output_path]
    subprocess.run(command, check=True, stderr=subprocess.DEVNULL)

@audio_bp.route('/process_audio', methods=['POST'])
def process_audio_route():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files['audio']
    if audio_file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    original_path = os.path.join(UPLOAD_FOLDER, audio_file.filename)
    audio_file.save(original_path)

    try:
        reencoded_path = os.path.join(UPLOAD_FOLDER, 'reencoded_audio.wav')
        reencode_audio(original_path, reencoded_path)
    except Exception as e:
        logging.error(f"Audio re-encoding failed: {e}")
        return jsonify({"error": "Audio re-encoding failed"}), 500

    try:
        transcription = process_audio(reencoded_path)
        pitch, intensity = extract_pitch_formants_intensity(reencoded_path)
        pauses = detect_pauses(reencoded_path, min_silence_len=300, silence_thresh=-35)
        speech_speed = calculate_speech_speed_and_fluency(reencoded_path, pauses)
        text_to_speech_with_features(transcription or "Audio transcription failed.", pitch, intensity, speech_speed, pauses)

        # Save to database
        audio_data = {
            "filename": audio_file.filename,
            "transcription": transcription,
            "pitch": pitch,
            "intensity": intensity,
            "speech_speed": speech_speed,
            "pauses": pauses,
        }
        result = collection.insert_one(audio_data)
        global audio_global_data
        audio_global_data = audio_data
    except Exception as e:
        logging.error(f"Error in processing audio: {e}")
        return jsonify({"error": str(e)}), 500

    # Clean up
    try:
        os.remove(original_path)
        os.remove(reencoded_path)
    except Exception as e:
        logging.warning(f"Error deleting files: {e}")


    return jsonify({
        "id": str(result.inserted_id),
        "message": "Audio processed and voice synthesized successfully",
        "features": {
            "pitch": pitch,
            "intensity": intensity,
            "speech_speed": speech_speed,
            "pauses": pauses,
        }
    })

@audio_bp.route('/generate_voice_from_db', methods=['POST'])
def generate_voice_from_db():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Text is required"}), 400  # Handle missing JSON data

        text = data.get('text', "Default speech")
        if not text:
            return jsonify({"error": "Text is required"}), 400  # Handle missing text

        pitch = audio_global_data.get("pitch", 100)
        intensity = 0.6
        speech_speed = 0.8
        pauses = audio_global_data.get("pauses", [])

        # Generate a unique filename
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        filename = f"speech_output_{timestamp}.mp3"
        filepath = os.path.join(AUDIO_FOLDER, filename)

        # Check if folder exists, create if needed
        if not os.path.exists(AUDIO_FOLDER):
            os.makedirs(AUDIO_FOLDER)

        # Generate the audio file
        text_to_speech_with_features(text, pitch, intensity, speech_speed, pauses)

        # Verify file was created
        if not os.path.exists(filepath):
            return jsonify({"error": "Speech generated successfully!!"}), 500

        # Send the file directly to the frontend
        return send_file(filepath, mimetype="audio/mpeg")

    except Exception as e:
        current_app.logger.error(f"Error generating speech: {str(e)}")
        return jsonify({"error": str(e)}), 500
