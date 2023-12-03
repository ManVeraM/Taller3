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
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly DataContext _context;

        public UsersController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/Users/5
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

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
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

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = user.Id }, user);
        }

        // DELETE: api/Users/5
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

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }


        [HttpPost("Register")]
        public async Task<ActionResult<User>> UserRegister(User user)
        {
            // Validaciones personalizadas
            if (!_context.Users.All(u => u.Email != user.Email))
            {
                ModelState.AddModelError("Email", "El correo ya está en uso.");
            }

            if (!_context.Users.All(u => u.Rut != user.Rut))
            {
                ModelState.AddModelError("Rut", "El RUT ya está en uso.");
            }

            if (!IsValidRut(user.Rut))
            {
                ModelState.AddModelError("Rut", "El RUT no es válido según el algoritmo del módulo 11.");
            }

            if (!IsValidEmail(user.Email))
            {
                ModelState.AddModelError("Email", "El correo no es válido o no pertenece al dominio permitido.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = user.Id }, user);
        }

        private bool IsValidRut(string rut)
        {
            // Eliminar puntos y guiones del RUT
            rut = rut.Replace(".", "").Replace("-", "");
    
            // Verificar que el RUT tenga el formato correcto
            if (!System.Text.RegularExpressions.Regex.IsMatch(rut, @"^[0-9]{8,9}$"))
            {
                return false;
            }

            // Separar el cuerpo y el dígito verificador
            string cuerpo = rut.Substring(0, rut.Length - 1);
            char dv = char.ToUpper(rut[rut.Length - 1]);

            // Calcular el dígito verificador esperado
            int suma = 0;
            int multiplicador = 2;

            for (int i = cuerpo.Length - 1; i >= 0; i--)
            {
                suma += int.Parse(cuerpo[i].ToString()) * multiplicador;
                multiplicador = multiplicador < 7 ? multiplicador + 1 : 2;
            }

            int resto = suma % 11;
            int resultadoEsperado = 11 - resto;

            // Convertir 10 a 'K'
            char dvEsperado = resultadoEsperado == 10 ? 'K' : resultadoEsperado.ToString()[0];

            // Comparar el dígito verificador calculado con el proporcionado
            return dv == dvEsperado;
        }

        // Método para validar el correo según la expresión regular y el dominio permitido
        private bool IsValidEmail(string email)
        {
            // Expresión regular para validar el formato del correo electrónico
            string emailRegex = @"^[a-zA-Z0-9._-]+@(ucn\.cl|alumnos\.ucn\.cl|disc\.ucn\.cl|ce\.ucn\.cl)$";

            // Verificar el formato del correo y el dominio permitido
            return System.Text.RegularExpressions.Regex.IsMatch(email, emailRegex);
        }

        
    }
}
