
namespace PortalEducaAPI.Domain.Models
{
    public class Curso
    {
        public long Id { get; set; }
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public decimal Valor { get; set; }
        public DateTime? DataCriacao { get; set; }
        public long? ProfessorId { get; set; }

        public int CargaHoraria { get; set; }
        public CategoriaCurso Categoria { get; set; }

        public bool Ativo { get; set; }
    }
}
