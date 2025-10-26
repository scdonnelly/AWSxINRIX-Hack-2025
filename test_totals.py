import os
import boto3
from decimal import Decimal
from db import StudentData

# Load credentials from .env.example file
def load_env():
    try:
        with open('.env.example', 'r') as f:
            for line in f:
                if '=' in line and not line.startswith('#'):
                    key, value = line.strip().split('=', 1)
                    if value:
                        os.environ[key] = value
    except FileNotFoundError:
        print("Please create .env.example file with your AWS credentials")
        exit()

load_env()

# Create DynamoDB resource
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
student_db = StudentData(dynamodb)
student_db.table = dynamodb.Table('hackathon-test-table')

try:
    print("Testing total calculation functions...")
    
    # Add some test data
    student_db.add_StudentData("TotalTest", "Alice", "Johnson", 95)
    student_db.add_StudentData("TotalTest", "Bob", "Smith", 90)
    
    # Add assignment columns
    student_db.add_assignment_column("Quiz1", 0)
    student_db.add_assignment_column("Quiz2", 0)
    student_db.add_assignment_column("Midterm", 0)
    
    # Add scores
    student_db.update_single_assignment("TotalTest", "Alice Johnson", "Quiz1", Decimal('85'))
    student_db.update_single_assignment("TotalTest", "Alice Johnson", "Quiz2", Decimal('90'))
    student_db.update_single_assignment("TotalTest", "Alice Johnson", "Midterm", Decimal('88'))
    
    student_db.update_single_assignment("TotalTest", "Bob Smith", "Quiz1", Decimal('78'))
    student_db.update_single_assignment("TotalTest", "Bob Smith", "Quiz2", Decimal('82'))
    student_db.update_single_assignment("TotalTest", "Bob Smith", "Midterm", Decimal('85'))
    
    print("Added test data and scores")
    
    # Test 1: Calculate total for one student
    alice_total = student_db.calculate_total_for_events(
        "TotalTest", 
        "Alice Johnson", 
        ["Quiz1", "Quiz2", "Midterm"]
    )
    print(f"\nAlice's total (Quiz1 + Quiz2 + Midterm): {alice_total}")
    
    # Test 2: Calculate quiz total only
    alice_quiz_total = student_db.calculate_total_for_events(
        "TotalTest", 
        "Alice Johnson", 
        ["Quiz1", "Quiz2"]
    )
    print(f"Alice's quiz total (Quiz1 + Quiz2): {alice_quiz_total}")
    
    # Test 3: Calculate totals for all students
    all_totals = student_db.calculate_totals_for_all_students(
        "TotalTest", 
        ["Quiz1", "Quiz2", "Midterm"]
    )
    
    print(f"\nAll students' totals:")
    for result in all_totals:
        print(f"  {result['name']}: {result['total']}")
        print(f"    Events: {result['events']}")
    
    print("\nTotal calculation functions are working!")
    
except Exception as e:
    print(f"Error: {e}")
