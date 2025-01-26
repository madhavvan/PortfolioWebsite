from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json

app = Flask(__name__)
CORS(app)

# Folder to save uploaded files
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Ensure the folder exists
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# File to store profile picture metadata
PROFILE_METADATA = 'profile.json'

# Initialize profile.json if it doesn't exist
if not os.path.exists(PROFILE_METADATA):
    with open(PROFILE_METADATA, 'w') as f:
        json.dump({'profilePicture': 'images/profilepic.jpg'}, f)

# Route to verify the server is running
@app.route('/', methods=['GET'])
def home():
    return "Flask server is running!"

# Route to handle file uploads
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'success': False, 'message': 'No file uploaded'})

    file = request.files['file']
    if file:
        filename = file.filename
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        # Update profile.json with the new file path
        with open(PROFILE_METADATA, 'w') as f:
            json.dump({'profilePicture': f'http://127.0.0.1:5000/uploads/{filename}'}, f)

        return jsonify({'success': True, 'imageUrl': f'http://127.0.0.1:5000/uploads/{filename}'})
    return jsonify({'success': False, 'message': 'Invalid file'})

# Route to get the current profile picture
@app.route('/profile-picture', methods=['GET'])
def get_profile_picture():
    with open(PROFILE_METADATA, 'r') as f:
        data = json.load(f)
    return jsonify(data)

# Serve uploaded files
@app.route('/uploads/<filename>', methods=['GET'])
def get_uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
