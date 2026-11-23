# Sistema de Gestão de Locadora

Aplicação web para gerenciamento de uma locadora de veículos, desenvolvida como segunda etapa do trabalho. O front-end foi integrado à API ASP.NET Core e ao banco SQL Server da primeira etapa.

## Funcionalidades implementadas

- Painel inicial com total de veículos, clientes, aluguéis ativos e receita registrada.
- Cadastro, consulta, edição e exclusão de **Fabricantes, Categorias, Veículos, Clientes e Aluguéis**.
- Filtros combináveis por pelo menos dois campos em cada entidade.
- Seleção de fabricante/categoria no cadastro de veículos e de cliente/veículo no cadastro de aluguel.
- Registro de devolução de veículo com quilometragem final.
- Consultas personalizadas que consomem os endpoints de `FiltrosController`.
- Interface responsiva em HTML, CSS e JavaScript, sem dados mocados nas telas: as informações são obtidas da API.
- Wireframes de baixa fidelidade em `LocadoraApi/wwwroot/wireframes.html`.

## Tecnologias

- HTML5, CSS3 e JavaScript (Fetch API)
- ASP.NET Core Web API / .NET 9
- Entity Framework Core 9
- SQL Server Express

## Estrutura relevante

```text
TP_LocadoraDeVeiculos/
├── LocadoraApi/
│   ├── Controllers/
│   ├── Data/
│   ├── DTOs/
│   ├── Migrations/
│   ├── Models/
│   ├── wwwroot/
│   │   ├── index.html
│   │   ├── wireframes.html
│   │   └── assets/
│   │       ├── app.js
│   │       └── styles.css
│   ├── appsettings.json
│   ├── Program.cs
│   └── LocadoraApi.csproj
├── dados-exemplo.sql
├── docs/
│   └── relatorio.tex
└── README.md
```

## Pré-requisitos

- .NET SDK 9.0 (o arquivo `.csproj` desta versão da API utiliza `net9.0`).
- SQL Server (Express ou outra edição compatível).
- SQL Server Management Studio (opcional, recomendado para administrar o banco).

## 1. Configurar a conexão com o SQL Server

Abra `LocadoraApi/appsettings.json` e ajuste a connection string para a instância disponível no computador. Exemplo para uma instância SQL Server Express com autenticação do Windows:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=LocadoraDb;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

Se a instância for padrão, use `Server=localhost` (sem `\\SQLEXPRESS`). Se o nome do servidor ou da instância for diferente, substitua pelo endereço correto. A connection string que veio no projeto original apontava para a máquina de desenvolvimento; por isso, ela deve ser adaptada no computador de execução.

## 2. Criar o banco e aplicar as migrations

Abra um terminal na pasta `LocadoraApi` e execute:

```bash
dotnet restore
dotnet tool install --global dotnet-ef
dotnet ef database update
```

O Entity Framework Core cria o banco `LocadoraDb` e as tabelas a partir das migrations existentes no projeto.

## 3. Inserir dados fictícios para demonstração

Depois de aplicar as migrations, abra `dados-exemplo.sql` no SSMS e execute o script. Ele insere exemplos de fabricantes, categorias, clientes, veículos e um aluguel histórico. Os registros são fictícios e o script verifica a existência de alguns dados para evitar duplicações.

A aplicação também pode ser utilizada com o banco vazio, cadastrando os registros pela interface. Para cadastrar um veículo, primeiro cadastre ao menos um fabricante e uma categoria. Para cadastrar um aluguel, primeiro cadastre um cliente e um veículo.

## 4. Executar a aplicação

Na pasta `LocadoraApi`, execute:

```bash
dotnet run
```

A configuração de desenvolvimento do projeto utiliza `http://localhost:5000`. Abra no navegador:

- **Sistema:** http://localhost:5000
- **Swagger:** http://localhost:5000/swagger
- **Wireframes:** http://localhost:5000/wireframes.html

O front-end é servido pela própria aplicação ASP.NET Core, na pasta `wwwroot`. Assim, as chamadas `fetch()` usam a mesma origem da API e não exigem configuração adicional de CORS.

## 5. Rotas da API consumidas pelo front-end

| Entidade / consulta | Rotas |
|---|---|
| Fabricantes | `GET/POST /api/fabricantes`, `GET/PUT/DELETE /api/fabricantes/{id}` |
| Categorias | `GET/POST /api/categorias`, `GET/PUT/DELETE /api/categorias/{id}` |
| Veículos | `GET/POST /api/veiculos`, `GET/PUT/DELETE /api/veiculos/{id}` |
| Clientes | `GET/POST /api/clientes`, `GET/PUT/DELETE /api/clientes/{id}` |
| Aluguéis | `GET/POST /api/alugueis`, `PUT/DELETE /api/alugueis/{id}`, `PATCH /api/alugueis/{id}/devolver` |
| Consultas | `GET /api/filtros/veiculos-por-fabricante/{nome}`; `GET /api/filtros/alugueis-por-cliente/{cpf}`; `GET /api/filtros/fabricantes-com-veiculos`; `GET /api/filtros/clientes-com-total-alugueis`; `GET /api/filtros/alugueis-por-categoria/{categoriaId}` |

Os filtros simples das listagens combinam os dados retornados pelos endpoints GET. A área **Consultas e relatórios** executa diretamente as rotas de consultas personalizadas já implementadas no back-end.

## 6. Wireframes

Os wireframes e protótipos das interfaces do sistema foram
desenvolvidos no Figma.

**Link:** [Wireframes](https://www.figma.com/make/j5QftyS0B4UnVa39n6uhNr/Wireframes-para-Locadora-de-Ve%C3%ADculos?p=f&t=teGK1wRKfAhTtPXl-0&fullscreen=1)
