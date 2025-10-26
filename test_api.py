import requests
import json

# Test the API endpoints
BASE_URL = "http://localhost:5000"

def test_api():
    print("Testing API endpoints...")
    
    # Test 1: Add a student
    print("\n1. Adding student...")
    student_data = {
        "company": "APITest",
        "firstName": "API",
        "lastName": "Student",
        "attendance": 95
    }
    response = requests.post(f"{BASE_URL}/students", json=student_data)
    print(f"Status: {response.status_code}, Response: {response.json()}")
    
    # Test 2: Get students
    print("\n2. Getting students...")
    response = requests.get(f"{BASE_URL}/students/APITest")
    print(f"Status: {response.status_code}, Students: {response.json()}")
    
    # Test 3: Add assignment
    print("\n3. Adding assignment...")
    assignment_data = {
        "assignment_name": "Quiz1",
        "default_score": 0
    }
    response = requests.post(f"{BASE_URL}/assignments", json=assignment_data)
    print(f"Status: {response.status_code}, Response: {response.json()}")
    
    # Test 4: Update assignment score
    print("\n4. Updating assignment score...")
    score_data = {
        "company": "APITest",
        "full_name": "API Student",
        "assignment_name": "Quiz1",
        "score": 88
    }
    response = requests.put(f"{BASE_URL}/assignments/score", json=score_data)
    print(f"Status: {response.status_code}, Response: {response.json()}")
    
    # Test 5: Get updated students
    print("\n5. Getting updated students...")
    response = requests.get(f"{BASE_URL}/students/APITest")
    print(f"Status: {response.status_code}, Students: {response.json()}")
    
    # Test 6: Delete student
    print("\n6. Deleting student...")
    response = requests.delete(f"{BASE_URL}/students/APITest/API Student")
    print(f"Status: {response.status_code}, Response: {response.json()}")
    
    # Test 7: Verify student deleted
    print("\n7. Verifying student deleted...")
    response = requests.get(f"{BASE_URL}/students/APITest")
    print(f"Status: {response.status_code}, Students: {response.json()}")

if __name__ == "__main__":
    test_api()
