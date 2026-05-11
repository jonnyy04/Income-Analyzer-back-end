using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.Entry;
using api.Helpers;
using api.Interfaces;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class EntryRepository : IEntryRepository
    {
        private readonly ApplicationDBContext _context;

        public EntryRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<List<Entry>> GetAllAsync(EntryQueryObject query, string userId)
        {
            var entries = _context.Entries
                .Where(e => e.AppUserId == userId)
                .AsQueryable();

            // Filtering
            if (query.Month.HasValue)
                entries = entries.Where(e => e.Month == query.Month.Value);

            if (query.Year.HasValue)
                entries = entries.Where(e => e.Year == query.Year.Value);

            // Sorting
            if (!string.IsNullOrWhiteSpace(query.SortBy))
            {
                entries = query.SortBy.ToLower() switch
                {
                    "balance" => query.IsDescending
                        ? entries.OrderByDescending(e => e.Balance)
                        : entries.OrderBy(e => e.Balance),
                    "dailyprofit" => query.IsDescending
                        ? entries.OrderByDescending(e => e.DailyProfit)
                        : entries.OrderBy(e => e.DailyProfit),
                    _ => query.IsDescending // default: sort by date
                        ? entries.OrderByDescending(e => e.Timestamp)
                        : entries.OrderBy(e => e.Timestamp),
                };
            }
            else
            {
                entries = entries.OrderByDescending(e => e.Timestamp);
            }

            // Pagination — skip M, take N
            var skip = (query.PageNumber - 1) * query.PageSize;
            return await entries.Skip(skip).Take(query.PageSize).ToListAsync();
        }

        public async Task<Entry?> GetByIdAsync(int id, string userId)
        {
            return await _context.Entries
                .FirstOrDefaultAsync(e => e.Id == id && e.AppUserId == userId);
        }

        public async Task<Entry> CreateAsync(Entry entry)
        {
            await _context.Entries.AddAsync(entry);
            await _context.SaveChangesAsync();
            return entry;
        }

        public async Task<Entry?> UpdateAsync(int id, string userId, UpdateEntryDto dto)
        {
            var existing = await _context.Entries
                .FirstOrDefaultAsync(e => e.Id == id && e.AppUserId == userId);

            if (existing == null) return null;

            existing.Balance = dto.Balance;

            // Recalculate dailyProfit against the previous entry
            var previousEntry = await _context.Entries
                .Where(e => e.AppUserId == userId && e.Timestamp < existing.Timestamp)
                .OrderByDescending(e => e.Timestamp)
                .FirstOrDefaultAsync();

            if (previousEntry != null)
            {
                var diff = dto.Balance - previousEntry.Balance;
                existing.DailyProfit = diff > 0 ? diff : 0;
            }

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<Entry?> DeleteAsync(int id, string userId)
        {
            var entry = await _context.Entries
                .FirstOrDefaultAsync(e => e.Id == id && e.AppUserId == userId);

            if (entry == null) return null;

            _context.Entries.Remove(entry);
            await _context.SaveChangesAsync();
            return entry;
        }
    }
}
