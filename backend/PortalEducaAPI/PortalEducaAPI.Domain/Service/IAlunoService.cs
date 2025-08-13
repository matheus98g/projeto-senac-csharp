using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PortalEducaAPI.Domain.Dtos.Request;
using PortalEducaAPI.Domain.Dtos.Response;

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
