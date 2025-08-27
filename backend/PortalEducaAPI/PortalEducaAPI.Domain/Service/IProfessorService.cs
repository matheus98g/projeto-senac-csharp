using PortalEducaAPI.Domain.Dtos.Request.Professor;
using PortalEducaAPI.Domain.Dtos.Response.Professor;
namespace PortalEducaAPI.Domain.Service
{
    public interface IProfessorService
    {
        Task<ObterProfessorDetalhadoPorIdResponse> ObterDetalhadoPorId(long id);
        Task<CadastrarProfessorResponse> Cadastrar(CadastrarProfessorRequest cadastrarRequest);
        Task DeletarPorId(long id);
        Task AtualizarPorId(long id, AtualizarProfessorRequest atualizarRequest);

        Task<IEnumerable<ObterTodosProfessorResponse>> ObterTodos();
    }
}
