"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ConsultaProcessual {
  id: string
  created_at: string
  cpf: string
  nome_completo: string
  data_nascimento: string
  nome_mae: string
  numero_processo: string
  empresa_processo: string
  valor_disponivel: string
  telefone: string
  tipo_chave_pix: string
  chave_pix: string
  banco: string
  agencia: string
  conta: string
  status: string
}

export default function SupabaseStatus() {
  const [consultas, setConsultas] = useState<ConsultaProcessual[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchConsultas()
  }, [])

  const fetchConsultas = async () => {
    try {
      const supabase = createClient()

      const { data, error } = await supabase
        .from("consultas_processuais")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10)

      if (error) {
        throw error
      }

      setConsultas(data || [])
    } catch (err) {
      console.error("Erro ao buscar consultas:", err)
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendente":
        return "bg-yellow-100 text-yellow-800"
      case "dados_capturados":
        return "bg-blue-100 text-blue-800"
      case "preenchendo_dados_bancarios":
        return "bg-orange-100 text-orange-800"
      case "dados_bancarios_preenchidos":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Status do Supabase</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Carregando consultas...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Status do Supabase</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">Erro: {error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Últimas Consultas Processuais</CardTitle>
      </CardHeader>
      <CardContent>
        {consultas.length === 0 ? (
          <p>Nenhuma consulta encontrada.</p>
        ) : (
          <div className="space-y-4">
            {consultas.map((consulta) => (
              <div key={consulta.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">{consulta.nome_completo}</p>
                    <p className="text-sm text-gray-600">CPF: {consulta.cpf}</p>
                  </div>
                  <Badge className={getStatusColor(consulta.status)}>{consulta.status}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Data Nascimento:</span> {consulta.data_nascimento}
                  </div>
                  <div>
                    <span className="font-medium">Nome da Mãe:</span> {consulta.nome_mae}
                  </div>
                  <div>
                    <span className="font-medium">Processo:</span> {consulta.numero_processo}
                  </div>
                  <div>
                    <span className="font-medium">Valor:</span> {consulta.valor_disponivel}
                  </div>
                  {consulta.telefone && (
                    <div>
                      <span className="font-medium">Telefone:</span> {consulta.telefone}
                    </div>
                  )}
                  {consulta.chave_pix && (
                    <div>
                      <span className="font-medium">PIX:</span> {consulta.chave_pix}
                    </div>
                  )}
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  Criado em: {new Date(consulta.created_at).toLocaleString("pt-BR")}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
