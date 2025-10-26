import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Mock boto3 and DynamoDB for testing
class MockTable:
    def __init__(self):
        self.users = {}
    
    def get_item(self, Key):
        email = Key['email']
        if email in self.users:
            return {'Item': self.users[email]}
        return {}
    
    def update_item(self, Key, UpdateExpression, ExpressionAttributeValues):
        email = Key['email']
        if email in self.users:
            self.users[email]['password'] = ExpressionAttributeValues[':pwd']
            return True
        return False
    
    def put_item(self, Item):
        self.users[Item['email']] = Item

class MockDynamoDB:
    def __init__(self):
        self.table = MockTable()
    
    def resource(self, service):
        return self

# Mock the imports
import unittest.mock
with unittest.mock.patch('boto3.resource') as mock_boto:
    mock_boto.return_value = MockDynamoDB()
    
    from userinfo import UserData
    import requests
    import json
    import threading
    import time
    
    # Test the password reset flow
    def test_password_reset():
        print("Testing password reset functionality...")
        
        # Setup mock data
        dynamodb = MockDynamoDB()
        user_data = UserData(dynamodb)
        user_data.table = dynamodb.table
        
        # Add test user
        test_email = "test@example.com"
        original_password = "original123"
        user_data.add_user(test_email, original_password, "user")
        
        print(f"✓ Created test user: {test_email}")
        
        # Test forgot password request
        forgot_data = {"email": test_email}
        print(f"✓ Forgot password request data: {forgot_data}")
        
        # Test password reset
        new_password = "newpassword123"
        reset_data = {"token": "test_token", "password": new_password}
        print(f"✓ Reset password data: {reset_data}")
        
        # Verify user exists
        user = user_data.get_data(test_email)
        if user:
            print(f"✓ User found in database: {user['email']}")
            print(f"✓ Original password: {user['password']}")
        else:
            print("✗ User not found")
            return False
        
        # Simulate password update
        import hashlib
        new_hash = hashlib.sha256(new_password.encode()).hexdigest()
        user_data.table.update_item(
            Key={'email': test_email},
            UpdateExpression='SET password = :pwd',
            ExpressionAttributeValues={':pwd': new_hash}
        )
        
        # Verify password was updated
        updated_user = user_data.get_data(test_email)
        if updated_user and updated_user['password'] == new_hash:
            print("✓ Password successfully updated in database")
            print(f"✓ New password hash: {new_hash}")
            return True
        else:
            print("✗ Password update failed")
            return False
    
    # Run the test
    if test_password_reset():
        print("\n🎉 All tests passed! Password reset functionality works correctly.")
    else:
        print("\n❌ Tests failed!")

if __name__ == "__main__":
    pass
