using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly DataContext _context;

        public UsersController(DataContext context)
        {
            _context = context;
        }

        /// <summary>
        /// gets all registered users
        /// </summary>
        /// <returns>
        /// users array
        /// </returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        /// <summary>
        /// gets the user with the given id
        /// </summary>
        /// <param name="id">id of the required user</param>
        /// <returns>
        /// If user exists return status 200 with the user
        /// else returns status 404 user not found
        /// </returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        /// <summary>
        /// Updates the user with the given id
        /// </summary>
        /// <param name="id">id of the required user</param>
        /// <param name="user">new data for the selected user</param>
        /// <returns>
        /// If user exists return status 200 with the user
        /// else returns status 404 user not found
        /// </returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }

            if (!string.IsNullOrEmpty(user.Password))
            {
                user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        /// <summary>
        /// Adds an user to the database
        /// </summary>
        /// <param name="usern">new user</param>
        /// <returns>
        /// If user exists return status 200 
        /// </returns>
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            // Check if RUT or Email already exists
            var existingUserWithSameRut = await _context.Users.AnyAsync(u => u.Rut == user.Rut);
            var existingUserWithSameEmail = await _context.Users.AnyAsync(u => u.Email == user.Email);

            if (existingUserWithSameRut)
            {
                return BadRequest("Ya existe un usuario con el mismo RUT.");
            }

            if (existingUserWithSameEmail)
            {
                return BadRequest("Ya existe un usuario con el mismo correo electrónico.");
            }
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            // Continue with user creation
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = user.Id }, user);
        }

        /// <summary>
        /// Deletes the user with the given id
        /// </summary>
        /// <param name="id">id of the required user</param>
        /// <returns>
        /// If user exists return status 200 and deletes the user
        /// else returns status 404 user not found
        /// </returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        /// <summary>
        /// Returns if an user exists
        /// </summary>
        /// <param name="id">id of the required user</param>
        /// <returns>
        /// If user exists return status 200 with true value
        /// else returns status 404 user and false value
        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }


        
    }
}
