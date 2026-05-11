import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "salarytrack_entries_v1";

function load() {
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
	} catch {
		return [];
	}
}

export function useEntries() {
	const [entries, setEntries] = useState(load);

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
	}, [entries]);

	const addEntry = useCallback((entry) => {
		setEntries((prev) => [...prev, entry]);
	}, []);

	const deleteEntry = useCallback((id) => {
		setEntries((prev) => prev.filter((e) => e.id !== id));
	}, []);

	return { entries, addEntry, deleteEntry };
}
