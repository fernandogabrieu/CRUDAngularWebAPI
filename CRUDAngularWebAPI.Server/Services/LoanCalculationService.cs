using CRUDAngularWebAPI.Server.Models;

namespace CRUDAngularWebAPI.Server.Services
{
    public class LoanCalculationService{
        private const decimal MonthlyInterestRate = 0.02m; // 2% de juros ao mês
        public decimal CalculateValueToBePaid(Loan loan){
            var months = ((loan.DateOfExpiration.Year - loan.DateOfLoan.Year) * 12) + loan.DateOfExpiration.Month - loan.DateOfLoan.Month;
            var valueToBePaid = loan.ValueObtained * (decimal)Math.Pow((double)(1 + MonthlyInterestRate), months);

            /*
            A fórmula para calcular juros compostos é:
            M = C * (1 + i)^t

            Onde:
            M = montante final
            C = capital
            i = taxa de juros
            t = tempo
            */

            return valueToBePaid;
        }
    }
}
