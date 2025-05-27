from pymongo import MongoClient
from bson import ObjectId
import os
from dotenv import load_dotenv

load_dotenv()

# Conexão com MongoDB
MONGODB_URI = os.getenv("MONGODB_URI")
client = MongoClient(MONGODB_URI)
db = client["aws_dashboard"]
users_collection = db["users"]

def get_user_by_username(username: str):
    return users_collection.find_one({"username": username})

def get_user_by_email(email: str):
    return users_collection.find_one({"email": email})

def create_user(user_data):
    user_dict = user_data.dict()
    result = users_collection.insert_one(user_dict)
    user_dict["_id"] = result.inserted_id
    return user_dict
