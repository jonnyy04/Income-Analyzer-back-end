import { useState, useMemo } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { MONTHS, fmt, fmtDec, getMonthlyStats } from "../utils/helpers";
import ChartTooltip from "../components/ChartTooltip";
import Icon from "../components/Icon";

// ─── TABLE TAB ──────────────────────────────────────────────────────────
function TableTab({ entries, onDelete }) {
	const [filterMonth, setFilterMonth] = useState("all");
	const [filterYear, setFilterYear] = useState("all");
	const [deleteConfirm, setDeleteConfirm] = useState(null);

	const years = useMemo(() => [...new Set(entries.map((e) => e.year))].sort((a, b) => b - a), [entries]);

	const months = useMemo(() => {
		const m = [...new Set(entries.filter((e) => filterYear === "all" || e.year === +filterYear).map((e) => e.month))];
		return m.sort((a, b) => a - b);
	}, [entries, filterYear]);

	const filtered = useMemo(() => {
		return [...entries].filter((e) => (filterYear === "all" || e.year === +filterYear) && (filterMonth === "all" || e.month === +filterMonth)).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
	}, [entries, filterYear, filterMonth]);

	const handleDeleteClick = (entryId, entryDate) => {
		setDeleteConfirm({ id: entryId, date: entryDate });
	};

	const confirmDelete = () => {
		if (deleteConfirm) {
			onDelete(deleteConfirm.id);
			setDeleteConfirm(null);
		}
	};

	if (!entries.length) return <Empty />;

	return (
		<div>
			{/* Filters */}
			<div style={{ display: "flex", gap: 10, marginBottom: "1rem", flexWrap: "wrap", alignItems: "center" }}>
				<span style={{ fontSize: 13, color: "var(--color-text2)", fontWeight: 500 }}>Filter:</span>
				<select
					className="form-select"
					value={filterYear}
					onChange={(e) => {
						setFilterYear(e.target.value);
						setFilterMonth("all");
					}}
				>
					<option value="all">All Years</option>
					{years.map((y) => (
						<option key={y} value={y}>
							{y}
						</option>
					))}
				</select>
				<select className="form-select" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
					<option value="all">All Months</option>
					{months.map((m) => (
						<option key={m} value={m}>
							{MONTHS[m - 1]}
						</option>
					))}
				</select>
				<span style={{ marginLeft: "auto", fontSize: 12, color: "var(--color-text3)", fontFamily: "DM Mono, monospace" }}>{filtered.length} entries</span>
			</div>

			{filtered.length === 0 ? (
				<div style={{ textAlign: "center", padding: "2rem", color: "var(--color-text3)", fontSize: 14 }}>No entries match this filter.</div>
			) : (
				<div style={{ overflowX: "auto", borderRadius: 10, border: "1px solid var(--color-border)" }}>
					<table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
						<thead>
							<tr style={{ background: "var(--color-surface2)", borderBottom: "1px solid var(--color-border)" }}>
								{["Date", "Month", "Year", "Balance", "Daily Profit", "Action"].map((h) => (
									<th
										key={h}
										style={{
											padding: "10px 16px",
											textAlign: "left",
											fontWeight: 600,
											fontSize: 11,
											letterSpacing: "0.05em",
											textTransform: "uppercase",
											color: "var(--color-text2)",
											whiteSpace: "nowrap",
										}}
									>
										{h}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{filtered.map((e, i) => (
								<tr
									key={e.id}
									style={{
										borderBottom: "1px solid var(--color-border)",
										background: i % 2 === 0 ? "var(--color-surface)" : "var(--color-surface2)",
									}}
								>
									<td style={{ padding: "10px 16px", fontFamily: "DM Mono, monospace", fontSize: 12, color: "var(--color-text)" }}>{e.date}</td>
									<td style={{ padding: "10px 16px", color: "var(--color-text2)" }}>{MONTHS[e.month - 1]}</td>
									<td style={{ padding: "10px 16px", color: "var(--color-text2)" }}>{e.year}</td>
									<td style={{ padding: "10px 16px", fontFamily: "DM Mono, monospace", fontWeight: 600, color: "var(--color-text)" }}>${fmt(e.balance)}</td>
									<td style={{ padding: "10px 16px" }}>{e.dailyProfit > 0 ? <span className="badge-green">+${fmt(e.dailyProfit)}</span> : <span className="badge-neutral">—</span>}</td>
									<td style={{ padding: "10px 16px" }}>
										<button className="btn-danger" onClick={() => handleDeleteClick(e.id, e.date)}>
											<Icon name="trash" size={13} /> Delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{/* Confirmation Modal */}
			{deleteConfirm && (
				<div
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background: "rgba(0, 0, 0, 0.5)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						zIndex: 1000,
					}}
					onClick={() => setDeleteConfirm(null)}
				>
					<div
						style={{
							background: "var(--color-surface)",
							borderRadius: 12,
							padding: "1.5rem",
							border: "1px solid var(--color-border)",
							boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
							maxWidth: 320,
						}}
						onClick={(e) => e.stopPropagation()}
					>
						<div style={{ marginBottom: "1rem" }}>
							<div style={{ fontSize: 18, fontWeight: 700, color: "var(--color-text)", marginBottom: 8 }}>Delete Entry?</div>
							<div style={{ fontSize: 13, color: "var(--color-text2)", lineHeight: 1.5 }}>
								Are you sure you want to delete the entry from <strong>{deleteConfirm.date}</strong>? This action cannot be undone.
							</div>
						</div>

						<div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
							<button
								onClick={() => setDeleteConfirm(null)}
								style={{
									padding: "8px 16px",
									background: "var(--color-surface2)",
									color: "var(--color-text2)",
									border: "1px solid var(--color-border)",
									borderRadius: 8,
									fontSize: 13,
									fontWeight: 600,
									cursor: "pointer",
									transition: "all 0.2s",
									fontFamily: "DM Sans, sans-serif",
								}}
								onMouseOver={(e) => {
									e.target.style.background = "var(--color-border)";
									e.target.style.color = "var(--color-text)";
								}}
								onMouseOut={(e) => {
									e.target.style.background = "var(--color-surface2)";
									e.target.style.color = "var(--color-text2)";
								}}
							>
								Cancel
							</button>
							<button
								onClick={confirmDelete}
								style={{
									padding: "8px 16px",
									background: "var(--color-red-light)",
									color: "var(--color-red)",
									border: "none",
									borderRadius: 8,
									fontSize: 13,
									fontWeight: 600,
									cursor: "pointer",
									transition: "all 0.2s",
									fontFamily: "DM Sans, sans-serif",
								}}
								onMouseOver={(e) => {
									e.target.style.opacity = "0.8";
									e.target.style.transform = "scale(1.02)";
								}}
								onMouseOut={(e) => {
									e.target.style.opacity = "1";
									e.target.style.transform = "scale(1)";
								}}
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

// ─── BAR CHART TAB ─────────────────────────────────────────────────────
function BarChartTab({ entries }) {
	const data = useMemo(() => getMonthlyStats(entries), [entries]);
	if (!data.length) return <Empty />;

	return (
		<div>
			<SectionTitle>Monthly Salary Overview</SectionTitle>
			<ResponsiveContainer width="100%" height={320}>
				<BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
					<CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
					<XAxis dataKey="label" tick={{ fill: "var(--color-text2)", fontSize: 11 }} axisLine={false} tickLine={false} angle={-30} textAnchor="end" dy={10} />
					<YAxis tick={{ fill: "var(--color-text2)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${fmt(v)}`} />
					<Tooltip content={<ChartTooltip />} />
					<Bar dataKey="salary" name="Salary" radius={[6, 6, 0, 0]}>
						{data.map((_, i) => (
							<Cell key={i} fill={i === data.length - 1 ? "var(--color-accent)" : "var(--color-border)"} />
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}

// ─── LINE CHART TAB ────────────────────────────────────────────────────
function LineChartTab({ entries }) {
	const data = useMemo(() => {
		const monthly = getMonthlyStats(entries);
		let cumulative = 0;
		return monthly.map((m) => {
			cumulative += m.salary;
			return { ...m, cumulative };
		});
	}, [entries]);

	if (!data.length) return <Empty />;

	return (
		<div>
			<SectionTitle>Cumulative Earnings Growth</SectionTitle>
			<ResponsiveContainer width="100%" height={320}>
				<LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
					<CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
					<XAxis dataKey="label" tick={{ fill: "var(--color-text2)", fontSize: 11 }} axisLine={false} tickLine={false} angle={-30} textAnchor="end" dy={10} />
					<YAxis tick={{ fill: "var(--color-text2)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${fmt(v)}`} />
					<Tooltip content={<ChartTooltip />} />
					<Line type="monotone" dataKey="cumulative" name="Total Earned" stroke="var(--color-accent)" strokeWidth={2.5} dot={{ fill: "var(--color-accent)", r: 4 }} activeDot={{ r: 6 }} />
					<Line type="monotone" dataKey="salary" name="Monthly" stroke="var(--color-green)" strokeWidth={2} strokeDasharray="4 2" dot={false} />
				</LineChart>
			</ResponsiveContainer>

			{/* Legend */}
			<div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 12 }}>
				{[
					{ label: "Total Earned", color: "var(--color-accent)", dash: false },
					{ label: "Monthly", color: "var(--color-green)", dash: true },
				].map((l) => (
					<div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--color-text2)" }}>
						<svg width={24} height={4}>
							<line x1="0" y1="2" x2="24" y2="2" stroke={l.color} strokeWidth={2} strokeDasharray={l.dash ? "4 2" : undefined} />
						</svg>
						{l.label}
					</div>
				))}
			</div>
		</div>
	);
}

// ─── GENERAL STATS TAB ─────────────────────────────────────────────────
function GeneralStatsTab({ entries }) {
	const monthly = useMemo(() => getMonthlyStats(entries), [entries]);
	if (!monthly.length) return <Empty />;

	const totalEarned = monthly.reduce((s, m) => s + m.salary, 0);
	const monthlyAvg = totalEarned / monthly.length;
	const totalWorked = monthly.reduce((s, m) => s + m.days, 0);
	const dailyAvg = totalWorked > 0 ? totalEarned / totalWorked : 0;
	const top3 = [...monthly].sort((a, b) => b.salary - a.salary).slice(0, 3);

	const dist = [
		{ label: "Under $10k", count: monthly.filter((m) => m.salary < 10000).length, color: "var(--color-text3)" },
		{ label: "$10k – $15k", count: monthly.filter((m) => m.salary >= 10000 && m.salary < 15000).length, color: "var(--color-accent)" },
		{ label: "$15k – $20k", count: monthly.filter((m) => m.salary >= 15000 && m.salary < 20000).length, color: "var(--color-green)" },
		{ label: "Over $20k", count: monthly.filter((m) => m.salary >= 20000).length, color: "var(--color-amber)" },
	];
	const maxDist = Math.max(...dist.map((d) => d.count), 1);
	const medals = ["🥇", "🥈", "🥉"];

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
			{/* Summary numbers */}
			<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "1rem" }}>
				{[
					{ label: "Total Earned", value: `$${fmt(totalEarned)}`, color: "var(--color-accent)" },
					{ label: "Monthly Avg", value: `$${fmt(monthlyAvg)}`, color: "var(--color-green)" },
					{ label: "Daily Avg", value: `$${fmtDec(dailyAvg)}`, color: "var(--color-purple)" },
					{ label: "Total Days", value: totalWorked, color: "var(--color-amber)" },
				].map((s) => (
					<div key={s.label} className="card" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
						<div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-text2)", fontWeight: 600 }}>{s.label}</div>
						<div className="mono" style={{ fontSize: 22, fontWeight: 700, color: s.color, letterSpacing: "-0.02em" }}>
							{s.value}
						</div>
					</div>
				))}
			</div>

			{/* Top 3 + Distribution */}
			<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
				{/* Top 3 */}
				<div className="card">
					<div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-text2)", fontWeight: 600, marginBottom: "1rem" }}>Top 3 Best Months</div>
					{top3.map((m, i) => (
						<div
							key={i}
							style={{
								display: "flex",
								alignItems: "center",
								gap: 10,
								padding: "10px 0",
								borderBottom: i < 2 ? "1px solid var(--color-border)" : "none",
							}}
						>
							<span style={{ fontSize: 18 }}>{medals[i]}</span>
							<div style={{ flex: 1 }}>
								<div style={{ fontWeight: 600, fontSize: 14, color: "var(--color-text)" }}>{m.label}</div>
								<div style={{ fontSize: 12, color: "var(--color-text3)" }}>{m.days} working days</div>
							</div>
							<div className="mono" style={{ fontWeight: 700, fontSize: 14, color: "var(--color-accent)" }}>
								${fmt(m.salary)}
							</div>
						</div>
					))}
				</div>

				{/* Distribution */}
				<div className="card">
					<div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-text2)", fontWeight: 600, marginBottom: "1rem" }}>Salary Distribution</div>
					{dist.map((d) => (
						<div key={d.label} style={{ marginBottom: 14 }}>
							<div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
								<span style={{ fontSize: 12, color: "var(--color-text2)" }}>{d.label}</span>
								<span className="mono" style={{ fontSize: 12, color: d.color, fontWeight: 700 }}>
									{d.count} mo
								</span>
							</div>
							<div style={{ height: 6, background: "var(--color-surface2)", borderRadius: 3, overflow: "hidden" }}>
								<div
									style={{
										height: "100%",
										width: `${(d.count / maxDist) * 100}%`,
										background: d.color,
										borderRadius: 3,
										transition: "width 0.4s ease",
									}}
								/>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

// ─── SHARED HELPERS ─────────────────────────────────────────────────────
function SectionTitle({ children }) {
	return <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-text2)", fontWeight: 600, marginBottom: "1rem" }}>{children}</div>;
}

function Empty() {
	return (
		<div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--color-text3)" }}>
			<div style={{ fontSize: 40, marginBottom: "1rem" }}>📊</div>
			<div style={{ fontWeight: 600, fontSize: 15, color: "var(--color-text2)" }}>No data yet</div>
			<div style={{ fontSize: 13, marginTop: 6 }}>Add your first balance entry to see statistics.</div>
		</div>
	);
}

// ─── STATISTICS PAGE ────────────────────────────────────────────────────
const TABS = ["Table", "Bar Chart", "Line Chart", "General Stats"];

export default function StatisticsPage({ entries, onDelete }) {
	const [active, setActive] = useState(0);

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
			<div>
				<div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 4, color: "var(--color-text)" }}>Statistics</div>
				<div style={{ fontSize: 13, color: "var(--color-text2)" }}>Deep dive into your earnings data.</div>
			</div>

			<div className="card" style={{ padding: 0, overflow: "hidden" }}>
				{/* Tab bar */}
				<div style={{ display: "flex", borderBottom: "1px solid var(--color-border)", overflowX: "auto" }}>
					{TABS.map((t, i) => (
						<button key={i} className={`tab-btn ${active === i ? "active" : ""}`} onClick={() => setActive(i)}>
							{t}
						</button>
					))}
				</div>

				{/* Tab content */}
				<div style={{ padding: "1.5rem" }}>
					{active === 0 && <TableTab entries={entries} onDelete={onDelete} />}
					{active === 1 && <BarChartTab entries={entries} />}
					{active === 2 && <LineChartTab entries={entries} />}
					{active === 3 && <GeneralStatsTab entries={entries} />}
				</div>
			</div>
		</div>
	);
}
