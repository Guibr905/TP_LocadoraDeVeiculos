using LocadoraApi.Data;
using LocadoraApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LocadoraApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientesController : ControllerBase
    {
        private readonly ApplicationContext _ctx;
        public ClientesController(ApplicationContext ctx) => _ctx = ctx;

        [HttpGet]
        public async Task<IActionResult> GetAll()
            => Ok(await _ctx.Clientes.AsNoTracking().ToListAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var c = await _ctx.Clientes.FindAsync(id);
            return c == null ? NotFound() : Ok(c);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Cliente c)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (await _ctx.Clientes.AnyAsync(x => x.CPF == c.CPF))
                return Conflict(new { msg = "CPF já cadastrado" });
            if (await _ctx.Clientes.AnyAsync(x => x.Email == c.Email))
                return Conflict(new { msg = "E-mail já cadastrado" });

            _ctx.Clientes.Add(c);
            await _ctx.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = c.Id }, c);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Cliente c)
        {
            if (id != c.Id) return BadRequest();
            if (!ModelState.IsValid) return BadRequest(ModelState);
            _ctx.Entry(c).State = EntityState.Modified;
            await _ctx.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var c = await _ctx.Clientes.FindAsync(id);
            if (c == null) return NotFound();
            _ctx.Clientes.Remove(c);
            await _ctx.SaveChangesAsync();
            return NoContent();
        }
    }
}