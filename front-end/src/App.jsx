import { useState } from "react";
import Sidebar from "./components/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import StatisticsPage from "./pages/StatisticsPage";
import { useEntries } from "./hooks/useEntries";
import { useDarkMode } from "./hooks/useDarkMode";

export default function App() {
	const { entries, addEntry, deleteEntry } = useEntries();
	const { dark, toggle: toggleDark } = useDarkMode();
	const [page, setPage] = useState("dashboard");

	return (
		<div style={{ display: "flex", minHeight: "100vh", background: "var(--color-bg)" }}>
			<Sidebar page={page} setPage={setPage} dark={dark} toggleDark={toggleDark} entryCount={entries.length} />

			<main style={{ flex: 1, padding: "2rem", maxWidth: 900, overflowX: "hidden" }}>
				{page === "dashboard" && <DashboardPage entries={entries} onAdd={addEntry} />}
				{page === "statistics" && <StatisticsPage entries={entries} onDelete={deleteEntry} />}
			</main>
		</div>
	);
}
