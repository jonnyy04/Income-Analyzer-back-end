import { authService } from "./authService";

const API_BASE_URL = "http://localhost:5200/api";

export const entryService = {
	// Get all entries for the authenticated user
	async getAllEntries(pageNumber = 1, pageSize = 100, month = null, year = null) {
		try {
			const token = authService.getToken();
			if (!token) {
				throw new Error("Not authenticated");
			}

			let url = `${API_BASE_URL}/entry?pageNumber=${pageNumber}&pageSize=${pageSize}`;

			if (month) url += `&month=${month}`;
			if (year) url += `&year=${year}`;

			const response = await fetch(url, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error("Failed to fetch entries");
			}

			return await response.json();
		} catch (error) {
			throw error;
		}
	},

	// Get a single entry by ID
	async getEntryById(id) {
		try {
			const token = authService.getToken();
			if (!token) {
				throw new Error("Not authenticated");
			}

			const response = await fetch(`${API_BASE_URL}/entry/${id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error("Failed to fetch entry");
			}

			return await response.json();
		} catch (error) {
			throw error;
		}
	},

	// Create a new entry
	async createEntry(balance) {
		try {
			const token = authService.getToken();
			if (!token) {
				throw new Error("Not authenticated");
			}

			const response = await fetch(`${API_BASE_URL}/entry`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ balance: parseFloat(balance) }),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || "Failed to create entry");
			}

			return await response.json();
		} catch (error) {
			throw error;
		}
	},

	// Update an existing entry
	async updateEntry(id, balance) {
		try {
			const token = authService.getToken();
			if (!token) {
				throw new Error("Not authenticated");
			}

			const response = await fetch(`${API_BASE_URL}/entry/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ balance: parseFloat(balance) }),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || "Failed to update entry");
			}

			return await response.json();
		} catch (error) {
			throw error;
		}
	},

	// Delete an entry
	async deleteEntry(id) {
		try {
			const token = authService.getToken();
			if (!token) {
				throw new Error("Not authenticated");
			}

			const response = await fetch(`${API_BASE_URL}/entry/${id}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error("Failed to delete entry");
			}

			return true;
		} catch (error) {
			throw error;
		}
	},
};
