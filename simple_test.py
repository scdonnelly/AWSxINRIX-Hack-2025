from userinfo import UserData

# Test basic class instantiation
print("Testing UserData class...")

# Mock DynamoDB resource
class MockDynamoDB:
    pass

user_data = UserData(MockDynamoDB())
print("✓ UserData class instantiated successfully")

# Test user_data dictionary
print(f"✓ User data structure: {user_data.user_data}")

print("Basic tests completed - class structure is valid!")
