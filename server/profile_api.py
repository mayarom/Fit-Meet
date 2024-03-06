#profile_api.py

from calendar import c
import stat
from tkinter import N
from flask import Flask, Response, jsonify, request, json
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required
from flask_restx import Namespace, Resource, fields
from exts import db
from models import TrainersReviews, Users, UsersDetails, TraineesDetails, TrainersDetails, UsersContact, UsersPermission

profile_ns = Namespace("profile", description="User profile operations")

# Define models for user profiles (you can customize this as needed)
user_basic_details_model = profile_ns.model(
    "UserBasicDetails",
    {
        "username": fields.String(description="The user's username"),
        "dob": fields.Date(description="Date of Birth"),
        "city": fields.String(description="The user's city"),
        "permissions": fields.String(description="The user's permissions")
    }
)

user_contact_details_model = profile_ns.model(
    "UserContactDetails",
    {
        "email": fields.String(description="The user's email address"),
        "phone": fields.String(description="The user's phone number")
    }
)

trainee_details_model = profile_ns.model(
    "TraineeDetails",
    {
        "goal": fields.String(description="The user's fitness goal"),
        "height": fields.Float(description="The user's height"),
        "weight": fields.Float(description="The user's weight")
    }
)

trainer_details_model = profile_ns.model(
    "TrainerDetails",
    {
        "experience": fields.String(description="The trainer's experience"),
        "paylink": fields.String(description="The trainer's payment link"),
        "trainer_id": fields.Integer(description="The ID of the trainer")
    }
)

trainer_review_model = profile_ns.model(
    "TrainerReview",
    {
        "trainer_id": fields.Integer(description="The ID of the trainer being reviewed"),
        "user_id": fields.Integer(description="The ID of the user leaving the review"),  # This is the user leaving the review
        "username": fields.String(description="The user's username who made the review"),
        "stars": fields.Integer(description="The number of stars for the review"),
        "description": fields.String(description="The review description")
    }
)

# Define a model for all user details
user_combined_model = profile_ns.model(
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

change_password_model = profile_ns.model(
    "ChangePassword",
    {
        "old_password": fields.String(required=True, description="The user's old password"),
        "new_password": fields.String(required=True, description="The user's new password")
    }
)

edit_profile_model = profile_ns.model(
    "EditProfile",
    {
        "message": fields.String(description="A message to describe the result of the operation"),
        "success": fields.Boolean(description="A boolean to indicate if the operation was successful"),
        "basic_details": fields.Nested(user_basic_details_model),
        "contact_details": fields.Nested(user_contact_details_model),
        "trainee_details": fields.Nested(trainee_details_model),
        "trainer_details": fields.Nested(trainer_details_model)
    }
)

# Create a resource for retrieving user profiles
@profile_ns.route("/profile/<int:userid>")
class UserProfile(Resource):
    @jwt_required()
    @profile_ns.marshal_with(user_combined_model)
    def get(self, userid):
        try:
            username = get_jwt_identity()
            # Retrieve the user profile from the database
            user = Users.query.get(userid)
            
            if user:
                RetUserBasicDetail = UsersDetails.query.filter_by(userID=userid).first()
                RetUserContactDetail = UsersContact.query.filter_by(userID=userid).first()
                RetUserPermissionDetail = UsersPermission.query.filter_by(userID=userid).first()

                if not RetUserBasicDetail or not RetUserContactDetail or not RetUserPermissionDetail:
                    print(f"DB error, user {userid} details not found in the database, corrupted data, registered user with incomplete details")
                    return Response(json.dumps({"message": "Fatal error, user details not found in the database", "success": False}), mimetype='application/json', status=500)

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
                        "paylink": RetTrainerDetail.paylink,
                        "trainer_id": RetTrainerDetail.userID
                    } if RetTrainerDetail else None,
                    "trainer_reviews": [
                        {
                            "trainer_id": review.trainerID,
                            "user_id": review.userID,
                            "username": Users.query.get(review.userID).username,
                            "stars": review.review_stars,
                            "description": review.review_description
                        } for review in RetTrainersReviews
                    ] if RetTrainersReviews else None
                }

                print(f"User profile retrieved successfully: {user.username}")

                return combined_details, 200
            else:
                print(f"User not found in the database: {userid}")
                return Response(json.dumps({"message": "Fatal error, can't find user in the database", "success": False}), mimetype='application/json', status=404)
        except Exception as e:
            print(f"Error retrieving user profile: {str(e)}")
            return Response(json.dumps({"message": "Error loading user data, server failure, brain overload", "success": False}), mimetype='application/json', status=500)
        
