"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Shield, User, Image, FileText, Award, 
  Cpu, Code, Database, Network, Lock, 
  Edit, Trash2, Save, Upload, Plus, LogOut,
  Mail, Phone, MapPin, Calendar, Download,
  Eye, EyeOff, BarChart3,
  Briefcase, GraduationCap,
  ExternalLink, AlertCircle, CheckCircle, CloudUpload,
  Loader2, RefreshCw, Globe, Check, X
} from "lucide-react"
import { supabase } from "@/lib/supabase"

// Fonction pour afficher les notifications
const showNotification = (message, type = "success") => {
  const oldNotifications = document.querySelectorAll('.custom-notification');
  oldNotifications.forEach(n => n.remove());
  
  const notification = document.createElement('div');
  notification.className = `custom-notification fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 ${
    type === 'success' ? 'bg-green-600 text-white' :
    type === 'error' ? 'bg-red-600 text-white' :
    type === 'info' ? 'bg-blue-600 text-white' :
    type === 'warning' ? 'bg-yellow-600 text-white' :
    'bg-blue-600 text-white'
  }`;
  notification.textContent = message;
  notification.style.transform = 'translateX(100%)';
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 10);
  
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
};

// Icônes disponibles pour les compétences
const ICONS = {
  Cpu: "💻",
  Shield: "🛡️",
  Code: "👨‍💻",
  Database: "🗄️",
  Network: "🌐",
  Lock: "🔒",
  Brain: "🧠",
  Eye: "👁️",
  Key: "🔑",
  Server: "🖥️",
  Cloud: "☁️",
  Terminal: "💻",
  Bug: "🐛",
  Search: "🔍",
  Radar: "📡",
  Satellite: "🛰️",
  Zap: "⚡"
}

