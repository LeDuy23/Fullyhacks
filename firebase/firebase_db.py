import firebase_admin
from firebase_admin import credentials, db, storage
from datetime import datetime
import json
import os
from dotenv import load_dotenv
import firebase_image2
import mimetypes

# Initialize Firebase
cred_firebase = credentials.Certificate(
    "fire-insurance-claim-app-firebase-adminsdk-fbsvc-1a0e50a113.json")

if not firebase_admin._apps:
firebase_admin.initialize_app(
    cred_firebase,
    {
        'databaseURL':
        'https://fire-insurance-claim-app-default-rtdb.firebaseio.com/',
        'storageBucket':
        'gs://fire-insurance-claim-app.firebasestorage.app'  # ✅ Note: this is usually appspot.com, not firebasestorage.app
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


#Takes in a local file and uploads it to the firebase storage
# Returns the public URL of the uploaded file
def upload_file_to_storage(local_file_path, storage_path):
    bucket = storage.bucket()
    blob = bucket.blob(storage_path)

    # Guess content type
    content_type, _ = mimetypes.guess_type(local_file_path)
    if content_type is None and local_file_path.endswith(".heic"):
        content_type = "image/heic"

    blob.upload_from_filename(local_file_path, content_type=content_type)
    blob.make_public()  # optional — makes the file accessible by public URL

    print(f"✅ Uploaded: {local_file_path}")
    print(f"🔗 Public URL: {blob.public_url}")
    return blob.public_url


# Test it
upload_file_to_storage('firebase/item1.png', "users/user123/items/item1.png")
