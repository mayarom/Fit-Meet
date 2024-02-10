from flask_sqlalchemy import SQLAlchemy

# The sole purpose of this file is to create the SQLAlchemy object,
# which is the database object that we will use to interact with the database.
# This is done by creating an instance of the SQLAlchemy class, which is imported from the flask_sqlalchemy module.
# This instance is then used to interact with the database.
# The instance is created in this file so that it can be imported into other files, such as the app.py file,
# where it is used to interact with the database. This is done to avoid creating multiple instances of the
# SQLAlchemy class, which would be inefficient and could lead to errors.
db = SQLAlchemy()
