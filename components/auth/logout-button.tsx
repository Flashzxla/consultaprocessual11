"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  const handleLogout = async () => {
    await fetch("/auth/logout", { method: "POST" })
    window.location.href = "/auth/login"
  }

  return (
    <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2 bg-transparent">
      <LogOut className="h-4 w-4" />
      Sair
    </Button>
  )
}
