using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PortalEducaAPI.Domain.Models;
using Newtonsoft.Json;

namespace PortalEducaAPI.Domain.Dtos.Request.Professor
{
    public class CadastrarProfessorRequest
    {
        [JsonProperty("nome")]
        public string Nome { get; set; }
        
        [JsonProperty("sobrenome")]
        public string Sobrenome { get; set; }
        
        [JsonProperty("telefone")]
        public string Telefone { get; set; }
        
        [JsonProperty("dataDeNascimento")]
        public DateTime? DataDeNascimento { get; set; }

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
