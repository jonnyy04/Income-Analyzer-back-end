import Icon from "./Icon";

export default function Sidebar({ page, setPage, dark, toggleDark, entryCount, user, onLogout }) {
	return (
		<aside
			style={{
				width: 220,
				background: "var(--color-surface)",
				borderRight: "1px solid var(--color-border)",
				padding: "1.5rem 1rem",
				display: "flex",
				flexDirection: "column",
				gap: 4,
				position: "sticky",
				top: 0,
				height: "100vh",
				flexShrink: 0,
				boxShadow: "2px 0 8px rgba(0,0,0,0.04)",
			}}
		>
			{/* Logo */}
			<div style={{ padding: "0 8px", marginBottom: "1.5rem" }}>
				<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
					<div
						style={{
							width: 34,
							height: 34,
							borderRadius: 9,
							background: "var(--color-accent)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
							<polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
							<polyline points="16 7 22 7 22 13" />
						</svg>
					</div>
					<div>
						<div style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.01em", color: "var(--color-text)" }}>SalaryTrack</div>
						<div
							style={{
								fontSize: 10,
								color: "var(--color-text3)",
								textTransform: "uppercase",
								letterSpacing: "0.08em",
							}}
						></div>
					</div>
				</div>
			</div>

			{/* User Info */}
			{user && (
				<div
					style={{
						background: "var(--color-bg)",
						padding: "0.75rem",
						borderRadius: "8px",
						marginBottom: "1rem",
						border: "1px solid var(--color-border)",
					}}
				>
					<div style={{ fontSize: "0.75rem", color: "var(--color-text3)", marginBottom: "0.25rem" }}>Logged in as</div>
					<div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--color-text)" }}>{user.userName}</div>
					<div style={{ fontSize: "0.75rem", color: "var(--color-text3)" }}>Role: {user.role}</div>
				</div>
			)}

			{/* Nav label */}
			<div
				style={{
					fontSize: 10,
					textTransform: "uppercase",
					letterSpacing: "0.08em",
					color: "var(--color-text3)",
					fontWeight: 600,
					padding: "0 8px",
					marginBottom: 4,
				}}
			>
				Navigation
			</div>

			<button className={`nav-item ${page === "dashboard" ? "active" : ""}`} onClick={() => setPage("dashboard")}>
				<Icon name="dashboard" size={16} />
				Dashboard
			</button>
			<button className={`nav-item ${page === "statistics" ? "active" : ""}`} onClick={() => setPage("statistics")}>
				<Icon name="stats" size={16} />
				Statistics
			</button>

			{/* Footer */}
			<div style={{ marginTop: "auto", paddingTop: "1rem", borderTop: "1px solid var(--color-border)" }}>
				<button className="btn-ghost" style={{ width: "100%", display: "flex", alignItems: "center", gap: 8 }} onClick={toggleDark}>
					<Icon name={dark ? "sun" : "moon"} size={15} />
					{dark ? "Light Mode" : "Dark Mode"}
				</button>

				{onLogout && (
					<button
						className="btn-ghost"
						style={{
							width: "100%",
							display: "flex",
							alignItems: "center",
							gap: 8,
							marginTop: "0.5rem",
							color: "#ef4444",
						}}
						onClick={onLogout}
					>
						<Icon name="logout" size={15} />
						Logout
					</button>
				)}

				<div style={{ fontSize: 10, color: "var(--color-text3)", textAlign: "center", marginTop: 10 }}>
					{entryCount} entries · {new Date().getFullYear()}
				</div>
			</div>
		</aside>
	);
}
