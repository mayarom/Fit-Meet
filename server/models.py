#models.py

from exts import db
from sqlalchemy import CheckConstraint, ForeignKey, Enum
from sqlalchemy.orm import relationship

# User model
class Users(db.Model):
    userID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    
    # Define the relationship between User and UserPermission
    permissions = relationship('UsersPermission', back_populates='user', uselist=False)

    def __repr__(self):
        return f"<User {self.username}>"

# Users Permissions model
class UsersPermission(db.Model):
    userID = db.Column(db.Integer, ForeignKey('users.userID'), nullable=False, primary_key=True)
    permissions = db.Column(Enum('trainee', 'trainer', 'admin'), nullable=False)

    # Define the relationship between UsersPermission and Users
    user = relationship('Users', back_populates='permissions')

# Users Details model
class UsersDetails(db.Model):
    userID = db.Column(db.Integer, ForeignKey('users.userID'), nullable=False, primary_key=True)
    dob = db.Column(db.Date, nullable=False)
    city = db.Column(db.String(255), nullable=False)

# Trainees Details model
class TraineesDetails(db.Model):
    userID = db.Column(db.Integer, ForeignKey('users.userID'), nullable=False, primary_key=True)
    height = db.Column(db.Numeric(3, 2), CheckConstraint('height >= 1.00 AND height <= 2.50'), nullable=False)
    weight = db.Column(db.Numeric(5, 2), CheckConstraint('weight >= 40.0 AND weight <= 300.0'), nullable=False)
    goal = db.Column(db.Text, nullable=False)

# Trainers Details model
class TrainersDetails(db.Model):
    userID = db.Column(db.Integer, ForeignKey('users.userID'), nullable=False, primary_key=True)
    experience = db.Column(db.Text, nullable=False)
    paylink = db.Column(db.String(255), nullable=False)

# Users Contact model
class UsersContact(db.Model):
    userID = db.Column(db.Integer, ForeignKey('users.userID'), nullable=False, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    phone = db.Column(db.String(20), unique=True, nullable=False)

# Trainers Exercises model
class TrainersExercises(db.Model):
    exerciseID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    userID = db.Column(db.Integer, ForeignKey('users.userID'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    date = db.Column(db.Date, nullable=False)
    description = db.Column(db.Text, nullable=False)

# Users Exercises model
class UsersExercises(db.Model):
    exerciseID = db.Column(db.Integer, ForeignKey('trainers_exercises.exerciseID'), primary_key=True)
    userID = db.Column(db.Integer, ForeignKey('users.userID'), primary_key=True)

# Trainers Reviews model
class TrainersReviews(db.Model):
    reviewID = db.Column(db.Integer, nullable=False, primary_key=False)
    trainerID = db.Column(db.Integer, ForeignKey('users.userID'), nullable=False, primary_key=False)
    userID = db.Column(db.Integer, ForeignKey('users.userID'), nullable=False, primary_key=False)
    review_stars = db.Column(db.Integer, CheckConstraint('review_stars >= 1 AND review_stars <= 5'), nullable=False)
    review_description = db.Column(db.Text, nullable=False, primary_key=True)

