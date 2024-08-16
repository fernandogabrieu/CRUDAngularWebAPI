using Microsoft.EntityFrameworkCore;

namespace CRUDAngularWebAPI.Server.Models
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<Customer> Customers { get; set; }

        public DbSet<Loan> Loans { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }
    }
}
