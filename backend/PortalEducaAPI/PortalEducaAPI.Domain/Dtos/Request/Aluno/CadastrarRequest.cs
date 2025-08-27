
namespace PortalEducaAPI.Domain.Dtos.Request.Aluno
{
    public class CadastrarRequest
    {
       
        public string Nome { get; set; }
        public string Sobrenome { get; set; }
        public string Email { get; set; }
        public string Telefone { get; set; }
        public string Responsavel { get; set; }
        public DateTime DataNascimento { get; set; }
    }
}
