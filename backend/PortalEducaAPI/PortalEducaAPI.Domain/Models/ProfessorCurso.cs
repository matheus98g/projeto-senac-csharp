using System;

namespace PortalEducaAPI.Domain.Models
{
    public class ProfessorCurso
    {
        public long Id { get; set; }
        public long ProfessorId { get; set; }
        public long CursoId { get; set; }
        public DateTime DataVinculacao { get; set; }
        public bool Ativo { get; set; }

        // Propriedades de navegação (opcional para views)
        public Professor? Professor { get; set; }
        public Curso? Curso { get; set; }
    }
}
