import { useState } from "react";
import { authService } from "../utils/authService";
import "./AuthPages.css";

export default function SignupPage({ onSignupSuccess }) {
	const [formData, setFormData] = useState({
		userName: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const [errors, setErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");

	const validateForm = () => {
		const newErrors = {};

		if (!formData.userName.trim()) {
			newErrors.userName = "Username is required";
		}

		if (!formData.email.trim()) {
			newErrors.email = "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = "Please enter a valid email";
		}

		if (!formData.password) {
			newErrors.password = "Password is required";
		} else if (formData.password.length < 6) {
			newErrors.password = "Password must be at least 6 characters";
		}

		if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match";
		}

		return newErrors;
	};

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
		setSuccessMessage("");

		const newErrors = validateForm();
		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		setIsLoading(true);
		try {
			const response = await authService.register({
				userName: formData.userName,
				email: formData.email,
				password: formData.password,
			});

			setSuccessMessage(`Account created successfully! Username: ${response.userName}`);
			setFormData({
				userName: "",
				email: "",
				password: "",
				confirmPassword: "",
			});

			// Call callback after successful signup (usually to switch to login)
			if (onSignupSuccess) {
				setTimeout(() => {
					onSignupSuccess();
				}, 1500);
			}
		} catch (error) {
			setErrors({
				submit: error.message || "Registration failed. Please try again.",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="auth-container">
			<div className="auth-card">
				<h1>Create Account</h1>

				{successMessage && <div className="success-message">{successMessage}</div>}

				{errors.submit && <div className="error-message">{errors.submit}</div>}

				<form onSubmit={handleSubmit} className="auth-form">
					<div className="form-group">
						<label htmlFor="userName">Username</label>
						<input type="text" id="userName" name="userName" value={formData.userName} onChange={handleChange} placeholder="Enter your username" disabled={isLoading} className={errors.userName ? "input-error" : ""} />
						{errors.userName && <span className="error-text">{errors.userName}</span>}
					</div>

					<div className="form-group">
						<label htmlFor="email">Email</label>
						<input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" disabled={isLoading} className={errors.email ? "input-error" : ""} />
						{errors.email && <span className="error-text">{errors.email}</span>}
					</div>

					<div className="form-group">
						<label htmlFor="password">Password</label>
						<input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="At least 6 characters" disabled={isLoading} className={errors.password ? "input-error" : ""} />
						{errors.password && <span className="error-text">{errors.password}</span>}
					</div>

					<div className="form-group">
						<label htmlFor="confirmPassword">Confirm Password</label>
						<input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" disabled={isLoading} className={errors.confirmPassword ? "input-error" : ""} />
						{errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
					</div>

					<button type="submit" disabled={isLoading} className="auth-button">
						{isLoading ? "Creating Account..." : "Sign Up"}
					</button>
				</form>
			</div>
		</div>
	);
}
