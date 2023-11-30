using Microsoft.EntityFrameworkCore;

namespace Backend.Models;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions<DataContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users{ get; set; } = null!;
}