import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Mock boto3 for testing
class MockTable:
    def __init__(self):
        self.users = {'test@example.com': {'email': 'test@example.com', 'password': 'hash123', 'role': 'user'}}
    
    def get_item(self, Key):
        email = Key['email']
        if email in self.users:
            return {'Item': self.users[email]}
        return {}
    
    def update_item(self, Key, UpdateExpression, ExpressionAttributeValues):
        email = Key['email']
        if email in self.users:
            self.users[email]['password'] = ExpressionAttributeValues[':pwd']

class MockDynamoDB:
    def __init__(self):
        self.table = MockTable()

import unittest.mock
with unittest.mock.patch('boto3.resource') as mock_boto:
    mock_boto.return_value = MockDynamoDB()
    
    # Import after mocking
    from updated_api import app
    
    def test_endpoints():
        print("Testing API endpoints...")
        
        with app.test_client() as client:
            # Test welcome endpoint
            response = client.get('/')
            print(f"✓ Welcome endpoint: {response.status_code} - {response.get_data(as_text=True)}")
            
            # Test forgot password
            response = client.post('/forgot-password', 
                                 json={'email': 'test@example.com'},
                                 content_type='application/json')
            print(f"✓ Forgot password: {response.status_code}")
            
            if response.status_code == 200:
                data = response.get_json()
                token = data.get('token')
                print(f"✓ Generated token: {token[:10]}...")
                
                # Test password reset
                response = client.post('/passwordreset',
                                     json={'token': token, 'password': 'newpass123'},
                                     content_type='application/json')
                print(f"✓ Password reset: {response.status_code} - {response.get_json()}")
            
            # Test invalid email
            response = client.post('/forgot-password',
                                 json={'email': 'nonexistent@example.com'},
                                 content_type='application/json')
            print(f"✓ Invalid email test: {response.status_code}")
        
        print("\n🎉 API integration tests completed!")
    
    test_endpoints()
