from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from pymongo import MongoClient
from routes.auth_routes import auth_bp
from routes.audio_routes import audio_bp
from utils.error_handler import register_error_handlers
from config import Config

app = Flask(__name__)
CORS(app)

# Load configurations
app.config.from_object(Config)

# Initialize JWT
jwt = JWTManager(app)

# MongoDB Setup
client = MongoClient(app.config['MONGODB_URI'])
db = client[app.config['DB_NAME']]

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(audio_bp, url_prefix='/api')

# Register error handlers
register_error_handlers(app)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
