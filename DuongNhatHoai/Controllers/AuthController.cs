using DuongNhatHoai.Data;
using DuongNhatHoai.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace DuongNhatHoai.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly AppDbContext _context;

        public AuthController(IConfiguration config, AppDbContext context)
        {
            _config = config;
            _context = context;
        }

        // ==== ĐĂNG KÝ ====
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
            if (existingUser != null)
            {
                return BadRequest("Email đã được sử dụng.");
            }

            var user = new User
            {
                FullName = model.FullName,
                Email = model.Email,
                PasswordHash = HashPassword(model.Password),
                Phone = model.Phone,
                Address = model.Address,

                Role = string.IsNullOrWhiteSpace(model.Role) ? "Customer" : model.Role,
                Status = "Active",
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok("Đăng ký thành công!");
        }

        // ==== ĐĂNG NHẬP ====
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel login)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.FullName == login.FullName);
            if (user == null || user.PasswordHash != HashPassword(login.Password))
            {
                return Unauthorized("Họ tên hoặc mật khẩu không đúng!");
            }

            if (user.Role.ToLower() != "admin")
            {
                return StatusCode(403, "Chỉ quản trị viên mới được phép đăng nhập!");
            }

            var token = GenerateJwtToken(user);
            return Ok(new { token });
        }

        // ==== TẠO TOKEN ====
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
                new Claim(ClaimTypes.Email, user.Email),
                new Claim("phone", user.Phone ?? ""),
                new Claim("image", user.Image ?? ""),
                new Claim("address", user.Address ?? ""),
                new Claim("status", user.Status ?? ""),
                new Claim("role", user.Role ?? ""),

                new Claim(ClaimTypes.Role, user.Role)
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

        // ==== HASH PASSWORD ====
        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }
    }

    // ==== MODELS ====

    public class LoginModel
    {
        public string FullName { get; set; } = null!;
        public string Password { get; set; } = null!;
    }

    public class RegisterModel
    {
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? Role { get; set; }  // Cho phép nhập quyền khi đăng ký
    }
}
