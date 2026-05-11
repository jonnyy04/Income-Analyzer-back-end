using api.Dtos.Entry;
using api.Models;

namespace api.Mappers
{
    public static class EntryMapper
    {
        public static EntryDto ToEntryDto(this Entry entry)
        {
            return new EntryDto
            {
                Id = entry.Id,
                Date = entry.Date,
                Timestamp = entry.Timestamp,
                Balance = entry.Balance,
                DailyProfit = entry.DailyProfit,
                Month = entry.Month,
                Year = entry.Year,
                AppUserId = entry.AppUserId,
            };
        }

        public static Entry ToEntryFromCreateDto(this CreateEntryDto dto, string userId, decimal dailyProfit)
        {
            var now = DateTime.UtcNow;
            return new Entry
            {
                Date = now.ToString("dd MMM yyyy"),
                Timestamp = now,
                Balance = dto.Balance,
                DailyProfit = dailyProfit,
                Month = now.Month,
                Year = now.Year,
                AppUserId = userId,
            };
        }
    }
}
