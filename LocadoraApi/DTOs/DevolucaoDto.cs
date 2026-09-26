using System.ComponentModel.DataAnnotations;

namespace LocadoraApi.DTOs
{
    public class DevolucaoDto
    {
        [Required(ErrorMessage = "A quilometragem final é obrigatória")]
        [Range(0, int.MaxValue, ErrorMessage = "Quilometragem inválida")]
        public int QuilometragemFinal { get; set; }
    }
}