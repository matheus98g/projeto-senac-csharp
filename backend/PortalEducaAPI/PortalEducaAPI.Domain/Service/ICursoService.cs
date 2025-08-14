using PortalEducaAPI.Domain.Dtos.Request.Curso;
using PortalEducaAPI.Domain.Dtos.Response.Aluno;
using PortalEducaAPI.Domain.Dtos.Response.Curso;

namespace PortalEducaAPI.Domain.Service
{
    public interface ICursoService
    {
        Task<ObterCursoDetalhadoPorIdResponse> ObterDetalhadoPorId(long id);
        Task<CadastrarCursoResponse> Cadastrar(CadastrarCursoRequest cadastrarCursoRequest);
        Task DeletarPorId(long id);
        Task AtualizarPorId(long id, AtualizarCursoRequest atualizarCursoRequest);
        Task<IEnumerable<ObterTodosCursoResponse>> ObterTodos();
    }
}
