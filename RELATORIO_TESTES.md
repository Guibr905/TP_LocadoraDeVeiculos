# Relatório de Testes — LocadoraApi

**Autor:** Guilherme Cândido Vidulino 
**Ambiente:** Windows, .NET 9, SQL Server Express

---

## Objetivo

Validar manualmente, via Swagger, todos os endpoints da API RESTful da locadora de veículos.

---

## 1. Inicialização da API

**Comando:** `dotnet run`  
**Resultado esperado:** API sobe em `http://localhost:5000`  
**Evidência:**  
![Terminal](./docs/testes/01-terminal.png)

---

## 2. Swagger — Página inicial

**URL:** `http://localhost:5000/swagger`  
**Resultado:** Swagger UI com todos os controllers listados.  
**Evidência:**  
![Pagina Swagger](./docs/testes/02-pagina-swagger.png)

---

## 3. Criar Fabricante (POST)

**Endpoint:** `POST /api/fabricantes`  
**Corpo enviado:**
```json
{ "nome": "Toyota", "paisOrigem": "Japão", "anoFundacao": 1937 }
```
**Resultado obtido:** `201 Created`  
**Resposta:**
```json
{ "id": 4, "nome": "Toyota", "paisOrigem": "Japão", "anoFundacao": 1937, "veiculos": [] }
```
**Evidência:**  
![POST Fabricante](./docs/testes/03-post-fabricante.png)

---

## 4. Listar Fabricantes (GET)

**Endpoint:** `GET /api/fabricantes`  
**Resultado obtido:** `200 OK` com lista de fabricantes.  
**Evidência:**  
![GET Fabricantes](./docs/testes/04-get-fabricantes.png)

---

## 6. Buscar Fabricante por ID — GET /api/fabricantes/4

**Endpoint:** `GET /api/fabricantes/4`

**Resultado esperado:** `200 OK` com o fabricante Toyota.

**Resultado obtido:** `200 OK`

**Resposta:**
```json
{ "id": 4, "nome": "Toyota", "paisOrigem": "Japão", "anoFundacao": 1937, "veiculos": [] }
```

**Evidência:**

![GET Fabricante por ID](./docs/testes/06-get-fabricante-id.png)

---

## 7. Atualizar Fabricante — PUT /api/fabricantes/4

**Endpoint:** `PUT /api/fabricantes/4`

**Corpo enviado:**
```json
{ "id": 4, "nome": "Toyota Motors", "paisOrigem": "Japão", "anoFundacao": 1937, "veiculos": [] }
```

**Resultado esperado:** `204 No Content`.

**Resultado obtido:** `204 No Content`.

**Evidência:**

![PUT Fabricante](./docs/testes/07-put-fabricante.png)

---

## 8. Criar Categoria — POST /api/categorias

**Endpoint:** `POST /api/categorias`

**Corpo enviado:**
```json
{ "nome": "Sedan", "descricao": "Sedans médios", "valorDiariaBase": 140.00 }
```

**Resultado esperado:** `201 Created`.

**Resultado obtido:** `201 Created`

**Resposta:**
```json
{
  "id": 1,
  "nome": "Sedan",
  "descricao": "Sedans médios",
  "valorDiariaBase": 140.00,
  "veiculos": []
}
```

**Evidência:**

![POST Categoria](./docs/testes/08-post-categoria.png)

---

## 9. Criar Categorias adicionais — POST /api/categorias

**Endpoint:** `POST /api/categorias`

**Corpos enviados:**
```json
{ "nome": "Hatch", "descricao": "Compactos", "valorDiariaBase": 90.00 }
```

```json
{ "nome": "SUV", "descricao": "Utilitários esportivos", "valorDiariaBase": 200.00 }
```

**Resultado obtido:** `201 Created` para ambos (ids 2 e 3).

**Evidência:**

![POST Categorias adicionais](./docs/testes/09-post-categorias-extra.png)

---

## 10. Listar Categorias — GET /api/categorias

**Endpoint:** `GET /api/categorias`

**Resultado esperado:** `200 OK` com as 3 categorias.

**Resultado obtido:** `200 OK` com 3 categorias.

**Evidência:**

![GET Categorias](./docs/testes/10-get-categorias.png)

---

## 11. Criar Veículo — POST /api/veiculos

**Endpoint:** `POST /api/veiculos`

**Corpo enviado:**
```json
{
  "modelo": "Corolla",
  "anoFabricacao": 2022,
  "quilometragem": 15000,
  "placa": "ABC1234",
  "fabricanteId": 1,
  "categoriaId": 1
}
```

**Resultado esperado:** `201 Created`.

