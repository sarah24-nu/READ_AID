from pymongo import MongoClient
from bson.objectid import ObjectId
from config import Config

class UserModel:
    def __init__(self):
        client = MongoClient(Config.MONGODB_URI)
        self.db = client[Config.DB_NAME]
        self.collection = self.db['users']

    def find_by_email(self, email):
        return self.collection.find_one({"email": email})

    def create_user(self, email, hashed_password,name,securityQuestion,securityAnswer):
        self.collection.insert_one({"email": email, "password": hashed_password, "name": name, "securityQuestion":securityQuestion, "securityAnswer":securityAnswer})

    def update_password(self, email, new_password):
        try:
            self.collection.update_one({"email": email}, {"$set": {"password": new_password}})
        except PyMongoError as e:
            raise Exception(f"Database error: {str(e)}")
        
