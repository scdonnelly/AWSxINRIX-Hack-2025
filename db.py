class StudentData:
    
    #dictionary
    student_data = {
        "company": 'company',
        "FirstName": 'FirstName',
        "LastName": 'LastName',
        "assignments": [],
        "bonus_points": [],
        "Attendence": []
    }
    
    #intialize the connection
    def __init__(self, dyn_resource):
        self.dyn_resource = dyn_resource
        self.table = None

    #create the table
    def create_table(self, table_name):

        try:
            self.table = self.dyn_resource.create_table(
                TableName=StudentData,
                KeySchema=[
                    {"AttributeName": "company", "KeyType": "HASH"},  # Partition key
                    {"AttributeName": "FirstName", "KeyType": "RANGE"},  # Sort key
                    {"AttributeName": "LastName", "KeyType": "RANGE"},  # Sort key
                ],
                AttributeDefinitions=[
                    {"AttributeName": "company", "AttributeType": "N"},
                    {"AttributeName": "FirstName", "AttributeType": "S"},
                    {"AttributeName": "LastName", "AttributeType": "S"},
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
        
