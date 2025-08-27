
namespace PortalEducaAPI.Domain.Dtos.Request.Professor
{
    public class CadastrarProfessorRequest
    {
        public string Nome { get; set; }
        public string Sobrenome { get; set; }
        public string Telefone { get; set; }
        public DateTime? DataDeNascimento { get; set; }

        public string Email { get; set; }
        public DateTime? DataContratacao { get; set; }
        public string Formacao { get; set; }

        public bool Ativo { get; set; }
    }
}
