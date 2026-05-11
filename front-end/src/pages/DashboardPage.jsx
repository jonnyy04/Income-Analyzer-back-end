import { useMemo, useState } from "react";
import AddEntry from "../components/AddEntry";
import StatCard from "../components/StatCard";
import { MONTHS, fmt } from "../utils/helpers";
import { seedSampleData } from "../utils/sampleData";
import { downloadEntriesAsJSON } from "../utils/downloadData";

export default function DashboardPage({ entries, onAdd }) {
	const [sampleMsg, setSampleMsg] = useState(null);
	const [downloadMsg, setDownloadMsg] = useState(null);
	const now = new Date();
	const curMonth = now.getMonth() + 1;
	const curYear = now.getFullYear();

	const thisMonth = useMemo(() => entries.filter((e) => e.month === curMonth && e.year === curYear), [entries, curMonth, curYear]);

	const monthlySalary = useMemo(() => thisMonth.reduce((s, e) => s + e.dailyProfit, 0), [thisMonth]);

	const lastBalance = useMemo(() => {
		if (!entries.length) return 0;
		const sorted = [...entries].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
		return sorted[0]?.balance || 0;
	}, [entries]);

	const workedDays = useMemo(() => thisMonth.filter((e) => e.dailyProfit > 0).length, [thisMonth]);
	const avgDaily = workedDays > 0 ? monthlySalary / workedDays : 0;

	const recentEntries = useMemo(() => [...entries].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5), [entries]);

	const handleLoadSample = () => {
		const result = seedSampleData();
		setSampleMsg(result);
		setTimeout(() => setSampleMsg(null), 4000);

		// Reload page to show new data - wait longer to ensure localStorage is written
		if (result.success) {
			setTimeout(() => {
				// Force refresh by adding timestamp to prevent caching
				window.location.href = window.location.href.split("#")[0] + "?refresh=" + Date.now();
			}, 2000);
		}
	};
	const handleDownloadData = () => {
		const result = downloadEntriesAsJSON();
		setDownloadMsg(result);
		setTimeout(() => setDownloadMsg(null), 4000);
	};
	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
			{/* Header */}
			<div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
				<div>
					<div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 4, color: "var(--color-text)" }}>Dashboard</div>
					<div style={{ fontSize: 13, color: "var(--color-text2)" }}>{now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
				</div>
				<div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
					<button
						onClick={handleLoadSample}
						style={{
							padding: "8px 14px",
							background: "var(--color-accent)",
							color: "white",
							border: "none",
							borderRadius: 8,
							fontSize: 13,
							fontWeight: 600,
							cursor: "pointer",
							whiteSpace: "nowrap",
							transition: "all 0.2s",
							boxShadow: "0 2px 8px rgba(37,99,235,0.2)",
						}}
						onMouseOver={(e) => (e.target.style.opacity = "0.85")}
						onMouseOut={(e) => (e.target.style.opacity = "1")}
					>
						 Load Sample Data
					</button>
					<button
						onClick={handleDownloadData}
						style={{
							padding: "8px 14px",
							background: "var(--color-green)",
							color: "white",
							border: "none",
							borderRadius: 8,
							fontSize: 13,
							fontWeight: 600,
							cursor: "pointer",
							whiteSpace: "nowrap",
							transition: "all 0.2s",
							boxShadow: "0 2px 8px rgba(16,185,129,0.2)",
						}}
						onMouseOver={(e) => (e.target.style.opacity = "0.85")}
						onMouseOut={(e) => (e.target.style.opacity = "1")}
					>
						 Download Data
					</button>
				</div>
			</div>

			{/* Download message */}
			{downloadMsg && (
				<div
					style={{
						padding: "12px 14px",
						borderRadius: 8,
						fontSize: 13,
						fontWeight: 500,
						background: downloadMsg.success ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
						border: `1px solid ${downloadMsg.success ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
						color: downloadMsg.success ? "var(--color-green)" : "var(--color-red)",
					}}
				>
					{downloadMsg.success ? "✓" : "✕"} {downloadMsg.message}
				</div>
			)}

			{/* Sample data message */}
			{sampleMsg && (
				<div
					style={{
						padding: "12px 14px",
						borderRadius: 8,
						fontSize: 13,
						fontWeight: 500,
						background: sampleMsg.success ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
						border: `1px solid ${sampleMsg.success ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
						color: sampleMsg.success ? "var(--color-green)" : "var(--color-red)",
					}}
				>
					{sampleMsg.success ? "✓" : "✕"} {sampleMsg.message}
				</div>
			)}

			{/* Add entry */}
			<AddEntry entries={entries} onAdd={onAdd} />

			{/* Stat cards */}
			<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
				<StatCard label="Monthly Salary" value={`$${fmt(monthlySalary)}`} sub={`${MONTHS[curMonth - 1]} ${curYear}`} color="blue" icon="award" />
				<StatCard label="Current Balance" value={`$${fmt(lastBalance)}`} sub="Last recorded" color="green" icon="wallet" />
				<StatCard label="Daily Average" value={`$${fmt(avgDaily)}`} sub="This month" color="purple" icon="trend" />
				<StatCard label="Worked Days" value={workedDays} sub="Profitable days" color="amber" icon="calendar" />
			</div>

			{/* Recent entries */}
			{recentEntries.length > 0 && (
				<div className="card">
					<div style={{ fontWeight: 600, fontSize: 14, marginBottom: "1rem", color: "var(--color-text)" }}>Recent Entries</div>
					<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
						{recentEntries.map((e) => (
							<div
								key={e.id}
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									padding: "10px 12px",
									borderRadius: 8,
									background: "var(--color-surface2)",
									borderLeft: `3px solid ${e.dailyProfit > 0 ? "var(--color-green)" : "var(--color-border)"}`,
								}}
							>
								<div>
									<div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text)" }}>{e.date}</div>
									<div className="mono" style={{ fontSize: 11, color: "var(--color-text3)" }}>
										${fmt(e.balance)} balance
									</div>
								</div>
								{e.dailyProfit > 0 ? (
									<span className="mono" style={{ fontWeight: 700, fontSize: 13, color: "var(--color-green)" }}>
										+${fmt(e.dailyProfit)}
									</span>
								) : (
									<span style={{ fontSize: 12, color: "var(--color-text3)" }}>No change</span>
								)}
							</div>
						))}
					</div>
				</div>
			)}

			{/* Empty state */}
			{entries.length === 0 && (
				<div className="card" style={{ textAlign: "center", padding: "3rem" }}>
					<div style={{ fontSize: 40, marginBottom: "1rem" }}>💰</div>
					<div style={{ fontWeight: 600, fontSize: 15, color: "var(--color-text2)" }}>No entries yet</div>
					<div style={{ fontSize: 13, marginTop: 6, color: "var(--color-text3)" }}>Enter your first account balance above to start tracking.</div>
				</div>
			)}
		</div>
	);
}
