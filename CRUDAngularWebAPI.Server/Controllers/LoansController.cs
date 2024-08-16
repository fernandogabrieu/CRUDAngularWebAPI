using CRUDAngularWebAPI.Server.Models;
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

        //construtor do controller
        public LoansController(ApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;
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
            await _applicationDbContext.Loans.AddAsync(loan);
            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        //método Put Loan 
        [HttpPut]
        public async Task<ActionResult> PutLoan(Loan loan)
        {
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
    }
}
