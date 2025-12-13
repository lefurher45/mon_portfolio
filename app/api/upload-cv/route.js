import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('cv')
    
    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    // Convertir le fichier en buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Créer le dossier uploads s'il n'existe pas
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    // Chemin où sauvegarder le CV
    const cvPath = path.join(uploadDir, 'cv.pdf')
    
    // Sauvegarder le fichier
    fs.writeFileSync(cvPath, buffer)

    // URL accessible publiquement
    const publicUrl = '/uploads/cv.pdf'

    return NextResponse.json({
      success: true,
      url: publicUrl,
      message: 'CV uploadé avec succès',
      timestamp: Date.now()
    })

  } catch (error) {
    console.error('Erreur upload:', error)
    return NextResponse.json(
      { error: 'Erreur lors du téléchargement du CV' },
      { status: 500 }
    )
  }
}

// Endpoint pour vérifier si le CV existe
export async function GET() {
  try {
    const cvPath = path.join(process.cwd(), 'public', 'uploads', 'cv.pdf')
    const exists = fs.existsSync(cvPath)

    return NextResponse.json({
      exists,
      url: exists ? '/uploads/cv.pdf' : null,
      timestamp: exists ? fs.statSync(cvPath).mtimeMs : null
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}