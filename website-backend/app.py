from flask import Flask, request, jsonify
from flask_basicauth import BasicAuth
import os

app = Flask(__name__)

# Basic Authentication Configuration
app.config['BASIC_AUTH_USERNAME'] = 'admin'  # Replace with your username
app.config['BASIC_AUTH_PASSWORD'] = 'mypassword'  # Replace with your password
basic_auth = BasicAuth(app)

# Folder to store uploaded files
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def home():
    return "Welcome to my personal website backend!"

@app.route('/admin/update-profile', methods=['POST'])
@basic_auth.required
def update_profile():
    if 'file' not in request.files:
        return jsonify({'success': False, 'message': 'No file uploaded'})

    file = request.files['file']
    if file:
        filename = file.filename
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        return jsonify({'success': True, 'message': 'Profile updated successfully!', 'filepath': filepath})

    return jsonify({'success': False, 'message': 'Invalid file'})

if __name__ == '__main__':
    app.run(debug=True)
