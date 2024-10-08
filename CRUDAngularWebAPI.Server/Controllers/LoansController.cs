﻿using CRUDAngularWebAPI.Server.Models;
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

        //serviço para obter lista de moedas
        private readonly CoinListService _coinListService;

        //construtor do controller
        public LoansController(ApplicationDbContext applicationDbContext,
                               LoanCalculationService loanCalculationService,
                               CoinListService coinListService)
        {
            _applicationDbContext = applicationDbContext;
            _loanCalculationService = loanCalculationService;
            _coinListService = coinListService;
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

        [HttpGet("coins")]
        public async Task<IActionResult> GetCoinList()
        {
            var coins = await _coinListService.GetCoinListAsync();
            
            if (coins == null || !coins.Any())
            {
                return NotFound("No currencies found");
            }

            return Ok(coins);
        }
    }
}
