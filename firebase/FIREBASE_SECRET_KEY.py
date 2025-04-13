# import firebase_admin
# from firebase_admin import credentials, db
# import json

# # ✅ Initialize app ONLY ONCE, with the correct credentials and database URL
# cred_obj = credentials.Certificate('/home/jacob/Downloads/fire-insurance-claim-app-firebase-adminsdk-fbsvc-46ec306df0.json')

# firebase_admin.initialize_app(cred_obj, {
#     'databaseURL': 'https://fire-insurance-claim-app-default-rtdb.firebaseio.com/'  # 🔁 Replace with your actual URL
# })

# # ✅ Set an initial value
# ref = db.reference("/")
# ref.set({
#     "Books": {
#         "Best_Sellers": -1
#     }
# })

# # ✅ Add book entries from JSON
# ref = db.reference("/Books/Best_Sellers")
# with open("book_info.json", "r") as f:
#     file_contents = json.load(f)

# for key, value in file_contents.items():
#     ref.push().set(value)

import firebase_admin
from firebase_admin import credentials, db
import json

# Initialize Firebase
cred = credentials.Certificate(
    'fire-insurance-claim-app-firebase-adminsdk-fbsvc-46ec306df0.json')

firebase_admin.initialize_app(cred, {
    'databaseURL':
    'https://fire-insurance-claim-app-default-rtdb.firebaseio.com/'
})

# Load JSON
with open("firebase/book_info.json") as f:
    data = json.load(f)

# Write entire data
ref = db.reference('users')
ref.set(data)


