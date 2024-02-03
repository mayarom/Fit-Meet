import pymysql

# Database connection details
host = "fit-meet-db-fit-meet.a.aivencloud.com"
user = "avnadmin"
password = "AVNS_2W0t4LFVzQtm2sPWtaZ"
database = "your_database_name"  # Change this to the specific database name you've created

# Establishing a connection to the database
connection = pymysql.connect(
    host=host,
    user=user,
    password=password,
    database=database
)

# Now you can perform database operations
cursor = connection.cursor()
cursor.execute("SELECT * FROM your_table")
results = cursor.fetchall()

# After usage, it's advisable to close the connection
# connection.close()  # You can close the connection when done, but it's recommended to manage connections properly in your application.
