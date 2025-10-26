import logging
import boto3
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key

logger = logging.getLogger(__name__)

class UserData:
    
    #dictionary
    user_data = {
        "email": 'email',
        "password": 'password',
        "role": 'role'
    }
    
    #initialize the connection
    def __init__(self, dyn_resource):
        self.dyn_resource = dyn_resource
        self.table = None

    #create the table
    def create_table(self, table_name):
        try:
            self.table = self.dyn_resource.create_table(
                TableName=table_name,
                KeySchema=[
                    {"AttributeName": "email", "KeyType": "HASH"},  # Partition key
                ],
                AttributeDefinitions=[
                    {"AttributeName": "email", "AttributeType": "S"},
                ],
                BillingMode='PAY_PER_REQUEST',
            )
            self.table.wait_until_exists()
        except ClientError as err:
            logger.error(
                "Couldn't create table %s. Here's why: %s: %s",
                table_name,
                err.response["Error"]["Code"],
                err.response["Error"]["Message"],
            )
            raise
        else:
            return self.table

    #get user data from table
    def get_data(self, email):
        try:
            response = self.table.get_item(Key={"email": email})
        except ClientError as err:
            logger.error(
                "Couldn't get data %s from table %s. Here's why: %s: %s",
                email,
                self.table.name,
                err.response["Error"]["Code"],
                err.response["Error"]["Message"],
            )
            raise
        else:
            return response.get("Item")

    #Add User
    def add_user(self, email, password, role):
        try:
            self.table.put_item(
                Item={
                    "email": email,
                    "password": password,
                    "role": role
                }
            )
        except ClientError as err:
            logger.error(
                "Couldn't add user %s to table %s. Here's why: %s: %s",
                email,
                self.table.name,
                err.response["Error"]["Code"],
                err.response["Error"]["Message"],
            )
            raise