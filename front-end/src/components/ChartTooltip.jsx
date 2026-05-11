import { fmt } from "../utils/helpers";

export default function ChartTooltip({ active, payload, label }) {
	if (!active || !payload?.length) return null;
	return (
		<div
			style={{
				background: "var(--color-surface)",
				border: "1px solid var(--color-border)",
				borderRadius: 8,
				padding: "8px 14px",
				boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
				fontSize: 13,
			}}
		>
			<div style={{ fontWeight: 600, color: "var(--color-text)", marginBottom: 4 }}>{label}</div>
			{payload.map((p, i) => (
				<div key={i} style={{ color: p.color, fontFamily: "DM Mono, monospace", fontSize: 13 }}>
					{p.name}: ${fmt(p.value)}
				</div>
			))}
		</div>
	);
}
