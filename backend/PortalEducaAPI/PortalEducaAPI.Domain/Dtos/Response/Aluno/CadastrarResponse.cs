using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace PortalEducaAPI.Domain.Dtos.Response.Aluno
{
    public class CadastrarResponse
    {
        [JsonProperty("id")]
        public long Id { get; set; }
    }
}
