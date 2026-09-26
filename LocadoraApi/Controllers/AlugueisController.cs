using LocadoraApi.Data;
using LocadoraApi.DTOs;
using LocadoraApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LocadoraApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AlugueisController : ControllerBase
    {
        private readonly ApplicationContext _ctx;
        public AlugueisController(ApplicationContext ctx) => _ctx = ctx;

        [HttpGet]
        public async Task<IActionResult> GetAll()
            => Ok(await _ctx.Alugueis
                .Include(a => a.Cliente)
                .Include(a => a.Veiculo)
                .AsNoTracking().ToListAsync());

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Aluguel a)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (a.DataDevolucaoPrevista <= a.DataRetirada)
                return BadRequest(new { msg = "Data de devolução deve ser posterior à retirada" });

            var veiculo = await _ctx.Veiculos.FindAsync(a.VeiculoId);
            if (veiculo == null) return NotFound(new { msg = "Veículo não encontrado" });

            var conflito = await _ctx.Alugueis.AnyAsync(x =>
                x.VeiculoId == a.VeiculoId &&
                x.DataDevolucaoReal == null &&
                a.DataRetirada < x.DataDevolucaoPrevista &&
                a.DataDevolucaoPrevista > x.DataRetirada);

            if (conflito) return Conflict(new { msg = "Veículo indisponível no período" });

            a.QuilometragemInicial = veiculo.Quilometragem;
            var dias = (a.DataDevolucaoPrevista - a.DataRetirada).Days;
            if (dias <= 0) dias = 1;
            a.ValorTotal = a.ValorDiaria * dias;

            _ctx.Alugueis.Add(a);
            await _ctx.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAll), new { id = a.Id }, a);
        }

        [HttpPatch("{id}/devolver")]
        public async Task<IActionResult> Devolver(int id, [FromBody] DevolucaoDto dto)
        {
            var a = await _ctx.Alugueis.Include(x => x.Veiculo)
                .FirstOrDefaultAsync(x => x.Id == id);
            if (a == null) return NotFound();
            if (a.DataDevolucaoReal != null) return BadRequest(new { msg = "Já devolvido" });

            a.DataDevolucaoReal = DateTime.Now;
            a.QuilometragemFinal = dto.QuilometragemFinal;

            if (dto.QuilometragemFinal < a.QuilometragemInicial)
                return BadRequest(new { msg = "Km final menor que inicial" });

            var dias = (a.DataDevolucaoReal.Value - a.DataRetirada).Days;
            if (dias <= 0) dias = 1;
            a.ValorTotal = a.ValorDiaria * dias;

            a.Veiculo.Quilometragem = dto.QuilometragemFinal;

            await _ctx.SaveChangesAsync();
            return Ok(a);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Aluguel a)
        {
            if (id != a.Id) return BadRequest();
            if (!ModelState.IsValid) return BadRequest(ModelState);
            _ctx.Entry(a).State = EntityState.Modified;
            await _ctx.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var a = await _ctx.Alugueis.FindAsync(id);
            if (a == null) return NotFound();
            _ctx.Alugueis.Remove(a);
            await _ctx.SaveChangesAsync();
            return NoContent();
        }
    }
}