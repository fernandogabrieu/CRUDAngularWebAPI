using CRUDAngularWebAPI.Server.Models;
using CRUDAngularWebAPI.Server.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CRUDAngularWebAPI.Server.Controllers
{    
    //identificação de que se trata de um controller p/ api
    [ApiController]

    //rota da api
    [Route("api/[controller]")]

    public class LoansController : ControllerBase
    {
        //criação do contexto 
        private readonly ApplicationDbContext _applicationDbContext;

        //serviço de cálculo do valor a ser pago do empréstimo
        private readonly LoanCalculationService _loanCalculationService; 

        //construtor do controller
        public LoansController(ApplicationDbContext applicationDbContext, LoanCalculationService loanCalculationService)
        {
            _applicationDbContext = applicationDbContext;
            _loanCalculationService = loanCalculationService;
        }

        //método Get All Loans
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Loan>>> GetLoans()
        {
            return await _applicationDbContext.Loans.ToListAsync();
        }

        //método Get Loan by Id
        [HttpGet("{loanId}")]
        public async Task<ActionResult<Loan>> GetLoans(int loanId)
        {
            Loan loan = await _applicationDbContext.Loans.FindAsync(loanId);

            if (loan == null)
                return NotFound();

            return loan;
        }

        //método Post Loan
        [HttpPost]
        public async Task<ActionResult<Loan>> PostLoan(Loan loan)
        {
            
            //loan.DateOfLoan = loan.DateOfLoan.Date;
            //loan.DateOfExpiration = loan.DateOfExpiration.Date;
            loan.DateOfLoan = DateTime.SpecifyKind(loan.DateOfLoan.Date.AddDays(1), DateTimeKind.Utc);
            loan.DateOfExpiration = DateTime.SpecifyKind(loan.DateOfExpiration.Date.AddDays(1), DateTimeKind.Utc);
            /*
            //Cálculo do número de meses entre a data de empréstimo e vencimento
            int numberOfMonths = ((loan.DateOfExpiration.Year - loan.DateOfLoan.Year) * 12) + loan.DateOfExpiration.Month - loan.DateOfLoan.Month;

            //Definição da taxa de juros
            decimal interestRate = 0.02m;

            //Cálculo do valor final usando juros compostos
            loan.ValueToBePaid = loan.ValueObtained * (decimal)Math.Pow((double)(1 + interestRate), numberOfMonths);
            */

            loan.ValueToBePaid = _loanCalculationService.CalculateValueToBePaid(loan);

            await _applicationDbContext.Loans.AddAsync(loan);
            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        //método Put Loan 
        [HttpPut]
        public async Task<ActionResult> PutLoan(Loan loan)
        {

            //loan.DateOfLoan = loan.DateOfLoan.Date;
            //loan.DateOfExpiration = loan.DateOfExpiration.Date;
            loan.DateOfLoan = DateTime.SpecifyKind(loan.DateOfLoan.Date.AddDays(1), DateTimeKind.Utc);
            loan.DateOfExpiration = DateTime.SpecifyKind(loan.DateOfExpiration.Date.AddDays(1), DateTimeKind.Utc);


            loan.ValueToBePaid = _loanCalculationService.CalculateValueToBePaid(loan);
            _applicationDbContext.Loans.Update(loan);
            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        //método Delete Loan
        [HttpDelete("{loanId}")]
        public async Task<ActionResult> DeleteLoan(int loanId)
        {
            Loan loan = await _applicationDbContext.Loans.FindAsync(loanId);
            if (loan == null)
                return NotFound();

            _applicationDbContext.Remove(loan);
            await _applicationDbContext.SaveChangesAsync();
            return Ok();
        }

        //método Simulate Loan
        [HttpPost("simulate")]
        public ActionResult<decimal> SimulateLoan(Loan loan)
        {
            var valueToBePaid = _loanCalculationService.CalculateValueToBePaid(loan);

            return Ok(valueToBePaid);
        }
    }
}
