using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PortalEducaAPI.Domain.Models;

namespace PortalEducaAPI.Domain.Repository
{
    public interface IProfessorRepository
    {
        Task<Curso> ObterDetalhadoPorId(long id);

        Task DeletarPorId(long id);
        Task AtualizarPorId(Curso curso);

        Task<IEnumerable<Curso>> ObterTodos();

        Task<long> Cadastrar(Curso curso);
    }
}
