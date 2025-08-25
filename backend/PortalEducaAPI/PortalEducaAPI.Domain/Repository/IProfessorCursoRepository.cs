using PortalEducaAPI.Domain.Models;

namespace PortalEducaAPI.Domain.Repository
{
    public interface IProfessorCursoRepository
    {
        Task<long> VincularProfessorACurso(long professorId, long cursoId);
        Task DesabilitarVinculo(long professorId, long cursoId);
        Task<bool> VinculoExiste(long professorId, long cursoId);
        Task<IEnumerable<ProfessorCurso>> ObterVinculosPorProfessor(long professorId);
        Task<IEnumerable<ProfessorCurso>> ObterVinculosPorCurso(long cursoId);
        Task<IEnumerable<Curso>> ObterCursosDoProfessor(long professorId);
        Task<IEnumerable<Professor>> ObterProfessoresAtivosParaCurso(long cursoId);
    }
}
