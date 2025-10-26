import logging
from botocore.exceptions import ClientError
logger = logging.getLogger(__name__)

class StudentData:
    
    #dictionary
    student_data = {
        "company": 'company',
        "FirstName": 'FirstName',
        "LastName": 'LastName',
        "FullName": 'FullName',
        "assignments": [],
        "bonus_points": [],
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
                    title,
                    self.table.name,
                    err.response["Error"]["Code"],
                    err.response["Error"]["Message"],
                )
                raise
            else:
                return response["Item"]

    def query_data(self, year):
        """
        Queries for movies that were released in the specified year.

        :param year: The year to query.
        :return: The list of movies that were released in the specified year.
        """
        try:
            response = self.table.query(KeyConditionExpression=Key("year").eq(year))
        except ClientError as err:
            logger.error(
                "Couldn't query for movies released in %s. Here's why: %s: %s",
                year,
                err.response["Error"]["Code"],
                err.response["Error"]["Message"],
            )
            raise
        else:
            return response["Items"]
        
#Update data
    def update_movie(self, title, year, rating, plot):
        """
        Updates rating and plot data for a movie in the table.

        :param title: The title of the movie to update.
        :param year: The release year of the movie to update.
        :param rating: The updated rating to the give the movie.
        :param plot: The updated plot summary to give the movie.
        :return: The fields that were updated, with their new values.
        """
        try:
            response = self.table.update_item(
                Key={"year": year, "title": title},
                UpdateExpression="set info.rating=:r, info.plot=:p",
                ExpressionAttributeValues={":r": Decimal(str(rating)), ":p": plot},
                ReturnValues="UPDATED_NEW",
            )
        except ClientError as err:
            logger.error(
                "Couldn't update movie %s in table %s. Here's why: %s: %s",
                title,
                self.table.name,
                err.response["Error"]["Code"],
                err.response["Error"]["Message"],
            )
            raise
        else:
            return response["Attributes"]
#Get Data
    def get_data(self, title, year):
            """
            Gets movie data from the table for a specific movie.

            :param title: The title of the movie.
            :param year: The release year of the movie.
            :return: The data about the requested movie.
            """
            try:
                response = self.table.get_item(Key={"year": year, "title": title})
            except ClientError as err:
                logger.error(
                    "Couldn't get movie %s from table %s. Here's why: %s: %s",
                    title,
                    self.table.name,
                    err.response["Error"]["Code"],
                    err.response["Error"]["Message"],
                )
                raise
            else:
                return response["Item"]

        try:
            self.table.put_item(
                Item={
                    "comapny": company,
                    "FirstName": FirstName,
                    "LastName" : Lastname,
                    "info": {"plot": plot, "rating": Decimal(str(rating))},
                }
            )
        except ClientError as err:
            logger.error(
                "Couldn't add movie %s to table %s. Here's why: %s: %s",
                title,
                self.table.name,
                err.response["Error"]["Code"],
                err.response["Error"]["Message"],
            )
            raise

    #Add Student Data
    def add_StudentData(company, firstName, lastName, attendance[]):
        """
        Adds a student record


        :param title: The title of the movie.
        :param year: The release year of the movie.
        :param plot: The plot summary of the movie.
        :param rating: The quality rating of the movie.
        """

    import uuid
    import logging
    from botocore.exceptions import ClientError

    logger = logging.getLogger(__name__)

    # # create a simple unique id for the student
    # student_id = str(uuid.uuid4())

    # Normalize attendance to a list
    if attendance is None:
        attendance = []
    elif not isinstance(attendance, list):
        attendance = [attendance]

    item = {
        # "student_id": student_id,
        "company": company,
        "firstName": firstName,
        "lastName": lastName,
        "attendance": attendance,
    }

    # Persist to DynamoDB if a table is configured
    if self.table is not None:
        try:
            self.table.put_item(Item=item)
        except ClientError as err:
            logger.error(
                "Couldn't add student %s to table %s: %s",
                student_id,
                getattr(self.table, "name", "<unknown>"),
                err,
            )
            raise

    return item

def