using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace PortalEducaAPI.Domain.Dtos.Request.Aluno
{
    public class CadastrarRequest
    {
        [JsonProperty("nome")]
        public string Nome { get; set; }
        
        [JsonProperty("sobrenome")]
        public string Sobrenome { get; set; }
        
        [JsonProperty("email")]
        public string Email { get; set; }
        
        [JsonProperty("telefone")]
        public string Telefone { get; set; }
        
        [JsonProperty("responsavel")]
        public string Responsavel { get; set; }
        
        [JsonProperty("dataNascimento")]
        public DateTime DataNascimento { get; set; }
    }
}
