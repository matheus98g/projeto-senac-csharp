using PortalEducaAPI.Domain.Models;

namespace PortalEducaAPI.Domain.Repository
{
    public interface IProfessorRepository
    {
        Task<Professor> ObterDetalhadoPorId(long id);

        Task DeletarPorId(long id);
        Task AtualizarPorId(Professor professor);

        Task<IEnumerable<Professor>> ObterTodos();

        Task<long> Cadastrar(Professor professor);
        Task<bool> ProfessorPossuiCursosVinculados(long professorId);
    }
}
