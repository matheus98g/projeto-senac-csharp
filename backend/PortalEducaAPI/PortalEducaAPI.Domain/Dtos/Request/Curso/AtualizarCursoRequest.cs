
namespace PortalEducaAPI.Domain.Dtos.Request.Curso
{
    public class AtualizarCursoRequest
    {
        public string Descricao { get; set; }

        public string Categoria { get; set; }

        public decimal Valor { get; set; }

        public int CargaHoraria { get; set; }

        public bool Ativo { get; set; }

        public long ProfessorId { get; set; }
    }
}
