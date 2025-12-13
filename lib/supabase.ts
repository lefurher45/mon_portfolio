import { createClient } from '@supabase/supabase-js'

// Vérification des variables d'environnement avec des valeurs par défaut
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Validation des variables d'environnement (en développement)
if (typeof window === 'undefined' && (!supabaseUrl || !supabaseAnonKey)) {
  console.warn('⚠️ Variables d\'environnement Supabase manquantes')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Fonctions utilitaires pour upload/download
export const uploadFile = async (file: File, bucket = 'portfolio', path = '') => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${path}${Date.now()}.${fileExt}`
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file)

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName)

  return publicUrl
}

// Fonction pour supprimer un fichier
export const deleteFile = async (url: string, bucket = 'portfolio') => {
  const fileName = url.split('/').pop()
  if (!fileName) return false
  
  const { error } = await supabase.storage
    .from(bucket)
    .remove([fileName])
  
  if (error) {
    console.error('Erreur lors de la suppression du fichier:', error)
    return false
  }
  
  return true
}

// Log pour le debug
if (typeof window !== 'undefined') {
  console.log('Supabase URL disponible:', !!supabaseUrl)
  console.log('Supabase Key disponible:', !!supabaseAnonKey)
}

