from pymongo import MongoClient
from bson.objectid import ObjectId
from config import Config


class LevelModel:
    def __init__(self):
        
        client = MongoClient(Config.MONGODB_LEVEL)
        self.db = client[Config.LEVEL_DB_NAME]
        self.collection = self.db['level_1']

    def get_all_levels(self):
        
        return list(self.collection.find({}, {"_id": 0, "levelNumber": 1, "title": 1}))

    def get_level_words(self, level_number):
    
        level = self.collection.find_one({"levelNumber": level_number}, {"_id": 0})
        if not level:
            raise Exception(f"Level {level_number} not found.")
        return level.get("categories", [])
