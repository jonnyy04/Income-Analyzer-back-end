import Icon from "./Icon";

const colorMap = {
	blue: { bg: "var(--color-accent-light)", text: "var(--color-accent)" },
	green: { bg: "var(--color-green-light)", text: "var(--color-green)" },
	amber: { bg: "var(--color-amber-light)", text: "var(--color-amber)" },
	purple: { bg: "var(--color-purple-light)", text: "var(--color-purple)" },
	red: { bg: "var(--color-red-light)", text: "var(--color-red)" },
};

export default function StatCard({ label, value, sub, color = "blue", icon }) {
	const c = colorMap[color] || colorMap.blue;

	return (
		<div className="card flex flex-col gap-2">
			<div className="flex items-center justify-between">
				<span style={{ fontSize: "11px", letterSpacing: "0.06em", color: "var(--color-text2)", textTransform: "uppercase", fontWeight: 600 }}>{label}</span>
				<div
					style={{
						width: 32,
						height: 32,
						borderRadius: 8,
						background: c.bg,
						color: c.text,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Icon name={icon} size={15} />
				</div>
			</div>
			<div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--color-text)", lineHeight: 1.1 }}>{value}</div>
			{sub && (
				<div className="mono" style={{ fontSize: 12, color: "var(--color-text3)" }}>
					{sub}
				</div>
			)}
		</div>
	);
}
