# Documentação da API — LocadoraApi

Documentação completa dos endpoints da API, com métodos HTTP, parâmetros e códigos de resposta.

**Base URL:** `http://localhost:5000`

---

## Sumário

1. [Fabricantes](#fabricantes)
2. [Categorias](#categorias)
3. [Veículos](#veículos)
4. [Clientes](#clientes)
5. [Aluguéis](#aluguéis)
6. [Filtros](#filtros)
7. [Códigos de resposta padrão](#códigos-de-resposta-padrão)

---

## Fabricantes

### `GET /api/fabricantes`
Lista todos os fabricantes.

- **Parâmetros:** nenhum
- **Respostas:**
  - `200 OK` — lista de fabricantes

**Exemplo de resposta:**
```json
[
  { "id": 1, "nome": "Toyota", "paisOrigem": "Japão", "anoFundacao": 1937 }
]
```

---

### `GET /api/fabricantes/{id}`
Busca um fabricante por ID.

- **Parâmetros:** `id` (int, path)
- **Respostas:**
  - `200 OK` — fabricante encontrado
  - `404 Not Found` — não existe

---

### `POST /api/fabricantes`
Cadastra um novo fabricante.

- **Corpo da requisição:**
```json
{ "nome": "Toyota", "paisOrigem": "Japão", "anoFundacao": 1937 }
```
- **Respostas:**
  - `201 Created` — criado com sucesso
  - `400 Bad Request` — dados inválidos

---

### `PUT /api/fabricantes/{id}`
Atualiza um fabricante.

- **Parâmetros:** `id` (int, path)
- **Corpo:** objeto Fabricante completo
- **Respostas:**
  - `204 No Content` — atualizado
  - `400 Bad Request` — dados inválidos
  - `404 Not Found` — não existe

---

### `DELETE /api/fabricantes/{id}`
Remove um fabricante.

- **Parâmetros:** `id` (int, path)
- **Respostas:**
  - `204 No Content` — removido
  - `404 Not Found` — não existe

---

## Categorias

*(Mesma estrutura dos fabricantes, com `nome`, `descricao`, `valorDiariaBase`.)*

### `GET /api/categorias`
### `GET /api/categorias/{id}`
### `POST /api/categorias`
### `PUT /api/categorias/{id}`
### `DELETE /api/categorias/{id}`

**Observação:** `DELETE` retorna `409 Conflict` se houver veículos vinculados à categoria.

---

## Veículos

### `GET /api/veiculos`
Lista todos os veículos (com fabricante e categoria incluídos).

### `GET /api/veiculos/{id}`
Busca veículo por ID (com fabricante e categoria).

### `POST /api/veiculos`
Cria um veículo.

- **Corpo:**
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
- **Respostas:**
  - `201 Created`
  - `400 Bad Request`
  - `409 Conflict` — placa duplicada

### `PUT /api/veiculos/{id}`
### `DELETE /api/veiculos/{id}`

---

## Clientes

### `GET /api/clientes`
### `GET /api/clientes/{id}`

### `POST /api/clientes`
Cadastra cliente.

- **Corpo:**
```json
{
  "nome": "João Silva",
  "cpf": "12345678900",
  "email": "joao@email.com",
  "telefone": "11999999999"
}
```
- **Respostas:**
  - `201 Created`
  - `400 Bad Request`
  - `409 Conflict` — CPF ou e-mail duplicado

### `PUT /api/clientes/{id}`
### `DELETE /api/clientes/{id}`

---

## Aluguéis

### `GET /api/alugueis`
Lista todos os aluguéis.

### `POST /api/alugueis`
Cria um aluguel.

- **Corpo:**
```json
{
  "clienteId": 1,
  "veiculoId": 1,
  "dataRetirada": "2026-09-26T10:00:00",
  "dataDevolucaoPrevista": "2026-09-30T10:00:00",
  "valorDiaria": 140.00
}
```
- **Respostas:**
  - `201 Created` — aluguel criado (calcula `valorTotal`)
  - `400 Bad Request` — data inválida
  - `404 Not Found` — cliente ou veículo não existe
  - `409 Conflict` — veículo indisponível no período

### `PATCH /api/alugueis/{id}/devolver`
Registra a devolução do veículo.

- **Parâmetros:**
  - `id` (int, path)
  - `quilometragemFinal` (int, query)
- **Respostas:**
  - `200 OK` — devolução registrada
  - `400 Bad Request` — já devolvido ou km inválida
  - `404 Not Found` — aluguel não existe

### `PUT /api/alugueis/{id}`
### `DELETE /api/alugueis/{id}`

---

## Filtros

### `GET /api/filtros/veiculos-por-fabricante/{nome}`
**JOIN:** INNER

Lista veículos de um fabricante pelo nome (busca parcial).

- **Exemplo:** `/api/filtros/veiculos-por-fabricante/Toyota`

### `GET /api/filtros/alugueis-por-cliente/{cpf}`
**JOIN:** INNER (3 tabelas — Aluguel + Cliente + Veículo)

Lista aluguéis de um cliente pelo CPF.

### `GET /api/filtros/fabricantes-com-veiculos`
**JOIN:** LEFT

Lista fabricantes, mostrando "(sem veículos)" quando não há.

### `GET /api/filtros/clientes-com-total-alugueis`
**JOIN:** LEFT + GROUP BY

Lista clientes com contagem e soma total dos aluguéis.

### `GET /api/filtros/alugueis-por-categoria/{categoriaId}`
**JOIN:** INNER (3 tabelas — Aluguel + Veículo + Categoria)

Lista aluguéis de veículos de uma categoria.

---

## Códigos de resposta padrão

| Código | Significado |
|--------|-------------|
| `200 OK` | Requisição bem-sucedida (GET/PATCH) |
| `201 Created` | Recurso criado com sucesso (POST) |
| `204 No Content` | Sucesso sem corpo (PUT/DELETE) |
| `400 Bad Request` | Dados inválidos na requisição |
| `404 Not Found` | Recurso não encontrado |
| `409 Conflict` | Conflito de regra de negócio (duplicidade, indisponibilidade) |
| `500 Internal Server Error` | Erro interno (tratado pelo ExceptionMiddleware) |

---

## Formato de erro padronizado

Todas as exceções são capturadas pelo `ExceptionMiddleware` e retornadas da seguinte forma:

```json
{
  "status": 500,
  "error": "Erro na requisição",
  "detail": "Mensagem específica do erro",
  "path": "/api/alugueis",
  "timestamp": "2026-09-26T20:42:48.114Z"
}
```
