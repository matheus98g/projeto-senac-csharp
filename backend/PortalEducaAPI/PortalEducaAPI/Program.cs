using PortalEducaAPI.Domain.Repository;
using PortalEducaAPI.Domain.Service;
using PortalEducaAPI.Domain.Service.PortalEducaAPI.Domain.Service;
using PortalEducaAPI.Infra;
using PortalEducaAPI.Infra.DatabaseConfiguration;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddScoped<IDbConnectionFactory>(x =>
{
    return new DbConnectionFactory("Server=(localdb)\\MSSQLLocalDB; Database=PortalEduca; Trusted_Connection=True;");
});
// Add services to the container.
builder.Services.AddScoped<IAlunoService, AlunoService>(); // a cada nova requisicao, o proprio .net dá um new no CarroService
builder.Services.AddScoped<IAlunoRepository, AlunoRepository>(); // a cada nova requisicao, o proprio .net dá um new no CarroRepository

builder.Services.AddScoped<ICursoService, CursoService>(); // a cada nova requisicao, o proprio .net dá um new no CarroService
builder.Services.AddScoped<ICursoRepository, CursoRepository>(); // a cada nova requisicao, o proprio .net dá um new no CarroRepository


builder.Services.AddScoped<IProfessorService, ProfessorService>(); // a cada nova requisicao, o proprio .net dá um new no CarroService
builder.Services.AddScoped<IProfessorRepository, ProfessorRepository>(); // a cada nova requisicao, o proprio .net dá um new no CarroRepository


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())

{
    app.UseSwagger();
    app.UseSwaggerUI();


    app.UseHttpsRedirection();

    app.UseAuthorization();

    app.MapControllers();

    app.Run();


}