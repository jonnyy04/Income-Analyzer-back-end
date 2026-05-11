using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace api.Models
{
    public class AppUser : IdentityUser
    {
        public List<Entry> Entries { get; set; } = new List<Entry>();
    }
}
