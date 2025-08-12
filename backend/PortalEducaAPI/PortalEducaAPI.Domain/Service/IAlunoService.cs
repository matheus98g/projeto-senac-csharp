using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PortalEducaAPI.Domain.Dtos.Request;
using PortalEducaAPI.Domain.Dtos.Response;

namespace PortalEducaAPI.Domain.Service
{
    public interface IAlunoService
    {
        Task<ObterDetalhadoPorIdResponse> ObterDetalhadoPorId(long id);
        Task<CadastrarResponse> Cadastrar(CadastrarRequest cadastrarRequest);
        Task DeletarPorId(long id);
        Task AtualizarPorId(long id, AtualizarRequest atualizarRequest);
 
        Task<IEnumerable<ObterTodosResponse>> ObterTodos();
    }
}
