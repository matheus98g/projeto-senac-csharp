using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace PortalEducaAPI.Domain.Dtos.Response.Aluno
{
    public class ObterTodosResponse
    {
        [JsonProperty("id")]
        public long Id { get; set; }
        
        [JsonProperty("nome")]
        public string Nome { get; set; }
        
        [JsonProperty("sobrenome")]
        public string Sobrenome { get; set; }
        
        [JsonProperty("email")]
        public string Email { get; set; }
        
        [JsonProperty("telefone")]
        public string Telefone { get; set; }
        
        [JsonProperty("dataDeNascimento")]
        public DateTime DataDeNascimento { get; set; }
        
        [JsonProperty("dataMatricula")]
        public DateTime DataMatricula { get; set; }
        
        [JsonProperty("ativo")]
        public bool Ativo { get; set; }
    }
}
