USE LocadoraDb;
GO

IF NOT EXISTS (SELECT 1 FROM Fabricantes WHERE Nome = 'Toyota')
    INSERT INTO Fabricantes (Nome, PaisOrigem, AnoFundacao) VALUES ('Toyota', 'Japão', 1937);
IF NOT EXISTS (SELECT 1 FROM Fabricantes WHERE Nome = 'Volkswagen')
    INSERT INTO Fabricantes (Nome, PaisOrigem, AnoFundacao) VALUES ('Volkswagen', 'Alemanha', 1937);
IF NOT EXISTS (SELECT 1 FROM Fabricantes WHERE Nome = 'Chevrolet')
    INSERT INTO Fabricantes (Nome, PaisOrigem, AnoFundacao) VALUES ('Chevrolet', 'Estados Unidos', 1911);
GO

IF NOT EXISTS (SELECT 1 FROM Categorias WHERE Nome = 'Hatch')
    INSERT INTO Categorias (Nome, Descricao, ValorDiariaBase) VALUES ('Hatch', 'Veículos compactos para uso urbano', 90.00);
IF NOT EXISTS (SELECT 1 FROM Categorias WHERE Nome = 'Sedan')
    INSERT INTO Categorias (Nome, Descricao, ValorDiariaBase) VALUES ('Sedan', 'Veículos com porta-malas separado', 140.00);
IF NOT EXISTS (SELECT 1 FROM Categorias WHERE Nome = 'SUV')
    INSERT INTO Categorias (Nome, Descricao, ValorDiariaBase) VALUES ('SUV', 'Utilitários esportivos', 200.00);
GO

IF NOT EXISTS (SELECT 1 FROM Clientes WHERE CPF = '12345678900')
    INSERT INTO Clientes (Nome, CPF, Email, Telefone, DataCadastro) VALUES ('João Silva', '12345678900', 'joao.silva@email.com', '11999990001', GETDATE());
IF NOT EXISTS (SELECT 1 FROM Clientes WHERE CPF = '98765432100')
    INSERT INTO Clientes (Nome, CPF, Email, Telefone, DataCadastro) VALUES ('Maria Souza', '98765432100', 'maria.souza@email.com', '11999990002', GETDATE());
IF NOT EXISTS (SELECT 1 FROM Clientes WHERE CPF = '45678912300')
    INSERT INTO Clientes (Nome, CPF, Email, Telefone, DataCadastro) VALUES ('Pedro Oliveira', '45678912300', 'pedro.oliveira@email.com', '11999990003', GETDATE());
GO

IF NOT EXISTS (SELECT 1 FROM Veiculos WHERE Placa = 'ABC1D23')
    INSERT INTO Veiculos (Modelo, AnoFabricacao, Quilometragem, Placa, FabricanteId, CategoriaId)
    SELECT 'Corolla', 2022, 15000, 'ABC1D23', f.Id, c.Id FROM Fabricantes f CROSS JOIN Categorias c WHERE f.Nome='Toyota' AND c.Nome='Sedan';
IF NOT EXISTS (SELECT 1 FROM Veiculos WHERE Placa = 'DEF4G56')
    INSERT INTO Veiculos (Modelo, AnoFabricacao, Quilometragem, Placa, FabricanteId, CategoriaId)
    SELECT 'Gol', 2021, 30000, 'DEF4G56', f.Id, c.Id FROM Fabricantes f CROSS JOIN Categorias c WHERE f.Nome='Volkswagen' AND c.Nome='Hatch';
IF NOT EXISTS (SELECT 1 FROM Veiculos WHERE Placa = 'GHI7J89')
    INSERT INTO Veiculos (Modelo, AnoFabricacao, Quilometragem, Placa, FabricanteId, CategoriaId)
    SELECT 'Tracker', 2023, 8000, 'GHI7J89', f.Id, c.Id FROM Fabricantes f CROSS JOIN Categorias c WHERE f.Nome='Chevrolet' AND c.Nome='SUV';
GO

IF NOT EXISTS (SELECT 1 FROM Alugueis)
BEGIN
    DECLARE @cliente INT = (SELECT TOP 1 Id FROM Clientes WHERE CPF='12345678900');
    DECLARE @veiculo INT = (SELECT TOP 1 Id FROM Veiculos WHERE Placa='ABC1D23');
    IF @cliente IS NOT NULL AND @veiculo IS NOT NULL
    BEGIN
        INSERT INTO Alugueis (ClienteId, VeiculoId, DataRetirada, DataDevolucaoPrevista, DataDevolucaoReal, QuilometragemInicial, QuilometragemFinal, ValorDiaria, ValorTotal)
        VALUES (@cliente, @veiculo, DATEADD(DAY,-12,GETDATE()), DATEADD(DAY,-9,GETDATE()), DATEADD(DAY,-9,GETDATE()), 15000, 15320, 140.00, 420.00);
    END
