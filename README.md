# TP_LocadoraDeVeiculos

API para gerenciamento de uma **locadora de veículos**, desenvolvida em **ASP.NET Core** com **Entity Framework Core** e **SQL Server Express**.

Trabalho referente à disciplina de **Tecnologias para Análise e Desenvolvimento de Sistemas** — **4º Período de Análise e Desenvolvimento de Sistemas**.

---

## Autor

- **Nome:** Guilherme Cândido Vidulino
- **Matrícula:** 896587
- **Código de pessoa:** 1600386

---

## Tecnologias utilizadas

| Tecnologia | Versão |
|-----------|--------|
| .NET | 8.0 |
| ASP.NET Core Web API | 8.0 |
| Entity Framework Core | 8.0 |
| SQL Server Express | 2022 |
| Swashbuckle (Swagger) | 6.5.0 |

---

## Entidades do sistema

O sistema possui **5 entidades**:

| Entidade | Descrição |
|----------|-----------|
| **Fabricante** | Marca dos veículos (Toyota, Volkswagen, etc.) |
| **Categoria** | Classificação do veículo (Hatch, Sedan, SUV) |
| **Veículo** | Veículo da frota, vinculado a um fabricante e uma categoria |
| **Cliente** | Cliente que aluga o veículo |
| **Aluguel** | Registro de locação, vinculando cliente + veículo em um período |

---

## Como rodar o projeto

### Pré-requisitos

