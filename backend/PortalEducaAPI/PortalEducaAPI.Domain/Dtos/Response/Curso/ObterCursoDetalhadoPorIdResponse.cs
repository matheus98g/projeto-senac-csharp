
namespace PortalEducaAPI.Domain.Dtos.Response.Curso
{
    public class ObterCursoDetalhadoPorIdResponse
    {
        public long Id { get; set; }
        public string Nome { get; set; }
        public string Descricao { get; set; }
      

        public decimal Valor { get; set; }
        public DateTime? DataCriacao { get; set; }
        public long? ProfessorId { get; set; }

        public int CargaHoraria { get; set; }
        public string Categoria { get; set; }

        public bool Ativo { get; set; }
    }
}
