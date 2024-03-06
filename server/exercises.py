from calendar import c
from re import T
import logging
from tkinter import N
from urllib import response
from flask_migrate import current
from flask_restx import Namespace, Resource, fields
from models import UsersPermission, db, UsersExercises, TrainersExercises, Users
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import Response, current_app, request, json
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

exercise_ns = Namespace("exercise", description="A namespace for Exercises")

exercise_model_details = exercise_ns.model(
    "Exercise", {
        "id": fields.Integer(),
        "title": fields.String(),
        "date": fields.String(),
        "description": fields.String()
    }
)

exercise_model_nested = exercise_ns.model(
    "ExerciesNested", {
        "message": fields.String(description="A message to describe the result of the operation"),
        "success": fields.Boolean(description="A boolean to indicate if the operation was successful"),
        "exercises": fields.List(fields.Nested(exercise_model_details), description="A list of exercises")
    }
)

exercise_model_create = exercise_ns.model(
    "ExerciseCreate", {
        "message": fields.String(description="A message to describe the result of the operation"),
        "success": fields.Boolean(description="A boolean to indicate if the operation was successful"),
        "id": fields.Integer(description="The ID of the newly created exercise")
    }
)

exercise_model_details_single = exercise_ns.model(
    "ExerciseSingle", {
        "message": fields.String(description="A message to describe the result of the operation"),
        "success": fields.Boolean(description="A boolean to indicate if the operation was successful"),
        "id": fields.Integer(description="The ID of the exercise"),
        "title": fields.String(description="The title of the exercise"),
        "date": fields.String(description="The date of the exercise"),
        "description": fields.String(description="The description of the exercise"),
        "trainername": fields.String(description="The name of the trainer who created the exercise"),
        "trainerID": fields.Integer(description="The ID of the trainer who created the exercise")
    }
)

exercise_model_trainee_register_details = exercise_ns.model(
    "ExerciseTraineeRegisterDetails", {
        "id": fields.Integer(description="The ID of the user"),
        "username": fields.String(description="The username of the user")
    }
)

exercise_model_exercise_list_details = exercise_ns.model(
    "ExerciseListDetails", {
        "id": fields.Integer(description="The ID of the exercise"),
        "title": fields.String(description="The title of the exercise"),
        "date": fields.String(description="The date of the exercise"),
        "description": fields.String(description="The description of the exercise"),
        "trainer_id": fields.Integer(description="The ID of the trainer who created the exercise"),
        "trainer_name": fields.String(description="The name of the trainer who created the exercise"),
        "registered_users": fields.List(fields.Nested(exercise_model_trainee_register_details), description="A list of registered users")
    }
)

exercise_model_exercise_list_nested = exercise_ns.model(
    "ExerciseListNested", {
        "message": fields.String(description="A message to describe the result of the operation"),
        "success": fields.Boolean(description="A boolean to indicate if the operation was successful"),
        "exercises": fields.List(fields.Nested(exercise_model_exercise_list_details), description="A list of exercises")
    }
)
    
