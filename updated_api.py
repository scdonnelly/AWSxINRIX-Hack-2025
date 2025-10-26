from flask import Flask, jsonify, request
from flask_cors import CORS
from functools import wraps
import jwt
import datetime
import boto3
import secrets
import hashlib
from userinfo import UserData

app = Flask(__name__)
CORS(app)
app.config["SECRET_KEY"] = 'thisIsTheSecretKey'

# Initialize DynamoDB and UserData
dynamodb = boto3.resource('dynamodb')
user_data = UserData(dynamodb)
reset_tokens = {}  # {token: {'email': str, 'expires': datetime}}

def tokenRequirement(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.args.get('token')
        key = str(request.args.get('key'))
        if not token:
            return jsonify("Missing authentication token"), 400
        try:
            data = jwt.decode(token, key, algorithms=["HS256"])
        except:
            return jsonify("Token is invalid"), 400
        return f(*args, **kwargs)
    return decorated

@app.route('/')
def welcome():
    return "Hello! :3"

@app.route('/forgot-password', methods=["POST"])
def forgot_password():
    body = request.get_json()
    if not body:
        return "No data provided", 400
    
    email = body.get('email')
    if not email:
        return "Email required", 400
    
    # Check if user exists in DynamoDB
    user = user_data.get_data(email)
    if not user:
        return jsonify("User not found"), 404
    
    # Generate reset token
    token = secrets.token_urlsafe(32)
    expires = datetime.datetime.now() + datetime.timedelta(hours=1)
    
    reset_tokens[token] = {
        'email': email,
        'expires': expires
    }
    
    return jsonify({
        'message': 'Reset token generated',
        'token': token,
        'expires_in': '1 hour'
    }), 200

@app.route('/passwordreset', methods=['POST'])
def password_reset():
    body = request.get_json()
    if not body:
        return "No data provided", 400
    
    token = body.get('token')
    new_password = body.get('password')
    
    if not token or not new_password:
        return "Token and new password required", 400
    
    # Verify token
    if token not in reset_tokens:
        return jsonify("Invalid token"), 400
    
    token_data = reset_tokens[token]
    if datetime.datetime.now() > token_data['expires']:
        del reset_tokens[token]
        return jsonify("Token expired"), 400
    
    # Hash new password
    password_hash = hashlib.sha256(new_password.encode()).hexdigest()
    
    # Update password in DynamoDB
    email = token_data['email']
    try:
        user_data.table.update_item(
            Key={'email': email},
            UpdateExpression='SET password = :pwd',
            ExpressionAttributeValues={':pwd': password_hash}
        )
    except Exception as e:
        return jsonify("Failed to update password"), 500
    
    # Delete used token
    del reset_tokens[token]
    
    return jsonify("Password reset successful"), 200

if __name__ == '__main__':
    app.run(debug=True, port=3000)
