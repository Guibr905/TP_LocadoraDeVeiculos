using LocadoraApi.Data;
using LocadoraApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LocadoraApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FabricantesController : ControllerBase
    {
        private readonly ApplicationContext _ctx;
        public FabricantesController(ApplicationContext ctx) => _ctx = ctx;

        [HttpGet]
        public async Task<IActionResult> GetAll()
            => Ok(await _ctx.Fabricantes.AsNoTracking().ToListAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var fab = await _ctx.Fabricantes.FindAsync(id);
            return fab == null ? NotFound(new { msg = "Fabricante não encontrado" }) : Ok(fab);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Fabricante fab)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            _ctx.Fabricantes.Add(fab);
            await _ctx.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = fab.Id }, fab);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Fabricante fab)
        {
            if (id != fab.Id) return BadRequest(new { msg = "Id divergente" });
            if (!ModelState.IsValid) return BadRequest(ModelState);
            _ctx.Entry(fab).State = EntityState.Modified;
            try { await _ctx.SaveChangesAsync(); }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _ctx.Fabricantes.AnyAsync(f => f.Id == id)) return NotFound();
                throw;
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var fab = await _ctx.Fabricantes.FindAsync(id);
            if (fab == null) return NotFound();
            _ctx.Fabricantes.Remove(fab);
            await _ctx.SaveChangesAsync();
            return NoContent();
        }
    }
}