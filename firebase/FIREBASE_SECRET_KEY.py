import firebase_admin
from firebase_admin import credentials, firestore, db
import json

cred = credentials.RefreshToken('path/to/refreshToken.json')

default_app = firebase_admin.initialize_app()

db = firestore.client()



cred_obj = credentials.Certificate('/home/jacob/Downloads/fire-insurance-claim-app-firebase-adminsdk-fbsvc-46ec306df0.json')
default_app = firebase_admin.initialize_app(cred_obj, {
    'databaseURL':db
    })


ref = db.reference("/")
ref.set({
    "Books":
    {
        "Best_Sellers": -1
    }
})

ref = db.reference("/Books/Best_Sellers")
import json
with open("book_info.json", "r") as f:
    file_contents = json.load(f)

for key, value in file_contents.items():
    ref.push().set(value)