using PortalEducaAPI.Domain.Models;

namespace PortalEducaAPI.Domain.Repository
{
    public interface IAlunoRepository
    {

        Task<long> Cadastrar(Aluno aluno);
        Task AtualizarPorId(Aluno aluno);
        Task DeletarPorId(long id);
        Task<Aluno> ObterDetalhadoPorId(long id);
        Task<IEnumerable<Aluno>> ObterTodos();
    }
}
