using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PortalEducaAPI.Domain.Models
{
    public class Aluno
    {
        public long Id { get; set; }
        public string Nome { get; set; }
        public string Sobrenome { get; set; }
        public string Telefone { get; set; }

        public string Email { get; set; }
        public DateTime? DataNascimento { get; set; }
        public DateTime? Matricula { get; set; }

        public bool Ativo { get; set; }

    }
}
