export async function GET(request: Request, { params }: { params: { cpf: string } }) {
  try {
    const { cpf } = params

    const response = await fetch(`http://38.242.137.71:3000/api/cpf/${cpf}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      return Response.json({ error: "API externa não disponível" }, { status: 500 })
    }

    const data = await response.json()

    if (data.DADOS && data.DADOS.length > 0) {
      const dadosCpf = data.DADOS[0]
      const transformedData = {
        nome: dadosCpf.NOME,
        data_nascimento: dadosCpf.NASC,
        nome_mae: dadosCpf.NOME_MAE || dadosCpf.MAE,
        cpf: dadosCpf.CPF,
      }
      return Response.json(transformedData)
    }

    return Response.json({ error: "CPF não encontrado" }, { status: 404 })
  } catch (error) {
    console.error("Erro na API de CPF:", error)
    return Response.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
