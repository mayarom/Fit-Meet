from flask_restx import Namespace, Resource, fields
from models import db, UsersExercises, TrainersExercises
from flask_jwt_extended import jwt_required
from flask import request
from datetime import datetime

exercise_ns = Namespace("exercise", description="A namespace for Exercises")

exercise_model = exercise_ns.model(
    "Exercise", {"id": fields.Integer(), "title": fields.String(), "description": fields.String()}
)

@exercise_ns.route("/trainer_exercises/<name>")
class TrainerExercisesResource(Resource):
    @exercise_ns.marshal_list_with(exercise_model)
    def get(self, name):
        # exercises = TrainersExercises.query.filter_by(name=name).all()
        exercises = TrainersExercises.query.all()
        return exercises

@exercise_ns.route("/exercises")
class ExercisesResource(Resource):
    @exercise_ns.marshal_list_with(exercise_model)
    def get(self):
        exercises = UsersExercises.query.all()
        return exercises
    
    @jwt_required()
    def post(self):
        print("inside post method")
        data = request.get_json()
        date_str = data.get("date")
        date_obj = datetime.strptime(date_str, "%Y-%m-%d") if date_str else None

        print("creating new exercise")
        new_exercise = TrainersExercises(
            name=data.get("title"),
            date=date_obj,  # Use the datetime object
            description=data.get("description")
        )

        print("saving new exercise")
        db.session.add(new_exercise)
        db.session.commit()

        # Serialize the new exercise object to a dictionary
        exercise_data = {
            "id": new_exercise.exerciseID,
            "title": new_exercise.name,
            "date": new_exercise.date.strftime("%Y-%m-%d") if new_exercise.date else None,
            "description": new_exercise.description
        }
        return exercise_data, 201

@exercise_ns.route("/exercise/<int:id>")
class ExerciseResource(Resource):
    @exercise_ns.marshal_with(exercise_model)
    def get(self, id):
        exercise = UsersExercises.query.get_or_404(id)
        return exercise

    @exercise_ns.marshal_with(exercise_model)
    @jwt_required()
    def put(self, id):
        exercise_to_update = UsersExercises.query.get_or_404(id)
        data = request.get_json()
        exercise_to_update.update(data.get("title"), data.get("description"))
        return exercise_to_update

    @exercise_ns.marshal_with(exercise_model)
    @jwt_required()
    def delete(self, id):
        exercise_to_delete = UsersExercises.query.get_or_404(id)
        exercise_to_delete.delete()
        return exercise_to_delete