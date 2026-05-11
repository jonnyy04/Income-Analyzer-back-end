import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import StatisticsPage from "./pages/StatisticsPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { useEntries } from "./hooks/useEntries";
import { useDarkMode } from "./hooks/useDarkMode";
import { authService } from "./utils/authService";

export default function App() {
	const { entries, addEntry, deleteEntry, isLoading, error } = useEntries();
	const { dark, toggle: toggleDark } = useDarkMode();
	const [page, setPage] = useState("dashboard");
	const [authPage, setAuthPage] = useState("login"); // "login" or "signup"
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState(null);
	const [sessionError, setSessionError] = useState(null);

	// Check if user is already authenticated on mount
	useEffect(() => {
		if (authService.isAuthenticated()) {
			setIsAuthenticated(true);
			setUser(authService.getUser());
		}

		// Register callback for unauthorized (401) errors
		authService.setOnUnauthorizedCallback(() => {
			setSessionError("Your session has expired. Please login again.");
			handleLogout();
		});
	}, []);

	// Clear session error after 5 seconds
	useEffect(() => {
		if (sessionError) {
			const timer = setTimeout(() => {
				setSessionError(null);
			}, 5000);
			return () => clearTimeout(timer);
		}
	}, [sessionError]);

	const handleLoginSuccess = (response) => {
		setIsAuthenticated(true);
		setUser(authService.getUser());
		setSessionError(null);
	};

	const handleSignupSuccess = () => {
		// After successful signup, switch to login page
		setAuthPage("login");
	};

	const handleLogout = () => {
		authService.logout();
		setIsAuthenticated(false);
		setUser(null);
		setAuthPage("login");
		setPage("dashboard");
	};

	// If not authenticated, show login/signup pages
	if (!isAuthenticated) {
		return <div>{authPage === "login" ? <LoginPage onLoginSuccess={handleLoginSuccess} onSwitchToSignup={() => setAuthPage("signup")} /> : <SignupPage onSignupSuccess={handleSignupSuccess} />}</div>;
	}

	// If authenticated, show main app
	return (
		<div style={{ display: "flex", minHeight: "100vh", background: "var(--color-bg)" }}>
			<Sidebar page={page} setPage={setPage} dark={dark} toggleDark={toggleDark} entryCount={entries.length} user={user} onLogout={handleLogout} />

			<main style={{ flex: 1, padding: "2rem", maxWidth: 900, overflowX: "hidden" }}>
				{sessionError && (
					<div
						style={{
							padding: "12px 14px",
							borderRadius: 8,
							fontSize: 13,
							fontWeight: 500,
							background: "rgba(239,68,68,0.1)",
							border: "1px solid rgba(239,68,68,0.3)",
							color: "var(--color-red)",
							marginBottom: "1rem",
						}}
					>
						⚠️ {sessionError}
					</div>
				)}
				{error && (
					<div
						style={{
							padding: "12px 14px",
							borderRadius: 8,
							fontSize: 13,
							fontWeight: 500,
							background: "rgba(239,68,68,0.1)",
							border: "1px solid rgba(239,68,68,0.3)",
							color: "var(--color-red)",
							marginBottom: "1rem",
						}}
					>
						✕ {error}
					</div>
				)}
				{page === "dashboard" && <DashboardPage entries={entries} onAdd={addEntry} isLoading={isLoading} />}
				{page === "statistics" && <StatisticsPage entries={entries} onDelete={deleteEntry} />}
			</main>
		</div>
	);
}
