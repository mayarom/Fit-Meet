from calendar import c
import stat
from tkinter import N
from flask import Flask, Response, jsonify, request, json
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required
from flask_restx import Namespace, Resource, fields
from exts import db
from models import TrainersReviews, Users, UsersDetails, TraineesDetails, TrainersDetails, UsersContact, UsersPermission

lists_ns = Namespace('lists', description='Lists of users and trainees')

# A method to retrieve all trainees from the database, with their details.
# This will be used as a base-API for the trainer to view all trainees that
# are registered to at least one of the trainer's exercises.

@lists_ns.route('/trainees-list')
class TraineesList(Resource):
    @jwt_required()
    def get(self):
        # Query the database to fetch all users with permissions of 'trainee'
        trainees = Users.query.join(Users.permissions).filter_by(permissions='trainee').all()

        # Assemble the fetched data into a list of dictionaries
        trainees_list = []
        
        for trainee in trainees:
            # Retrieve details from UsersDetails and UsersContact models
            details = UsersDetails.query.filter_by(userID=trainee.userID).first()
            contact = UsersContact.query.filter_by(userID=trainee.userID).first()
            
            # Assemble user details into a dictionary
            trainee_details = {
                'id': trainee.userID,
                'name': trainee.username,
                'city': details.city if details else None,
                'email': contact.email if contact else None,
                'phone': contact.phone if contact else None
            }
            trainees_list.append(trainee_details)

        # Return the list in JSON format
        return Response(json.dumps(trainees_list), mimetype='application/json', status=200)
    
@lists_ns.route('/users-list')
class UsersList(Resource):
    @jwt_required()
    def get(self):

        current_user = Users.query.filter_by(username=get_jwt_identity()).first()
        current_user_permission = UsersPermission.query.filter_by(userID=current_user.userID).first()

        if current_user_permission.permissions != "admin":
            return Response(json.dumps({"message": "You do not have permission to access this resource", "success": False}), mimetype='application/json', status=403)


        # Query the database to fetch all users
        users = Users.query.all()

        # Assemble the fetched data into a list of dictionaries
        users_list = []
        
        for user in users:
            # Retrieve details from UsersDetails and UsersContact models
            details = UsersDetails.query.filter_by(userID=user.userID).first()
            contact = UsersContact.query.filter_by(userID=user.userID).first()
            permission = UsersPermission.query.filter_by(userID=user.userID).first()
            
            # Assemble user details into a dictionary
            user_details = {
                'id': user.userID,
                'name': user.username,
                'city': details.city if details else None,
                'email': contact.email if contact else None,
                'phone': contact.phone if contact else None,
                'dob': details.dob if details else None,
                'permissions': permission.permissions if permission else None
            }
            users_list.append(user_details)

        # Return the list in JSON format
        return Response(json.dumps(users_list), mimetype='application/json', status=200)