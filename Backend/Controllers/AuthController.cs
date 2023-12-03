using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend;
using Backend.Models;
using Microsoft.AspNetCore.DataProtection;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using System.Security.Claims;
using BCrypt.Net;


namespace Dumbo.Controllers{

    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController: ControllerBase{
        private readonly string secretKey;
        private readonly DataContext _context;

        public AuthenticationController(IConfiguration config, DataContext context){
            secretKey = config.GetSection("Settings").GetSection("SecretKey").ToString();
            _context = context;

        }


   


        /// <summary>
        /// Validate if the credentials matches with the registered admin
        /// </summary>
        /// <param name="User">Model that contains a user that wants to log into the system</param>
        /// <returns>
        /// If crendentials are correct return status 200 with the token
        /// Else return status 401 with a message the invalid credentials
        /// </returns>
        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Login([FromBody] User user)
        {
            
            var existingUser = await _context.Users.FirstOrDefaultAsync(a => a.Rut == user.Rut);
            if (existingUser == null)
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new { message = "Invalid credentials" });
            }

            var passwordMatches = BCrypt.Net.BCrypt.Verify(user.Password, existingUser.Password);
            if (!passwordMatches)
            {
                return StatusCode(StatusCodes.Status401Unauthorized, new { message = "Invalid credentials" });
            }
            

            var keyBytes = Encoding.ASCII.GetBytes(secretKey);
            var claims = new ClaimsIdentity();
            claims.AddClaim(new Claim(ClaimTypes.NameIdentifier, user.Rut));

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = claims,
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(keyBytes), SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenConfig = tokenHandler.CreateToken(tokenDescriptor);

            string CreatedToken = tokenHandler.WriteToken(tokenConfig);

            return StatusCode(StatusCodes.Status200OK, new { token = CreatedToken });
        }
    }

}