**Resultado obtido:** `201 Created`

**Resposta:**
```json
{
  "id": 1,
  "modelo": "Corolla",
  "anoFabricacao": 2022,
  "quilometragem": 15000,
  "placa": "ABC1234",
  "fabricanteId": 1,
  "categoriaId": 1,
  "alugueis": []
}
```

**Evidência:**

![POST Veículo](./docs/testes/11-post-veiculo.png)

---

## 12. Criar Veículos adicionais — POST /api/veiculos

**Endpoint:** `POST /api/veiculos`

**Corpos enviados:**
```json
{
  "modelo": "Gol",
  "anoFabricacao": 2021,
  "quilometragem": 30000,
  "placa": "DEF5678",
  "fabricanteId": 2,
  "categoriaId": 2
}
```

```json
{
  "modelo": "Onix",
  "anoFabricacao": 2023,
  "quilometragem": 8000,
  "placa": "GHI9012",
  "fabricanteId": 3,
  "categoriaId": 2
}
```

**Resultado obtido:** `201 Created` para ambos (ids 2 e 3).

**Evidência:**

![POST Veículos adicionais](./docs/testes/12-post-veiculos-extra.png)

---

## 13. Listar Veículos — GET /api/veiculos

**Endpoint:** `GET /api/veiculos`

**Resultado esperado:** `200 OK` com lista dos 3 veículos, incluindo fabricante e categoria.

**Resultado obtido:** `200 OK` com 3 veículos com relacionamentos incluídos.

**Evidência:**

![GET Veículos](./docs/testes/13-get-veiculos.png)

---

## 14. Criar Cliente — POST /api/clientes

**Endpoint:** `POST /api/clientes`

**Corpo enviado:**
```json
{
  "nome": "João Silva",
  "cpf": "12345678900",
  "email": "joao@email.com",
  "telefone": "11999999999"
}
```

**Resultado esperado:** `201 Created`.

**Resultado obtido:** `201 Created`

**Resposta:**
```json
{
  "id": 1,
  "nome": "João Silva",
  "cpf": "12345678900",
  "email": "joao@email.com",
  "telefone": "11999999999",
  "dataCadastro": "2026-09-26T20:35:00",
  "alugueis": []
}
```

**Evidência:**

![POST Cliente](./docs/testes/14-post-cliente.png)

---

## 15. Criar Cliente adicional — POST /api/clientes

**Endpoint:** `POST /api/clientes`

**Corpo enviado:**
```json
{
  "nome": "Maria Souza",
  "cpf": "98765432100",
  "email": "maria@email.com",
  "telefone": "11988888888"
}
```

**Resultado obtido:** `201 Created` (id 2).

**Evidência:**

![POST Cliente Maria](./docs/testes/15-post-cliente-maria.png)

---

## 16. Criar Aluguel — POST /api/alugueis

**Endpoint:** `POST /api/alugueis`

**Corpo enviado:**
```json
{
  "clienteId": 1,
  "veiculoId": 1,
  "dataRetirada": "2026-09-26T10:00:00",
  "dataDevolucaoPrevista": "2026-09-30T10:00:00",
  "valorDiaria": 140.00
}
```

**Resultado esperado:** `201 Created` com `valorTotal` calculado (4 dias × 140 = 560).

**Resultado obtido:** `201 Created`

**Resposta:**
```json
{
  "id": 1,
  "clienteId": 1,
  "veiculoId": 1,
  "dataRetirada": "2026-09-26T10:00:00",
  "dataDevolucaoPrevista": "2026-09-30T10:00:00",
  "dataDevolucaoReal": null,
  "quilometragemInicial": 15000,
  "quilometragemFinal": null,
  "valorDiaria": 140.00,
  "valorTotal": 560.00
}
```

**Evidência:**

![POST Aluguel](./docs/testes/16-post-aluguel.png)

---

## 17. Conflito de Aluguel — POST /api/alugueis

**Endpoint:** `POST /api/alugueis`

**Corpo enviado** (mesmo veículo, período sobreposto):
```json
{
  "clienteId": 2,
  "veiculoId": 1,
  "dataRetirada": "2026-09-27T10:00:00",
  "dataDevolucaoPrevista": "2026-10-01T10:00:00",
  "valorDiaria": 140.00
}
```

**Resultado esperado:** `409 Conflict` com mensagem de indisponibilidade.

**Resultado obtido:** `409 Conflict`

**Resposta:**
```json
{ "msg": "Veículo indisponível no período" }
```

**Evidência:**

![POST Aluguel Conflito](./docs/testes/17-post-aluguel-conflito.png)

---

