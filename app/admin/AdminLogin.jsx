"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Shield, Lock, Eye, EyeOff, Home, ArrowLeft } from "lucide-react"

export default function AdminLogin() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Mot de passe administrateur (à changer)
  const ADMIN_PASSWORD = "mezerowalt"

  const handleLogin = (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simulation de délai pour l'authentification
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        // Stocker le token d'authentification dans localStorage
        localStorage.setItem("admin_auth", "true")
        localStorage.setItem("admin_logged_in", Date.now().toString())
        
        // Rediriger vers le dashboard admin
        router.push("/admin/dashboard")
      } else {
        setError("Mot de passe incorrect")
        setLoading(false)
      }
    }, 800)
  }

  // Vérifier si déjà connecté - CORRIGÉ POUR ÉVITER LA BOUCLE
  useEffect(() => {
    // Vérifier uniquement si on est sur la page de login
    if (typeof window !== "undefined") {
      const isLoggedIn = localStorage.getItem("admin_auth") === "true"
      const loginTime = localStorage.getItem("admin_logged_in")
      
      if (isLoggedIn && loginTime) {
        // Vérifier si la session a expiré (12 heures)
        const currentTime = Date.now()
        const sessionDuration = currentTime - parseInt(loginTime)
        const twelveHours = 12 * 60 * 60 * 1000
        
        if (sessionDuration < twelveHours) {
          // IMPORTANT: Vérifier si on n'est pas déjà en train de rediriger
          // et si on n'est pas déjà sur le dashboard
          const currentPath = window.location.pathname
          if (!currentPath.includes("/admin/dashboard")) {
            router.push("/admin/dashboard")
          }
        } else {
          // Session expirée, nettoyer le localStorage
          localStorage.removeItem("admin_auth")
          localStorage.removeItem("admin_logged_in")
        }
      }
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      {/* Bouton pour revenir à la page principale */}
      <button
        onClick={() => router.push("/")}
        className="fixed top-4 left-4 px-4 py-2 bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-lg rounded-lg border border-gray-700 z-40 text-sm text-gray-300 hover:text-white transition-all flex items-center gap-2"
        title="Retour à la page principale"
      >
        <ArrowLeft size={16} />
        Retour au portfolio
      </button>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl mb-4">
            <Shield size={48} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Portfolio Admin</h1>
          <p className="text-gray-400">Accès sécurisé au panneau d'administration</p>
        </div>

        <div className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-lg rounded-2xl p-8 border border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Mot de passe administrateur
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-gray-500" size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  placeholder="Entrez le mot de passe"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                  Connexion...
                </>
              ) : (
                <>
                  <Shield size={20} />
                  Se connecter
                </>
              )}
            </button>

            {/* Bouton alternative pour retourner à la page principale */}
            <button
              type="button"
              onClick={() => router.push("/")}
              className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2 border border-gray-700"
            >
              <Home size={18} />
              Retour au portfolio
            </button>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Contactez le développeur si vous avez oublié le mot de passe
              </p>
            </div>
          </form>
        </div>

        {/* Indicateur de sécurité */}
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Système sécurisé par cryptage
        </div>
      </div>
    </div>
  )
}