@exercise_ns.route("/trainer-exercises/<int:id>")
class TrainerExercisesListResource(Resource):
    @exercise_ns.marshal_list_with(exercise_model_nested)
    @jwt_required()
    def get(self, id):
        curr_user = get_jwt_identity()

        if not curr_user:
            response_data = { "message": "Access denied", "error": "You must be logged in to access this resource", "success": False }
            return Response(response_data, mimetype="application/json", status=401)
        
        permission = UsersPermission.query.filter_by(userID=id).first()

        if not permission:
            response_data = { "message": "The user with the specified ID does not exist", "success": False }
            return Response(response_data, mimetype="application/json", status=404)
        
        elif permission.permissions != "trainer" and permission.permissions != "admin":
            response_data = { "message": "The user with the specified ID is not a trainer", "success": False }
            return Response(response_data, mimetype="application/json", status=418) # I'm a teapot (RFC 2324)
        
        exercises_list = TrainersExercises.query.filter_by(userID=id).all()

        if not exercises_list:
            response_data = { "message": "The trainer with the specified ID does not exist or has no exercises", "success": False }
            return Response(response_data, mimetype="application/json", status=404)
        
        response_data = {
            "message": "Exercises retrieved successfully",
            "success": True,
            "exercises": [
                {
                    "id": exercise.exerciseID,
                    "title": exercise.name,
                    "date": exercise.date.strftime("%Y-%m-%d") if exercise.date else None,
                    "description": exercise.description
                } for exercise in exercises_list
            ]
        }

        return Response(response_data, mimetype="application/json", status=200)
    
    @jwt_required()
    # Delete the selected exercise from the database, if it exists, else return a 404 status code.
    def delete(self, id):
        curr_user = get_jwt_identity()
        curr_user = Users.query.filter_by(username=curr_user).first()

        if not curr_user:
            response_data = { "message": "Access denied", "error": "You must be logged in to access this resource", "success": False }
            return Response(response_data, mimetype="application/json", status=401)
        
        permission = UsersPermission.query.filter_by(userID=curr_user.userID).first()

        if not permission:
            response_data = { "message": "Access denied", "error": "The user with the specified ID does not exist", "success": False }
            return Response(response_data, mimetype="application/json", status=404)
        
        elif permission.permissions != "trainer" and permission.permissions != "admin":
            response_data = { "message": "The given user is not a trainer", "error": "The user with the specified ID is not a trainer", "success": False }
            return Response(response_data, mimetype="application/json", status=418) # I'm a teapot (RFC 2324)
        
        exercise_to_delete = TrainersExercises.query.get(id)

        if not exercise_to_delete:
            response_data = { "message": "Exercise not found", "error": "The exercise with the specified ID does not exist", "success": False }
            return Response(response_data, mimetype="application/json", status=404)
        
        # Before deleting the exercise, ensure that all users registered to the exercise are unregistered.
        users_exercises = UsersExercises.query.filter_by(exerciseID=id).all()

        for user_exercise in users_exercises:
            db.session.delete(user_exercise)

        # Ensure the exercise is deleted from the database, then return a 204 status code.
        db.session.delete(exercise_to_delete)
        db.session.commit()

        response_data = { "message": "Exercise deleted successfully", "success": True, "id": id }
        return response_data, 200
    
    @jwt_required()
    def put(self, id):
        curr_user = get_jwt_identity()
        curr_user = Users.query.filter_by(username=curr_user).first()

        if not curr_user:
            response_data = { "message": "You must be logged in to access this resource", "success": False }
            return Response(response_data, mimetype="application/json", status=401)
        
        permission = UsersPermission.query.filter_by(userID=curr_user.userID).first()

        if not permission:
            response_data = { "message": "The user with the specified ID does not exist", "success": False }
            return Response(response_data, mimetype="application/json", status=404)
        
        elif permission.permissions != "trainer" and permission.permissions != "admin":
            response_data = { "message": "The given user is not a trainer", "error": "The user with the specified ID is not a trainer", "success": False }
            return Response(response_data, mimetype="application/json", status=418)
        
        data = request.get_json()

        if not data.get("title") or not data.get("description") or not data.get("date"):
            response_data = { "message": "The title and description fields are required", "success": False }
            return Response(response_data, mimetype="application/json", status=400)
        
        exercise_to_update = TrainersExercises.query.filter_by(exerciseID=id, userID=permission.userID).first()

        if not exercise_to_update:
            response_data = { "message": "Exercise not found", "error": "The exercise with the specified ID does not exist, or you do not have permission to update it", "success": False }
            return Response(response_data, mimetype="application/json", status=404)
        
        exercise_to_update.name = data.get("title")
        exercise_to_update.date = datetime.strptime(data.get("date"), "%Y-%m-%d")
        exercise_to_update.description = data.get("description")

        db.session.commit()

        response_data = json.dumps({"message": "Exercise updated successfully", "success": True})
        return Response(response_data, mimetype='application/json', status=200)


    
