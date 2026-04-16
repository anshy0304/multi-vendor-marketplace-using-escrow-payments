using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class MarketPlaceDbContext : DbContext
    {
        public MarketPlaceDbContext(DbContextOptions options) : base(options)
        {
        }

       public DbSet<User> Users { get; set; }
       public DbSet<Product> Products { get; set; }
       public DbSet<Order> Orders { get; set; }
       public DbSet<EscrowTransaction> EscrowTransactions { get; set; }


    }
}
