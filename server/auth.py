import stat
from tkinter import N
from flask import Flask, Response, jsonify, request, json
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required
from flask_restx import Namespace, Resource, fields
from exts import db
from models import TrainersReviews, Users, UsersDetails, TraineesDetails, TrainersDetails, UsersContact, UsersPermission

# Assuming you have already defined your auth_ns namespace
auth_ns = Namespace("auth", description="A namespace for our Authentication")
# Assuming you have already defined your auth_ns namespace
user_ns = Namespace("user", description="User-related operations")

# Define a model for user login
login_model = auth_ns.model(
    "Login", 
    {
        "username": fields.String(required=True),
        "password": fields.String(required=True)
    }
)

# Define a model for user signup
signup_basic_model = auth_ns.model(
    "SignUpBasic",
    {
        "username": fields.String(required=True, description="The user's username"),
        "email": fields.String(required=True, description="The user's email address"),
        "password": fields.String(required=True, description="The user's password"),
        "dob": fields.Date(required=True, description="Date of Birth"),
        "city": fields.String(required=True, description="The user's city"),
        "phone": fields.String(required=True, description="The user's phone number"),
        "permissions": fields.String(required=True, description="The user's permissions")
    }
)

signup_trainee_model = auth_ns.model(
    "SignUpTrainee",
    {
        "goal": fields.String(description="The user's fitness goal"),
        "height": fields.Float(description="The user's height"),
        "weight": fields.Float(description="The user's weight")
    }
)

signup_trainer_model = auth_ns.model(
    "SignUpTrainer",
    {
        "experience": fields.String(description="The trainer's experience"),
        "paylink": fields.String(description="The trainer's payment link")
    }
)

signup_model = auth_ns.model(
    "SignUp",
    {
        "basic_details": fields.Nested(signup_basic_model),
        "trainee_details": fields.Nested(signup_trainee_model),
        "trainer_details": fields.Nested(signup_trainer_model)
    }
)

# Define models for user profiles (you can customize this as needed)
user_basic_details_model = user_ns.model(
    "UserBasicDetails",
    {
        "username": fields.String(description="The user's username"),
        "dob": fields.Date(description="Date of Birth"),
        "city": fields.String(description="The user's city"),
        "permissions": fields.String(description="The user's permissions")
    }
)

user_contact_details_model = user_ns.model(
    "UserContactDetails",
    {
        "email": fields.String(description="The user's email address"),
        "phone": fields.String(description="The user's phone number")
    }
)

trainee_details_model = user_ns.model(
    "TraineeDetails",
    {
        "goal": fields.String(description="The user's fitness goal"),
        "height": fields.Float(description="The user's height"),
        "weight": fields.Float(description="The user's weight")
    }
)

trainer_details_model = user_ns.model(
    "TrainerDetails",
    {
        "experience": fields.String(description="The trainer's experience"),
        "paylink": fields.String(description="The trainer's payment link")
    }
)

trainer_review_model = user_ns.model(
    "TrainerReview",
    {
        "trainer_id": fields.Integer(description="The ID of the trainer being reviewed"),
        "user_id": fields.Integer(description="The ID of the user leaving the review"),  # This is the user leaving the review
        "stars": fields.Integer(description="The number of stars for the review"),
        "description": fields.String(description="The review description")
    }
)

# Define a model for all user details
user_combined_model = user_ns.model(
    "UserCombinedDetails",
    {
        "message": fields.String(description="A message to describe the result of the operation"),
        "success": fields.Boolean(description="A boolean to indicate if the operation was successful"),
        "basic_details": fields.Nested(user_basic_details_model),
        "contact_details": fields.Nested(user_contact_details_model),
        "trainee_details": fields.Nested(trainee_details_model),
        "trainer_details": fields.Nested(trainer_details_model),
        "trainer_reviews": fields.List(fields.Nested(trainer_review_model))
    }
)

change_password_model = auth_ns.model(
    "ChangePassword",
    {
        "old_password": fields.String(required=True, description="The user's old password"),
        "new_password": fields.String(required=True, description="The user's new password")
    }
)

