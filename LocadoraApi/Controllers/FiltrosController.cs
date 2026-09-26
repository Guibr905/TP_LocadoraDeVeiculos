using LocadoraApi.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LocadoraApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FiltrosController : ControllerBase
    {
        private readonly ApplicationContext _ctx;
        public FiltrosController(ApplicationContext ctx) => _ctx = ctx;

        [HttpGet("veiculos-por-fabricante/{nome}")]
        public async Task<IActionResult> VeiculosPorFabricante(string nome)
        {
            var resultado = await (from v in _ctx.Veiculos
                                   join f in _ctx.Fabricantes on v.FabricanteId equals f.Id
                                   where f.Nome.Contains(nome)
                                   select new
                                   {
                                       v.Id,
                                       v.Modelo,
                                       v.AnoFabricacao,
                                       v.Placa,
                                       Fabricante = f.Nome,
                                       f.PaisOrigem
                                   }).ToListAsync();
            return Ok(resultado);
        }

        [HttpGet("alugueis-por-cliente/{cpf}")]
        public async Task<IActionResult> AlugueisPorCliente(string cpf)
        {
            var resultado = await (from a in _ctx.Alugueis
                                   join c in _ctx.Clientes on a.ClienteId equals c.Id
                                   join v in _ctx.Veiculos on a.VeiculoId equals v.Id
                                   where c.CPF == cpf
                                   select new
                                   {
                                       a.Id,
                                       Cliente = c.Nome,
                                       Veiculo = v.Modelo,
                                       v.Placa,
                                       a.DataRetirada,
                                       a.DataDevolucaoPrevista,
                                       a.DataDevolucaoReal,
                                       a.ValorTotal
                                   }).ToListAsync();
            return Ok(resultado);
        }

        [HttpGet("fabricantes-com-veiculos")]
        public async Task<IActionResult> FabricantesComVeiculos()
        {
            var resultado = await (from f in _ctx.Fabricantes
                                   join v in _ctx.Veiculos on f.Id equals v.FabricanteId into g
                                   from v in g.DefaultIfEmpty()
                                   select new
                                   {
                                       Fabricante = f.Nome,
                                       Veiculo = v != null ? v.Modelo : "(sem veículos)"
                                   }).ToListAsync();
            return Ok(resultado);
        }

        [HttpGet("clientes-com-total-alugueis")]
        public async Task<IActionResult> ClientesComTotalAlugueis()
        {
            var resultado = await (from c in _ctx.Clientes
                                   join a in _ctx.Alugueis on c.Id equals a.ClienteId into g
                                   from a in g.DefaultIfEmpty()
                                   group a by new { c.Id, c.Nome, c.CPF } into grp
                                   select new
                                   {
                                       grp.Key.Id,
                                       grp.Key.Nome,
                                       grp.Key.CPF,
                                       TotalAlugueis = grp.Count(x => x != null),
                                       ValorTotalGasto = grp.Where(x => x != null).Sum(x => (decimal?)x.ValorTotal) ?? 0
                                   }).ToListAsync();
            return Ok(resultado);
        }

        [HttpGet("alugueis-por-categoria/{categoriaId}")]
        public async Task<IActionResult> AlugueisPorCategoria(int categoriaId)
        {
            var resultado = await (from a in _ctx.Alugueis
                                   join v in _ctx.Veiculos on a.VeiculoId equals v.Id
                                   join cat in _ctx.Categorias on v.CategoriaId equals cat.Id
                                   where cat.Id == categoriaId
                                   select new
                                   {
                                       AluguelId = a.Id,
                                       Categoria = cat.Nome,
                                       Veiculo = v.Modelo,
                                       a.DataRetirada,
                                       a.DataDevolucaoPrevista,
                                       a.ValorTotal
                                   }).ToListAsync();
            return Ok(resultado);
        }
    }
}