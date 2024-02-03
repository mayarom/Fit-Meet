from decouple import config
import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.dirname(os.path.realpath(__file__))

class Config:
    # Secret key for your Flask application
    SECRET_KEY = os.getenv("SECRET_KEY", "secret")

    # Disable Flask-SQLAlchemy modification tracking for better performance
    SQLALCHEMY_TRACK_MODIFICATIONS = os.getenv("SQLALCHEMY_TRACK_MODIFICATIONS", False)

    # URI for the database connection (Aiven MySQL database)
    SQLALCHEMY_DATABASE_URI = "mysql://avnadmin:AVNS_2W0t4LFVzQtm2sPWtaZ@fit-meet-db-fit-meet.a.aivencloud.com:18248/defaultdb"
    
    # Enable debug mode for development (Set to False in production)
    DEBUG = True

# Development configuration (inherits from Config)
class DevConfig(Config):
    pass

# Production configuration (inherits from Config)
class ProdConfig(Config):
    pass

# Test configuration (inherits from Config)
class TestConfig(Config):
    pass
