import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function ExemploSupabase() {
  const supabase = await createClient()

  // Verificar se usuário está logado
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Buscar dados do usuário (exemplo)
  const { data: profiles } = await supabase.from("profiles").select("*").eq("id", user.id)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Exemplo Supabase</h1>
      <p>Usuário logado: {user.email}</p>

      {profiles && profiles.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Perfil:</h2>
          <pre className="bg-gray-100 p-4 rounded mt-2">{JSON.stringify(profiles[0], null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
