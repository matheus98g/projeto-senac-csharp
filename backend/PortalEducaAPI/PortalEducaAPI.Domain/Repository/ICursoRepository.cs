using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PortalEducaAPI.Domain.Models;

namespace PortalEducaAPI.Domain.Repository
{
    public interface ICursoRepository
    {
        Task<long> Cadastrar(Curso curso);
        Task AtualizarPorId(Curso curso);
        Task DeletarPorId(long id);
        Task<Curso> ObterDetalhadoPorId(long id);
        Task<IEnumerable<Curso>> ObterTodos();
    }
}