# Create a resource for retrieving user profiles
@user_ns.route("/profile/<int:userid>")
class UserProfile(Resource):
    @user_ns.marshal_with(user_combined_model)
    def get(self, userid):
        try:
            # Retrieve the user profile from the database
            user = Users.query.get(userid)
            if user:
                print(f"User profile retrieved successfully: {user.username}")

                RetUserBasicDetail = UsersDetails.query.filter_by(userID=userid).first()
                RetUserContactDetail = UsersContact.query.filter_by(userID=userid).first()
                RetUserPermissionDetail = UsersPermission.query.filter_by(userID=userid).first()

                RetTraineeDetail = None
                RetTrainerDetail = None
                RetTrainersReviews = None

                if RetUserPermissionDetail.permissions == "trainee":                
                    RetTraineeDetail = TraineesDetails.query.filter_by(userID=userid).first()

                elif RetUserPermissionDetail.permissions == "trainer":
                    RetTrainerDetail = TrainersDetails.query.filter_by(userID=userid).first()
                    RetTrainersReviews = TrainersReviews.query.filter_by(trainerID=userid).all()

                combined_details = {
                    "message": "User profile retrieved successfully",
                    "success": True,
                    "basic_details": {
                        "username": user.username,
                        "dob": RetUserBasicDetail.dob,
                        "city": RetUserBasicDetail.city,
                        "permissions": RetUserPermissionDetail.permissions
                    },
                    "contact_details": {
                        "email": RetUserContactDetail.email,
                        "phone": RetUserContactDetail.phone
                    },
                    "trainee_details": {
                        "goal": RetTraineeDetail.goal,
                        "height": RetTraineeDetail.height,
                        "weight": RetTraineeDetail.weight
                    } if RetTraineeDetail else None,
                    "trainer_details": {
                        "experience": RetTrainerDetail.experience,
                        "paylink": RetTrainerDetail.paylink
                    } if RetTrainerDetail else None,
                    "trainer_reviews": [
                    {
                        "trainer_id": review.trainerID,
                        "user_id": review.userID,
                        "stars": review.review_stars,
                        "description": review.review_description
                    } for review in RetTrainersReviews
                ] if RetTrainersReviews else None
                }
                
                return combined_details, 200
            else:
                print(f"User not found in the database: {userid}")
                return {"message": "User not found, are you sure this user exists?", "success": False}, 404
        except Exception as e:
            print(f"Error retrieving user profile: {str(e)}")
            return {"message": "Error loading user data, server failure, brain overload", "success": False}, 500
        
@auth_ns.route("/profile")
class Profile(Resource):
    @jwt_required()
    @user_ns.marshal_with(user_combined_model)
    def get(self):
        try:
            # Retrieve the user profile from the database
            username = get_jwt_identity()
            user = Users.query.filter_by(username=username).first()
            if user:
                print(f"User profile retrieved successfully: {user.username}")

                RetUserBasicDetail = UsersDetails.query.filter_by(userID=user.userID).first()
                RetUserContactDetail = UsersContact.query.filter_by(userID=user.userID).first()
                RetUserPermissionDetail = UsersPermission.query.filter_by(userID=user.userID).first()

                RetTraineeDetail = None
                RetTrainerDetail = None
                RetTrainersReviews = None

                if RetUserPermissionDetail.permissions == "trainee":                
                    RetTraineeDetail = TraineesDetails.query.filter_by(userID=user.userID).first()

                elif RetUserPermissionDetail.permissions == "trainer":
                    RetTrainerDetail = TrainersDetails.query.filter_by(userID=user.userID).first()
                    RetTrainersReviews = TrainersReviews.query.filter_by(trainerID=user.userID).all()

                combined_details = {
                    "basic_details": {
                        "username": user.username,
                        "dob": RetUserBasicDetail.dob,
                        "city": RetUserBasicDetail.city,
                        "permissions": RetUserPermissionDetail.permissions
                    },
                    "contact_details": {
                        "email": RetUserContactDetail.email,
                        "phone": RetUserContactDetail.phone
                    },
                    "trainee_details": {
                        "goal": RetTraineeDetail.goal,
                        "height": RetTraineeDetail.height,
                        "weight": RetTraineeDetail.weight
                    } if RetTraineeDetail else None,
                    "trainer_details": {
                        "experience": RetTrainerDetail.experience,
                        "paylink": RetTrainerDetail.paylink
                    } if RetTrainerDetail else None,
                    "trainer_reviews": [
                    {
                        "trainer_id": review.trainerID,
                        "user_id": review.userID,
                        "stars": review.review_stars,
                        "description": review.review_description
                    } for review in RetTrainersReviews
                ] if RetTrainersReviews else None
                }
                    
                return combined_details, 200
            else:
                print(f"User not found in the database: {user.username}")
                return {"message": "Fatal error, can't find user in the database"}, 404
            
        except Exception as e:
            print(f"Error retrieving user profile: {str(e)}")
            return {"message": "Error loading user data, server failure, brain overload"}, 500

