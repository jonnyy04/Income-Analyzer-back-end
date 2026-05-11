using System.Collections.Generic;
using System.Threading.Tasks;
using api.Dtos.Entry;
using api.Helpers;
using api.Models;

namespace api.Interfaces
{
    public interface IEntryRepository
    {
        Task<List<Entry>> GetAllAsync(EntryQueryObject query, string userId);
        Task<Entry?> GetByIdAsync(int id, string userId);
        Task<Entry> CreateAsync(Entry entry);
        Task<Entry?> UpdateAsync(int id, string userId, UpdateEntryDto dto);
        Task<Entry?> DeleteAsync(int id, string userId);
    }
}
