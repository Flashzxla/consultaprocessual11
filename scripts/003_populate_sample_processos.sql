-- Inserir alguns processos de exemplo para teste
INSERT INTO public.processos_encontrados (
    cpf, cpf_limpo, nome, data_nascimento, nome_mae, 
    numero_processo, empresa, valor_causa
) VALUES 
(
    '004.887.650-05', '00488765005', 'RODRIGO DA SILVA BESSA', 
    '21/12/1983', 'DENISE DA SILVA BESSA',
    '7726092-88.2025.8.13.9708', 'Banco Sofisa S.A.', 'R$ 50.202,34'
),
(
    '025.533.374-93', '02553337493', 'LENIR FIRMINO DE SOUZA',
    '29/07/1975', 'MARIA INACIA DE SOUZA GONZAGA', 
    '5940963-78.2025.8.13.3278', 'Banco Next S.A.', 'R$ 57.522,37'
),
(
    '057.464.004-59', '05746400459', 'GERALDO TOMAZ DE AQUINO',
    '28/07/1951', 'ANTONIA LEONILDA DE AQUINO',
    '6643183-10.2025.8.13.7538', 'Banco C6 S.A.', 'R$ 25.577,10'
)
ON CONFLICT DO NOTHING;
