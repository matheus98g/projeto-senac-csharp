# Dockerfile de desenvolvimento para .NET 8

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5000

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copia os arquivos de projeto e restaura as dependências
COPY *.csproj ./
RUN dotnet restore

# Copia o restante do código
COPY . ./

# Build em modo Development (sem publicação)
FROM build AS dev
WORKDIR /src
ENV ASPNETCORE_ENVIRONMENT=Development

# Comando padrão para rodar a aplicação em hot reload
CMD [ "dotnet", "watch", "run", "--urls", "http://0.0.0.0:5000" ]