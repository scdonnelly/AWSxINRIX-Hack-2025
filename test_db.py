import boto3
from moto import mock_dynamodb
import pytest
from db import StudentData

@mock_dynamodb
def test_database_functions():
    # Setup mock DynamoDB
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    student_db = StudentData(dynamodb)
    
    # Create table
    student_db.create_table('test-table')
    
    # Test data
    test_student = {
        'company': 'test_company',
        'FirstName': 'John',
        'LastName': 'Doe',
        'FullName': 'John Doe',
        'assignments': [{'name': 'Math Quiz', 'score': 85}, {'name': 'Science Test', 'score': 92}],
        'BonusPoints': [],
        'Attendance': []
    }
    
    # Test add student
    student_db.add_student(test_student)
    
    # Test get all students
    students = student_db.get_all_students('test_company')
    assert len(students) == 1
    assert students[0]['FullName'] == 'John Doe'
    
    # Test add multiple students
    students_data = [
        {'FirstName': 'Jane', 'LastName': 'Smith', 'assignments': [{'name': 'History Essay', 'score': 88}, {'name': 'Art Project', 'score': 95}]},
        {'FirstName': 'Mike', 'LastName': 'Johnson', 'assignments': [{'name': 'Physics Lab', 'score': 78}, {'name': 'Chemistry Quiz', 'score': 82}]},
        {'FirstName': 'Sarah', 'LastName': 'Wilson', 'assignments': [{'name': 'English Paper', 'score': 91}, {'name': 'Literature Review', 'score': 87}]},
        {'FirstName': 'David', 'LastName': 'Brown', 'assignments': [{'name': 'Biology Test', 'score': 89}, {'name': 'Geography Quiz', 'score': 84}]},
        {'FirstName': 'Emily', 'LastName': 'Davis', 'assignments': [{'name': 'Music Theory', 'score': 93}, {'name': 'Piano Recital', 'score': 96}]}
    ]
    
    for student in students_data:
        student_db.add_student({
            'company': 'test_company',
            'FirstName': student['FirstName'],
            'LastName': student['LastName'],
            'FullName': f"{student['FirstName']} {student['LastName']}",
            'assignments': student['assignments'],
            'BonusPoints': [],
            'Attendance': []
        })
    
    students = student_db.get_all_students('test_company')
    assert len(students) == 6
    
    print("All database tests passed!")

if __name__ == '__main__':
    test_database_functions()
