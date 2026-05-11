const paths = {
	dashboard: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
	stats: "M18 20V10M12 20V4M6 20v-6",
	sun: "M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 5a7 7 0 1 0 0 14A7 7 0 0 0 12 5z",
	moon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
	plus: "M12 5v14M5 12h14",
	trash: "M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M8 6V4h8v2",
	wallet: "M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM16 11a1 1 0 1 0 2 0 1 1 0 0 0-2 0zM4 7V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2",
	trend: "M22 7l-9.5 9.5-5-5L1 17",
	calendar: "M3 4h18v18H3zM16 2v4M8 2v4M3 10h18",
	award: "M12 15l-4 6h8l-4-6zM12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
	chart: "M3 3v18h18",
};

export default function Icon({ name, size = 18, strokeWidth = 2 }) {
	return (
		<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
			<path d={paths[name]} />
		</svg>
	);
}
