-- Tabela para armazenar consultas de CPF e dados processuais
CREATE TABLE IF NOT EXISTS consultas_processuais (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Dados do CPF consultado
  cpf text NOT NULL,
  nome_completo text,
  data_nascimento text,
  nome_mae text,
  
  -- Dados do processo
  numero_processo text,
  empresa_processo text,
  valor_disponivel text,
  
  -- Dados de contato
  telefone text,
  
  -- Dados PIX
  tipo_chave_pix text,
  chave_pix text,
  
  -- Dados bancários tradicionais
  banco text,
  agencia text,
  conta text,
  
  -- Status da consulta
  status text DEFAULT 'pendente',
  
  -- Metadados
  ip_address text,
  user_agent text
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_consultas_cpf ON consultas_processuais(cpf);
CREATE INDEX IF NOT EXISTS idx_consultas_created_at ON consultas_processuais(created_at);
CREATE INDEX IF NOT EXISTS idx_consultas_status ON consultas_processuais(status);

-- RLS (Row Level Security) para proteger os dados
ALTER TABLE consultas_processuais ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção de novos registros
CREATE POLICY "Permitir inserção de consultas" ON consultas_processuais
  FOR INSERT WITH CHECK (true);

-- Política para permitir leitura de consultas
CREATE POLICY "Permitir leitura consultas" ON consultas_processuais
  FOR SELECT USING (true);

-- Política para permitir atualização de consultas
CREATE POLICY "Permitir atualização consultas" ON consultas_processuais
  FOR UPDATE USING (true);
