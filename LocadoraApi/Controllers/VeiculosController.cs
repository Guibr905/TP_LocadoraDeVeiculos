using LocadoraApi.Data;
using LocadoraApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LocadoraApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VeiculosController : ControllerBase
    {
        private readonly ApplicationContext _ctx;
        public VeiculosController(ApplicationContext ctx) => _ctx = ctx;

        [HttpGet]
        public async Task<IActionResult> GetAll()
            => Ok(await _ctx.Veiculos
                .Include(v => v.Fabricante)
                .Include(v => v.Categoria)
                .AsNoTracking().ToListAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var v = await _ctx.Veiculos
                .Include(x => x.Fabricante)
                .Include(x => x.Categoria)
                .FirstOrDefaultAsync(x => x.Id == id);
            return v == null ? NotFound() : Ok(v);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Veiculo v)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (await _ctx.Veiculos.AnyAsync(x => x.Placa == v.Placa))
                return Conflict(new { msg = "Placa já cadastrada" });

            _ctx.Veiculos.Add(v);
            await _ctx.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = v.Id }, v);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Veiculo v)
        {
            if (id != v.Id) return BadRequest();
            if (!ModelState.IsValid) return BadRequest(ModelState);
            _ctx.Entry(v).State = EntityState.Modified;
            await _ctx.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var v = await _ctx.Veiculos.FindAsync(id);
            if (v == null) return NotFound();
            _ctx.Veiculos.Remove(v);
            await _ctx.SaveChangesAsync();
            return NoContent();
        }
    }
}