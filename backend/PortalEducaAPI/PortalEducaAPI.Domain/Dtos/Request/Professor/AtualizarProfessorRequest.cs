using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace PortalEducaAPI.Domain.Dtos.Request.Professor
{
    public class AtualizarProfessorRequest
    {
        [JsonProperty("email")]
        public string Email { get; set; }

        [JsonProperty("telefone")]
        public string Telefone { get; set; }

        [JsonProperty("ativo")]
        public bool Ativo { get; set; }

        [JsonProperty("formacao")]
        public string Formacao { get; set; }
    }
}