@profile_ns.route("/profile")
class Profile(Resource):
    @jwt_required()
    @profile_ns.marshal_with(user_combined_model)
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
                        "username": Users.query.get(review.userID).username,
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

@profile_ns.route("/change-password")
class ChangePassword(Resource):
    @jwt_required()
    @profile_ns.expect(change_password_model)
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
        
@profile_ns.route("/edit-profile")
class EditProfile(Resource):
    @jwt_required()
    @profile_ns.expect(edit_profile_model)
    def post(self):
        data = request.get_json()
        username = get_jwt_identity()
        db_user = Users.query.filter_by(username=username).first()

        if db_user:
            # Update the user's basic details
            db_user_details = UsersDetails.query.filter_by(userID=db_user.userID).first()
            db_user_contact = UsersContact.query.filter_by(userID=db_user.userID).first()
            db_user_permission = UsersPermission.query.filter_by(userID=db_user.userID).first()

            db_user_details.dob = data.get("dob")
            db_user_details.city = data.get("city")
            db_user_contact.email = data.get("email")
            db_user_contact.phone = data.get("phone")

            if db_user_permission.permissions == "trainee":
                db_trainee_details = TraineesDetails.query.filter_by(userID=db_user.userID).first()
                db_trainee_details.goal = data.get("goal")
                db_trainee_details.height = data.get("height")
                db_trainee_details.weight = data.get("weight")
            elif db_user_permission.permissions == "trainer":
                db_trainer_details = TrainersDetails.query.filter_by(userID=db_user.userID).first()
                db_trainer_details.experience = data.get("experience")
                db_trainer_details.paylink = data.get("paylink")

            db.session.commit()
            response_data = json.dumps({"message": "User profile updated successfully", "success": True})
            return Response(response_data, mimetype='application/json', status=200)
        else:
            response_data = json.dumps({"message": "User not found", "success": False})
            return Response(response_data, mimetype='application/json', status=404)
        
@profile_ns.route("/delete-account")
class DeleteAccount(Resource):
    @jwt_required()
    def delete(self):
        username = get_jwt_identity()
        db_user = Users.query.filter_by(username=username).first()

        if db_user:
            db_user_details = UsersDetails.query.filter_by(userID=db_user.userID).first()
            db_user_contact = UsersContact.query.filter_by(userID=db_user.userID).first()
            db_user_permission = UsersPermission.query.filter_by(userID=db_user.userID).first()
            db_user_trainee = TraineesDetails.query.filter_by(userID=db_user.userID).first()
            db_user_trainer = TrainersDetails.query.filter_by(userID=db_user.userID).first()

            if db_user_details:
                db.session.delete(db_user_details)

            if db_user_contact:
                db.session.delete(db_user_contact)

            if db_user_permission:
                db.session.delete(db_user_permission)

            if db_user_trainee:
                db.session.delete(db_user_trainee)

            if db_user_trainer:
                db.session.delete(db_user_trainer)

            db.session.delete(db_user)
            db.session.commit()

            print(f"User account deleted successfully: {username}")

            response_data = json.dumps({"message": "User account deleted successfully", "success": True})
            return Response(response_data, mimetype='application/json', status=200)
        else:
            response_data = json.dumps({"message": "User not found", "success": False})
            return Response(response_data, mimetype='application/json', status=404)