import logging
import boto3
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
                UpdateExpression="SET #assignment_name = :score",
                ExpressionAttributeNames={"#assignment_name": assignment_name},
                ExpressionAttributeValues={":score": default_score}
                )
        except ClientError as err:
            logger.error(f"Couldn't add assignment column {assignment_name}: {err}")
            raise



    #Add Student Data
    def add_StudentData(self, company, firstName, lastName, attendance):

        try:
            fullName = f"{firstName} {lastName}"
            self.table.put_item(
                Item={
                    "company": company,
                    "FullName": fullName,
                    "FirstName": firstName,
                    "LastName": lastName,
                    "Attendance": attendance,
                    "assignments": [],
                    "BonusPoints": []
                }
            )
        except ClientError as err:
            logger.error(
                "Couldn't add student %s to table %s. Here's why: %s: %s",
                fullName,
                self.table.name,
                err.response["Error"]["Code"],
                err.response["Error"]["Message"],
            )
            raise

#Add Column
    def add_column(self, assignment_data):


        # Add a new column to the student_data dictionary
        self.student_data["assignments"].append(assignment_data)

        # Update the DynamoDB table with the new column
        try:

            response = self.table.scan()
            students = response['Items']
        
            for student in students:
                    self.table.update_item(
                        Key={"company": student["company"], "FullName": student["FullName"]},
                        UpdateExpression="SET assignments = list_append(if_not_exists(assignments, :empty_list), :new_assignment)",
                        ExpressionAttributeValues={
                            ':empty_list': [],
                            ':new_assignment': [assignment_data]
                        }
                    )
        except ClientError as err:
            logger.error(f"Couldn't add assignment: {err}")
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


    #Bonus
    def add_bonus_points(self, company, full_name, bonus_points):

        # Add a new column to the student_data dictionary
        self.student_data["BonusPoints"].append(bonus_points)

        try:
            self.table.update_item(
                Key={"company": company, "FullName": full_name},
                UpdateExpression='SET BonusPoints = list_append(if_not_exists(BonusPoints, :empty_list), :new_bonus)',
                ExpressionAttributeValues={
                    ':empty_list': [],
                    ':new_bonus': [bonus_points]
                }
            )
        except ClientError as err:
            logger.error(f"Couldn't add bonus points: {err}")
            raise

    def delete_student(self, company, full_name):
        try:
            response = self.table.delete_item(
                Key={"company": company, "FullName": full_name}
            )
            return response
        except ClientError as err:
            logger.error(
                "Couldn't delete student %s from table %s. Here's why: %s: %s",
                full_name,
                self.table.name,
                err.response["Error"]["Code"],
                err.response["Error"]["Message"],
            )
            raise
    def calculate_total_for_events(self, company, full_name, event_names):
        """
        Calculate total score for specific events/assignments for one student
        """
        try:
            student = self.get_data(company, full_name)
            total = 0
            
            for event in event_names:
                if event in student:
                    score = student[event]
                    if isinstance(score, (int, float)):
                        total += score
                    else:
                        total += float(score)
            
            return total
        except ClientError as err:
            logger.error(f"Couldn't calculate total for {full_name}: {err}")
            raise

    def calculate_totals_for_all_students(self, company, event_names):
        """
        Calculate totals for specific events for all students in a company
        """
        try:
            students = self.query_data(company)
            results = []
            
            for student in students:
                total = 0
                for event in event_names:
                    if event in student:
                        score = student[event]
                        if isinstance(score, (int, float)):
                            total += score
                        else:
                            total += float(score)
                
                results.append({
                    'name': student['FullName'],
                    'total': total,
                    'events': {event: student.get(event, 0) for event in event_names}
                })
            
            return results
        except ClientError as err:
            logger.error(f"Couldn't calculate totals for company {company}: {err}")
            raise
