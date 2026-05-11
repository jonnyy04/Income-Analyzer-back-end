using api.Models;

namespace api.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(AppUser user);
        string CreateTokenForRole(string username, string userId, string role);
    }
}
