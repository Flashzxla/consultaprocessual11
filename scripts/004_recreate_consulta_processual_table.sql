-- Recriar tabela consultas_processuais limpa
-- Remove tabela existente e cria nova para eliminar dados duplicados

DROP TABLE IF EXISTS public.consultas_processuais;

CREATE TABLE public.consultas_processuais (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Dados pessoais do CPF
    cpf TEXT NOT NULL,
    nome_completo TEXT,
    data_nascimento TEXT,
    nome_mae TEXT,
    
    -- Dados do processo
    numero_processo TEXT,
    empresa_processo TEXT,
    valor_disponivel TEXT,
    
    -- Dados de contato
    telefone TEXT,
    
    -- Dados PIX
    tipo_chave_pix TEXT,
    chave_pix TEXT,
    
    -- Dados bancários
    banco TEXT,
    agencia TEXT,
    conta TEXT,
    
    -- Metadados
    status TEXT DEFAULT 'iniciado',
    ip_address TEXT,
    user_agent TEXT
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.consultas_processuais ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção de dados
CREATE POLICY "Permitir inserção de consultas" ON public.consultas_processuais
    FOR INSERT WITH CHECK (true);

-- Política para permitir leitura de dados
CREATE POLICY "Permitir leitura de consultas" ON public.consultas_processuais
    FOR SELECT USING (true);

-- Política para permitir atualização de dados
CREATE POLICY "Permitir atualização de consultas" ON public.consultas_processuais
    FOR UPDATE USING (true);
