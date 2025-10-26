import boto3
from db import StudentData
from flask import Flask, request, jsonify
from decimal import Decimal

app = Flask(__name__)

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

@app.route('/students', methods=['POST'])
def add_student():
    """Add a new student"""
    try:
        data = request.json
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

@app.route('/students/<company>', methods=['GET'])
def get_students(company):
    """Get all students from a company"""
    try:
        db = get_db()
        students = db.query_data(company)
        
        # Convert Decimal values to float for JSON
        for student in students:
            for key, value in student.items():
                student[key] = decimal_to_float(value)
        
        return jsonify(students), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/students/<company>/<full_name>', methods=['DELETE'])
def delete_student(company, full_name):
    """Delete a student"""
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
        data = request.json
        db = get_db()
        
        db.add_assignment_column(
            assignment_name=data['assignment_name'],
            default_score=data.get('default_score', 0)
        )
        
        return jsonify({"message": "Assignment column added"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/assignments/score', methods=['PUT'])
def update_assignment_score():
    """Update individual assignment score"""
    try:
        data = request.json
        db = get_db()
        
        db.update_single_assignment(
            company=data['company'],
            full_name=data['full_name'],
            assignment_name=data['assignment_name'],
            score=Decimal(str(data['score']))
        )
        
        return jsonify({"message": "Assignment score updated"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
@app.route('/totals/create', methods=['POST'])
def create_total_column():
    """Create a total column from existing assignments"""
    try:
        data = request.json
        db = get_db()
        
        db.create_total_column(
            column_names=data['column_names'],
            total_column_name=data['total_column_name']
        )
        
        return jsonify({
            "message": f"Total column '{data['total_column_name']}' created",
            "from_columns": data['column_names']
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400
