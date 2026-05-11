// API service for authentication
const API_BASE_URL = "http://localhost:5200/api";

// Callback for unauthorized errors
let onUnauthorizedCallback = null;

export const authService = {
	// Set callback for when 401 is received
	setOnUnauthorizedCallback(callback) {
		onUnauthorizedCallback = callback;
	},

	// Trigger unauthorized callback
	triggerUnauthorized() {
		if (onUnauthorizedCallback) {
			onUnauthorizedCallback();
		}
	},

	// Register a new user
	async register(userData) {
		try {
			const response = await fetch(`${API_BASE_URL}/account/register`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(userData),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.errors ? error.errors.join(", ") : error.message || "Registration failed");
			}

			return await response.json();
		} catch (error) {
			throw error;
		}
	},

	// Login and get token
	async login(credentials) {
		try {
			const response = await fetch(`${API_BASE_URL}/token`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(credentials),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || error || "Login failed");
			}

			const data = await response.json();

			// Store token and user info
			if (data.token) {
				localStorage.setItem("authToken", data.token);
				localStorage.setItem(
					"user",
					JSON.stringify({
						userName: data.userName,
						role: data.role,
					}),
				);
			}

			return data;
		} catch (error) {
			throw error;
		}
	},

	// Logout
	logout() {
		localStorage.removeItem("authToken");
		localStorage.removeItem("user");
	},

	// Get stored token
	getToken() {
		return localStorage.getItem("authToken");
	},

	// Get stored user info
	getUser() {
		const user = localStorage.getItem("user");
		return user ? JSON.parse(user) : null;
	},

	// Check if user is authenticated
	isAuthenticated() {
		return !!this.getToken();
	},
};
