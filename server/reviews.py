from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import Response, request, jsonify
from models import TrainersReviews, db, Users, UsersPermission

review_ns = Namespace("review", description="A namespace for Reviews")

review_model_details = review_ns.model(
    "Review", {
        "id": fields.Integer(),
        "trainer_id": fields.Integer(),
        "user_id": fields.Integer(),
        "stars": fields.Integer(),
        "description": fields.String()
    }
)

@review_ns.route("/reviews", methods=['GET', 'POST'])
class ReviewsListResource(Resource):
    @review_ns.marshal_with(review_model_details)
    @jwt_required()
    def get(self):
        reviews = TrainersReviews.query.all()
        return reviews

    @jwt_required()
    @review_ns.expect(review_model_details)
    def post(self):
        curr_user = get_jwt_identity()
        curr_user = Users.query.filter_by(username=curr_user).first()

        if not curr_user:
            response_data = { "message": "You must be logged in to access this resource", "success": False }
            return Response(response_data, mimetype="application/json", status=401)
        
        permission = UsersPermission.query.filter_by(userID=curr_user.userID).first()

        if not permission:
            response_data = { "message": "The user with the specified ID does not exist", "success": False }
            return Response(response_data, mimetype="application/json", status=404)
        
        data = request.json
        trainer_id = data.get("trainer_id")
        user_id = curr_user.userID
        stars = data.get("stars")
        description = data.get("description")

        trainer = Users.query.get(trainer_id)
        user = Users.query.get(user_id)
        print("user", user)
        print("trainer:", trainer)
        if not trainer or not user:
            return {"message": "Trainer or user does not exist"}, 404

        new_review = TrainersReviews(trainerID=trainer_id, userID=user_id, review_stars=stars, review_description=description)
        db.session.add(new_review)
        db.session.commit()

        return True, 201