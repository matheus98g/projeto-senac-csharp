using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace PortalEducaAPI.Domain.Dtos
{
    public class ErroResponse
    {
        [JsonProperty("mensagem")]
        public string Mensagem { get; set; }

        [JsonProperty("codigo")]
        public string Codigo { get; set; }
    }
}
