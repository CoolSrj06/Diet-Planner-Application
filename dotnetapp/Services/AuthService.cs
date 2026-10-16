using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

using dotnetapp.Data;
using dotnetapp.Models;

namespace dotnetapp.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(
            ApplicationDbContext context,
            IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // Registration
        public async Task<(int, string)> Registration(User model, string role)
        {
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == model.Email);

            if (existingUser != null)
            {
                return (0, "User with this email already exists");
            }

            if (role == "Admin")
            {
                var superKey = _configuration["SUPERKEY"];

                if (model.SuperKey != superKey)
                {
                    return (0, "Invalid Super Key");
                }
            }

            model.UserRole = role;

            model.Password = BCrypt.Net.BCrypt.HashPassword(model.Password);

            _context.Users.Add(model);

            await _context.SaveChangesAsync();

            return (1, "User registered successfully");
        }

        // Login
        public async Task<(int, string)> Login(LoginModel model)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == model.Email);

            if (user == null)
            {
                return (0, "Invalid Email");
            }

            if (!BCrypt.Net.BCrypt.Verify(model.Password, user.Password))
            {
                return (0, "Invalid password");
            }

            var claims = new List<Claim>
            {
                new Claim(
                    ClaimTypes.NameIdentifier,
                    user.UserId.ToString()
                ),

                new Claim(
                    ClaimTypes.Email,
                    user.Email
                ),

                new Claim(
                    ClaimTypes.Role,
                    user.UserRole
                ),

                new Claim(
                    "UserId",
                    user.UserId.ToString()
                ),

                new Claim(
                    "UserRole",
                    user.UserRole
                ),

                new Claim(
                    "UserName",
                    user.Username
                )
            };

            var token = GenerateToken(claims);

            return (1, token);
        }

        private string GenerateToken(IEnumerable<Claim> claims)
        {
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(
                    _configuration["JWT:Key"]!
                )
            );

            var credentials = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256
            );

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:Issuer"],
                audience: _configuration["JWT:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(8),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler()
                .WriteToken(token);
        }
    }
}