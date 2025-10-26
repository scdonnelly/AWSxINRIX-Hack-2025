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
import os
from dotenv import load_dotenv

load_dotenv()

aws_access_key = os.getenv('AWS_ACCESS_KEY_ID')
aws_secret_key = os.getenv('AWS_SECRET_ACCESS_KEY')
aws_region = os.getenv('AWS_DEFAULT_REGION')

dynamodb = boto3.resource('dynamodb',
    aws_access_key_id=aws_access_key,
    aws_secret_access_key=aws_secret_key,
    region_name=aws_region
)

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

def add_student():
    """Add a new student"""
    try:
        body = request.get_json()
        if not body:
            return "User did not provide data", 400
        db = get_db()
            
        db.add_StudentData(
            company=body['company'],
            firstName=body['firstName'],
            lastName=body['lastName'],
            attendance=body['attendance']
        )
            
        return jsonify({"message": "Student added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    

    
@app.route('/students', methods=['GET'])
def get_students():
    """Get all students from a company"""
    try:
        db = get_db()
        body = request.get_json()
        if not body:
            return "User did not provide data", 400
        company = body['company']
        if not company:
            return "User did not specify a company", 400
        
        students = db.query_data(company)
        
        # Convert Decimal values to float for JSON
        for student in students:
            for key, value in student.items():
                student[key] = decimal_to_float(value)
        
        return jsonify(students), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
@app.route('/students', methods=['DELETE'])
def delete_student():
    """Delete a student"""
    body = request.get_json()
    if not body:
        return "User did not provide data", 400
    company = body['company']
    if not company:
        return "User did not specify company", 400
    full_name = body['full_name']
    try:
        db = get_db()
        db.delete_student(company, full_name)
        return jsonify({"message": "Student deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
@app.route('/assignments', methods=['POST'])
def add_assignment():
    """Add assignment column to all students"""
    try:
        body = request.get_json()
        if not body:
            return "User did not provide data", 400

        assignment_name = str(body['assignment_name'])
        if not assignment_name:
            return "User did not name assignment", 400

        default_score = Decimal(str(body['default_score']))

        db = get_db()
        if not default_score:
            db.add_assignment_column(
                assignment_name
            )
        else:
            db.add_assignment_column(
                assignment_name,
                default_score
            )
        
        return jsonify({"message": "Assignment column added"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400    
    
@app.route('/assignments/score', methods=['PUT'])
def update_assignment_score():
    """Update individual assignment score"""
    try:
        body = request.get_json()
        if not body:
            return "User did not provide data", 400
        db = get_db()
        
        company = body['company']
        full_name = body['full_name'],
        assignment_name = body['assignment_name'],
        score=Decimal(str(body['score']))
        if not company:
            return "User did not satisfy all requirements"


        db.update_single_assignment(
            company,
            full_name,
            assignment_name,
            score
        )
        
        return jsonify({"message": "Assignment score updated"}), 200
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

if __name__ == '__main__':
    app.run(debug=True, port=3000)