using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using PortalEducaAPI.Domain.Dtos;
using PortalEducaAPI.Domain.Dtos.Request.Curso;
using PortalEducaAPI.Domain.Dtos.Request.Professor;
using PortalEducaAPI.Domain.Service;

namespace PortalEducaAPI.Controllers
{
    

        [ApiController]
        [Route("Professor")]
        public class ProfessorController : Controller
        {
            private readonly IProfessorService _ProfessorService;

            public ProfessorController(IProfessorService ProfessorService)
            {
                _ProfessorService = ProfessorService;
            }

            [HttpGet]
            public async Task<IActionResult> ObterTodos()
            {
                var CursoResponse = await _ProfessorService.ObterTodos();

                return Ok(CursoResponse);
            }

            [HttpGet("{id}")]
            public async Task<IActionResult> ObterDetalhadoPorId([FromRoute] long id)
            {
                try
                {
                    var CursoDetalhadoResponse = await _ProfessorService.ObterDetalhadoPorId(id);

                    return Ok(CursoDetalhadoResponse);
                }
                catch (Exception ex)
                {
                    var erroResponse = new ErroResponse
                    {
                        Mensagem = ex.Message
                    };

                    return NotFound(erroResponse);
                }
            }

            [HttpPost]
            public async Task<IActionResult> Cadastrar([FromBody] CadastrarProfessorRequest cadastrarRequest)
            {
                try
                {
                    var cadastrarResponse = await _ProfessorService.Cadastrar(cadastrarRequest);

                    return Ok(cadastrarResponse);
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

            [HttpDelete("{id}")]
            public async Task<IActionResult> DeletarPorId([FromRoute] long id)
            {
                try
                {
                    await _ProfessorService.DeletarPorId(id);

                    return Ok();
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
            [HttpPut("{id}")]
            public async Task<IActionResult> EditarPorID([FromRoute] long id, [FromBody] AtualizarProfessorRequest adicionarRequest)
            {
                try
                {
                    await _ProfessorService.AtualizarPorId(id, adicionarRequest);
                    return Ok();
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
    }



