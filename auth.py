from flask import Flask, Response, request, json
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required
from flask_restx import Namespace, Resource, fields
from exts import db
from models import User, UserDetails, TraineeDetails, TrainerDetails, UserContact

# Assuming you have already defined your auth_ns namespace
auth_ns = Namespace("auth", description="A namespace for our Authentication")
# Assuming you have already defined your auth_ns namespace
user_ns = Namespace("user", description="User-related operations")

# Define a model for user profiles (you can customize this as needed)
user_profile_model = user_ns.model(
    "UserProfile",
    {
        "userID": fields.Integer(readonly=True, description="User ID"),
        "username": fields.String(description="Username"),
        "dob": fields.Date(description="Date of Birth"),
        "city": fields.String(description="City"),
        "email": fields.String(description="Email address"),
        "phone": fields.String(description="Phone number"),
        "is_trainer": fields.Boolean(description="Is trainer"),
    },
)

# Create a resource for retrieving user profiles
@user_ns.route("/profile/<int:user_id>")
class UserProfile(Resource):
    @user_ns.marshal_with(user_profile_model)
    def get(self, user_id):
        try:
            # Retrieve the user profile from the database
            user = User.query.get(user_id)
            if user:
                print(f"User profile retrieved successfully: {user.username}")
                return user, 200
            else:
                print("User not found")
                return {"message": "User not found"}, 404
        except Exception as e:
            print(f"Error retrieving user profile: {str(e)}")
            return {"message": "Error loading user data"}, 500

# Model for signup
signup_model = auth_ns.model(
    "SignUp",
    {
        "username": fields.String(required=True, description="The user's username"),
        "email": fields.String(required=True, description="The user's email address"),
        "password": fields.String(required=True, description="The user's password"),
        "dob": fields.Date(required=True, description="Date of Birth"),
        "city": fields.String(required=True, description="The user's city"),
        "phone": fields.String(required=True, description="The user's phone number"),
        "is_trainer": fields.Boolean(description="Is trainer"),
    }
)

# Model for login
login_model = auth_ns.model(
    "Login", 
    {"username": fields.String(required=True), "password": fields.String(required=True)}
)

@auth_ns.route("/signup")
class SignUp(Resource):
    @auth_ns.expect(signup_model)
    def post(self):
        # Getting data from request
        data = request.get_json()

        # Checking for required fields
        required_fields = ["username", "dob", "city", "email", "phone", "password", "is_trainer"]
        print("Checking for required fields, " + str(required_fields), data)
        for field in required_fields:
            if not data.get(field):
                response_data = json.dumps({"message": f"Missing required field: {field}"})
                return Response(response_data, mimetype='application/json', status=400)

        # Checking if user already exists
        username = data.get("username")
        db_user = User.query.filter_by(username=username).first()

        # If user does not exist, create a new one
        if not db_user:
            new_user = User(
                username=username,
                dob=data.get("dob"),
                city=data.get("city"),
                email=data.get("email"),
                phone=data.get("phone"),
                is_trainer=data.get("is_trainer"),
                password=generate_password_hash(data.get("password"))
            )
            db.session.add(new_user)
            db.session.commit()
            response_data = json.dumps({"message": "User created successfully"})
            return Response(response_data, mimetype='application/json', status=201)
        else:
            response_data = json.dumps({"message": "Username already exists"})
            return Response(response_data, mimetype='application/json', status=409)

@auth_ns.route("/login")
class Login(Resource):
    @auth_ns.expect(login_model)
    def post(self):
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        db_user = User.query.filter_by(username=username).first()
        if db_user and check_password_hash(db_user.password, password):
            access_token = create_access_token(identity=username)
            refresh_token = create_refresh_token(identity=username)
            
            # Retrieve the is_trainer parameter from the database
            is_trainer = db_user.is_trainer

            # Print user details to the terminal
            print(f"Logged in user: Username - {db_user.username}, is_trainer - {is_trainer}")

            response_data = json.dumps({"access_token": access_token, "refresh_token": refresh_token, "is_trainer": is_trainer})
            return Response(response_data, mimetype='application/json', status=200)
        else:
            response_data = json.dumps({"message": "Invalid username or password"})
            return Response(response_data, mimetype='application/json', status=401)

@auth_ns.route("/refresh")
class RefreshResource(Resource):
    @jwt_required(refresh=True)
    def post(self):
        current_user = get_jwt_identity()
        new_access_token = create_access_token(identity=current_user)
        response_data = json.dumps({"access_token": new_access_token})
        return Response(response_data, mimetype='application/json')