@exercise_ns.route("/create-exercise")
class CreateExerciseResource(Resource):
    @exercise_ns.marshal_with(exercise_model_details)
    @jwt_required()
    def post(self):
        username = get_jwt_identity()
        db_user = Users.query.filter_by(username=username).first()

        if not db_user:
            response_data = { "message": "You must be logged in to access this resource", "success": False }
            return Response(response_data, mimetype="application/json", status=401)
        
        permission = UsersPermission.query.filter_by(userID=db_user.userID).first()

        if permission.permissions != "trainer" and permission.permissions != "admin":
            response_data = { "message": "You do not have permission to access this resource", "success": False }
            return Response(response_data, mimetype="application/json", status=401)
        
        data = request.get_json()

        if not data.get("title") or not data.get("description") or not data.get("date"):
            response_data = { "message": "The title and description fields are required", "success": False }
            return Response(response_data, mimetype="application/json", status=400)
        
        new_exercise = TrainersExercises(
            userID=db_user.userID,
            name=data.get("title"),
            date=datetime.strptime(data.get("date"), "%Y-%m-%d"),
            description=data.get("description")
        )

        db.session.add(new_exercise)
        db.session.commit()

        # Fetch the newly created exercise from the database and return the id of the new exercise.
        new_exercise = TrainersExercises.query.filter_by(name=data.get("title"), userID=db_user.userID, description=data.get("description")).first()

        response_data = {
            "message": "Exercise created successfully",
            "success": True,
            "id": new_exercise.exerciseID
        }

        print(f'Exercise {new_exercise.exerciseID} created successfully for user {db_user.username}')

        return Response(response_data, mimetype="application/json", status=201)

@exercise_ns.route("/exercise/<int:id>")
class ExerciseResource(Resource):
    @exercise_ns.marshal_with(exercise_model_details_single)
    @jwt_required()
    def get(self, id):
        username = get_jwt_identity()
        db_user = Users.query.filter_by(username=username).first()

        if not db_user:
            response_data = { "message": "You must be logged in to access this resource", "success": False }
            return Response(response_data, mimetype="application/json", status=401)
        
        exercise_details = TrainersExercises.query.filter_by(exerciseID=id).first()

        if not exercise_details:
            response_data = { "message": "The exercise with the specified ID does not exist", "success": False }
            return Response(response_data, mimetype="application/json", status=404)
        
        trainer_name = Users.query.filter_by(userID=exercise_details.userID).first().username
        
        response_data = {
            "message": "Exercise retrieved successfully",
            "success": True,
            "id": exercise_details.exerciseID,
            "title": exercise_details.name,
            "date": exercise_details.date.strftime("%Y-%m-%d") if exercise_details.date else None,
            "description": exercise_details.description,
            "trainername": trainer_name,
            "trainerID": exercise_details.userID
        }

        return response_data, 200

    @jwt_required()
    # Register the trainee to the selected exercise
    def put(self, id):
        username = get_jwt_identity()
        db_user = Users.query.filter_by(username=username).first()

        if not db_user:
            response_data = { "message": "You must be logged in to access this resource", "success": False }
            return Response(response_data, mimetype="application/json", status=401)
        
        permission = UsersPermission.query.filter_by(userID=db_user.userID).first()

        if permission.permissions != "trainee" and permission.permissions != "admin":
            response_data = { "message": "You do not have permission to access this resource", "success": False }
            return Response(response_data, mimetype="application/json", status=401)

        exercise_to_register = TrainersExercises.query.filter_by(exerciseID=id).first()

        if not exercise_to_register:
            response_data = { "message": "The exercise with the specified ID does not exist", "success": False }
            return Response(response_data, mimetype="application/json", status=404)
        
        # Check if the user already registered to the exercise
        user_exercise = UsersExercises.query.filter_by(userID=db_user.userID, exerciseID=id).first()

        if user_exercise:
            response_data = { "message": "The user is already registered to the exercise", "success": False }
            return Response(response_data, mimetype="application/json", status=409)
        
        # Check if the date of the exercise is in the past
        """ if exercise_to_register.date < datetime.now():
            response_data = { "message": "The date of the exercise has already passed", "success": False }
            return Response(response_data, mimetype="application/json", status=400) """
        
        # Register the user to the exercise
        new_user_exercise = UsersExercises(
            userID=db_user.userID,
            exerciseID=id
        )

        db.session.add(new_user_exercise)
        db.session.commit()

        response_data = { "message": "Registered successfully", "success": True }
        return response_data, 201

    @jwt_required()
    # Delete the selected exercise, if it exists, else return a 404 status code.
    def delete(self, id):
        username = get_jwt_identity()
        db_user = Users.query.filter_by(username=username).first()

        if not db_user:
            response_data = { "message": "You must be logged in to access this resource", "success": False }
            return Response(response_data, mimetype="application/json", status=401)
        
        permission = UsersPermission.query.filter_by(userID=db_user.userID).first()

        if permission.permissions != "trainee" and permission.permissions != "admin":
            response_data = { "message": "You do not have permission to access this resource", "success": False }
            return Response(response_data, mimetype="application/json", status=401)
        
        exercise_to_delete = UsersExercises.query.filter_by(exerciseID=id, userID=db_user.userID).first()

        if not exercise_to_delete:
            response_data = { "message": "The user is not registered to the exercise with the specified ID", "success": False }
            return Response(response_data, mimetype="application/json", status=400)

        # Ensure the exercise is deleted from the database, then return a 200 status code.
        db.session.delete(exercise_to_delete)
        db.session.commit()

        response_data = { "message": "Unregistered successfully", "success": True }
        return response_data, 200

