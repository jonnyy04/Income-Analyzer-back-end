using System;
using System.ComponentModel.DataAnnotations;

namespace api.Dtos.Entry
{
    // Returned to the client
    public class EntryDto
    {
        public int Id { get; set; }
        public string Date { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public decimal Balance { get; set; }
        public decimal DailyProfit { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public string AppUserId { get; set; } = string.Empty;
    }

    // Used when creating a new entry
    public class CreateEntryDto
    {
        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Balance must be a positive number.")]
        public decimal Balance { get; set; }
    }

    // Used when updating an existing entry
    public class UpdateEntryDto
    {
        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Balance must be a positive number.")]
        public decimal Balance { get; set; }
    }
}
