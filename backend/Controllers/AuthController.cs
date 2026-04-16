using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using System.IdentityModel.Tokens.Jwt;


namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly MarketPlaceDbContext _context;
        public AuthController(MarketPlaceDbContext context)
        {
            _context = context;
        }
        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto request)
        {
            if(await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest("Email is already taken");
            }
            var newUser = new User
            {
                Name = request.Name,
                Email = request.Email,
                Role = request.Role,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
            };
            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();
            return Ok(new
            {
                Message = "Registration Successful"
            });
        }
            [HttpPost("login")]
            public async Task<ActionResult> Login(LoginDto request)
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
                if(user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                {
                    return BadRequest("Invalid email or Password");
                }
            var configuration = HttpContext.RequestServices.GetRequiredService<IConfiguration>();
            var secretKey = configuration["JwtSettings:SecretKey"];
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey!));
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier,user.Id.ToString()),
                new Claim(ClaimTypes.Role,user.Role)
            };
            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddDays(1),
                signingCredentials:new SigningCredentials(key,SecurityAlgorithms.HmacSha256)
                );
            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(new
                {
                    Message = "Login successful!",
                    Token = tokenString,
                    UserId = user.Id,
                    Role = user.Role,
                   
                });
            }
    }
}