# Get user's exercises (trainee = all registered exercises, trainer = all exercises created by the trainer)
@exercise_ns.route("/exercises-list")
class ExercisesListResource(Resource):
    @exercise_ns.marshal_list_with(exercise_model_nested)
    @jwt_required()
    def get(self):
        curr_user = get_jwt_identity()

        if not curr_user:
            response_data = { "message": "Access denied", "error": "You must be logged in to access this resource", "success": False }
            print(f'User {curr_user} is not logged in')
            return Response(response_data, mimetype="application/json", status=401)
        
        id = Users.query.filter_by(username=curr_user).first().userID

        if not id:
            response_data = { "message": "Access denied", "error": "The user with the specified ID does not exist", "success": False, "exercises": [] }
            print(f'User {curr_user} does not exist')
            return Response(response_data, mimetype="application/json", status=404)
        
        permission = UsersPermission.query.filter_by(userID=id).first()
        
        if permission.permissions == "trainee":
            exercises_list = UsersExercises.query.filter_by(userID=permission.userID).all()
            print(f'User {curr_user} is a trainee')
            exercises_list_details = [TrainersExercises.query.filter_by(exerciseID=exercise.exerciseID).first() for exercise in exercises_list]

            if not exercises_list_details:
                response_data = { "message": "No exercises found", "success": True, "exercises": [] }
                print(f'No exercises found for user {curr_user}')
                return response_data, 200
            
            response_data = {
                "message": "Exercises retrieved successfully",
                "success": True,
                "exercises": [
                    {
                        "id": exercise.exerciseID,
                        "title": exercise.name,
                        "date": exercise.date.strftime("%Y-%m-%d") if exercise.date else None,
                        "description": exercise.description
                    } for exercise in exercises_list_details
                ]
            }

            print(f'Exercises retrieved successfully for user {curr_user}')
            return response_data, 200
        
        elif permission.permissions == "trainer" or permission.permissions == "admin":
            exercises_list = TrainersExercises.query.filter_by(userID=permission.userID).all()
            print(f'User {curr_user} is a trainer')

        else:
            response_data = { "message": "You do not have permission to access this resource", "success": False, "exercises": [] }
            print(f'User {curr_user} does not have permission to access this resource')
            return Response(response_data, mimetype="application/json", status=401)

        if not exercises_list:
            response_data = { "message": "No exercises found", "success": True, "exercises": [] }
            print(f'No exercises found for user {curr_user}')
            return response_data, 200
        
        response_data = {
            "message": "Exercises retrieved successfully",
            "success": True,
            "exercises": [
                {
                    "id": exercise.exerciseID,
                    "title": exercise.name,
                    "date": exercise.date.strftime("%Y-%m-%d") if exercise.date else None,
                    "description": exercise.description
                } for exercise in exercises_list
            ]
        }

        print(f'Exercises retrieved successfully for user {curr_user}')

        return response_data, 200

