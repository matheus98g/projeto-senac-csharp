using PortalEducaAPI.Domain.Dtos.Request.Aluno;
using PortalEducaAPI.Domain.Dtos.Response.Aluno;

namespace PortalEducaAPI.Domain.Service
{
   

    namespace PortalEducaAPI.Domain.Service
    {
        public interface IAlunoService
        {
            Task<CadastrarResponse> Cadastrar(CadastrarRequest request);
            Task AtualizarPorId(long id, AtualizarRequest request);
            Task DeletarPorId(long id);
            Task<IEnumerable<ObterTodosResponse>> ObterTodos();
            Task<ObterDetalhadoPorIdResponse> ObterDetalhadoPorId(long id);
        }
    }

}
