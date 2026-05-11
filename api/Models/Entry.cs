using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    [Table("Entries")]
    public class Entry
    {
        public int Id { get; set; }
        public string Date { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public decimal Balance { get; set; }
        public decimal DailyProfit { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }

        // Ownership
        public string AppUserId { get; set; } = string.Empty;
        public AppUser? AppUser { get; set; }
    }
}
