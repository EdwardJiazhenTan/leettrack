import mysql.connector
from mysql.connector import Error

def get_db_connection():
    """
    Creates a connection to the MySQL database and returns the connection object.
    """
    try:
        connection = mysql.connector.connect(
            host='hostName',        # Or your database host
            user='userName',    # Your database username
            password='password',# Your database password
            database='dbName' # Your database name
        )
        return connection
    except Error as e:
        print(f"Error connecting to MySQL database: {e}")
        return None
