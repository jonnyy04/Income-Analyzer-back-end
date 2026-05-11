import { useState } from "react";
import { fmt } from "../utils/helpers";
import Icon from "./Icon";

export default function AddEntry({ onAdd }) {
	const [balance, setBalance] = useState("");
	const [loading, setLoading] = useState(false);
	const [msg, setMsg] = useState(null);

	const handle = async () => {
		const val = parseFloat(balance);
		if (isNaN(val) || val < 0) {
			setMsg({ type: "error", text: "Please enter a valid balance." });
			return;
		}
		setLoading(true);
		try {
			const entry = await onAdd(val);
			setBalance("");
			const text = entry.dailyProfit > 0 ? `+$${fmt(entry.dailyProfit)} added to this month's salary!` : "Entry saved — no increase detected.";
			setMsg({ type: entry.dailyProfit > 0 ? "success" : "neutral", text });
			setTimeout(() => setMsg(null), 3500);
		} catch (error) {
			setMsg({ type: "error", text: error.message || "Failed to add entry" });
		} finally {
			setLoading(false);
		}
	};

	const handleKey = (e) => {
		if (e.key === "Enter" && !loading) handle();
	};

	return (
		<div
			style={{
				background: "linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)",
				borderRadius: 12,
				padding: "1.5rem",
				color: "#fff",
				boxShadow: "0 4px 24px rgba(37,99,235,0.25)",
			}}
		>
			<div style={{ marginBottom: "1rem" }}>
				<div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.75, marginBottom: 4 }}>Daily Entry</div>
				<div style={{ fontSize: 20, fontWeight: 700 }}>Enter Today's Balance</div>
			</div>

			<div style={{ display: "flex", gap: 10, alignItems: "center" }}>
				<div style={{ position: "relative", flex: 1 }}>
					<span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontWeight: 700, fontSize: 16, opacity: 0.8 }}>$</span>
					<input
						type="number"
						value={balance}
						onChange={(e) => setBalance(e.target.value)}
						onKeyDown={handleKey}
						placeholder="0.00"
						disabled={loading}
						style={{
							width: "100%",
							padding: "10px 12px 10px 28px",
							borderRadius: 8,
							border: "1.5px solid rgba(255,255,255,0.3)",
							background: "rgba(255,255,255,0.15)",
							color: "#fff",
							fontSize: 16,
							fontWeight: 500,
							outline: "none",
							backdropFilter: "blur(4px)",
							fontFamily: "DM Sans, sans-serif",
							opacity: loading ? 0.6 : 1,
							cursor: loading ? "not-allowed" : "text",
						}}
					/>
				</div>
				<button
					onClick={handle}
					disabled={loading}
					style={{
						padding: "10px 22px",
						background: "#fff",
						color: "var(--color-accent)",
						border: "none",
						borderRadius: 8,
						fontWeight: 700,
						fontSize: 14,
						cursor: loading ? "not-allowed" : "pointer",
						whiteSpace: "nowrap",
						display: "flex",
						alignItems: "center",
						gap: 6,
						boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
						transition: "transform 0.15s",
						fontFamily: "DM Sans, sans-serif",
						opacity: loading ? 0.7 : 1,
					}}
				>
					<Icon name="plus" size={16} />
					{loading ? "Adding..." : "Add"}
				</button>
			</div>

			{msg && (
				<div
					style={{
						marginTop: 12,
						padding: "8px 14px",
						borderRadius: 8,
						fontSize: 13,
						fontWeight: 500,
						background: msg.type === "success" ? "rgba(16,185,129,0.25)" : msg.type === "error" ? "rgba(239,68,68,0.25)" : "rgba(255,255,255,0.15)",
						border: `1px solid ${msg.type === "success" ? "rgba(16,185,129,0.5)" : msg.type === "error" ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.3)"}`,
						color: "#fff",
					}}
				>
					{msg.text}
				</div>
			)}
		</div>
	);
}
