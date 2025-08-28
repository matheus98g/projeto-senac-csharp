using Microsoft.AspNetCore.Mvc;
using PortalEducaAPI.Domain.Dtos;
using PortalEducaAPI.Domain.Models;
using PortalEducaAPI.Domain.Repository;

namespace PortalEducaAPI.Controllers
{
    [ApiController]
    [Route("aluno-curso")]
    public class AlunoCursoController : Controller
    {
        private readonly IAlunoCursoRepository _alunoCursoRepository;

        public AlunoCursoController(IAlunoCursoRepository alunoCursoRepository)
        {
            _alunoCursoRepository = alunoCursoRepository;
        }

        [HttpPost("vincular")]
        public async Task<IActionResult> VincularAlunoACurso([FromBody] VincularAlunoCursoRequest request)
        {
            try
            {
                Console.WriteLine($"Tentando vincular aluno {request.AlunoId} ao curso {request.CursoId}");
                
                var id = await _alunoCursoRepository.VincularAlunoACurso(request.AlunoId, request.CursoId);
                
                Console.WriteLine($"Aluno vinculado com sucesso. ID do vínculo: {id}");
                
                return Ok(new { 
                    mensagem = "Aluno vinculado ao curso com sucesso", 
                    id = id,
                    sucesso = true 
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao vincular aluno: {ex.Message}");
                
                var erroResponse = new ErroResponse
                {
                    Mensagem = ex.Message
                };

                return BadRequest(erroResponse);
            }
        }

        [HttpDelete("desvincular")]
        public async Task<IActionResult> DesvincularAlunoDoCurso([FromBody] VincularAlunoCursoRequest request)
        {
            try
            {
                await _alunoCursoRepository.DesabilitarVinculo(request.AlunoId, request.CursoId);
                
                return Ok(new { 
                    mensagem = "Aluno desvinculado do curso com sucesso", 
                    sucesso = true 
                });
            }
            catch (Exception ex)
            {
                var erroResponse = new ErroResponse
                {
                    Mensagem = ex.Message
                };

                return BadRequest(erroResponse);
            }
        }

        [HttpGet("curso/{cursoId}/alunos")]
        public async Task<IActionResult> ObterAlunosDoCurso([FromRoute] long cursoId)
        {
            try
            {
                var alunos = await _alunoCursoRepository.ObterAlunosAtivosParaCurso(cursoId);
                return Ok(alunos);
            }
            catch (Exception ex)
            {
                var erroResponse = new ErroResponse
                {
                    Mensagem = ex.Message
                };

                return BadRequest(erroResponse);
            }
        }

        [HttpGet("aluno/{alunoId}/cursos")]
        public async Task<IActionResult> ObterCursosDoAluno([FromRoute] long alunoId)
        {
            try
            {
                var cursos = await _alunoCursoRepository.ObterCursosDoAluno(alunoId);
                return Ok(cursos);
            }
            catch (Exception ex)
            {
                var erroResponse = new ErroResponse
                {
                    Mensagem = ex.Message
                };

                return BadRequest(erroResponse);
            }
        }

        [HttpGet("verificar/{alunoId}/{cursoId}")]
        public async Task<IActionResult> VerificarVinculo([FromRoute] long alunoId, [FromRoute] long cursoId)
        {
            try
            {
                var existe = await _alunoCursoRepository.VinculoExiste(alunoId, cursoId);
                return Ok(new { vinculado = existe });
            }
            catch (Exception ex)
            {
                var erroResponse = new ErroResponse
                {
                    Mensagem = ex.Message
                };

                return BadRequest(erroResponse);
            }
        }


    }

    public class VincularAlunoCursoRequest
    {
        public long AlunoId { get; set; }
        public long CursoId { get; set; }
    }
}
