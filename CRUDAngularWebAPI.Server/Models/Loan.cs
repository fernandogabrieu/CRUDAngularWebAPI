using Npgsql;
using System.Data;

namespace CRUDAngularWebAPI.Server.Models
{
    public class Loan
    {
        public int Id { get; set; }
        public decimal ValueObtained { get; set; }
        public string Coin { get; set; }
        public decimal ConversionRateToReal { get; set; }
        public DateTime DateOfLoan { get; set; }
        public DateTime DateOfExpiration { get; set; }
        public decimal? ValueToBePaid { get; set; }
        public int CustomerId { get; set; } //um empréstimo (Loan) deve ter um cliente (Customer)
        public int Installments { get; set; }

    }
}