import firebase_admin
from firebase_admin import credentials, storage

cred = credentials.Certificate(
    "fire-insurance-claim-app-firebase-adminsdk-fbsvc-46ec306df0.json")

firebase_admin.initialize_app(cred, {
  
})