END;
GO

IF NOT EXISTS (SELECT 1 FROM Fabricantes WHERE Nome = 'Honda')
    INSERT INTO Fabricantes (Nome, PaisOrigem, AnoFundacao) VALUES ('Honda', 'Japao', 1948);
IF NOT EXISTS (SELECT 1 FROM Fabricantes WHERE Nome = 'Hyundai')
    INSERT INTO Fabricantes (Nome, PaisOrigem, AnoFundacao) VALUES ('Hyundai', 'Coreia do Sul', 1967);
IF NOT EXISTS (SELECT 1 FROM Fabricantes WHERE Nome = 'Fiat')
    INSERT INTO Fabricantes (Nome, PaisOrigem, AnoFundacao) VALUES ('Fiat', 'Italia', 1899);
IF NOT EXISTS (SELECT 1 FROM Fabricantes WHERE Nome = 'Nissan')
    INSERT INTO Fabricantes (Nome, PaisOrigem, AnoFundacao) VALUES ('Nissan', 'Japao', 1933);
GO

IF NOT EXISTS (SELECT 1 FROM Categorias WHERE Nome = 'Picape')
    INSERT INTO Categorias (Nome, Descricao, ValorDiariaBase) VALUES ('Picape', 'Veiculos para transporte de cargas e uso misto', 230.00);
IF NOT EXISTS (SELECT 1 FROM Categorias WHERE Nome = 'Minivan')
    INSERT INTO Categorias (Nome, Descricao, ValorDiariaBase) VALUES ('Minivan', 'Veiculos com maior capacidade de passageiros', 190.00);
IF NOT EXISTS (SELECT 1 FROM Categorias WHERE Nome = 'Compacto')
    INSERT INTO Categorias (Nome, Descricao, ValorDiariaBase) VALUES ('Compacto', 'Veiculos economicos para deslocamentos urbanos', 85.00);
IF NOT EXISTS (SELECT 1 FROM Categorias WHERE Nome = 'Conversivel')
    INSERT INTO Categorias (Nome, Descricao, ValorDiariaBase) VALUES ('Conversivel', 'Veiculos com teto retratil ou removivel', 280.00);
GO

IF NOT EXISTS (SELECT 1 FROM Clientes WHERE CPF = '32165498700')
    INSERT INTO Clientes (Nome, CPF, Email, Telefone, DataCadastro) VALUES ('Ana Clara Mendes', '32165498700', 'ana.mendes@email.com', '11988887771', DATEADD(DAY, -40, GETDATE()));
IF NOT EXISTS (SELECT 1 FROM Clientes WHERE CPF = '65498732100')
    INSERT INTO Clientes (Nome, CPF, Email, Telefone, DataCadastro) VALUES ('Rafael Costa Lima', '65498732100', 'rafael.lima@email.com', '11988887772', DATEADD(DAY, -32, GETDATE()));
IF NOT EXISTS (SELECT 1 FROM Clientes WHERE CPF = '78932165400')
    INSERT INTO Clientes (Nome, CPF, Email, Telefone, DataCadastro) VALUES ('Camila Ferreira Alves', '78932165400', 'camila.alves@email.com', '11988887773', DATEADD(DAY, -25, GETDATE()));
IF NOT EXISTS (SELECT 1 FROM Clientes WHERE CPF = '14725836900')
    INSERT INTO Clientes (Nome, CPF, Email, Telefone, DataCadastro) VALUES ('Bruno Henrique Rocha', '14725836900', 'bruno.rocha@email.com', '11988887774', DATEADD(DAY, -18, GETDATE()));
IF NOT EXISTS (SELECT 1 FROM Clientes WHERE CPF = '25836914700')
    INSERT INTO Clientes (Nome, CPF, Email, Telefone, DataCadastro) VALUES ('Isabela Martins Souza', '25836914700', 'isabela.souza@email.com', '11988887775', DATEADD(DAY, -10, GETDATE()));
GO

IF NOT EXISTS (SELECT 1 FROM Veiculos WHERE Placa = 'JKL2M34')
    INSERT INTO Veiculos (Modelo, AnoFabricacao, Quilometragem, Placa, FabricanteId, CategoriaId)
    SELECT 'Civic', 2022, 18400, 'JKL2M34', f.Id, c.Id FROM Fabricantes f CROSS JOIN Categorias c WHERE f.Nome = 'Honda' AND c.Nome = 'Compacto';
IF NOT EXISTS (SELECT 1 FROM Veiculos WHERE Placa = 'MNO5P67')
    INSERT INTO Veiculos (Modelo, AnoFabricacao, Quilometragem, Placa, FabricanteId, CategoriaId)
    SELECT 'Toro', 2023, 12600, 'MNO5P67', f.Id, c.Id FROM Fabricantes f CROSS JOIN Categorias c WHERE f.Nome = 'Fiat' AND c.Nome = 'Picape';
