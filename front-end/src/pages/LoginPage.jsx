import { useState } from "react";
import { authService } from "../utils/authService";
import "./AuthPages.css";

export default function LoginPage({ onLoginSuccess, onSwitchToSignup }) {
	const [formData, setFormData] = useState({
		userName: "",
		password: "",
		role: "USER",
	});

	const [errors, setErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		// Clear error for this field when user starts typing
		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: "",
			}));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const newErrors = {};
		if (!formData.userName.trim()) {
			newErrors.userName = "Username is required";
		}
		if (!formData.password) {
			newErrors.password = "Password is required";
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		setIsLoading(true);
		try {
			const response = await authService.login(formData);

			if (onLoginSuccess) {
				onLoginSuccess(response);
			}
		} catch (error) {
			setErrors({
				submit: error.message || "Login failed. Please try again.",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="auth-container">
			<div className="auth-card">
				<h1>Login</h1>

				{errors.submit && <div className="error-message">{errors.submit}</div>}

				<form onSubmit={handleSubmit} className="auth-form">
					<div className="form-group">
						<label htmlFor="userName">Username</label>
						<input type="text" id="userName" name="userName" value={formData.userName} onChange={handleChange} placeholder="Enter your username" disabled={isLoading} className={errors.userName ? "input-error" : ""} />
						{errors.userName && <span className="error-text">{errors.userName}</span>}
					</div>

					<div className="form-group">
						<label htmlFor="password">Password</label>
						<input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" disabled={isLoading} className={errors.password ? "input-error" : ""} />
						{errors.password && <span className="error-text">{errors.password}</span>}
					</div>

					<div className="form-group">
						<label htmlFor="role">Role</label>
						<select id="role" name="role" value={formData.role} onChange={handleChange} disabled={isLoading}>
							<option value="USER">User</option>
							<option value="ADMIN">Admin</option>
						</select>
					</div>

					<button type="submit" disabled={isLoading} className="auth-button">
						{isLoading ? "Logging in..." : "Login"}
					</button>
				</form>

				<p className="auth-link">
					Don't have an account?{" "}
					<button type="button" onClick={onSwitchToSignup} className="link-button" disabled={isLoading}>
						Sign Up
					</button>
				</p>
			</div>
		</div>
	);
}
