﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PortalEducaAPI.Domain.Models;

namespace PortalEducaAPI.Domain.Dtos.Response.Curso
{
    public class ObterCursoDetalhadoPorIdResponse
    {
        public long Id { get; set; }
        public string Nome { get; set; }
        public string Descricao { get; set; }
      

        public decimal Valor { get; set; }
        public DateTime? DataCriacao { get; set; }
        public long? ProfessorId { get; set; }

        public int CargaHoraria { get; set; }
        public string Categoria { get; set; }

        public bool Ativo { get; set; }
    }
}
