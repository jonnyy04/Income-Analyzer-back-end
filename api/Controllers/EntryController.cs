using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using api.Dtos.Entry;
using api.Helpers;
using api.Interfaces;
using api.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using api.Models;

namespace api.Controllers
{
    [Route("api/entry")]
    [ApiController]
    [Authorize] // All endpoints require a valid JWT
    public class EntryController : ControllerBase
    {
        private readonly IEntryRepository _entryRepo;
        private readonly UserManager<AppUser> _userManager;

        public EntryController(IEntryRepository entryRepo, UserManager<AppUser> userManager)
        {
            _entryRepo = entryRepo;
            _userManager = userManager;
        }

        // Helper: resolve the authenticated user's ID from the JWT
        private string? GetUserId() =>
            User.FindFirstValue(ClaimTypes.NameIdentifier);

        /// <summary>
        /// Get all entries for the authenticated user.
        /// Supports filtering by month/year and pagination (?pageNumber=1&amp;pageSize=20).
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] EntryQueryObject query)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var entries = await _entryRepo.GetAllAsync(query, userId);
            var dtos = entries.Select(e => e.ToEntryDto());
            return Ok(dtos);
        }

        /// <summary>
        /// Get a single entry by ID (must belong to the authenticated user).
        /// </summary>
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var entry = await _entryRepo.GetByIdAsync(id, userId);
            if (entry == null) return NotFound("Entry not found.");

            return Ok(entry.ToEntryDto());
        }

        /// <summary>
        /// Create a new balance entry. DailyProfit is auto-calculated vs the previous entry.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateEntryDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            // Calculate daily profit vs last entry
            var allEntries = await _entryRepo.GetAllAsync(new EntryQueryObject { PageSize = 1 }, userId);
            var lastBalance = allEntries.FirstOrDefault()?.Balance ?? 0;
            var diff = dto.Balance - lastBalance;
            var dailyProfit = diff > 0 ? diff : 0;

            var entry = dto.ToEntryFromCreateDto(userId, dailyProfit);
            var created = await _entryRepo.CreateAsync(entry);

            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created.ToEntryDto());
        }

        /// <summary>
        /// Update the balance of an existing entry. Recalculates DailyProfit automatically.
        /// </summary>
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateEntryDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var updated = await _entryRepo.UpdateAsync(id, userId, dto);
            if (updated == null) return NotFound("Entry not found.");

            return Ok(updated.ToEntryDto());
        }

        /// <summary>
        /// Delete an entry by ID. ADMIN role can delete any entry; USER only their own.
        /// </summary>
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            var userId = GetUserId();
            if (userId == null) return Unauthorized();

            var deleted = await _entryRepo.DeleteAsync(id, userId);
            if (deleted == null) return NotFound("Entry not found.");

            return NoContent();
        }
    }
}
