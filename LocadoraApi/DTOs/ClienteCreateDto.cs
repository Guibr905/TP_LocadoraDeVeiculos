using System.ComponentModel.DataAnnotations;

namespace LocadoraApi.DTOs
{
    public class ClienteCreateDto
    {
        [Required, StringLength(120, MinimumLength = 3)]
        public string Nome { get; set; }

        [Required, StringLength(11, MinimumLength = 11)]
        public string CPF { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        [Phone]
        public string Telefone { get; set; }
    }
}