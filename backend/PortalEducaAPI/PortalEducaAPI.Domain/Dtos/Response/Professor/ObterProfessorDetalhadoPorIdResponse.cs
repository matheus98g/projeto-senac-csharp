
namespace PortalEducaAPI.Domain.Dtos.Response.Professor
{
    public class ObterProfessorDetalhadoPorIdResponse
    {
        public long Id { get; set; }
        public string Nome { get; set; }
        public string Sobrenome { get; set; }
        public string Telefone { get; set; }

        public string Email { get; set; }
        public DateTime? DataContratacao { get; set; }
        public string Formacao { get; set; }

        public bool Ativo { get; set; }
    }
}
