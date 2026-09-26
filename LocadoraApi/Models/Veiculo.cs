using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LocadoraApi.Models
{
    [Table("Veiculos")]
    public class Veiculo
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(80)]
        public string Modelo { get; set; }

        [Required]
        [Range(1900, 2100)]
        public int AnoFabricacao { get; set; }

        [Range(0, int.MaxValue)]
        public int Quilometragem { get; set; }

        [Required]
        [StringLength(10)]
        public string Placa { get; set; }

        // FK
        [Required]
        public int FabricanteId { get; set; }
        [ForeignKey("FabricanteId")]
        public Fabricante? Fabricante { get; set; }

        [Required]
        public int CategoriaId { get; set; }
        [ForeignKey("CategoriaId")]
        public Categoria? Categoria { get; set; }

        public ICollection<Aluguel> Alugueis { get; set; } = new List<Aluguel>();
    }
}