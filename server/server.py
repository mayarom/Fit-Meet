import os
from main import create_app
from config import DevConfig, ProdConfig, TestConfig  # Include this line if you have a TestConfig
from models import db

# Determine the environment and choose the appropriate configuration
env = os.getenv('FLASK_ENV')

if env == 'development':
    app_config = DevConfig
elif env == 'production':
    app_config = ProdConfig
elif env == 'testing':
    app_config = TestConfig  # Include this line if you have a TestConfig
else:
    app_config = ProdConfig  # Default to ProdConfig if the environment is not set

# Create the app with the selected configuration
app = create_app(app_config)

if __name__ == "__main__":
    # Start the Flask application
    app.run(port=5001)
