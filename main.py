from fastapi import FastAPI
from pymongo import MongoClient
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# ✅ Initialize FastAPI
app = FastAPI()

# ✅ Enable CORS to allow requests from React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust if needed
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# ✅ Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")  # Make sure MongoDB is running
db = client["voice_form_db"]  # Database name
collection = db["responses"]  # Collection name

# ✅ Define Request Model
class FormResponse(BaseModel):
    answers: list[str]

# ✅ API to Save Data to MongoDB
@app.post("/save-responses")
async def save_responses(data: FormResponse):
    result = collection.insert_one(data.dict())  # Insert data into MongoDB
    return {"message": "Data saved successfully", "id": str(result.inserted_id)}

# ✅ API to Get All Responses from MongoDB
@app.get("/get-responses")
async def get_responses():
    records = list(collection.find({}, {"_id": 0}))  # Exclude MongoDB _id
    return {"responses": records}

# ✅ API to Delete All Responses from MongoDB
@app.delete("/delete-all-responses")
async def delete_all_responses():
    try:
        collection.delete_many({})  # Delete all records in the collection
        return {"message": "All records deleted successfully"}
    except Exception as e:
        return {"message": f"Error deleting records: {str(e)}"}

# ✅ Test Route
@app.get("/")
async def home():
    return {"message": "FastAPI is working!"}
