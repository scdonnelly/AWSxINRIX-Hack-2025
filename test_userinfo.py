import boto3
from moto import mock_dynamodb
from userinfo import UserData

@mock_dynamodb
def test_user_operations():
    # Setup
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    user_data = UserData(dynamodb)
    
    # Test table creation
    table = user_data.create_table('test-users')
    assert table.name == 'test-users'
    
    # Test add user
    user_data.add_user('test@example.com', 'password123', 'user')
    
    # Test get user
    result = user_data.get_data('test@example.com')
    assert result['email'] == 'test@example.com'
    assert result['password'] == 'password123'
    assert result['role'] == 'user'
    
    print("All tests passed!")

if __name__ == "__main__":
    test_user_operations()
