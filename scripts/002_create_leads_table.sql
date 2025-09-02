-- Tabela para armazenar dados dos leads/usuários
CREATE TABLE IF NOT EXISTS public.leads (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) NOT NULL,
    telefone VARCHAR(20),
    numero_processo VARCHAR(50),
    empresa VARCHAR(255),
    valor_causa VARCHAR(50),
    
    -- Dados bancários
    tipo_chave_pix VARCHAR(20),
    chave_pix VARCHAR(255),
    banco VARCHAR(255),
    agencia VARCHAR(20),
    conta VARCHAR(50),
    
    -- Status e controle
    status VARCHAR(50) DEFAULT 'inicial',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_leads_cpf ON public.leads(cpf);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at);

-- RLS (Row Level Security)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública (ajuste conforme necessário)
CREATE POLICY "Allow public read access" ON public.leads
    FOR SELECT USING (true);

-- Política para permitir inserção pública (ajuste conforme necessário)
CREATE POLICY "Allow public insert access" ON public.leads
    FOR INSERT WITH CHECK (true);

-- Política para permitir atualização pública (ajuste conforme necessário)
CREATE POLICY "Allow public update access" ON public.leads
    FOR UPDATE USING (true);
