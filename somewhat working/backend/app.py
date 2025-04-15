from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, db

app = Flask(__name__)
CORS(app)

cred = credentials.Certificate('secrets/firebase_admin_config.json')
firebase_admin.initialize_app(cred)
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://fire-insurance-claim-app-default-rtdb.firebaseio.com/',
    })

@app.route("/api/items", methods=["GET"])
def get_items():
    ref = db.reference("users/user123/items")
    data = ref.get()
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True, port=5000)