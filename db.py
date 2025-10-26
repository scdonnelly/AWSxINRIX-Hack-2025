import logging
from botocore.exceptions import ClientError
logger = logging.getLogger(__name__)
from boto3.dynamodb.conditions import Key

class StudentData:
    
    #dictionary
    student_data = {
        "company": 'company',
        "FirstName": 'FirstName',
        "LastName": 'LastName',
        "FullName": 'FullName',
        "assignments": [],
        "BonusPoints": [],
        "Attendance": []
    }
    
    #intialize the connection
    def __init__(self, dyn_resource):
        self.dyn_resource = dyn_resource
        self.table = None

    #create the table
    def create_table(self, table_name):

        try:
            self.table = self.dyn_resource.create_table(
                TableName=table_name,
                KeySchema=[
                    {"AttributeName": "company", "KeyType": "HASH"},  # Partition key
                    {"AttributeName": "FullName", "KeyType": "RANGE"},  # Sort key
                ],
                AttributeDefinitions=[
                    {"AttributeName": "company", "AttributeType": "S"},
                    {"AttributeName": "FullName", "AttributeType": "S"},
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

    #get student data from a table
    def get_data(self, company, FullName):
            
            try:
                response = self.table.get_item(Key={"company": company, "FullName": FullName})
            except ClientError as err:
                logger.error(
                    "Couldn't get data %s from table %s. Here's why: %s: %s",
                    FullName,
                    self.table.name,
                    err.response["Error"]["Code"],
                    err.response["Error"]["Message"],
                )
                raise
            else:
                return response["Item"]

    def query_data(self, company):
        try:
            response = self.table.query(KeyConditionExpression=Key("company").eq(company))
        except ClientError as err:
            logger.error(
                "Couldn't query for students in %s. Here's why: %s: %s",
                company,
                err.response["Error"]["Code"],
                err.response["Error"]["Message"],
            )
            raise
        else:
            return response["Items"]
        
    #Update data
    def update_data(self, FullName, company, Attendance, BonusPoints, assignments):
       
        try:
            response = self.table.update_item(
                Key={"company": company, "FullName": FullName},
                UpdateExpression="set Attendance=:a, BonusPoints=:b, assignments=:as",
                ExpressionAttributeValues={":a": Attendance, ":b": BonusPoints, ":as": assignments},
                ReturnValues="UPDATED_NEW",
            )
        except ClientError as err:
            logger.error(
                "Couldn't update student %s in table %s. Here's why: %s: %s",
                FullName,
                self.table.name,
                err.response["Error"]["Code"],
                err.response["Error"]["Message"],
            )
            raise
        else:
            return response["Attributes"]

    #updatate single assignment score
    def update_single_assignment(self, company, full_name, assignment_name, score):

        try:
            response = self.table.update_item(
                Key={"company": company, "FullName": full_name},
                UpdateExpression=f"SET {assignment_name} = :score",
                ExpressionAttributeValues={":score": score},
                ReturnValues="UPDATED_NEW"
            )
            return response["Attributes"]
        except ClientError as err:
            logger.error(f"Couldn't update {assignment_name} for {full_name}: {err}")
            raise

    #add new assignment column to all students
    def add_assignment_column(self, assignment_name, default_score=0):

        try:
            # First, scan all items to get all students
            response = self.table.scan()
            students = response['Items']

            # Update each student record to add the new assignment column
            for student in students:
                self.table.update_item(
                Key={"company": student["company"], "FullName": student["FullName"]},
                UpdateExpression=f"SET {assignment_name} = :score",
                ExpressionAttributeValues={":score": default_score}
                )
        except ClientError as err:
            logger.error(f"Couldn't add assignment column {assignment_name}: {err}")
            raise


def add_bonus_column(self, bonus_name, default_score=0):

    try:
        # First, scan all items to get all students
        response = self.table.scan()
        students = response['Items']
        
        # Update each student record to add the new bonus column
        for student in students:
            self.table.update_item(
                Key={"company": student["company"], "FullName": student["FullName"]},
                UpdateExpression=f"SET {bonus_name} = :score",
                ExpressionAttributeValues={":score": default_score}
            )
    except ClientError as err:
        logger.error(f"Couldn't add bonus column {bonus_name}: {err}")
        raise

#create totals columns
def create_total_column(self, column_names, total_column_name):
    
    try:
        # Get all students
        response = self.table.scan()
        students = response['Items']
        
        # Update each student with the new total column
        for student in students:
            total = 0
            for column in column_names:
                if column in student:
                    total += float(student[column])
            
            # Add the total column to this student
            self.table.update_item(
                Key={"company": student["company"], "FullName": student["FullName"]},
                UpdateExpression=f"SET {total_column_name} = :total",
                ExpressionAttributeValues={":total": total}
            )
    except ClientError as err:
        logger.error(f"Couldn't create total column {total_column_name}: {err}")
        raise