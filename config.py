from decouple import config
import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.dirname(os.path.realpath(__file__))

class Config:
    # Secret key for your Flask application
    SECRET_KEY = config('SECRET_KEY', default='secret')

    # Disable Flask-SQLAlchemy modification tracking for better performance
    SQLALCHEMY_TRACK_MODIFICATIONS = config('SQLALCHEMY_TRACK_MODIFICATIONS', default=False, cast=bool)

    # Database configuration (Aiven MySQL database)
    db_type = "mysql"  # Database type, We are using MySQL
    db_host = config('DB_HOST')
    db_port = config('DB_PORT', default=18248, cast=int)
    db_user = config('DB_USER')
    db_password = config('DB_PASSWORD')
    db_name = config('DB_NAME')

    # URI for the database connection (Aiven MySQL database)
    SQLALCHEMY_DATABASE_URI = f"{db_type}://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
    
    # Enable debug mode for development (Set to False in production)
    DEBUG = config('DEBUG', default=True, cast=bool)

# Development configuration (inherits from Config)
class DevConfig(Config):
    pass

# Production configuration (inherits from Config)
class ProdConfig(Config):
    pass

# Test configuration (inherits from Config)
class TestConfig(Config):
    pass
