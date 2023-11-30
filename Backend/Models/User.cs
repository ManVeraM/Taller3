namespace Backend.Models;


public class User
    {
        public int Id { get; set; }
        public string? FullName { get; set; }

        public string? Email { get; set; }

        public int YearOfBirth { get; set; }

        public string? Rut { get; set; }

        public string? Password { get; set; }

    }