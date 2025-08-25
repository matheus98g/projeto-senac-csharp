using PortalEducaAPI.Domain.Repository;
using PortalEducaAPI.Domain.Service;
using PortalEducaAPI.Domain.Service.PortalEducaAPI.Domain.Service;
using PortalEducaAPI.Infra;
using PortalEducaAPI.Infra.DatabaseConfiguration;

var builder = WebApplication.CreateBuilder(args);

// Configuração da conexão com banco de dados
builder.Services.AddScoped<IDbConnectionFactory>(x =>
{
    return new DbConnectionFactory("Host=localhost;Port=5432;Database=portaleduca;Username=portaleduca;Password=portaleduca");
});

// Injeção de dependência - Services
builder.Services.AddScoped<IAlunoService, AlunoService>();
builder.Services.AddScoped<ICursoService, CursoService>();
builder.Services.AddScoped<IProfessorService, ProfessorService>();

// Injeção de dependência - Repositories
builder.Services.AddScoped<IAlunoRepository, AlunoRepository>();
builder.Services.AddScoped<ICursoRepository, CursoRepository>();
builder.Services.AddScoped<IProfessorRepository, ProfessorRepository>();

// Configuração de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:3001") // URLs do frontend Next.js
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

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
}

// Usar CORS antes de outras configurações
app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();