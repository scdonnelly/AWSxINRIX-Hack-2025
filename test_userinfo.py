import boto3
from userinfo import UserData

# Create DynamoDB resource
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')

# Create UserData instance
user_db = UserData(dynamodb)

# Test table creation
try:
    table = user_db.create_table('test-user-table')
    print("✅ Table created successfully!")
    print(f"Table name: {table.table_name}")
    
    # Test adding a user
    user_db.add_user("john_doe", "password123", "admin")
    print("✅ User added successfully!")
    
    # Test getting user data
    user = user_db.get_data("john_doe")
    if user:
        print(f"✅ User found: {user['username']}, Role: {user['role']}")
    else:
        print("❌ User not found")
        
except Exception as e:
    print(f"❌ Error: {e}")