# Fetch the list of exercises created by a specific trainer    
@exercise_ns.route("/exercise-list/<int:id>")
class ExerciseListResource(Resource):
    @exercise_ns.marshal_list_with(exercise_model_nested)
    @jwt_required()
    def get(self, id):
        curr_user = get_jwt_identity()

        if not curr_user:
            response_data = { "message": "You must be logged in to access this resource", "success": False }
            print(f'User {curr_user} is not logged in')
            return Response(response_data, mimetype="application/json", status=401)
        
        curr_user_id = Users.query.filter_by(username=curr_user).first().userID
        
        permission = UsersPermission.query.filter_by(userID=id).first()

        if not permission:
            response_data = { "message": "The user with the specified ID does not exist", "success": False }
            print(f'User {curr_user} does not exist')
            return Response(response_data, mimetype="application/json", status=404)
        
        elif permission.permissions != "trainer" and permission.permissions != "admin":
            response_data = { "message": "The user with the specified ID is not a trainer", "success": False }
            print(f'User id {id} is not a trainer')
            return Response(response_data, mimetype="application/json", status=418)
        
        exercises_list = TrainersExercises.query.filter_by(userID=id).all()

        if not exercises_list:
            response_data = { "message": "The trainer with the specified ID does not exist or has no exercises", "success": False, "exercises": [] }
            return Response(response_data, mimetype="application/json", status=404)
        
        exercises_list = [exercise for exercise in exercises_list if not UsersExercises.query.filter_by(userID=curr_user_id, exerciseID=exercise.exerciseID).first()]
        
        response_data = {
            "message": "Exercises retrieved successfully",
            "success": True,
            "exercises": [
                {
                    "id": exercise.exerciseID,
                    "title": exercise.name,
                    "date": exercise.date.strftime("%Y-%m-%d") if exercise.date else None,
                    "description": exercise.description
                } for exercise in exercises_list
            ]
        }

        return response_data, 200
    
@exercise_ns.route("/exercise-list-all")
class ExerciseListAllResource(Resource):
    @exercise_ns.marshal_with(exercise_model_exercise_list_nested)
    @jwt_required()
    def get(self):
        username = get_jwt_identity()
        curr_user = Users.query.filter_by(username=username).first()

        if not curr_user:
            response_data = { "message": "You must be logged in to access this resource", "success": False }
            return Response(response_data, mimetype="application/json", status=401)
        
        permission = UsersPermission.query.filter_by(userID=curr_user.userID).first()

        if not permission:
            response_data = { "message": "The user with the specified ID does not exist", "success": False }
            return response_data, 404
        
        elif permission.permissions != "admin":
            response_data = { "message": "The user with the specified ID is not a trainer", "success": False }
            return response_data, 418
        
        exercises_list = TrainersExercises.query.all()

        if not exercises_list:
            response_data = { "message": "No exercises found", "success": False, "exercises": [] }
            return response_data, 200
        
        ex_list = []
        
        for exercise in exercises_list:
            trainer_name = Users.query.filter_by(userID=exercise.userID).first()

            if not trainer_name:
                continue

            registered_users = UsersExercises.query.filter_by(exerciseID=exercise.exerciseID).all()
            users_list = []

            for user in registered_users:
                trainee_name = Users.query.filter_by(userID=user.userID).first()

                if not trainee_name:
                    continue
                
                users_list.append({
                    "id": user.userID,
                    "username": trainee_name.username
                })

            ex_list.append({
                "id": exercise.exerciseID,
                "title": exercise.name,
                "date": exercise.date.strftime("%Y-%m-%d") if exercise.date else None,
                "description": exercise.description,
                "trainer_id": exercise.userID,
                "trainer_name": trainer_name.username,
                "registered_users": users_list
            })
        
        response_data = {
            "message": "Exercises retrieved successfully",
            "success": True,
            "exercises": ex_list
        }

        return response_data, 200