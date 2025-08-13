using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PortalEducaAPI.Domain.Dtos.Request
{
    public class CadastrarCursoRequest
    {

        public string Nome { get; set; }

        public string  Descricao { get; set; }

        public  DateTime DataCriacao { get; set; }

        public string Categoria { get; set; }

        public decimal Valor { get; set; }

        public int CargaHoraria { get; set; }

        public  bool Ativo { get; set; }

    }
}


 