import firebase_admin
from firebase_admin import credentials, storage
import mimetypes

# ✅ Initialize Firebase (you only do this once per run)
cred = credentials.Certificate(
    "fire-insurance-claim-app-firebase-adminsdk-fbsvc-46ec306df0.json")

firebase_admin.initialize_app(
    cred,
    {
        'storageBucket':
        'fire-insurance-claim-app.appspot.com'  # change to your real bucket
    })


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


upload_file_to_storage('firebase/5.png', "users/user123/items/5.png")
