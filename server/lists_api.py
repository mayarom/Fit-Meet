#lists_api.py is a RESTful API that provides lists of users, trainees, and trainers from the database.

from calendar import c
import logging
import stat
from tkinter import N
from flask import Flask, Response, jsonify, request, json
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required
from flask_restx import Namespace, Resource, fields
from exts import db
from models import TrainersReviews, Users, UsersDetails, TraineesDetails, TrainersDetails, UsersContact, UsersPermission, UsersExercises, TrainersExercises

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

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
    
@lists_ns.route('/trainers-list')
class TrainersList(Resource):
    def get(self):
        # Query the database to fetch all users with the 'trainer' permission
        trainers = Users.query.join(UsersPermission).filter(UsersPermission.permissions == 'trainer').all()

        # Assemble the fetched data into a list of dictionaries
        trainers_list = []

        for trainer in trainers:
            # Retrieve details from UsersDetails, UsersContact, and TrainersDetails models
            details = UsersDetails.query.filter_by(userID=trainer.userID).first()
            contact = UsersContact.query.filter_by(userID=trainer.userID).first()
            trainer_details = TrainersDetails.query.filter_by(userID=trainer.userID).first()

            # Assemble trainer details into a dictionary
            trainer_dict = {
                'id': trainer.userID,
                'name': trainer.username,
                'city': details.city if details else None,
                'email': contact.email if contact else None,
                'phone': contact.phone if contact else None,
                'experience': trainer_details.experience if trainer_details else None,
                'paylink': trainer_details.paylink if trainer_details else None
            }
            trainers_list.append(trainer_dict)

        # Return the list in JSON format
        return Response(json.dumps(trainers_list), mimetype='application/json', status=200)

    
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
    

@lists_ns.route('/trainees-list/registered')
class TraineesListRegistered(Resource):
    @jwt_required()
    def get(self):
        curr_user = get_jwt_identity()

        curr_user_id = Users.query.filter_by(username=curr_user).first().userID

        if not curr_user_id:
            return Response(json.dumps({"message": "User not found", "success": False}), mimetype='application/json', status=404)
        
        curr_user_permissions = UsersPermission.query.filter_by(userID=curr_user_id).first()

        if not curr_user_permissions:
            return Response(json.dumps({"message": "User permissions not found", "success": False}), mimetype='application/json', status=404)
        
        elif curr_user_permissions.permissions != "trainer" and curr_user_permissions.permissions != "admin":
            return Response(json.dumps({"message": "You do not have permission to access this resource", "success": False}), mimetype='application/json', status=403)
        
        # Query the database to fetch all users with permissions of 'trainee'
        trainees = Users.query.join(Users.permissions).filter_by(permissions='trainee').all()

        # Assemble the fetched data into a list of dictionaries
        trainees_list = []
        
        for trainee in trainees:
            # Check if the trainee is registered to any of the trainer's exercises
            trainee_exercises = UsersExercises.query.filter_by(userID=trainee.userID).all()

            exercise_list = []

            for exercise in trainee_exercises:
                trainer_id = TrainersExercises.query.filter_by(exerciseID=exercise.exerciseID).first().userID

                if trainer_id == curr_user_id:
                    exercise_data = TrainersExercises.query.filter_by(exerciseID=exercise.exerciseID).first()
                    exercise_list.append({
                        'id': exercise_data.exerciseID,
                        'name': exercise_data.name,
                        'date': exercise_data.date,
                        'description': exercise_data.description
                    })

            if len(exercise_list) > 0:
                # Retrieve details from UsersDetails and UsersContact models
                details = UsersDetails.query.filter_by(userID=trainee.userID).first()
                contact = UsersContact.query.filter_by(userID=trainee.userID).first()
                
                # Assemble user details into a dictionary
                trainee_details = {
                    'id': trainee.userID,
                    'name': trainee.username,
                    'city': details.city if details else None,
                    'email': contact.email if contact else None,
                    'phone': contact.phone if contact else None,
                    'exercises': exercise_list
                }
                trainees_list.append(trainee_details)

        # Return the list in JSON format
        return Response(json.dumps(trainees_list), mimetype='application/json', status=200)