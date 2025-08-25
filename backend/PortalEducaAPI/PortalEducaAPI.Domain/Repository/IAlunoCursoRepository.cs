using PortalEducaAPI.Domain.Models;

namespace PortalEducaAPI.Domain.Repository
{
    public interface IAlunoCursoRepository
    {
        Task<long> VincularAlunoACurso(long alunoId, long cursoId);
        Task DesabilitarVinculo(long alunoId, long cursoId);
        Task<bool> VinculoExiste(long alunoId, long cursoId);
        Task<IEnumerable<AlunoCurso>> ObterVinculosPorAluno(long alunoId);
        Task<IEnumerable<AlunoCurso>> ObterVinculosPorCurso(long cursoId);
        Task<IEnumerable<Curso>> ObterCursosDoAluno(long alunoId);
        Task<IEnumerable<Aluno>> ObterAlunosAtivosParaCurso(long cursoId);
    }
}
