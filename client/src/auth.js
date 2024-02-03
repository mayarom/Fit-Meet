import { createAuthProvider } from 'react-token-auth';

export const [useAuth, authFetch, login, logout] = createAuthProvider({
    accessTokenKey: 'access_token',
    onUpdateToken: (token) => fetch('/auth/refresh', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: token.refresh_token })
    })
    .then(r => {
        if (!r.ok) {
            throw new Error('Failed to refresh token');
        }
        return r.json();
    })
});

// Function to handle user login
export const loginUser = (username, password) => {
    return fetch('/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Login failed');
        }
        return response.json();
    })
    .then(data => {
        login(data.access_token);
        localStorage.setItem('username', data.user.name);
        return data.user; // Return user data for further processing if needed
    })
    .catch(error => {
        console.error('Login error:', error);
        throw error; // Re-throw the error for the caller to handle if needed
    });
};

export const logoutUser = () => {
    logout();
    localStorage.removeItem('username');
};

// Function to fetch user profile
export const fetchUserProfile = () => {
    return authFetch('/profile')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch user profile');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Profile fetch error:', error);
            throw error; // Re-throw the error for the caller to handle if needed
        });
};
