using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LocadoraApi.Models
{
    [Table("Fabricantes")]
    public class Fabricante
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "O nome do fabricante é obrigatório")]
        [StringLength(100, MinimumLength = 2)]
        public string Nome { get; set; }

        [StringLength(80)]
        public string PaisOrigem { get; set; }

        public int AnoFundacao { get; set; }

        public ICollection<Veiculo> Veiculos { get; set; } = new List<Veiculo>();
    }
}