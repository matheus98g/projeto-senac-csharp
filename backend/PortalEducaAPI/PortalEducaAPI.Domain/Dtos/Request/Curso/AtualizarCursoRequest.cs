using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using PortalEducaAPI.Domain.Models;
using Newtonsoft.Json;

namespace PortalEducaAPI.Domain.Dtos.Request.Curso
{
    public class AtualizarCursoRequest
    {
        [JsonProperty("nome")]
        public string? Nome { get; set; }

        [Required]
        [JsonProperty("descricao")]
        public string Descricao { get; set; }

        [Required]
        [JsonProperty("categoria")]
        public CategoriaCurso Categoria { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Valor deve ser maior que zero")]
        [JsonProperty("valor")]
        public decimal Valor { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Carga horária deve ser maior que zero")]
        [JsonProperty("cargaHoraria")]
        public int CargaHoraria { get; set; }

        [Required]
        [JsonProperty("ativo")]
        public bool Ativo { get; set; }

        [JsonProperty("professorId")]
        public long? ProfessorId { get; set; }
    }
}
