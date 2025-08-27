using System.Text.Json.Serialization;

namespace PortalEducaAPI.Domain.Dtos
{
    public class ErroResponse
    {
        public string Mensagem { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string Codigo { get; set; }

    }
}