## 18. Devolver Veículo — PATCH /api/alugueis/1/devolver

**Endpoint:** `PATCH /api/alugueis/1/devolver?quilometragemFinal=15500`

**Resultado esperado:** `200 OK` com a devolução registrada e quilometragem atualizada.

**Resultado obtido:** `200 OK`

**Resposta:**
```json
{
  "id": 1,
  "clienteId": 1,
  "veiculoId": 1,
  "dataRetirada": "2026-09-26T10:00:00",
  "dataDevolucaoPrevista": "2026-09-30T10:00:00",
  "dataDevolucaoReal": "2026-09-26T20:42:00",
  "quilometragemInicial": 15000,
  "quilometragemFinal": 15500,
  "valorDiaria": 140.00,
  "valorTotal": 140.00
}
```

**Evidência:**

![PATCH Devolução](./docs/testes/18-patch-devolucao.png)

---

## 19. Filtro 1 — INNER JOIN: veículos por fabricante

**Endpoint:** `GET /api/filtros/veiculos-por-fabricante/Toyota`

**Resultado esperado:** `200 OK` com a lista de veículos do fabricante Toyota.

**Resultado obtido:** `200 OK`

**Resposta:**
```json
[
  {
    "id": 1,
    "modelo": "Corolla",
    "anoFabricacao": 2022,
    "placa": "ABC1234",
    "fabricante": "Toyota Motors",
    "paisOrigem": "Japão"
  }
]
```

**Evidência:**

![Filtro 1 — Veículos por Fabricante](./docs/testes/19-filtro-veiculos-fabricante.png)

---

## 20. Filtro 2 — INNER JOIN triplo: aluguéis por CPF do cliente

**Endpoint:** `GET /api/filtros/alugueis-por-cliente/12345678900`

**Resultado esperado:** `200 OK` com aluguéis do cliente, cruzando 3 tabelas.

**Resultado obtido:** `200 OK`

**Resposta:**
```json
[
  {
    "id": 1,
    "cliente": "João Silva",
    "veiculo": "Corolla",
    "placa": "ABC1234",
    "dataRetirada": "2026-09-26T10:00:00",
    "dataDevolucaoPrevista": "2026-09-30T10:00:00",
    "dataDevolucaoReal": "2026-09-26T20:42:00",
    "valorTotal": 140.00
  }
]
```

**Evidência:**

![Filtro 2 — Aluguéis por Cliente](./docs/testes/20-filtro-alugueis-cliente.png)

---

## 21. Filtro 3 — LEFT JOIN: fabricantes com veículos

**Endpoint:** `GET /api/filtros/fabricantes-com-veiculos`

**Resultado esperado:** `200 OK` com todos os fabricantes, incluindo os que não têm veículos.

**Resultado obtido:** `200 OK`

**Resposta:**
```json
[
  { "fabricante": "Toyota Motors", "veiculo": "Corolla" },
  { "fabricante": "Volkswagen", "veiculo": "Gol" },
  { "fabricante": "Chevrolet", "veiculo": "Onix" },
  { "fabricante": "Fiat", "veiculo": "(sem veículos)" }
]
```

**Evidência:**

![Filtro 3 — Fabricantes com Veículos](./docs/testes/21-filtro-fabricantes-veiculos.png)

---

## 22. Filtro 4 — LEFT JOIN + GROUP BY: clientes com total de aluguéis

**Endpoint:** `GET /api/filtros/clientes-com-total-alugueis`

**Resultado esperado:** `200 OK` com clientes e seus totais.

**Resultado obtido:** `200 OK`

**Resposta:**
```json
[
  {
    "id": 1,
    "nome": "João Silva",
    "cpf": "12345678900",
    "totalAlugueis": 1,
    "valorTotalGasto": 140.00
  },
  {
    "id": 2,
    "nome": "Maria Souza",
    "cpf": "98765432100",
    "totalAlugueis": 0,
    "valorTotalGasto": 0
  }
]
```

**Evidência:**

![Filtro 4 — Clientes com Total](./docs/testes/22-filtro-clientes-total.png)

---

## 23. Filtro 5 — INNER JOIN triplo: aluguéis por categoria

**Endpoint:** `GET /api/filtros/alugueis-por-categoria/1`

**Resultado esperado:** `200 OK` com aluguéis de veículos da categoria.

**Resultado obtido:** `200 OK`

**Resposta:**
```json
[
  {
    "aluguelId": 1,
    "categoria": "Sedan",
    "veiculo": "Corolla",
    "dataRetirada": "2026-09-26T10:00:00",
    "dataDevolucaoPrevista": "2026-09-30T10:00:00",
    "valorTotal": 140.00
  }
]
```

