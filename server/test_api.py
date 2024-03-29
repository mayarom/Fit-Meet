import unittest
from main import create_app
from config import TestConfig
from exts import db
from models import Users  # Import the User model from models.py

class APITestCase(unittest.TestCase):
    def setUp(self):
        # Create a test app and client
        self.app = create_app(TestConfig)
        self.client = self.app.test_client(self)

        with self.app.app_context():
            db.init_app(self.app)
            db.create_all()

    def test_signup(self):
        # Test the user signup endpoint
        signup_response = self.client.post(
            "/auth/signup",
            json={
                "username": "testuser",
                "email": "testuser@test.com",
                "password": "password1234",
                "dob": "1996-01-01",
                "city": "Tel Aviv",
                "goal": "lose weight",
                "phone": "0501234567",
                "permissions": "trainee",  # Updated to match the UserPermission model
                "height": 1.75,
                "weight": 80.0
            },
        )
        status_code = signup_response.status_code
        self.assertEqual(status_code, 201)

    def test_login(self):
        # Test the user login endpoint
        signup_response = self.client.post(
            "/auth/signup",
            json={
                "username": "testuser",
                "email": "testuser@test.com",
                "password": "password1234",
                "dob": "1996-01-01",
                "city": "Tel Aviv",
                "goal": "lose weight",
                "phone": "0501234567",
                "permissions": "trainee",  # Updated to match the UserPermission model
                "height": 1.75,
                "weight": 80.0
            },
        )

        login_response = self.client.post(
            "/auth/login",
            json={"username": "testuser", "password": "password1234"},
        )

        status_code = login_response.status_code
        json = login_response.json
        self.assertEqual(status_code, 200)

    def tearDown(self):
        # Clean up after each test
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

if __name__ == "__main__":
    unittest.main()
