
namespace PortalEducaAPI.Domain.Dtos.Request.Professor
{
    public class AtualizarProfessorRequest
    {
        public string Email { get; set; }

        public  string Telefone { get; set; }

        public bool Ativo { get; set; }

        public  string Formacao { get; set; }
    }
}