@auth_ns.route("/signup")
class SignUp(Resource):
    @auth_ns.expect(signup_model)
    def post(self):
        # Getting data from request
        data = request.get_json()

        # Checking for basic required fields
        required_fields = ["username", "dob", "city", "email", "phone", "password"]
        print("Checking for required fields, " + str(required_fields), data)
        for field in required_fields:
            if not data.get(field):
                response_data = json.dumps({"message": f"Missing required field: {field}"})
                return Response(response_data, mimetype='application/json', status=400)
        
        # If user is a trainer, check for required fields (experience and paylink)
        if data.get("permissions") == "trainer":
            required_fields = ["experience", "paylink"]
            print("Checking for required fields, " + str(required_fields), data)
            for field in required_fields:
                if not data.get(field):
                    response_data = json.dumps({"message": f"Missing required field: {field}"})
                    return Response(response_data, mimetype='application/json', status=400)
                
        # If user is a trainee, check for required fields (goal, height, weight)
        elif data.get("permissions") == "trainee":
            required_fields = ["goal", "height", "weight"]
            print("Checking for required fields, " + str(required_fields), data)
            for field in required_fields:
                if not data.get(field):
                    response_data = json.dumps({"message": f"Missing required field: {field}"})
                    return Response(response_data, mimetype='application/json', status=400)
                
        else:
            response_data = json.dumps({"message": "Invalid permissions"})
            return Response(response_data, mimetype='application/json', status=400)

        # Checking if user already exists
        username = data.get("username")
        db_user = Users.query.filter_by(username=username).first()

        # If user does not exist, create a new one
        if not db_user:
            new_user = Users(
                username=username,
                password=generate_password_hash(data.get("password"))
            )
            db.session.add(new_user)
            db.session.commit()

            # Get the userID of the new user
            new_user = Users.query.filter_by(username=username).first()

            # Create a new UserPermission record
            new_user_permission = UsersPermission(
                userID=new_user.userID,
                permissions=data.get("permissions")
            )

            # Create a new UserDetails record
            new_user_details = UsersDetails(
                userID=new_user.userID,
                dob=data.get("dob"),
                city=data.get("city")
            )

            # Create a new UserContact record
            new_user_contact = UsersContact(
                userID=new_user.userID,
                email=data.get("email"),
                phone=data.get("phone")
            )

            db.session.add(new_user_permission)
            db.session.add(new_user_details)
            db.session.add(new_user_contact)

            # If user is a trainee, create a new TraineeDetails record
            if data.get("permissions") == "trainee":
                new_trainee_details = TraineesDetails(
                    userID=new_user.userID,
                    goal=data.get("goal"),
                    height=data.get("height"),
                    weight=data.get("weight")
                )

                db.session.add(new_trainee_details)

            # If user is a trainer, create a new TrainerDetails record
            elif data.get("permissions") == "trainer":
                new_trainer_details = TrainersDetails(
                    userID=new_user.userID,
                    experience=data.get("experience"),
                    paylink=data.get("paylink")
                )

                db.session.add(new_trainer_details)

            # Commit the changes to the database
            db.session.commit()


            response_data = json.dumps({"success": True, "message": "User created successfully"})
            return Response(response_data, mimetype='application/json', status=201)
        else:
            response_data = json.dumps({"success": False, "message": "Username already exists"})
            return Response(response_data, mimetype='application/json', status=409)

@auth_ns.route("/login")
class Login(Resource):
    @auth_ns.expect(login_model)
    def post(self):
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        db_user = Users.query.filter_by(username=username).first()

        # If the user exists and the password is correct, create an access token.
        if db_user and check_password_hash(db_user.password, password):
            access_token = create_access_token(identity=username)
            refresh_token = create_refresh_token(identity=username)
            
            # Retrieve the permissions of the user
            permission = UsersPermission.query.filter_by(userID=db_user.userID).first()

            # Print user details to the terminal
            print(f"Logged in user: Username - {db_user.username},  permission - {permission.permissions}")

            response_data = json.dumps({"access_token": access_token, "refresh_token": refresh_token, "permissions": permission.permissions})
            return Response(response_data, mimetype='application/json', status=200)
        
        # If the user does not exist or the password is incorrect, return an error message of 401 Unauthorized
        else:
            response_data = json.dumps({"message": "Invalid username or password"})
            return Response(response_data, mimetype='application/json', status=401)
        
@auth_ns.route("/change-password")
class ChangePassword(Resource):
    @jwt_required()
    @auth_ns.expect(change_password_model)
    def post(self):
        data = request.get_json()
        username = get_jwt_identity()
        old_password = data.get("old_password")

        # Check if the old password is correct
        db_user = Users.query.filter_by(username=username).first()

        if db_user and check_password_hash(db_user.password, old_password):
            new_password = data.get("new_password")
            db_user.password = generate_password_hash(new_password)
            db.session.commit()
            response_data = json.dumps({"message": "Password changed successfully", "success": True})
            # Print details to the terminal
            print(f"Password changed successfully for user: {username}")
            return Response(response_data, mimetype='application/json', status=200)
        
        else:
            print(f"User {username} provided an invalid old password for changing password")
            response_data = json.dumps({"message": "Invalid old password", "success": False})
            return Response(response_data, mimetype='application/json', status=401)

@auth_ns.route("/refresh")
class RefreshResource(Resource):
    @jwt_required(refresh=True)
    def post(self):
        current_user = get_jwt_identity()
        new_access_token = create_access_token(identity=current_user)
        response_data = json.dumps({"access_token": new_access_token})
        return Response(response_data, mimetype='application/json')