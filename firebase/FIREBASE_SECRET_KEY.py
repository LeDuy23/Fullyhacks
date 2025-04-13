import firebase_admin
from firebase_admin import credentials, db
from datetime import datetime
import json
import os
from dotenv import load_dotenv
import firebase_image2

#Load the .env variable for our admin key.
load_dotenv()
admin_key = os.getenv(
    'fire-insurance-claim-app-firebase-adminsdk-fbsvc-1a0e50a113.json')
db_url = os.getenv('fire-insurance-claim-app.firebasestorage.app')
print(admin_key)

# Initialize Firebase
cred = credentials.Certificate(
    'fire-insurance-claim-app-firebase-adminsdk-fbsvc-1a0e50a113.json')

if not firebase_admin._apps:
    firebase_admin.initialize_app(
        cred, {
            'fire-insurance-claim-app.firebasestorage.app':
            'https://fire-insurance-claim-app-default-rtdb.firebaseio.com/'
        })

user_id = "user123"

#user metadata
user_ref = db.reference(f'users/{user_id}')
user_ref.set({
    "name": "John Doe",
    "email": "jacob@email.com",
    "address": "123 Main St, Anytown, USA",
    "metadata": {
        "language": "English",
        "currency": "USD"
    }
})

# Load JSON
with open("firebase/house_items_info.json") as f:
    data = json.load(f)

items_ref = db.reference(f'users/{user_id}/items')

for key, item in data.items():
    print(key)
    print(item)

    #upload image to firebase storage
    image_filename = f"{key}.png"
    local_path = f"firebase/{image_filename}"
    storage_path = f"users/{user_id}/items/{image_filename}"
    try:
        image_url = firebase_image2.upload_file_to_storage(
            local_path, storage_path)
    except Exception as e:
        print(f"❌ Failed to upload {image_filename}: {e}")
        image_url = None

    item['image_url'] = image_url
    item['quantity'] = item.get('quantity', 1)
    item['created_at'] = datetime.utcnow().isoformat()
    items_ref.push().set(item)

print("✅ User and items successfully added to Firebase.")
