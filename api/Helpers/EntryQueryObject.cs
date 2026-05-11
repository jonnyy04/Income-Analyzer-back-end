namespace api.Helpers
{
    public class EntryQueryObject
    {
        // Filter by month (1-12)
        public int? Month { get; set; }

        // Filter by year
        public int? Year { get; set; }

        // Sort by: "date", "balance", "dailyProfit"
        public string? SortBy { get; set; }
        public bool IsDescending { get; set; } = true;

        // Pagination
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}
