using CRUDAngularWebAPI.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CRUDAngularWebAPI.Server.Controllers
{
    //identificação de que se trata de um controller p/ api
    [ApiController]

    //rota da api
    [Route("api/[controller]")]
    public class CustomersController : ControllerBase
    {
        //criação do contexto 
        private readonly ApplicationDbContext _applicationDbContext;

        //construtor do controller
        public CustomersController(ApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;
        }

        //método Get All Customers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Customer>>> GetCustomers()
        {
            return await _applicationDbContext.Customers.ToListAsync();
        }

        //método Get Customer by Id
        [HttpGet("{customerId}")]
        public async Task<ActionResult<Customer>> GetCustomer(int customerId)
        {
            Customer customer = await _applicationDbContext.Customers.FindAsync(customerId);

            if (customer == null)
                return NotFound();

            return customer;
        }

        //método Post Customer
        [HttpPost]
        public async Task<ActionResult<Customer>> PostCustomer(Customer customer)
        {
            await _applicationDbContext.Customers.AddAsync(customer);
            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        //método Put Customer
        [HttpPut]
        public async Task<ActionResult> PutCustomer(Customer customer)
        {
            _applicationDbContext.Customers.Update(customer);
            await _applicationDbContext.SaveChangesAsync();

            return Ok();
        }

        //método Delete Customer
        [HttpDelete("{customerId}")]
        public async Task<ActionResult> DeleteCustomer(int customerId)
        {
            Customer customer = await _applicationDbContext.Customers.FindAsync(customerId);
            if (customer == null)
                return NotFound();

            _applicationDbContext.Remove(customer); 
            await _applicationDbContext.SaveChangesAsync(); 
            return Ok();
        }
    }
}
