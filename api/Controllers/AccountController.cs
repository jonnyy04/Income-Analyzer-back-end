using api.Dtos.Account;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<api.Models.AppUser> _userManager;

        public AccountController(UserManager<api.Models.AppUser> userManager)
        {
            _userManager = userManager;
        }

        /// <summary>
        /// Register a new user account.
        /// </summary>
        /// <param name="dto">Registration details (userName, email, password)</param>
        /// <returns>Success message or error</returns>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = new api.Models.AppUser
            {
                UserName = dto.UserName,
                Email = dto.Email
            };

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description);
                return BadRequest(new { errors });
            }

            // Assign User role by default
            await _userManager.AddToRoleAsync(user, "User");

            return Ok(new { message = "User registered successfully", userName = dto.UserName });
        }
    }
}
