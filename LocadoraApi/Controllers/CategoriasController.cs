using LocadoraApi.Data;
using LocadoraApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LocadoraApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriasController : ControllerBase
    {
        private readonly ApplicationContext _ctx;

        public CategoriasController(ApplicationContext ctx)
        {
            _ctx = ctx;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categorias = await _ctx.Categorias
                .AsNoTracking()
                .ToListAsync();

            return Ok(categorias);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var categoria = await _ctx.Categorias
                .Include(c => c.Veiculos)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (categoria == null)
                return NotFound(new { msg = "Categoria não encontrada" });

            return Ok(categoria);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Categoria categoria)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            if (await _ctx.Categorias.AnyAsync(c => c.Nome == categoria.Nome))
                return Conflict(new { msg = "Já existe uma categoria com este nome" });

            _ctx.Categorias.Add(categoria);
            await _ctx.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = categoria.Id }, categoria);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Categoria categoria)
        {
            if (id != categoria.Id)
                return BadRequest(new { msg = "Id da URL diferente do corpo" });

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!await _ctx.Categorias.AnyAsync(c => c.Id == id))
                return NotFound(new { msg = "Categoria não encontrada" });

            _ctx.Entry(categoria).State = EntityState.Modified;

            try
            {
                await _ctx.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var categoria = await _ctx.Categorias
                .Include(c => c.Veiculos)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (categoria == null)
                return NotFound(new { msg = "Categoria não encontrada" });

            if (categoria.Veiculos != null && categoria.Veiculos.Any())
                return Conflict(new { msg = "Não é possível excluir categoria com veículos vinculados" });

            _ctx.Categorias.Remove(categoria);
            await _ctx.SaveChangesAsync();

            return NoContent();
        }
    }
}