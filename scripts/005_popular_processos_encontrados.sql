-- Inserir dados de exemplo na tabela processos_encontrados
INSERT INTO processos_encontrados (cpf_ativo, numero_processo, polo_passivo, valor_causa, data_criacao) VALUES
-- CPF que está sendo testado
('70814874401', '1234567-89.2024.8.13.0001', 'Banco Itaú S.A.', 'R$ 15.750,00', NOW()),
('708.148.744-01', '9876543-21.2024.8.13.0002', 'Banco Bradesco S.A.', 'R$ 22.340,50', NOW()),

-- Outros CPFs de exemplo
('12345678901', '5555555-55.2024.8.13.0003', 'Banco do Brasil S.A.', 'R$ 8.500,00', NOW()),
('123.456.789-01', '7777777-77.2024.8.13.0004', 'Caixa Econômica Federal', 'R$ 12.890,75', NOW()),
('98765432109', '3333333-33.2024.8.13.0005', 'Banco Santander S.A.', 'R$ 18.200,00', NOW()),
('987.654.321-09', '1111111-11.2024.8.13.0006', 'Banco Inter S.A.', 'R$ 9.650,25', NOW()),

-- CPFs adicionais para testes
('11111111111', '2222222-22.2024.8.13.0007', 'Nubank S.A.', 'R$ 25.000,00', NOW()),
('22222222222', '4444444-44.2024.8.13.0008', 'Banco Original S.A.', 'R$ 14.320,80', NOW()),
('33333333333', '6666666-66.2024.8.13.0009', 'Banco C6 S.A.', 'R$ 11.475,90', NOW()),
('44444444444', '8888888-88.2024.8.13.0010', 'Banco XP S.A.', 'R$ 19.800,00', NOW());

-- Verificar os dados inseridos
SELECT * FROM processos_encontrados ORDER BY data_criacao DESC;
