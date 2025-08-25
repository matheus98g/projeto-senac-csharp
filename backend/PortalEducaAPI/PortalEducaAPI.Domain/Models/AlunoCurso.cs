using System;

namespace PortalEducaAPI.Domain.Models
{
    public class AlunoCurso
    {
        public long Id { get; set; }
        public long AlunoId { get; set; }
        public long CursoId { get; set; }
        public DateTime DataMatriculaCurso { get; set; }
        public bool Ativo { get; set; }

        // Propriedades de navegação (opcional para views)
        public Aluno? Aluno { get; set; }
        public Curso? Curso { get; set; }
    }
}
