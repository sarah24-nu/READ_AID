import os
from pyAudioAnalysis import ShortTermFeatures as sF
from pyAudioAnalysis import audioBasicIO
from pydub import AudioSegment
from pydub.silence import detect_silence
import numpy as np
import noisereduce as nr
from scipy.io import wavfile
from scipy.signal import butter, lfilter
import pyttsx3
import speech_recognition as sr

# Add ffmpeg path to system PATH
os.environ["PATH"] += os.pathsep + r"C:\ffmpeg\ffmpeg-7.1-essentials_build\bin"

# Detect pauses in audio
def detect_pauses(file_path, min_silence_len=300, silence_thresh=-35):
    audio = AudioSegment.from_wav(file_path)
    pauses = detect_silence(audio, min_silence_len=min_silence_len, silence_thresh=silence_thresh)
    return [(start / 1000, end / 1000) for start, end in pauses]

# Extract pitch and intensity
def extract_pitch_formants_intensity(audio_file):
    [rate, signal] = audioBasicIO.read_audio_file(audio_file)
    signal = audioBasicIO.stereo_to_mono(signal)
    features, _ = sF.feature_extraction(signal, rate, 0.05 * rate, 0.025 * rate)
    pitch = features[0]  # Pitch (ZCR approximation)
    intensity = features[1]  # Intensity approximation
    return np.mean(pitch), np.mean(intensity)

# Calculate speech speed and fluency
def calculate_speech_speed_and_fluency(audio_file, pauses):
    [rate, signal] = audioBasicIO.read_audio_file(audio_file)
    total_duration = len(signal) / rate
    pause_duration = sum(end - start for start, end in pauses)
    speaking_duration = total_duration - pause_duration
    if speaking_duration <= 0:
        return 0
    estimated_words = speaking_duration / 0.3  # Assuming average word duration
    return estimated_words / total_duration

# Noise reduction
def reduce_noise(input_audio_path, output_cleaned_audio_path, noise_reduction_strength=0.8):
    audio = AudioSegment.from_file(input_audio_path)
    audio.export("temp.wav", format="wav")
    rate, data = wavfile.read("temp.wav")
    if len(data.shape) > 1:
        data = np.mean(data, axis=1)
    filtered_data = highpass_filter(data, cutoff=100, fs=rate)
    reduced_noise = nr.reduce_noise(y=filtered_data, sr=rate, prop_decrease=noise_reduction_strength)
    wavfile.write(output_cleaned_audio_path, rate, reduced_noise.astype(np.int16))

# High-pass filter
def highpass_filter(data, cutoff, fs, order=5):
    nyquist = 0.5 * fs
    normal_cutoff = cutoff / nyquist
    b, a = butter(order, normal_cutoff, btype='high', analog=False)
    return lfilter(b, a, data)

# Speech-to-text
def speech_to_text_from_file(audio_file_path):
    recognizer = sr.Recognizer()
    with sr.AudioFile(audio_file_path) as source:
        audio_data = recognizer.record(source)
        try:
            return recognizer.recognize_google(audio_data)
        except (sr.UnknownValueError, sr.RequestError):
            return None

# Text-to-speech
def text_to_speech_with_features(text, mean_pitch=100, mean_intensity=500.0, speech_speed=200, pauses=[]):
    engine = pyttsx3.init()
    engine.setProperty('rate', int(speech_speed * 100))
    engine.setProperty('volume', mean_intensity)
    engine.setProperty('pitch', mean_pitch)
    engine.say(text)
    engine.runAndWait()

# Main processing function
def process_audio(input_audio_path):
    cleaned_audio_path = "cleaned_audio.wav"
    reduce_noise(input_audio_path, cleaned_audio_path)
    return speech_to_text_from_file(cleaned_audio_path)
