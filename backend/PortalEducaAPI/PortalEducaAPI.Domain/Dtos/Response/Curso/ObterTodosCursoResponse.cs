using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PortalEducaAPI.Domain.Models;
using Newtonsoft.Json;

namespace PortalEducaAPI.Domain.Dtos.Response.Curso
{
    public class ObterTodosCursoResponse
    {
        [JsonProperty("id")]
        public long Id { get; set; }
        
        [JsonProperty("nome")]
        public string Nome { get; set; }
        
        [JsonProperty("descricao")]
        public string Descricao { get; set; }
        
        [JsonProperty("valor")]
        public decimal Valor { get; set; }
        
        [JsonProperty("dataCriacao")]
        public DateTime? DataCriacao { get; set; }
        
        [JsonProperty("professorId")]
        public long? ProfessorId { get; set; }
        
        [JsonProperty("cargaHoraria")]
        public int CargaHoraria { get; set; }
        
        [JsonProperty("categoria")]
        public CategoriaCurso Categoria { get; set; }
        
        [JsonProperty("ativo")]
        public bool Ativo { get; set; }
    }
}
