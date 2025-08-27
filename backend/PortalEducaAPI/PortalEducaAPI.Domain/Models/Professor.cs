namespace PortalEducaAPI.Domain.Models
{
    public class Professor
    {
        public long Id { get; set; }
        public string Nome { get; set; }
        public string Sobrenome { get; set; }
        public string Telefone { get; set; }

        public string Email { get; set; }
        public DateTime? DataDeNascimento { get; set; }
        public DateTime? DataContratacao { get; set; }
        public FormacaoProfessor Formacao { get; set; }

        public bool Ativo { get; set; }

    }
}
