using System.ComponentModel.DataAnnotations;

namespace LocadoraApi.DTOs
{
    public class AluguelCreateDto
    {
        [Required]
        public int ClienteId { get; set; }

        [Required]
        public int VeiculoId { get; set; }

        [Required]
        public DateTime DataRetirada { get; set; }

        [Required]
        public DateTime DataDevolucaoPrevista { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal ValorDiaria { get; set; }
    }
}