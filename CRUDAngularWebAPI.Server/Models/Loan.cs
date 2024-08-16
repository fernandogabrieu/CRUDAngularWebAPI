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
        public Customer Customer { get; set; } //um empréstimo (Loan) deve ter um cliente (Customer)

    }
}