- [.NET SDK 8.0+](https://dotnet.microsoft.com/download/dotnet/8.0)
- [SQL Server Express](https://www.microsoft.com/sql-server/sql-server-downloads)
- [Ferramenta `dotnet-ef`](https://learn.microsoft.com/ef/core/cli/dotnet)
- [Visual Studio Code](https://code.visualstudio.com/) (opcional)
- [SQL Server Management Studio](https://learn.microsoft.com/sql/ssms/) (opcional, para visualizar o banco)

### 1. Instalar a ferramenta do EF Core (uma vez só)

```bash
dotnet tool install --global dotnet-ef
```

> Se já tiver instalada e quiser atualizar:
> ```bash
> dotnet tool update --global dotnet-ef
> ```

### 2. Clonar o repositório

```bash
git clone https://github.com/[SEU-USUARIO]/[NOME-REPO].git
cd [NOME-REPO]/LocadoraApi
```

### 3. Configurar a connection string

Abra o arquivo `appsettings.json` e ajuste o **nome do seu servidor SQL Server Express**:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=SEU-PC\\SQLEXPRESS;Database=LocadoraDb;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

> **Importante:** troque `SEU-PC` pelo nome da sua máquina.  
> No SSMS, geralmente é algo como `DESKTOP-XXXXX\SQLEXPRESS`.

### 4. Restaurar dependências

```bash
dotnet restore
```

### 5. Aplicar as migrations (cria o banco de dados)

```bash
dotnet ef database update
```

Isso vai criar automaticamente o banco `LocadoraDb` com as 5 tabelas + tabela de histórico do EF.

### 6. Rodar a API

```bash
dotnet run
```

A API vai subir em:

```
http://localhost:5000
```

### 7. Abrir o Swagger

No navegador:

```
http://localhost:5000/swagger
```

## Como testar

**OBS:** Os exemplos de testes abaixo foram os mesmos realizados durante a confecção do projeto.

### 1. Cadastrar fabricantes

`POST /api/fabricantes`

```json
{ "nome": "Toyota", "paisOrigem": "Japão", "anoFundacao": 1937 }
```

```json
{ "nome": "Volkswagen", "paisOrigem": "Alemanha", "anoFundacao": 1937 }
```

```json
{ "nome": "Chevrolet", "paisOrigem": "EUA", "anoFundacao": 1911 }
```

### 2. Cadastrar categorias

`POST /api/categorias`

```json
{ "nome": "Hatch", "descricao": "Compactos", "valorDiariaBase": 90.00 }
```

```json
{ "nome": "Sedan", "descricao": "Sedans médios", "valorDiariaBase": 140.00 }
```

```json
{ "nome": "SUV", "descricao": "Utilitários esportivos", "valorDiariaBase": 200.00 }
```

### 3. Cadastrar veículos

`POST /api/veiculos`

```json
{
  "modelo": "Corolla",
  "anoFabricacao": 2022,
  "quilometragem": 15000,
  "placa": "ABC1234",
  "fabricanteId": 1,
  "categoriaId": 2
}
```

```json
{
  "modelo": "Gol",
  "anoFabricacao": 2021,
  "quilometragem": 30000,
  "placa": "DEF5678",
  "fabricanteId": 2,
  "categoriaId": 1
}
```

> Ajuste `fabricanteId` e `categoriaId` conforme os IDs gerados.

### 4. Cadastrar clientes

`POST /api/clientes`

```json
{ "nome": "João Silva", "cpf": "12345678900", "email": "joao@email.com", "telefone": "11999999999" }
```

```json
{ "nome": "Maria Souza", "cpf": "98765432100", "email": "maria@email.com", "telefone": "11988888888" }
```

### 5. Criar um aluguel

`POST /api/alugueis`

```json
{
  "clienteId": 1,
  "veiculoId": 1,
  "dataRetirada": "2026-09-26T10:00:00",
  "dataDevolucaoPrevista": "2026-09-30T10:00:00",
  "valorDiaria": 140.00
}
```

### 6. Devolver o veículo

`PATCH /api/alugueis/1/devolver?quilometragemFinal=15500`

### 7. Testar os filtros

```
GET /api/filtros/veiculos-por-fabricante/Toyota
GET /api/filtros/alugueis-por-cliente/12345678900
GET /api/filtros/fabricantes-com-veiculos
GET /api/filtros/clientes-com-total-alugueis
GET /api/filtros/alugueis-por-categoria/2
```

---

## Estrutura do projeto

```
LocadoraApi/
├── Controllers/           
│   ├── FabricantesController.cs
│   ├── CategoriasController.cs
│   ├── VeiculosController.cs
│   ├── ClientesController.cs
│   ├── AlugueisController.cs
│   └── FiltrosController.cs
│
├── Models/                 
│   ├── Fabricante.cs
│   ├── Categoria.cs
│   ├── Veiculo.cs
│   ├── Cliente.cs
│   └── Aluguel.cs
│
├── DTOs/                  
│   ├── AluguelCreateDto.cs
│   ├── ClienteCreateDto.cs
│   └── DevolucaoDto.cs
│
├── Data/                  
│   └── ApplicationContext.cs
│
├── Middleware/            
│   └── ExceptionMiddleware.cs
│
├── Migrations/            
│
├── Properties/
│   └── launchSettings.json
│
├── Program.cs
├── appsettings.json
└── LocadoraApi.csproj
```

---

## Exemplos de teste no SSMS

Para conferir os dados no banco:

```sql
USE LocadoraDb;

SELECT * FROM Fabricantes;
SELECT * FROM Categorias;
SELECT * FROM Veiculos;
SELECT * FROM Clientes;
SELECT * FROM Alugueis;
```

Ou uma consulta com JOIN para ver aluguéis completos:

```sql
SELECT 
    a.Id AS AluguelId,
    c.Nome AS Cliente,
    v.Modelo AS Veiculo,
    v.Placa,
    a.DataRetirada,
    a.DataDevolucaoPrevista,
    a.DataDevolucaoReal,
    a.ValorTotal
FROM Alugueis a
INNER JOIN Clientes c ON a.ClienteId = c.Id
INNER JOIN Veiculos v ON a.VeiculoId = v.Id;
```

---

## Repositório

- **GitHub:** https://github.com/[SEU-USUARIO]/[NOME-REPO]

---
