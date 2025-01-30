import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MONGODB_URI = os.getenv('MONGODB_URI', 'your_mongodb_connection_string')
    MONGODB_LEVEL = os.getenv('MONGODB_LEVEL', 'your_mongodb_connection_string')
    DB_NAME = os.getenv('DB_NAME', 'audio_database')
    LEVEL_DB_NAME = os.getenv('LEVEL_DB_NAME', 'level_database')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your_secret_key')
