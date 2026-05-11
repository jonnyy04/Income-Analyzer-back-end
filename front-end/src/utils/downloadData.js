/**
 * Download utilities for exporting data
 */

/**
 * Download entries data as JSON file
 * Retrieves data from localStorage and triggers browser download
 */
export function downloadEntriesAsJSON() {
	try {
		const STORAGE_KEY = "salarytrack_entries_v1";
		const data = localStorage.getItem(STORAGE_KEY);

		if (!data) {
			return {
				success: false,
				message: "No data to download",
			};
		}

		const entries = JSON.parse(data);

		if (entries.length === 0) {
			return {
				success: false,
				message: "No entries found",
			};
		}

		// Create blob with JSON data
		const jsonString = JSON.stringify(entries, null, 2);
		const blob = new Blob([jsonString], { type: "application/json" });

		// Create download link
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;

		// Generate filename with current date
		const now = new Date();
		const dateStr = now.toISOString().split("T")[0];
		link.download = `salarytrack_entries_${dateStr}.json`;

		// Trigger download
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);

		return {
			success: true,
			message: `Downloaded ${entries.length} entries successfully!`,
		};
	} catch (error) {
		console.error("Error downloading data:", error);
		return {
			success: false,
			message: `Error: ${error.message}`,
		};
	}
}
