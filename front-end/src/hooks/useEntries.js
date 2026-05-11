import { useState, useEffect, useCallback } from "react";
import { entryService } from "../utils/entryService";

export function useEntries() {
	const [entries, setEntries] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	// Load entries from API on mount
	useEffect(() => {
		loadEntries();
	}, []);

	const loadEntries = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			const data = await entryService.getAllEntries();
			setEntries(Array.isArray(data) ? data : []);
		} catch (err) {
			setError(err.message);
			setEntries([]);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const addEntry = useCallback(async (balance) => {
		try {
			const newEntry = await entryService.createEntry(balance);
			setEntries((prev) => [newEntry, ...prev]);
			return newEntry;
		} catch (err) {
			setError(err.message);
			throw err;
		}
	}, []);

	const deleteEntry = useCallback(async (id) => {
		try {
			await entryService.deleteEntry(id);
			setEntries((prev) => prev.filter((e) => e.id !== id));
		} catch (err) {
			setError(err.message);
			throw err;
		}
	}, []);

	const updateEntry = useCallback(async (id, balance) => {
		try {
			const updated = await entryService.updateEntry(id, balance);
			setEntries((prev) => prev.map((e) => (e.id === id ? updated : e)));
			return updated;
		} catch (err) {
			setError(err.message);
			throw err;
		}
	}, []);

	return { entries, addEntry, deleteEntry, updateEntry, loadEntries, isLoading, error };
}
