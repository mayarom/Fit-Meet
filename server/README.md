# 🏋️ Fit & Meet - Fitness Training System

## 📖 Project Description

Fit & Meet is an advanced digital system developed as part of a Software Engineering course project. Designed for fitness trainers and trainees, it aims to facilitate efficient coordination and management of personal training sessions.

## 🌟 Key Features

- **Trainers**: Create professional profiles, publish training programs, and coordinate workouts with trainees.
- **Trainees**: Search for trainers based on specialization, register for training sessions, and track progress.

## 🚀 Technologies and Structure

- **Front-End**:
  - 🎨 Developed using [React](https://reactjs.org/)
  - Provides an intuitive and dynamic user interface.
- **Back-End**:
  - 🔧 Based on [Python](https://www.python.org/) and [Flask](https://flask.palletsprojects.com/en/2.0.x/)
  - Handles API requests, user authentication, and information management.
- **Database**:
  - 💾 Data stored in [MySQL](https://www.mysql.org/index.html)
  - Manages user information and training history.
- **Cloud**:
  - ☁️ Maintained and operated on [Microsoft Azure](https://azure.microsoft.com/)
  - Includes services for storage and data security.

## ⚙️ Installation and Running

1. **Project Download**:
   ```bash
   git clone https://github.com/mayarom/Fit-Meet-app.git
   ```
2. **Development Environment Setup:**
   - Create and activate a virtual environment:

     ```bash
     python -m venv venv
     source venv/bin/activate # Or in Windows: venv\Scripts\activate
     ```
   - Install dependencies:

     ```bash
     pip install -r requirements.txt
     ```
   - Running the Server:

     ```bash
     python run.py
     ```

## 📌 Using the System

- **Trainers**: Create a profile, schedule training sessions, and monitor trainee progress.
- **Trainees**: Search for a suitable trainer, register for training programs, and track your progress.

## 📚 Database Tables

### Users Table

- `userID` (PK, INT, AUTO_INCREMENT) - Unique identifier for each user.
- `username` (VARCHAR(255), UQ, NN) - Unique username.
- `password` (VARCHAR(255), NN) - Encrypted user password.

### Users Permission Table

- `userID` (PK, FK, INT) - Unique user identifier, linked to the Users Table.
- `permissions` (ENUM('trainee', 'trainer', 'admin'), NN) - Type of user permission.

### Users Details Table

- `userID` (PK, FK, INT) - Unique user identifier, linked to the Users Table.
- `dob` (DATE, NN) - User's date of birth.
- `city` (VARCHAR(255), NN) - User's city of residence.

### Trainees Details Table

- `userID` (PK, FK, INT) - Unique trainer identifier, linked to the Users Table.
- `height` (DECIMAL(3,2), CHECK(height BETWEEN 1.00 AND 2.50), NN) - Trainee's height.
- `weight` (DECIMAL(5,2), CHECK(weight BETWEEN 40.0 AND 300.0), NN) - Trainee's weight.
- `goal` (TEXT, NN) - Trainee's training goals.

### Trainers Details Table

- `userID` (PK, FK, INT) - Unique trainer identifier, linked to the Users Table.
- `experience` (TEXT, NN) - Trainer's training experience.
- `paylink` (VARCHAR(255), NN) - Payment link for training services.

### Users Contact Table

- `userID` (PK, FK, INT) - Unique user identifier, linked to the Users Table.
- `email` (VARCHAR(255), NN, UQ) - User's email address.
- `phone` (VARCHAR(20), NN, UQ) - User's phone number.

### Trainers Exercises Table

- `exerciseID` (PK, INT, AUTO_INCREMENT) - Unique identifier for each exercise.
- `userID` (FK, INT) - Unique identifier of the trainer who created the exercise, linked to the Users Table.
- `name` (VARCHAR(255), NN) - Name of the exercise.
- `date` (DATE, NN) - Date of the exercise.
- `description` (TEXT, NN) - Description of the exercise.

### Users Exercises Table

- `exerciseID` (PK, FK, INT) - Unique identifier of the exercise, linked to the Trainers Exercises Table.
- `userID` (PK, FK, INT) - Unique user identifier, linked to the Users Table.

### Trainers Reviews Table

- `trainerID` (FK, INT) - Unique trainer identifier, linked to the Users Table.
- `userID` (FK, INT) - Unique user identifier who wrote the review, linked to the Users Table.
- `review_stars` (INT, CHECK(review_stars BETWEEN 1 AND 5), NN) - Rating of the review (1 to 5 stars).
- `review_description` (TEXT, NN) - Description of the review.

## 👥 Development Team

- Linor Ronen
- Roy Simanovich
- Maya Rom

## 🤝 Contributing to the Project

We welcome contributions to the development and improvement of the project. Please follow these steps:

1. Fork the repository.
2. Create a new branch for your changes.
3. Make the changes and submit a Pull Request.

For more details, see [Contribution Guide](CONTRIBUTING.md).

## 📜 License

This project is distributed under the MIT License. See [LICENSE](LICENSE) for details.
