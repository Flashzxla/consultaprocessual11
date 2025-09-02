-- Tabela para armazenar processos encontrados por CPF
CREATE TABLE IF NOT EXISTS public.processos_encontrados (
    id SERIAL PRIMARY KEY,
    cpf VARCHAR(14) NOT NULL,
    cpf_limpo VARCHAR(11) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    data_nascimento VARCHAR(10),
    nome_mae VARCHAR(255),
    numero_processo VARCHAR(50) NOT NULL,
    empresa VARCHAR(255) NOT NULL,
    valor_causa VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_processos_cpf_limpo ON public.processos_encontrados(cpf_limpo);
CREATE INDEX IF NOT EXISTS idx_processos_cpf ON public.processos_encontrados(cpf);
CREATE INDEX IF NOT EXISTS idx_processos_numero ON public.processos_encontrados(numero_processo);

-- RLS (Row Level Security)
ALTER TABLE public.processos_encontrados ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública (ajuste conforme necessário)
CREATE POLICY "Allow public read access" ON public.processos_encontrados
    FOR SELECT USING (true);

-- Política para permitir inserção pública (ajuste conforme necessário)
CREATE POLICY "Allow public insert access" ON public.processos_encontrados
    FOR INSERT WITH CHECK (true);
