import boto3
from db import StudentData

# Create DynamoDB resource (using local or AWS)
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')

# Create StudentData instance
student_db = StudentData(dynamodb)

# Test table creation
try:
    table = student_db.create_table('test-student-table')
    print("✅ Table created successfully!")
    print(f"Table name: {table.table_name}")
    print(f"Table status: {table.table_status}")
    
    # Test adding a student
    student_db.add_StudentData(
        company="TestCompany",
        firstName="John",
        lastName="Doe", 
        attendance=95
    )
    print("✅ Student added successfully!")
    
    # Test querying students
    students = student_db.query_data("TestCompany")
    print(f"✅ Found {len(students)} students")
    for student in students:
        print(f"  - {student['FullName']}")
        
except Exception as e:
    print(f"❌ Error: {e}")
