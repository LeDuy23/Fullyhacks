import firebase_admin
from firebase_admin import credentials, db
from datetime import datetime
import json

# Initialize Firebase
cred = credentials.Certificate(
    'fire-insurance-claim-app-firebase-adminsdk-fbsvc-46ec306df0.json')

firebase_admin.initialize_app(cred, {
    'databaseURL':
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
    item['quantity'] = item.get('quantity', 1)
    item['created_at'] = datetime.utcnow().isoformat()
    items_ref.push().set(item)

print("✅ User and items successfully added to Firebase.")
