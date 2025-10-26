from flask import Flask, jsonify, request
from flask_cors import CORS
from functools import wraps
import jwt
import datetime
import requests
import bcrypt
import boto3
from db import StudentData
from decimal import Decimal


#storing users in a list for now, will update to store in a database
users = []

password = "password"

bytes = password.encode('utf-8')
salt = bcrypt.gensalt()
hash = bcrypt.hashpw(bytes, salt)

test_user = {
    'username': "Test User",
    'password': hash
}

users.append(test_user)

app = Flask(__name__)
CORS(app)

# Initialize database connection
def get_db():
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    student_db = StudentData(dynamodb)
    student_db.table = dynamodb.Table('hackathon-test-table')
    return student_db

# Helper function to convert Decimal to float for JSON
def decimal_to_float(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    return obj

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


@app.route('/students', methods=['POST'])
@tokenRequirement
def add_student():
    """Add a new student"""
    try:
        body = request.get_json()
        if not body:
            return "User did not provide data", 400
        db = get_db()
        
        db.add_StudentData(
            company=data['company'],
            firstName=data['firstName'],
            lastName=data['lastName'],
            attendance=data['attendance']
        )
        
        return jsonify({"message": "Student added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/')
def welcome():
    return "Hello! :3"
    
@app.route('/createUser', methods=["POST"])
def createUser():
    """
    username = request.form.get('user')
    password = request.form.get('password')
    """
    body = request.get_json()
    if not body:
        return "User did not provide data", 400
    username = body.get('user')
    password = body.get('password')
    if not username:
        return "User did not provide username", 400
    if not password:
        return "User did not provide password", 400
    
    encode = password.encode('utf-8')
    hash = bcrypt.hashpw(encode, salt)

    # stored locally for now, must connect to database when possible
    new_user = {
        'username' : username,
        'password' : hash 
    }

    users.append(new_user)
    
    return jsonify("Welcome " + username), 200
    
@app.route('/login', methods=["POST"])
def findUser():
    """
    username = request.form.get('user')
    password = request.form.get('password')
    """
    key = str(request.args.get('key'))
    body = request.get_json()
    if not body:
        return "User did not provide data", 400
    username = body.get('user')
    password = body.get('password')
    if not username:
        return "User did not provide username", 400
    if not password:
        return "User did not provide password", 400
    
    bytes = password.encode('utf-8')
    hash = bcrypt.hashpw(bytes, salt)

    for user in users:
        if user["username"] == username:
            if user["password"] == hash:
                token = jwt.encode({'user': username, 'exp': datetime.datetime.now(datetime.timezone.utc)+datetime.timedelta(hours=24)}, key)
                return jsonify(token)
            return jsonify("Password incorrect")

    return jsonify("User not found")


@app.route('/passwordreset', methods=['POST'])
def resetPassword():

    body = request.get_json()
    if not body:
        return "User did not provide data", 400
    email = body.get('email')
    if not email:
        return "User did not provide username", 400

    bytes = password.encode('utf-8')
    hash = bcrypt.hashpw(bytes, salt)

    for user in users:
        if user["username"] == username:
            user["password"] = hash
            return jsonify("Password reset")

    return jsonify("User not found")
# Handling data

# website -> database
# Add points via attendance
# Add points via bonus

# database -> website
# Rank students and return to the website
# Return the data of one student
# Return the data of one event / day

# data storage
# Add a student to dataset
# Manually change student data
# Remove a student 
# Delete an entire classroom (end of the year)

@app.route('/createStudent')
@tokenRequirement
def addStudent():
    body = request.get_json()
    if not body:
        return "User did not provide data", 400
    name = body.get('name')
    if not name:
        return "User did not provide name", 400
    points = body.get('points')
    if not points:
        points = 0
    
    #add student to database

    return jsonify(name + " was added and currently has " + str(points) + " points"), 200




"""
@app.route('/removeStudent')
def deleteStudent():
    body = request.get_json
    if not body:
        return "User did not provide data", 400
    name = body.get('name')
    if not name:
        return "User did not provide name", 400
    
    # use name to retrive student
    # probably loop over data and delete - or delete entire row if possible

"""

if __name__ == '__main__':
    app.run(debug=True, port=3000)