# 🏋️ Fit & Meet - Fitness Training Management API
### Presentation: https://docs.google.com/presentation/d/1O1hMb0q88Y8B75xORcmrK6DbuDEdomEy/edit?usp=sharing&ouid=103104202947156141205&rtpof=true&sd=true
## 📖 Project Description

Fit & Meet is a robust and feature-rich RESTful API that powers a fitness training management system. Developed as part of a Software Engineering course project, this API provides all the required endpoints for managing users, trainers, trainees, and user profile operations efficiently.

## 🌟 Key Features

- **User Management**: Support for full CRUD (Create, Read, Update, Delete) operations on user accounts, facilitating seamless management of user data. 

- **Authentication**: Secure and stateless authentication using JSON Web Tokens (JWTs).

- **Profile Management**: Users can retrieve, update, and delete their profiles and perform sensitive operations like changing their password.

- **Trainer and Trainee Management**: Specialized endpoints for managing trainer and trainee accounts. Trainers can create professional profiles and publish training programs. Trainees can search for trainers based on specialization, register for training sessions, and track their progress.

## 🚀 Technologies and Structure

- **Python + Flask**: The API is built using Python and Flask, which provides structure for organizing the application into units of functionality, and utilities for routing, handling requests and generating responses.

- **Flask-RESTX**: An extension for Flask that adds support for quickly building REST APIs while providing user-friendly Swagger UI documentation.

- **Flask-JWT-Extended**: This extension adds support for JWT-based authentication in our Flask app.

- **SQLAlchemy**: It is used to handle database operations smoothly and abstracts the SQLAlchemy Core and ORM to provide a user-friendly solution to manage and query the application data.

## ⚙️ Installation and Running

1. **Clone the Project**:
   ```bash
   git clone https://github.com/mayarom/Fit-Meet-app.git
   ```
2. **Setup Environment**:
   - Create a virtual environment using Python:
     ```bash
     python -m venv venv
     ```
   - Activate the virtual environment:
     ```bash
     source venv/bin/activate # For Unix-based OS
     ```
     ```bash
     .\env\Scripts\activate # For Windows
     ```
   - Install the requirements:
     ```bash
     pip install -r requirements.txt
     ```
3. **Configure Environment Variables**:
   - Set `FLASK_ENV=development` to enable debug mode, which will allow Flask to provide more in-depth error messages.

4. **Running the Server**:
   ```bash
   python server.py
   ```

## 📚 API Documentation

The following endpoints are available:

- `GET /profile/<int:userid>`: Returns the profile of a user
- `GET /profile`: Returns the profile of the currently authenticated user
- `POST /change-password`: Changes password of the currently authenticated user
- `POST /edit-profile`: Edits profile of the currently authenticated user
- `DELETE /delete-account`: Deletes account of the currently authenticated user

## 👥 Development Team

- Linor Ronen
- Roy Simanovich
- Maya Rom
- Benji

## 🤝 Contributing

This project is open source. Contributions are always welcomed. Be sure to fork the repository and work on a branch of your version of the repo. We are looking forward to your open pull requests.

## 📜 License

This project is distributed under the MIT License. See [LICENSE](LICENSE) for more details.
