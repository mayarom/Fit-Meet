from flask import Flask
from flask_restx import Api
from models import User, UserPermission, UserDetails, TraineeDetails, TrainerDetails, UserContact, TrainersExercises, UsersExercises, TrainersReviews
from exts import db
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from exercises import exercise_ns
from auth import auth_ns
from flask_cors import CORS
import logging
import os

def create_app(config):
    app = Flask(__name__, static_url_path="/", static_folder="./client/build")
    app.config.from_object(config)

    if not app.config['SECRET_KEY']:
        raise ValueError("No secret key set for JWT operations")

    logging.basicConfig(level=logging.INFO)

    if app.config["ENV"] == "production":
        CORS(app, resources={r"/api/*": {"origins": "https://yourdomain.com"}})
    else:
        CORS(app)

    db.init_app(app)
    Migrate(app, db)
    JWTManager(app)

    api = Api(app, version='1.0', title='My API', description='A simple API', doc="/docs")
    api.add_namespace(exercise_ns)
    api.add_namespace(auth_ns)

    @app.route("/") 
    def index():
        return app.send_static_file("index.html")

    @app.errorhandler(404)
    def not_found(err):
        return app.send_static_file("index.html")

    @app.route("/health")
    def health_check():
        return {"status": "up"}, 200

    @app.shell_context_processor
    def make_shell_context():
        return {
            "db": db,
            "User": User,
            "UserPermission": UserPermission,
            "UserDetails": UserDetails,
            "TraineeDetails": TraineeDetails,
            "TrainerDetails": TrainerDetails,
            "UserContact": UserContact,
            "TrainersExercises": TrainersExercises,
            "UsersExercises": UsersExercises,
            "TrainersReviews": TrainersReviews
        }

    return app

if __name__ == "__main__":
    app = create_app(os.environ.get('FLASK_CONFIG') or 'default_config_module')
    app.run()
