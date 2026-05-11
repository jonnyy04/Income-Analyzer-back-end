using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using api.Dtos.Account;
using api.Interfaces;
using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("api/token")]
    [ApiController]
    public class TokenController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;

        public TokenController(
            UserManager<AppUser> userManager,
            SignInManager<AppUser> signInManager,
            ITokenService tokenService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
        }

        /// <summary>
        /// Returns a JWT for the given credentials and requested role.
        /// Role must be "ADMIN" or "USER". Expiry: 1 minute (demo).
        /// </summary>
        /// <remarks>
        /// Example request body:
        ///
        ///     POST /api/token
        ///     {
        ///         "userName": "alice",
        ///         "password": "Password123!",
        ///         "role": "ADMIN"
        ///     }
        ///
        /// The returned token must be sent as: Authorization: Bearer {token}
        /// </remarks>
        [HttpPost]
        public async Task<IActionResult> GetToken([FromBody] TokenRequestDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // Validate role
            var role = dto.Role?.ToUpper();
            if (role != "ADMIN" && role != "USER")
                return BadRequest("Role must be 'ADMIN' or 'USER'.");

            // Validate credentials
            var user = await _userManager.FindByNameAsync(dto.UserName);
            if (user == null)
                return Unauthorized("Invalid username or password.");

            var result = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
            if (!result.Succeeded)
                return Unauthorized("Invalid username or password.");

            // Check the user actually has the requested role
            var userRoles = await _userManager.GetRolesAsync(user);
            if (!userRoles.Contains(role, System.StringComparer.OrdinalIgnoreCase))
                return Forbid(); // 403 — user doesn't have the requested role

            var token = _tokenService.CreateTokenForRole(user.UserName!, user.Id, role);

            return Ok(new
            {
                token,
                role,
                expiresIn = "60 seconds",
                userName = user.UserName,
            });
        }
    }

    // DTO scoped here since it's only used by this controller
    public class TokenRequestDto
    {
        [Required] public string UserName { get; set; } = string.Empty;
        [Required] public string Password { get; set; } = string.Empty;
        [Required] public string Role { get; set; } = string.Empty;
    }
}
