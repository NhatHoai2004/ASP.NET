using DuongNhatHoai.Data;
using DuongNhatHoai.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace DuongNhatHoai.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public UserController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // GET: api/user
        [HttpGet]
        public ActionResult<IEnumerable<User>> Get()
        {
            var users = _context.Users.ToList();
            return Ok(users);
        }

        // GET: api/user/{id}
        [HttpGet("{id}")]
        public ActionResult<User> Get(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null)
                return NotFound();
            return Ok(user);
        }

        // POST: api/user
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] User user)
        {
            if (user == null)
                return BadRequest("User data is null.");

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash);
            user.CreatedAt = DateTime.UtcNow;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = user.Id }, user);
        }

        // PUT: api/user/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] User updatedUser)
        {
            if (updatedUser == null)
                return BadRequest("Updated user data is null.");

            var existingUser = await _context.Users.FindAsync(id);
            if (existingUser == null)
                return NotFound();

            // Nếu PasswordHash là null hoặc chuỗi trống, giữ nguyên mật khẩu cũ
            if (string.IsNullOrWhiteSpace(updatedUser.PasswordHash))
            {
                updatedUser.PasswordHash = existingUser.PasswordHash;
            }
            else
            {
                updatedUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword(updatedUser.PasswordHash);
            }
            // Xử lý giữ nguyên ảnh nếu không cập nhật mới
            if (string.IsNullOrWhiteSpace(updatedUser.Image))
            {
                updatedUser.Image = existingUser.Image;
            }

            // Cập nhật các thuộc tính
            existingUser.FullName = updatedUser.FullName;
            existingUser.Email = updatedUser.Email;
            existingUser.Phone = updatedUser.Phone;
            existingUser.Address = updatedUser.Address;
            existingUser.Role = updatedUser.Role;
            existingUser.Status = updatedUser.Status;
            existingUser.Image = updatedUser.Image;
            existingUser.PasswordHash = updatedUser.PasswordHash;
            existingUser.UpdatedAt = DateTime.UtcNow;
            existingUser.UpdatedBy = updatedUser.UpdatedBy;

            await _context.SaveChangesAsync();

            // 👉 Sau khi cập nhật, tạo lại token mới và trả về
            var newToken = GenerateJwtToken(existingUser);
            return Ok(new { token = newToken });
        }

        // DELETE: api/user/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // Tạo JWT token
        private string GenerateJwtToken(User user)
        {
            var key = _config["Jwt:Key"];
            var issuer = _config["Jwt:Issuer"];

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Email, user.Email ?? ""),
                new Claim("phone", user.Phone ?? ""),
                new Claim("image", user.Image ?? ""),
                new Claim("address", user.Address ?? ""),
                new Claim("status", user.Status ?? ""),
                new Claim("role", user.Role ?? ""),
                new Claim(ClaimTypes.Role, user.Role ?? "")
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: null,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
