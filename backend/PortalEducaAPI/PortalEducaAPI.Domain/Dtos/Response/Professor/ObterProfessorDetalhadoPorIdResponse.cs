using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PortalEducaAPI.Domain.Models;
using Newtonsoft.Json;

namespace PortalEducaAPI.Domain.Dtos.Response.Professor
{
    public class ObterProfessorDetalhadoPorIdResponse
    {
        [JsonProperty("id")]
        public long Id { get; set; }
        
        [JsonProperty("nome")]
        public string Nome { get; set; }
        
        [JsonProperty("sobrenome")]
        public string Sobrenome { get; set; }
        
        [JsonProperty("telefone")]
        public string Telefone { get; set; }

        [JsonProperty("email")]
        public string Email { get; set; }
        
        [JsonProperty("dataContratacao")]
        public DateTime? DataContratacao { get; set; }
        
        [JsonProperty("formacao")]
        public string Formacao { get; set; }

        [JsonProperty("ativo")]
        public bool Ativo { get; set; }
    }
}