const DEFAULT_PERSONAL_INFO = {
  name: "Pana Adolphe",
  title: "Expert Cybersécurité",
  location: "Lomé, Togo",
  email: "contact@pana-adolphe.dev",
  phone: "+228 00 00 00 00",
  about: "Spécialiste en cybersécurité offensive et défensive avec 3+ années d'expérience. Je développe des solutions sécurisées tout en protégeant les infrastructures contre les cybermenaces modernes.",
  photo: null,
  cv_data: null,
  cv_filename: null,
  cv_type: null,
  experience: "3+ années",
  projects: "20+ projets",
  availability: "Disponible",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [data, setData] = useState({
    personalInfo: DEFAULT_PERSONAL_INFO,
    projects: [],
    skills: [],
    certifications: [],
    timeline: []
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editSection, setEditSection] = useState(null)
  const [tempData, setTempData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploadingImages, setUploadingImages] = useState({})

  // Vérifier l'authentification AVEC LOCALSTORAGE
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window === "undefined") return
      
      const isLoggedIn = localStorage.getItem("admin_auth") === "true"
      const loginTime = localStorage.getItem("admin_logged_in")
      
      if (!isLoggedIn || !loginTime) {
        router.push("/admin")
        return
      }
      
      // Vérifier si la session a expiré (12 heures)
      const currentTime = Date.now()
      const sessionDuration = currentTime - parseInt(loginTime)
      const twelveHours = 12 * 60 * 60 * 1000
      
      if (sessionDuration >= twelveHours) {
        localStorage.removeItem("admin_auth")
        localStorage.removeItem("admin_logged_in")
        router.push("/admin")
        return
      }
      
      loadData()
    }

    checkAuth()
  }, [router])

  // Charger les données depuis Supabase
  const loadData = async () => {
    setLoading(true)
    try {
      console.log("🔄 Chargement des données...")
      
      // Charger les informations personnelles
      const { data: personalInfo, error: personalError } = await supabase
        .from('personal_info')
        .select('*')
        .limit(1)
        .single()

      if (personalError) {
        if (personalError.code === 'PGRST116') {
          // Table vide, créer une entrée par défaut
          console.log("📝 Création des infos personnelles par défaut...")
          const { data: newInfo, error: insertError } = await supabase
            .from('personal_info')
            .insert([DEFAULT_PERSONAL_INFO])
            .select()
            .single()
          
          if (insertError) {
            console.error("❌ Erreur création infos:", insertError)
            throw insertError
          }
          
          console.log("✅ Infos personnelles créées:", newInfo)
        } else {
          console.error("❌ Erreur personal_info:", personalError)
          throw personalError
        }
      }

      // Charger les projets - NOTE: Assurez-vous que votre table projects a une colonne 'images' (TEXT[])
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (projectsError) {
        console.error("Erreur projets:", projectsError)
      }

      // Charger les compétences
      const { data: skills, error: skillsError } = await supabase
        .from('skills')
        .select('*')
        .order('created_at', { ascending: false })

      if (skillsError) {
        console.error("Erreur skills:", skillsError)
      }

      // Charger les certifications
      const { data: certifications, error: certsError } = await supabase
        .from('certifications')
        .select('*')
        .order('created_at', { ascending: false })

      if (certsError) {
        console.error("Erreur certifications:", certsError)
      }

      // Charger le parcours
      const { data: timeline, error: timelineError } = await supabase
        .from('timeline')
        .select('*')
        .order('year', { ascending: false })

      if (timelineError) {
        console.error("Erreur timeline:", timelineError)
      }

      // Recharger les infos personnelles après création
      const { data: finalPersonalInfo } = await supabase
        .from('personal_info')
        .select('*')
        .limit(1)
        .single()

      console.log("✅ Données chargées:", {
        personalInfo: !!finalPersonalInfo,
        projects: projects?.length || 0,
        skills: skills?.length || 0,
        certifications: certifications?.length || 0,
        timeline: timeline?.length || 0
      })

      setData({
        personalInfo: finalPersonalInfo || DEFAULT_PERSONAL_INFO,
        projects: projects || [],
        skills: skills || [],
        certifications: certifications || [],
        timeline: timeline || []
      })
    } catch (error) {
      console.error("🚨 Erreur lors du chargement des données:", error)
      showNotification("Erreur lors du chargement des données", "error")
      
      setData({
        personalInfo: DEFAULT_PERSONAL_INFO,
        projects: [],
        skills: [],
        certifications: [],
        timeline: []
      })
    } finally {
      setLoading(false)
    }
  }

  // Logout avec localStorage
  const handleLogout = () => {
    localStorage.removeItem("admin_auth")
    localStorage.removeItem("admin_logged_in")
    router.push("/admin")
  }

  // Sauvegarder les données dans Supabase
  const saveData = async (section, dataToSave) => {
    try {
      console.log("💾 Sauvegarde vers:", section)
      
      let dataForSupabase = { ...dataToSave }
      
      // Ajouter updated_at
      dataForSupabase.updated_at = new Date().toISOString()
      
      // Supprimer l'id pour les insertions
      if (!dataForSupabase.id && dataForSupabase.id !== undefined) {
        delete dataForSupabase.id
      }
      
      let result
      let tableName = section
      
      // Déterminer le nom de la table
      if (section === "personalInfo") {
        tableName = "personal_info"
      }
      
      console.log("Table:", tableName, "Données:", dataForSupabase)
      
      if (dataForSupabase.id) {
        // UPDATE
        const { id, ...updateData } = dataForSupabase
        result = await supabase
          .from(tableName)
          .update(updateData)
          .eq('id', id)
      } else {
        // INSERT
        result = await supabase
          .from(tableName)
          .insert([dataForSupabase])
      }
      
      console.log("📊 Résultat sauvegarde:", result)
      
      if (result.error) {
        console.error("❌ Erreur Supabase:", result.error)
        throw result.error
      }
      
      showNotification("✅ Données sauvegardées avec succès!")
      
      // Recharger après 1 seconde
      setTimeout(loadData, 1000)
      
      return true
      
    } catch (error) {
      console.error("🔥 Erreur de sauvegarde complète:", error)
      showNotification(`❌ Erreur: ${error.message || "Sauvegarde échouée"}`, "error")
      return false
    }
  }

  const startEdit = (section, itemId = null) => {
    setIsEditing(true)
    setEditSection({ section, itemId })
    
    if (itemId) {
      // Édition d'un élément spécifique
      const item = data[section].find(item => item.id === itemId)
      if (item) {
        setTempData({...item})
      }
    } else if (section === "personalInfo") {
      // Édition des informations personnelles
      setTempData({...data.personalInfo})
    } else {
      // Création d'un nouvel élément
      const newItem = section === "projects" ? {
        title: "",
        description: "",
        details: "",
        tags: [],
        technologies: [],
        images: [], // Changé: tableau d'images au lieu d'une seule image
        status: "En cours",
        code_link: "",
        demo_link: "",
        created_at: new Date().toISOString()
      } : section === "skills" ? {
        name: "",
        level: 50,
        icon: "Cpu",
        category: "Développement",
        created_at: new Date().toISOString()
      } : section === "certifications" ? {
        name: "",
        issuer: "",
        status: "Obtenue",
        date: new Date().getFullYear().toString(),
        created_at: new Date().toISOString()
      } : {
        year: new Date().getFullYear().toString(),
        title: "",
        description: "",
        created_at: new Date().toISOString()
      }
      setTempData(newItem)
    }
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setEditSection(null)
    setTempData(null)
  }

  const saveEdit = async () => {
    if (!editSection || !tempData) return

    try {
      await saveData(editSection.section, tempData)
      cancelEdit()
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error)
      showNotification("Erreur lors de la sauvegarde", "error")
    }
  }

  const addItem = (section) => {
    startEdit(section)
  }

  const deleteItem = async (section, itemId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) {
      try {
        const tableName = section === "personalInfo" ? "personal_info" : section
        const { error } = await supabase
          .from(tableName)
          .delete()
          .eq('id', itemId)

        if (error) throw error

        showNotification("Élément supprimé avec succès")
        await loadData()
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
        showNotification("Erreur lors de la suppression", "error")
      }
    }
  }

  const handlePhotoUpload = async (e, section, itemId = null) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showNotification("Veuillez sélectionner une image valide", "error")
      return
    }

    try {
      showNotification("Conversion de l'image en cours...", "info")
      
      // Vérifier la taille (max 1MB pour Base64)
      const maxSize = 1 * 1024 * 1024
      if (file.size > maxSize) {
        showNotification("L'image est trop volumineuse (max 1MB)", "error")
        return
      }
      
      // Convertir en base64
      const reader = new FileReader()
      
      reader.onloadend = async () => {
        try {
          const base64Data = reader.result
          
          if (section === "personalInfo") {
            await saveData("personalInfo", {
              ...data.personalInfo,
              photo: base64Data
            })
          }
          
          showNotification("✅ Image sauvegardée avec succès!", "success")
        } catch (error) {
          console.error('Erreur sauvegarde:', error)
          showNotification("❌ Erreur lors de la sauvegarde", "error")
        }
      }
      
      reader.onerror = () => {
        showNotification("❌ Erreur lors de la lecture du fichier", "error")
      }
      
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Erreur upload:', error)
      showNotification("❌ Erreur lors du traitement de l'image", "error")
    }
  }

  // NOUVELLE FONCTION: Upload multiple d'images pour les projets
  const handleProjectImagesUpload = async (e, projectId) => {
    const files = Array.from(e.target.files)
    if (!files.length) return

    // Filtrer seulement les images
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    if (imageFiles.length === 0) {
      showNotification("Veuillez sélectionner des images valides", "error")
      return
    }

    try {
      setUploadingImages(prev => ({ ...prev, [projectId]: true }))
      showNotification(`Conversion de ${imageFiles.length} image(s) en cours...`, "info")

      // Convertir toutes les images en base64
      const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
      }

      const base64Images = await Promise.all(imageFiles.map(convertToBase64))

      // Récupérer le projet actuel
      const project = data.projects.find(p => p.id === projectId)
      if (!project) {
        showNotification("Projet non trouvé", "error")
        return
      }

      // Ajouter les nouvelles images aux existantes
      const currentImages = project.images || []
      const updatedImages = [...currentImages, ...base64Images]

      // Sauvegarder dans Supabase
      await saveData("projects", {
        ...project,
        images: updatedImages
      })

      showNotification(`✅ ${imageFiles.length} image(s) ajoutée(s) avec succès!`, "success")
    } catch (error) {
      console.error('Erreur upload multiple:', error)
      showNotification("❌ Erreur lors du traitement des images", "error")
    } finally {
      setUploadingImages(prev => ({ ...prev, [projectId]: false }))
    }
  }

  // NOUVELLE FONCTION: Supprimer une image spécifique d'un projet
  const removeProjectImage = async (projectId, imageIndex) => {
    const project = data.projects.find(p => p.id === projectId)
    if (!project) return

    const currentImages = [...(project.images || [])]
    currentImages.splice(imageIndex, 1)

    try {
      await saveData("projects", {
        ...project,
        images: currentImages
      })
      showNotification("Image supprimée avec succès", "success")
    } catch (error) {
      console.error('Erreur suppression image:', error)
      showNotification("❌ Erreur lors de la suppression", "error")
    }
  }

  const handleCVUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!validTypes.includes(file.type)) {
      showNotification("Seuls les fichiers PDF et Word sont acceptés", "error")
      return
    }

    try {
      showNotification("Upload du CV en cours...", "info")

      // Convertir en base64 pour stockage dans la base
      const reader = new FileReader()
      
      reader.onloadend = async () => {
        try {
          const base64Data = reader.result
          
          // Mettre à jour les informations personnelles
          await saveData("personalInfo", {
            ...data.personalInfo,
            cv_data: base64Data,
            cv_filename: file.name,
            cv_type: file.type
          })
          
          showNotification("✅ CV uploadé avec succès !", "success")
        } catch (error) {
          console.error('Erreur lors du traitement du fichier:', error)
          showNotification("❌ Erreur lors du traitement du fichier", "error")
        }
      }
      
      reader.onerror = () => {
        showNotification("❌ Erreur lors de la lecture du fichier", "error")
      }
      
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Erreur upload:', error)
      showNotification("❌ Erreur de connexion", "error")
    }
  }

  // Fonction pour télécharger le CV depuis la base64
  const downloadCV = () => {
    if (!data.personalInfo?.cv_data) {
      showNotification("Aucun CV disponible", "error")
      return
    }

    try {
      const base64Data = data.personalInfo.cv_data
      const mimeType = data.personalInfo.cv_type || 'application/pdf'
      const filename = data.personalInfo.cv_filename || 'cv.pdf'
      
      const byteString = atob(base64Data.split(',')[1])
      const ab = new ArrayBuffer(byteString.length)
      const ia = new Uint8Array(ab)
      
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }
      
      const blob = new Blob([ab], { type: mimeType })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      
      document.body.appendChild(link)
      link.click()
      
      setTimeout(() => {
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }, 100)
      
      showNotification("✅ CV téléchargé avec succès", "success")
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error)
      showNotification("❌ Erreur lors du téléchargement", "error")
    }
  }

  // Fonction pour supprimer le CV
  const deleteCV = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer le CV ?")) {
      try {
        await saveData("personalInfo", {
          ...data.personalInfo,
          cv_data: null,
          cv_filename: null,
          cv_type: null
        })
        
        showNotification("✅ CV supprimé avec succès", "success")
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
        showNotification("❌ Erreur lors de la suppression", "error")
      }
    }
  }

  const renderEditForm = () => {
    if (!editSection || !tempData) return null

    switch (editSection.section) {
      case "personalInfo":
        return (
          <div className="space-y-4">
            {/* ... formulaire personalInfo inchangé ... */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Nom complet</label>
              <input
                type="text"
                value={tempData.name || ""}
                onChange={(e) => setTempData({...tempData, name: e.target.value})}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Titre professionnel</label>
              <input
                type="text"
                value={tempData.title || ""}
                onChange={(e) => setTempData({...tempData, title: e.target.value})}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              />
            </div>
            {/* ... autres champs personalInfo ... */}
          </div>
        )

      case "projects":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Titre</label>
              <input
                type="text"
                value={tempData.title || ""}
                onChange={(e) => setTempData({...tempData, title: e.target.value})}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea
                value={tempData.description || ""}
                onChange={(e) => setTempData({...tempData, description: e.target.value})}
                rows="3"
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Détails</label>
              <textarea
                value={tempData.details || ""}
                onChange={(e) => setTempData({...tempData, details: e.target.value})}
                rows="4"
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Tags (séparés par des virgules)</label>
              <input
                type="text"
                value={Array.isArray(tempData.tags) ? tempData.tags.join(", ") : tempData.tags || ""}
                onChange={(e) => setTempData({...tempData, tags: e.target.value.split(",").map(tag => tag.trim()).filter(tag => tag)})}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                placeholder="Cybersécurité, IA, Python"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Technologies (séparées par des virgules)</label>
              <input
                type="text"
                value={Array.isArray(tempData.technologies) ? tempData.technologies.join(", ") : tempData.technologies || ""}
                onChange={(e) => setTempData({...tempData, technologies: e.target.value.split(",").map(tech => tech.trim()).filter(tech => tech)})}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                placeholder="React, Node.js, MongoDB"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Statut</label>
              <select
                value={tempData.status || "En cours"}
                onChange={(e) => setTempData({...tempData, status: e.target.value})}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              >
                <option>En cours</option>
                <option>Terminé</option>
                <option>En pause</option>
                <option>Planifié</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Lien du code</label>
              <input
                type="text"
                value={tempData.code_link || ""}
                onChange={(e) => setTempData({...tempData, code_link: e.target.value})}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Lien de démo</label>
              <input
                type="text"
                value={tempData.demo_link || ""}
                onChange={(e) => setTempData({...tempData, demo_link: e.target.value})}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Images du projet (multiple)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files)
                  const promises = files.map(file => {
                    return new Promise((resolve) => {
                      const reader = new FileReader()
                      reader.onloadend = () => resolve(reader.result)
                      reader.readAsDataURL(file)
                    })
                  })
                  
                  Promise.all(promises).then(newImages => {
                    setTempData({
                      ...tempData,
                      images: [...(tempData.images || []), ...newImages]
                    })
                  })
                }}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              />
              {tempData.images && tempData.images.length > 0 && (
                <div className="mt-4">
                  <div className="text-sm text-gray-400 mb-2">
                    {tempData.images.length} image(s)
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {tempData.images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={img} 
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded border border-gray-700"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = [...tempData.images]
                            newImages.splice(index, 1)
                            setTempData({...tempData, images: newImages})
                          }}
                          className="absolute top-1 right-1 p-1 bg-red-600/80 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={14} className="text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case "skills":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Nom de la compétence</label>
              <input
                type="text"
                value={tempData.name || ""}
                onChange={(e) => setTempData({...tempData, name: e.target.value})}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Niveau (%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={tempData.level || 50}
                onChange={(e) => setTempData({...tempData, level: parseInt(e.target.value)})}
                className="w-full"
              />
              <div className="text-center text-cyan-400 font-mono mt-1">{tempData.level || 50}%</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Icône</label>
              <select
                value={tempData.icon || "Cpu"}
                onChange={(e) => setTempData({...tempData, icon: e.target.value})}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              >
                {Object.entries(ICONS).map(([key, icon]) => (
                  <option key={key} value={key}>
                    {icon} {key}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Catégorie</label>
              <select
                value={tempData.category || "Développement"}
                onChange={(e) => setTempData({...tempData, category: e.target.value})}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              >
                <option>Sécurité</option>
                <option>Développement</option>
                <option>DevOps</option>
                <option>Cloud</option>
              </select>
            </div>
          </div>
        )

      case "certifications":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Nom de la certification</label>
              <input
                type="text"
                value={tempData.name || ""}
                onChange={(e) => setTempData({...tempData, name: e.target.value})}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Organisme</label>
              <input
                type="text"
                value={tempData.issuer || ""}
                onChange={(e) => setTempData({...tempData, issuer: e.target.value})}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Statut</label>
              <select
                value={tempData.status || "Obtenue"}
                onChange={(e) => setTempData({...tempData, status: e.target.value})}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              >
                <option>Obtenue</option>
                <option>En cours</option>
                <option>Planifiée</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Date/Année</label>
              <input
                type="text"
                value={tempData.date || ""}
                onChange={(e) => setTempData({...tempData, date: e.target.value})}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              />
            </div>
          </div>
        )

      case "timeline":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Année</label>
              <input
                type="text"
                value={tempData.year || ""}
                onChange={(e) => setTempData({...tempData, year: e.target.value})}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Titre</label>
              <input
                type="text"
                value={tempData.title || ""}
                onChange={(e) => setTempData({...tempData, title: e.target.value})}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea
                value={tempData.description || ""}
                onChange={(e) => setTempData({...tempData, description: e.target.value})}
                rows="3"
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto" />
          <p className="mt-4 text-gray-400">Chargement des données...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      {/* Barre de navigation supérieure */}
      <div className="bg-gray-800/80 backdrop-blur-lg border-b border-gray-700">
        <div className="px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Shield className="text-cyan-400" />
            <div>
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-sm text-gray-400">Gestion du portfolio - Supabase</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => loadData()}
              className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors text-sm flex items-center gap-2"
              title="Rafraîchir les données"
            >
              <RefreshCw size={14} />
              Rafraîchir
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <LogOut size={18} />
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800/50 h-[calc(100vh-73px)] border-r border-gray-700 overflow-y-auto">
          <nav className="p-4 space-y-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "dashboard" 
                  ? "bg-cyan-600 text-white" 
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <BarChart3 size={20} />
              Tableau de bord
            </button>
            <button
              onClick={() => setActiveTab("personal")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "personal" 
                  ? "bg-cyan-600 text-white" 
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <User size={20} />
              Informations personnelles
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "projects" 
                  ? "bg-cyan-600 text-white" 
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <Briefcase size={20} />
              Projets
            </button>
            <button
              onClick={() => setActiveTab("skills")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "skills" 
                  ? "bg-cyan-600 text-white" 
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <Cpu size={20} />
              Compétences
            </button>
            <button
              onClick={() => setActiveTab("certifications")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "certifications" 
                  ? "bg-cyan-600 text-white" 
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <Award size={20} />
              Certifications
            </button>
            <button
              onClick={() => setActiveTab("timeline")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "timeline" 
                  ? "bg-cyan-600 text-white" 
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <GraduationCap size={20} />
              Parcours
            </button>
          </nav>
        </div>

        {/* Contenu principal */}
        <div className="flex-1 p-6 overflow-y-auto h-[calc(100vh-73px)]">
          {isEditing ? (
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-gray-800/50 to-black/50 rounded-xl p-6 border border-cyan-500/20">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">
                    {editSection.itemId ? 'Modifier' : 'Ajouter'} {
                      editSection.section === "personalInfo" ? "les informations personnelles" : 
                      editSection.section === "projects" ? "un projet" :
                      editSection.section === "skills" ? "une compétence" :
                      editSection.section === "certifications" ? "une certification" : 
                      "une étape du parcours"
                    }
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={saveEdit}
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Save size={18} />
                      Sauvegarder
                    </button>
                  </div>
                </div>
                {renderEditForm()}
              </div>
            </div>
          ) : (
            <>
              {activeTab === "dashboard" && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Tableau de bord</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-gray-800/50 to-black/50 rounded-xl p-6 border border-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Projets</h3>
                        <div className="text-cyan-400 font-bold text-2xl">{data.projects?.length || 0}</div>
                      </div>
                      <p className="text-gray-400 text-sm">Projets actifs dans le portfolio</p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-800/50 to-black/50 rounded-xl p-6 border border-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Compétences</h3>
                        <div className="text-purple-400 font-bold text-2xl">{data.skills?.length || 0}</div>
                      </div>
                      <p className="text-gray-400 text-sm">Compétences techniques listées</p>
                    </div>
                    <div className="bg-gradient-to-br from-gray-800/50 to-black/50 rounded-xl p-6 border border-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Certifications</h3>
                        <div className="text-green-400 font-bold text-2xl">{data.certifications?.length || 0}</div>
                      </div>
                      <p className="text-gray-400 text-sm">Certifications professionnelles</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-800/50 to-black/50 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Aperçu du portfolio</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-lg">
                        <User className="text-cyan-400" />
                        <div>
                          <div className="text-white font-medium">{data.personalInfo?.name || "Nom non défini"}</div>
                          <div className="text-gray-400 text-sm">{data.personalInfo?.title || "Titre non défini"}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 bg-gray-800/30 rounded-lg">
                          <div className="text-cyan-400 text-lg font-bold">{data.personalInfo?.experience || "3+ années"}</div>
                          <div className="text-gray-400 text-sm">Expérience</div>
                        </div>
                        <div className="p-4 bg-gray-800/30 rounded-lg">
                          <div className="text-purple-400 text-lg font-bold">{data.personalInfo?.projects || "20+ projets"}</div>
                          <div className="text-gray-400 text-sm">Projets</div>
                        </div>
                        <div className="p-4 bg-gray-800/30 rounded-lg">
                          <div className="text-green-400 text-lg font-bold">{data.personalInfo?.availability || "Disponible"}</div>
                          <div className="text-gray-400 text-sm">Disponibilité</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "personal" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Informations personnelles</h2>
                    <button
                      onClick={() => startEdit("personalInfo")}
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Edit size={18} />
                      Modifier
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gradient-to-br from-gray-800/50 to-black/50 rounded-xl p-6 border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-4">Photo de profil</h3>
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-gray-900 to-black">
                            {data.personalInfo?.photo ? (
                              <img 
                                src={data.personalInfo.photo} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <User size={64} className="text-cyan-400" />
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <input
                            type="file"
                            id="photo-upload"
                            accept="image/*"
                            onChange={(e) => handlePhotoUpload(e, "personalInfo")}
                            className="hidden"
                          />
                          <label
                            htmlFor="photo-upload"
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                          >
                            <Upload size={18} />
                            Changer la photo
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-800/50 to-black/50 rounded-xl p-6 border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-4">CV / Curriculum Vitae</h3>
                      <div className="space-y-4">
                        <div className={`p-4 rounded-lg ${data.personalInfo?.cv_data ? 'bg-gray-800/30' : 'bg-gray-800/20 border border-dashed border-gray-700'}`}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <FileText className={data.personalInfo?.cv_data ? "text-cyan-400" : "text-gray-500"} />
                              <div>
                                <div className="text-white font-medium">
                                  {data.personalInfo?.cv_data ? data.personalInfo.cv_filename || "CV" : "Aucun CV téléchargé"}
                                </div>
                                {data.personalInfo?.cv_data && (
                                  <div className="text-gray-400 text-sm">
                                    {data.personalInfo.cv_type === 'application/pdf' ? 'PDF' : 
                                     data.personalInfo.cv_type?.includes('word') ? 'Word' : 'Document'}
                                    {data.personalInfo.cv_data ? 
                                      ` (${Math.round(data.personalInfo.cv_data.length / 1024)} KB)` : ''}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className={`px-2 py-1 text-xs rounded flex items-center gap-1 ${
                              data.personalInfo?.cv_data ? 'bg-green-900/30 text-green-400' : 'bg-gray-800 text-gray-400'
                            }`}>
                              {data.personalInfo?.cv_data ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                              {data.personalInfo?.cv_data ? 'Disponible' : 'Non téléchargé'}
                            </div>
                          </div>
                          
                          {data.personalInfo?.cv_data && (
                            <div className="text-xs text-cyan-300 mt-2">
                              ✔️ Le CV est stocké dans Supabase et sera disponible sur le portfolio.
                            </div>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <input
                              type="file"
                              id="cv-upload"
                              accept=".pdf,.doc,.docx"
                              onChange={handleCVUpload}
                              className="hidden"
                            />
                            <label
                              htmlFor="cv-upload"
                              className="px-4 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 w-full text-center"
                            >
                              <CloudUpload size={18} />
                              {data.personalInfo?.cv_data ? "Changer le CV" : "Ajouter un CV"}
                            </label>
                          </div>
                          
                          {data.personalInfo?.cv_data && (
                            <>
                              <button
                                onClick={downloadCV}
                                className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center justify-center gap-2"
                              >
                                <Download size={18} />
                                Télécharger
                              </button>
                              
                              <button
                                onClick={deleteCV}
                                className="px-4 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors flex items-center justify-center gap-2"
                              >
                                <Trash2 size={18} />
                                Supprimer
                              </button>
                            </>
                          )}
                        </div>
                        
                        {!data.personalInfo?.cv_data && (
                          <div className="text-xs text-gray-500 mt-2 space-y-1">
                            <p className="flex items-center gap-1">
                              📝 <strong>Instructions:</strong>
                            </p>
                            <ol className="list-decimal list-inside ml-4 space-y-1">
                              <li>Cliquez sur "Ajouter un CV" pour sélectionner votre fichier</li>
                              <li>Le CV sera automatiquement sauvegardé dans Supabase</li>
                              <li>Il sera disponible immédiatement sur le portfolio</li>
                            </ol>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-800/50 to-black/50 rounded-xl p-6 border border-gray-700">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <User className="text-cyan-400" />
                        <div>
                          <div className="text-gray-400 text-sm">Nom complet</div>
                          <div className="text-white font-medium">{data.personalInfo?.name || "Non défini"}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Briefcase className="text-cyan-400" />
                        <div>
                          <div className="text-gray-400 text-sm">Titre professionnel</div>
                          <div className="text-white font-medium">{data.personalInfo?.title || "Non défini"}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="text-cyan-400" />
                        <div>
                          <div className="text-gray-400 text-sm">Localisation</div>
                          <div className="text-white font-medium">{data.personalInfo?.location || "Non défini"}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="text-cyan-400" />
                        <div>
                          <div className="text-gray-400 text-sm">Email</div>
                          <div className="text-white font-medium">{data.personalInfo?.email || "Non défini"}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="text-cyan-400" />
                        <div>
                          <div className="text-gray-400 text-sm">Téléphone</div>
                          <div className="text-white font-medium">{data.personalInfo?.phone || "Non défini"}</div>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-gray-700">
                        <div className="text-gray-400 text-sm mb-2">À propos</div>
                        <div className="text-white">{data.personalInfo?.about || "Non défini"}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700">
                        <div className="text-center">
                          <div className="text-cyan-400 text-lg font-bold">{data.personalInfo?.experience || "3+ années"}</div>
                          <div className="text-gray-400 text-sm">Expérience</div>
                        </div>
                        <div className="text-center">
                          <div className="text-purple-400 text-lg font-bold">{data.personalInfo?.projects || "20+ projets"}</div>
                          <div className="text-gray-400 text-sm">Projets</div>
                        </div>
                        <div className="text-center">
                          <div className="text-green-400 text-lg font-bold">{data.personalInfo?.availability || "Disponible"}</div>
                          <div className="text-gray-400 text-sm">Disponibilité</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "projects" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Gestion des projets</h2>
                    <button
                      onClick={() => addItem("projects")}
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Plus size={18} />
                      Ajouter un projet
                    </button>
                  </div>

                  <div className="grid gap-6">
                    {data.projects?.map((project) => (
                      <div key={project.id} className="bg-gradient-to-br from-gray-800/50 to-black/50 rounded-xl p-6 border border-gray-700">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-white">{project.title || "Sans titre"}</h3>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`px-2 py-1 text-xs rounded ${
                                project.status === "Terminé" ? "bg-green-900/30 text-green-400" :
                                project.status === "En cours" ? "bg-blue-900/30 text-blue-400" :
                                "bg-yellow-900/30 text-yellow-400"
                              }`}>
                                {project.status || "En cours"}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEdit("projects", project.id)}
                              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => deleteItem("projects", project.id)}
                              className="p-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg transition-colors text-red-400"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-gray-400 text-sm mb-4">{project.description || "Aucune description"}</p>
                        
                        {project.tags && project.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.tags.map((tag, i) => (
                              <span key={i} className="px-2 py-1 bg-cyan-900/20 text-cyan-300 text-xs rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {/* Section images du projet */}
                        <div className="mb-6">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="text-white font-medium">Images du projet</h4>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 text-sm">
                                {project.images?.length || 0} image(s)
                              </span>
                              <input
                                type="file"
                                id={`project-images-${project.id}`}
                                accept="image/*"
                                multiple
                                onChange={(e) => handleProjectImagesUpload(e, project.id)}
                                className="hidden"
                              />
                              <label
                                htmlFor={`project-images-${project.id}`}
                                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors cursor-pointer flex items-center gap-2 text-sm"
                                disabled={uploadingImages[project.id]}
                              >
                                {uploadingImages[project.id] ? (
                                  <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Upload...
                                  </>
                                ) : (
                                  <>
                                    <Upload size={14} />
                                    Ajouter des images
                                  </>
                                )}
                              </label>
                            </div>
                          </div>
                          
                          {project.images && project.images.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                              {project.images.map((img, index) => (
                                <div key={index} className="relative group">
                                  <img 
                                    src={img} 
                                    alt={`${project.title} - ${index + 1}`}
                                    className="w-full h-40 object-cover rounded-lg border border-gray-700"
                                  />
                                  <button
                                    onClick={() => removeProjectImage(project.id, index)}
                                    className="absolute top-2 right-2 p-1.5 bg-red-600/80 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X size={14} className="text-white" />
                                  </button>
                                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                    {index + 1}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-8 border-2 border-dashed border-gray-700 rounded-lg text-center">
                              <Image className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                              <p className="text-gray-400">Aucune image pour ce projet</p>
                              <p className="text-gray-500 text-sm mt-1">
                                Cliquez sur "Ajouter des images" pour en ajouter
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-4 mt-4 pt-4 border-t border-gray-700">
                          {project.code_link && (
                            <a 
                              href={project.code_link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2 text-sm"
                            >
                              <ExternalLink size={14} />
                              Code source
                            </a>
                          )}
                          {project.demo_link && (
                            <a 
                              href={project.demo_link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-purple-400 hover:text-purple-300 flex items-center gap-2 text-sm"
                            >
                              <Globe size={14} />
                              Démo
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "skills" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Gestion des compétences</h2>
                    <button
                      onClick={() => addItem("skills")}
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Plus size={18} />
                      Ajouter une compétence
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {data.skills?.map((skill) => (
                      <div key={skill.id} className="bg-gradient-to-br from-gray-800/50 to-black/50 rounded-xl p-6 border border-gray-800 hover:border-cyan-500/50 transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{ICONS[skill.icon] || "💻"}</div>
                            <div>
                              <h3 className="text-lg font-bold text-white">{skill.name || "Sans nom"}</h3>
                              <div className="text-gray-400 text-sm">{skill.category || "Non catégorisé"}</div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEdit("skills", skill.id)}
                              className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => deleteItem("skills", skill.id)}
                              className="p-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg transition-colors text-red-400"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Niveau</span>
                            <span className="text-cyan-400 font-mono">{skill.level || 0}%</span>
                          </div>
                          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                              style={{ width: `${skill.level || 0}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "certifications" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Gestion des certifications</h2>
                    <button
                      onClick={() => addItem("certifications")}
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Plus size={18} />
                      Ajouter une certification
                    </button>
                  </div>

                  <div className="grid gap-4">
                    {data.certifications?.map((cert) => (
                      <div key={cert.id} className="bg-gradient-to-br from-gray-800/50 to-black/50 rounded-xl p-6 border border-gray-800 hover:border-cyan-500/50 transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <Award className="text-cyan-400" />
                            <div>
                              <h3 className="text-lg font-bold text-white">{cert.name || "Sans nom"}</h3>
                              <div className="text-gray-400 text-sm">{cert.issuer || "Non spécifié"}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className={`px-2 py-1 text-xs rounded ${
                              cert.status === "Obtenue" ? "bg-green-900/30 text-green-400" :
                              cert.status === "En cours" ? "bg-blue-900/30 text-blue-400" :
                              "bg-yellow-900/30 text-yellow-400"
                            }`}>
                              {cert.status || "Non spécifié"}
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEdit("certifications", cert.id)}
                                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => deleteItem("certifications", cert.id)}
                                className="p-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg transition-colors text-red-400"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                        {cert.date && (
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <Calendar size={14} />
                            {cert.date}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "timeline" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Gestion du parcours</h2>
                    <button
                      onClick={() => addItem("timeline")}
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Plus size={18} />
                      Ajouter une étape
                    </button>
                  </div>

                  <div className="relative">
                    <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-cyan-500 to-purple-500"></div>
                    
                    {data.timeline?.map((item, i) => (
                      <div key={item.id} className={`relative mb-8 ${i % 2 === 0 ? 'md:pr-1/2 md:pl-8' : 'md:pl-1/2 md:pr-8'}`}>
                        <div className="bg-gradient-to-br from-gray-800/50 to-black/50 rounded-xl p-6 border border-gray-800">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                                <span className="text-cyan-400 font-bold">{item.year || "Année"}</span>
                              </div>
                              <h4 className="text-white font-semibold text-lg">{item.title || "Sans titre"}</h4>
                              <p className="text-gray-400 text-sm mt-1">{item.description || "Aucune description"}</p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEdit("timeline", item.id)}
                                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => deleteItem("timeline", item.id)}
                                className="p-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg transition-colors text-red-400"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}