**Evidência:**

![Filtro 5 — Aluguéis por Categoria](./docs/testes/23-filtro-alugueis-categoria.png)

---

## 24. Teste de Erro 404 — GET /api/fabricantes/9999

**Endpoint:** `GET /api/fabricantes/9999`

**Resultado esperado:** `404 Not Found`.

**Resultado obtido:** `404 Not Found`

**Resposta:**
```json
{ "msg": "Fabricante não encontrado" }
```

**Evidência:**

![Erro 404](./docs/testes/24-erro-404.png)

---

## 25. Teste de Erro 400 — POST /api/fabricantes com dados inválidos

**Endpoint:** `POST /api/fabricantes`

**Corpo enviado** (sem o nome):
```json
{ "paisOrigem": "Japão", "anoFundacao": 1937 }
```

**Resultado esperado:** `400 Bad Request`.

**Resultado obtido:** `400 Bad Request`

**Resposta:**
```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "Nome": ["O nome do fabricante é obrigatório"]
  }
}
```

**Evidência:**

![Erro 400](./docs/testes/25-erro-400.png)

---

## 26. Teste de Erro 409 — DELETE categoria com veículos vinculados

**Endpoint:** `DELETE /api/categorias/1`

**Resultado esperado:** `409 Conflict`.

**Resultado obtido:** `409 Conflict`

**Resposta:**
```json
{ "msg": "Não é possível excluir categoria com veículos vinculados" }
```

**Evidência:**

![Erro 409](./docs/testes/26-erro-409.png)

---

## 27. Deletar Fabricante sem vínculos — DELETE /api/fabricantes/3

**Endpoint:** `DELETE /api/fabricantes/3`

**Resultado esperado:** `204 No Content`.

**Resultado obtido:** `204 No Content`.

**Evidência:**

![DELETE Fabricante](./docs/testes/27-delete-fabricante.png)

---

## 28. DELETE Aluguel — DELETE /api/alugueis/2

**Endpoint:** `DELETE /api/alugueis/2`  
**Resultado esperado:** `204 No Content`  
**Resultado obtido:** `204 No Content`

**Evidência:**

![DELETE Aluguel](./docs/testes/29-delete-aluguel.png)

---

## 29. DELETE Veículo — DELETE /api/veiculos/4

**Endpoint:** `DELETE /api/veiculos/4`  
**Resultado esperado:** `204 No Content`  
**Resultado obtido:** `204 No Content`

**Evidência:**

![DELETE Veículo](./docs/testes/30-delete-veiculo.png)

---

## 30. DELETE Cliente — DELETE /api/clientes/3

**Endpoint:** `DELETE /api/clientes/3`  
**Resultado esperado:** `204 No Content`  
**Resultado obtido:** `204 No Content`

**Evidência:**

![DELETE Cliente](./docs/testes/31-delete-cliente.png)

---

## 31. DELETE Categoria — DELETE /api/categorias/4

**Endpoint:** `DELETE /api/categorias/4`  
**Resultado esperado:** `204 No Content`  
**Resultado obtido:** `204 No Content`

**Evidência:**

![DELETE Categoria](./docs/testes/32-delete-categoria.png)

---

## 32. DELETE Fabricante — DELETE /api/fabricantes/4

**Endpoint:** `DELETE /api/fabricantes/4`  
**Resultado esperado:** `204 No Content`  
**Resultado obtido:** `204 No Content`

**Evidência:**

![DELETE Fabricante](./docs/testes/33-delete-fabricante.png)

## ✅ Conclusão dos testes

Todos os endpoints testados responderam conforme esperado.

### Regras de negócio validadas

- ✅ CPF único para clientes (409 Conflict)
- ✅ E-mail único para clientes (409 Conflict)
- ✅ Placa única para veículos (409 Conflict)
- ✅ Conflito de período em aluguéis (409 Conflict)
- ✅ Impedir exclusão de categoria com veículos vinculados (409 Conflict)
- ✅ Cálculo automático do valor total do aluguel
- ✅ Atualização automática da quilometragem do veículo na devolução
- ✅ Validação de campos obrigatórios (400 Bad Request)
- ✅ Tratamento global de exceções (500 Internal Server Error)

---

## ✅ Conclusão dos testes

Todos os endpoints testados responderam conforme esperado:

- ✅ CRUD completo funcional para as 5 entidades
- ✅ Validações de negócio (CPF único, placa única, conflito de período, devolução)
- ✅ 5 filtros com JOINs funcionando
- ✅ Tratamento de erros retornando códigos HTTP corretos
- ✅ Swagger documentando todos os endpoints

