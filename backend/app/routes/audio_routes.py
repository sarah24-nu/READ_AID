import os
from flask import Blueprint, jsonify, request
from audioprocessing import (
    process_audio,
    extract_pitch_formants_intensity,
    detect_pauses,
    calculate_speech_speed_and_fluency,
    text_to_speech_with_features,
)
from pymongo import MongoClient
from config import Config
import subprocess

audio_bp = Blueprint('audio', __name__)
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

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
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    # Clean up
    os.remove(original_path)
    os.remove(reencoded_path)

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
