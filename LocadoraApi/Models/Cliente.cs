using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LocadoraApi.Models
{
    [Table("Clientes")]
    public class Cliente
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(120)]
        public string Nome { get; set; }

        [Required]
        [StringLength(14)]
        public string CPF { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(120)]
        public string Email { get; set; }

        [Phone]
        [StringLength(20)]
        public string Telefone { get; set; }

        public DateTime DataCadastro { get; set; } = DateTime.Now;

        public ICollection<Aluguel> Alugueis { get; set; } = new List<Aluguel>();
    }
}