IF NOT EXISTS (SELECT 1 FROM Veiculos WHERE Placa = 'QRS8T90')
    INSERT INTO Veiculos (Modelo, AnoFabricacao, Quilometragem, Placa, FabricanteId, CategoriaId)
    SELECT 'Creta', 2021, 35200, 'QRS8T90', f.Id, c.Id FROM Fabricantes f CROSS JOIN Categorias c WHERE f.Nome = 'Hyundai' AND c.Nome = 'SUV';
IF NOT EXISTS (SELECT 1 FROM Veiculos WHERE Placa = 'UVW1X23')
    INSERT INTO Veiculos (Modelo, AnoFabricacao, Quilometragem, Placa, FabricanteId, CategoriaId)
    SELECT 'Uno', 2020, 48100, 'UVW1X23', f.Id, c.Id FROM Fabricantes f CROSS JOIN Categorias c WHERE f.Nome = 'Fiat' AND c.Nome = 'Compacto';
IF NOT EXISTS (SELECT 1 FROM Veiculos WHERE Placa = 'YZA4B56')
    INSERT INTO Veiculos (Modelo, AnoFabricacao, Quilometragem, Placa, FabricanteId, CategoriaId)
    SELECT 'Versa', 2022, 21900, 'YZA4B56', f.Id, c.Id FROM Fabricantes f CROSS JOIN Categorias c WHERE f.Nome = 'Nissan' AND c.Nome = 'Sedan';
IF NOT EXISTS (SELECT 1 FROM Veiculos WHERE Placa = 'CDE7F89')
    INSERT INTO Veiculos (Modelo, AnoFabricacao, Quilometragem, Placa, FabricanteId, CategoriaId)
    SELECT 'HR-V', 2024, 5300, 'CDE7F89', f.Id, c.Id FROM Fabricantes f CROSS JOIN Categorias c WHERE f.Nome = 'Honda' AND c.Nome = 'SUV';
GO

IF NOT EXISTS (SELECT 1 FROM Alugueis a INNER JOIN Veiculos v ON v.Id = a.VeiculoId WHERE v.Placa = 'MNO5P67' AND a.QuilometragemInicial = 12600)
BEGIN
    INSERT INTO Alugueis (ClienteId, VeiculoId, DataRetirada, DataDevolucaoPrevista, DataDevolucaoReal, QuilometragemInicial, QuilometragemFinal, ValorDiaria, ValorTotal)
    SELECT c.Id, v.Id, DATEADD(DAY, -8, GETDATE()), DATEADD(DAY, -5, GETDATE()), DATEADD(DAY, -5, GETDATE()), 12600, 12920, 230.00, 690.00
    FROM Clientes c CROSS JOIN Veiculos v WHERE c.CPF = '32165498700' AND v.Placa = 'MNO5P67';
END;
IF NOT EXISTS (SELECT 1 FROM Alugueis a INNER JOIN Veiculos v ON v.Id = a.VeiculoId WHERE v.Placa = 'UVW1X23' AND a.QuilometragemInicial = 48100)
BEGIN
    INSERT INTO Alugueis (ClienteId, VeiculoId, DataRetirada, DataDevolucaoPrevista, DataDevolucaoReal, QuilometragemInicial, QuilometragemFinal, ValorDiaria, ValorTotal)
    SELECT c.Id, v.Id, DATEADD(DAY, -15, GETDATE()), DATEADD(DAY, -12, GETDATE()), DATEADD(DAY, -12, GETDATE()), 48100, 48450, 85.00, 255.00
    FROM Clientes c CROSS JOIN Veiculos v WHERE c.CPF = '65498732100' AND v.Placa = 'UVW1X23';
END;
IF NOT EXISTS (SELECT 1 FROM Alugueis a INNER JOIN Veiculos v ON v.Id = a.VeiculoId WHERE v.Placa = 'CDE7F89' AND a.DataDevolucaoReal IS NULL)
BEGIN
    INSERT INTO Alugueis (ClienteId, VeiculoId, DataRetirada, DataDevolucaoPrevista, DataDevolucaoReal, QuilometragemInicial, QuilometragemFinal, ValorDiaria, ValorTotal)
    SELECT c.Id, v.Id, GETDATE(), DATEADD(DAY, 4, GETDATE()), NULL, 5300, NULL, 200.00, 800.00
    FROM Clientes c CROSS JOIN Veiculos v WHERE c.CPF = '78932165400' AND v.Placa = 'CDE7F89';
END;
GO

SELECT * FROM Fabricantes;
SELECT * FROM Categorias;
SELECT * FROM Clientes;
SELECT * FROM Veiculos;
SELECT * FROM Alugueis;
GO
