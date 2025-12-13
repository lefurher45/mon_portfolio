"use client"

import React, { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Sphere } from "@react-three/drei"
import * as THREE from "three"
import {
  Cpu,
  Shield,
  Code,
  Terminal,
  Database,
  Network,
  Lock,
  Zap,
  Globe,
  Activity,
  Server,
  Fingerprint,
  Brain,
  Eye,
  Key,
  Binary,
  Bug,
  Search,
  ShieldCheck,
  AlertTriangle,
  Github,
  Linkedin,
  Mail,
  Phone,
  Download,
  Rocket,
  Sparkles,
  Atom,
  Satellite,
  Radar,
  Cctv,
  Wifi,
  WifiOff,
  ShieldAlert,
  Skull,
  Bot,
  Settings,
  Code2,
  User,
  AlertCircle,
  Award,
  MapPin,
  Calendar,
  ExternalLink,
  FileText,
  Users,
  Target,
  BarChart,
  Clock,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  RefreshCw,
  ChevronRight,
  Star,
  TrendingUp,
  Shield as ShieldIcon,
  Cloud as CloudIcon
} from "lucide-react"
import { supabase } from "@/lib/supabase"

// ================= TYPES =================
interface PersonalInfo {
  id?: string
  name: string
  title: string
  location: string
  email: string
  phone: string
  about: string
  photo: string | null
  cv_data: string | null
  cv_filename: string | null
  cv_type: string | null
  experience: string
  projects: string
  availability: string
  created_at?: string
  updated_at?: string
  stats?: any
}

interface Project {
  id: string
  title: string
  description: string
  details: string
  tags: string[]
  technologies: string[]
  status: string
  code_link: string
  demo_link: string
  image: string | null
}

interface Skill {
  id: string
  name: string
  level: number
  icon: string
  category: string
}

interface Certification {
  id: string
  name: string
  issuer: string
  status: string
  date: string
  link?: string
}

interface TimelineItem {
  id: string
  year: string
  title: string
  description: string
}

interface PortfolioData {
  personalInfo: PersonalInfo | null
  projects: Project[]
  skills: Skill[]
  certifications: Certification[]
  timeline: TimelineItem[]
}

interface ProjectDetailsProps {
  project: Project
  onClose: () => void
}

interface ProjectCardProps {
  project: Project
  index: number
  onClick: (project: Project) => void
}

interface SkillCardProps {
  skill: Skill
  index: number
}

interface CertificationCardProps {
  certification: Certification
  index: number
}

interface ContactCardProps {
  icon: React.ReactNode
  title: string
  description: string
  link: string
  pulse?: boolean
}

interface TimelineItemProps {
  item: TimelineItem
  index: number
}

interface SectionProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  bg?: string
  refProp?: React.RefObject<HTMLElement | null>
}

// ================= COMPOSANT 3D SIMPLIFIÉ =================
interface GlobeProps {
  speed: number
}

function SimpleGlobeWithChase({ speed }: GlobeProps) {
  const globeRef = useRef<THREE.Mesh>(null)
  const hackerRef = useRef<THREE.Group>(null)
  const agentRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    
    // Rotation de la sphère
    if (globeRef.current) {
      globeRef.current.rotation.y = t * 0.3 * speed
    }
    
    // Animation des personnages
    if (hackerRef.current && agentRef.current) {
      const radius = 1.6
      const hackerAngle = t * 0.8 * speed
      const agentAngle = hackerAngle + Math.PI * 0.7
      
      // Hacker (rouge)
      hackerRef.current.position.set(
        Math.cos(hackerAngle) * radius,
        Math.sin(t * 3) * 0.2,
        Math.sin(hackerAngle) * radius
      )
      
      // Agent (bleu)
      agentRef.current.position.set(
        Math.cos(agentAngle) * radius,
        Math.sin(t * 3 + Math.PI) * 0.2,
        Math.sin(agentAngle) * radius
      )
      
      // Orienter les personnages
      const hackerLookAt = new THREE.Vector3(
        Math.cos(hackerAngle + 0.1) * radius,
        Math.sin(t * 3) * 0.2,
        Math.sin(hackerAngle + 0.1) * radius
      )
      
      const agentLookAt = new THREE.Vector3(
        Math.cos(agentAngle + 0.1) * radius,
        Math.sin(t * 3 + Math.PI) * 0.2,
        Math.sin(agentAngle + 0.1) * radius
      )
      
      hackerRef.current.lookAt(hackerLookAt)
      agentRef.current.lookAt(agentLookAt)
    }
  })
  
  return (
    <group>
      {/* Sphère principale simple */}
      <Sphere ref={globeRef} args={[1.5, 32, 32]}>
        <meshStandardMaterial 
          color="#0ea5e9"
          emissive="#0ea5e9"
          emissiveIntensity={0.2}
          roughness={0.3}
          metalness={0.7}
          transparent
          opacity={0.2}
          wireframe
        />
      </Sphere>
      
      {/* Personnage rouge */}
      <group ref={hackerRef}>
        <mesh>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.3} />
        </mesh>
        {/* Corps */}
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[0.15, 0.2, 0.1]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
      </group>
      
      {/* Personnage bleu */}
      <group ref={agentRef}>
        <mesh>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.3} />
        </mesh>
        {/* Corps */}
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[0.15, 0.2, 0.1]} />
          <meshStandardMaterial color="#1d4ed8" />
        </mesh>
        {/* Bouclier */}
        <mesh position={[0.12, 0, 0]}>
          <boxGeometry args={[0.03, 0.2, 0.05]} />
          <meshStandardMaterial color="#60a5fa" />
        </mesh>
      </group>
    </group>
  )
}

// ================= PROJECT DETAILS =================
function ProjectDetailsPage({ project, onClose }: ProjectDetailsProps) {
  const isValidImage = (str: string | null): boolean => {
    if (!str) return false
    return str.startsWith('data:image/') || str.startsWith('http')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 backdrop-blur-lg z-[100] flex items-center justify-center p-4"
    >
      <div className="bg-gray-900/95 border border-cyan-500/30 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{project.title}</h2>
              <div className="flex gap-2 flex-wrap">
                {project.tags?.map((tag, i) => (
                  <span key={`tag-${i}`} className="text-sm bg-cyan-900/30 text-cyan-300 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
              {project.status && (
                <span className={`inline-block mt-2 px-3 py-1 text-xs rounded ${
                  project.status === "Terminé" ? "bg-green-900/30 text-green-400" :
                  project.status === "En cours" ? "bg-blue-900/30 text-blue-400" :
                  "bg-yellow-900/30 text-yellow-400"
                }`}>
                  {project.status}
                </span>
              )}
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              ×
            </button>
          </div>

          {project.image && isValidImage(project.image) && (
            <div className="mb-6">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-64 object-cover rounded-lg border border-gray-800"
              />
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-3">Description</h3>
              <p className="text-gray-300">{project.description}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-3">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies?.map((tech, i) => (
                  <span key={`tech-${i}`} className="text-sm bg-gray-800 text-gray-300 px-3 py-1 rounded">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {project.details && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-200 mb-3">Détails du projet</h3>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-gray-300">{project.details}</p>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            {project.code_link && (
              <a 
                href={project.code_link} 
                target="_blank" 
                rel="noreferrer" 
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Code size={18} /> Code Source
              </a>
            )}
            {project.demo_link && (
              <a 
                href={project.demo_link} 
                target="_blank" 
                rel="noreferrer" 
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center gap-2 transition-colors"
              >
                <ExternalLink size={18} /> Live Demo
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ================= PROJECT CARD =================
function ProjectCard({ project, index, onClick }: ProjectCardProps) {
  const statusColors: Record<string, string> = {
    'Terminé': 'bg-green-900/30 text-green-400 border-green-700/50',
    'En cours': 'bg-blue-900/30 text-blue-400 border-blue-700/50',
    'Planifié': 'bg-yellow-900/30 text-yellow-400 border-yellow-700/50',
    'En pause': 'bg-gray-900/30 text-gray-400 border-gray-700/50'
  }
  
  const isValidImage = (str: string | null): boolean => {
    if (!str) return false
    return str.startsWith('data:image/') || str.startsWith('http')
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      onClick={() => onClick(project)}
      className="bg-gradient-to-br from-gray-900/50 to-black/50 rounded-xl overflow-hidden border border-gray-800 hover:border-cyan-500/50 transition-all cursor-pointer group h-full flex flex-col"
    >
      {/* Image du projet */}
      {project.image && isValidImage(project.image) ? (
        <div className="h-48 overflow-hidden relative">
          <img 
            src={project.image} 
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-cyan-900/20 to-purple-900/20 flex items-center justify-center relative">
          <div className="text-cyan-400">
            <Code size={48} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>
      )}
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-white text-lg group-hover:text-cyan-300 transition-colors">
            {project.title}
          </h3>
          {project.status && (
            <span className={`text-xs px-2 py-1 rounded ${statusColors[project.status] || 'bg-gray-900/30 text-gray-400'}`}>
              {project.status}
            </span>
          )}
        </div>
        
        <p className="text-gray-400 text-sm mb-4 flex-1">
          {project.description}
        </p>
        
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {project.tags.slice(0, 3).map((tag, i) => (
              <span key={`tag-${i}`} className="text-xs bg-cyan-900/20 text-cyan-300 px-2 py-1 rounded">
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        <div className="flex justify-between items-center pt-4 border-t border-gray-800">
          <span className="text-cyan-400 text-sm font-medium">
            Voir les détails
          </span>
          <ExternalLink size={16} className="text-cyan-400 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  )
}

// ================= COMPOSANTS DE CARTE =================
function SkillCard({ skill, index }: SkillCardProps) {
  const iconMap: Record<string, React.ReactNode> = {
    'Cpu': <Cpu className="text-cyan-400" size={24} />,
    'Shield': <Shield className="text-cyan-400" size={24} />,
    'Code': <Code className="text-cyan-400" size={24} />,
    'Database': <Database className="text-cyan-400" size={24} />,
    'Network': <Network className="text-cyan-400" size={24} />,
    'Lock': <Lock className="text-cyan-400" size={24} />,
    'Brain': <Brain className="text-cyan-400" size={24} />,
    'Eye': <Eye className="text-cyan-400" size={24} />,
    'Key': <Key className="text-cyan-400" size={24} />,
    'Server': <Server className="text-cyan-400" size={24} />,
    'Terminal': <Terminal className="text-cyan-400" size={24} />,
    'Bug': <Bug className="text-cyan-400" size={24} />,
    'Search': <Search className="text-cyan-400" size={24} />,
    'Radar': <Radar className="text-cyan-400" size={24} />,
    'Satellite': <Satellite className="text-cyan-400" size={24} />,
    'Zap': <Zap className="text-cyan-400" size={24} />
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-gradient-to-br from-gray-900/50 to-black/50 rounded-xl p-5 border border-gray-800 hover:border-cyan-500/50 transition-all"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="text-cyan-400">
          {iconMap[skill.icon] || <Cpu className="text-cyan-400" size={24} />}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-white">{skill.name}</h3>
          <p className="text-sm text-gray-400">{skill.category || 'Développement'}</p>
        </div>
        <span className="text-cyan-400 font-bold font-mono">{skill.level}%</span>
      </div>
      
      <div className="space-y-2">
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: `${skill.level}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full relative"
          >
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 0px rgba(34, 211, 238, 0)",
                  "0 0 8px rgba(34, 211, 238, 0.8)",
                  "0 0 0px rgba(34, 211, 238, 0)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute right-0 top-0 w-1 h-full bg-cyan-300"
            />
          </motion.div>
        </div>
        
        <div className="flex justify-between text-xs text-gray-500">
          <span>Novice</span>
          <span>Intermédiaire</span>
          <span>Avancé</span>
          <span>Expert</span>
        </div>
      </div>
    </motion.div>
  )
}

function CertificationCard({ certification, index }: CertificationCardProps) {
  const statusColors: Record<string, string> = {
    'Obtenue': 'bg-green-900/30 text-green-400',
    'En cours': 'bg-blue-900/30 text-blue-400',
    'Planifiée': 'bg-yellow-900/30 text-yellow-400'
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-gradient-to-br from-gray-900/50 to-black/50 rounded-xl p-5 border border-gray-800 hover:border-cyan-500/50 transition-all"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="relative">
          <Award className="text-cyan-400" size={24} />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-white">{certification.name}</h3>
          <p className="text-sm text-gray-400">{certification.issuer}</p>
          {certification.date && (
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <Calendar size={12} />
              {certification.date}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <span className={`text-xs px-2 py-1 rounded ${statusColors[certification.status] || 'bg-gray-900/30 text-gray-400'}`}>
          {certification.status || 'Certifié'}
        </span>
        {certification.link && (
          <a href={certification.link} target="_blank" className="text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-1">
            Vérifier
            <ExternalLink size={12} />
          </a>
        )}
      </div>
    </motion.div>
  )
}

function ContactCard({ icon, title, description, link, pulse = false }: ContactCardProps) {
  return (
    <motion.a 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, y: -5 }}
      href={link}
      target="_blank"
      className="bg-gradient-to-br from-gray-900/50 to-black/50 rounded-xl p-5 border border-gray-800 hover:border-cyan-500/50 transition-all group block"
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          {icon}
          {pulse && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping"></div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-white group-hover:text-cyan-300 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-400 mt-1">{description}</p>
        </div>
      </div>
    </motion.a>
  )
}

function TimelineItemComponent({ item, index }: TimelineItemProps) {
  return (
    <div key={item.id} className={`relative mb-8 ${index % 2 === 0 ? 'md:pr-1/2 md:pl-8' : 'md:pl-1/2 md:pr-8'}`}>
      <div className="bg-gradient-to-br from-gray-900/50 to-black/50 p-6 rounded-xl border border-gray-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
          <span className="text-cyan-400 font-bold text-lg">{item.year}</span>
        </div>
        <h4 className="text-white font-semibold text-xl mb-2">{item.title}</h4>
        <p className="text-gray-300">{item.description}</p>
      </div>
    </div>
  )
}

// ================= SECTION COMPONENT =================
function Section({ title, subtitle, children, bg = "bg-black", refProp }: SectionProps) {
  return (
    <section ref={refProp} className={`py-20 ${bg} relative overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/20 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
        {children}
      </div>
    </section>
  )
}

// Fonction pour télécharger le CV depuis Supabase
const downloadCVFromBase64 = (cvData: string | null, cvFilename: string | null, cvType: string | null): boolean => {
  if (!cvData) {
    alert("CV non disponible")
    return false
  }

  try {
    // Extraire le type MIME et les données base64
    const base64String = cvData
    const mimeType = cvType || 'application/pdf'
    const filename = cvFilename || 'cv.pdf'
    
    // Convertir base64 en blob
    const byteString = atob(base64String.split(',')[1])
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    
    const blob = new Blob([ab], { type: mimeType })
    
    // Créer un lien de téléchargement
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    
    // Déclencher le téléchargement
    document.body.appendChild(link)
    link.click()
    
    // Nettoyer
    setTimeout(() => {
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    }, 100)
    
    return true
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error)
    alert("Erreur lors du téléchargement du CV")
    return false
  }
}

// Données par défaut
const DEFAULT_PERSONAL_INFO: PersonalInfo = {
  name: "Pana Adolphe",
  title: "Expert Cybersécurité & Développeur Full Stack",
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
  availability: "Disponible"
}

// Fonction pour charger les données depuis Supabase
const loadPortfolioData = async () => {
  try {
    console.log("🔄 Chargement des données du portfolio...")
    
    // Charger toutes les données depuis Supabase
    const [
      { data: personalInfo, error: personalError },
      { data: projects, error: projectsError },
      { data: skills, error: skillsError },
      { data: certifications, error: certsError },
      { data: timeline, error: timelineError }
    ] = await Promise.all([
      supabase.from('personal_info').select('*').limit(1).single(),
      supabase.from('projects').select('*').order('created_at', { ascending: false }),
      supabase.from('skills').select('*').order('created_at', { ascending: false }),
      supabase.from('certifications').select('*').order('created_at', { ascending: false }),
      supabase.from('timeline').select('*').order('year', { ascending: false })
    ])

    // Gestion des erreurs
    if (personalError) console.error("Erreur personal_info:", personalError)
    if (projectsError) console.error("Erreur projects:", projectsError)
    if (skillsError) console.error("Erreur skills:", skillsError)
    if (certsError) console.error("Erreur certifications:", certsError)
    if (timelineError) console.error("Erreur timeline:", timelineError)

    // Conversion des données pour correspondre à nos types
    const formattedProjects: Project[] = (projects || []).map((p: any) => ({
      id: p.id,
      title: p.title || "Sans titre",
      description: p.description || "",
      details: p.details || "",
      tags: Array.isArray(p.tags) ? p.tags : [],
      technologies: Array.isArray(p.technologies) ? p.technologies : [],
      status: p.status || "En cours",
      code_link: p.code_link || "",
      demo_link: p.demo_link || "",
      image: p.image || null
    }))

    const formattedSkills: Skill[] = (skills || []).map((s: any) => ({
      id: s.id,
      name: s.name || "Sans nom",
      level: Number(s.level) || 50,
      icon: s.icon || "Cpu",
      category: s.category || "Développement"
    }))

    const formattedCertifications: Certification[] = (certifications || []).map((c: any) => ({
      id: c.id,
      name: c.name || "Sans nom",
      issuer: c.issuer || "Non spécifié",
      status: c.status || "Obtenue",
      date: c.date || new Date().getFullYear().toString(),
      link: c.link || undefined
    }))

    const formattedTimeline: TimelineItem[] = (timeline || []).map((t: any) => ({
      id: t.id,
      year: t.year || new Date().getFullYear().toString(),
      title: t.title || "Sans titre",
      description: t.description || ""
    }))

    // Si nous avons des données personnelles, utiliser les colonnes séparées
    let personalData: PersonalInfo
    if (personalInfo) {
      personalData = {
        id: personalInfo.id,
        name: personalInfo.name || DEFAULT_PERSONAL_INFO.name,
        title: personalInfo.title || DEFAULT_PERSONAL_INFO.title,
        location: personalInfo.location || DEFAULT_PERSONAL_INFO.location,
        email: personalInfo.email || DEFAULT_PERSONAL_INFO.email,
        phone: personalInfo.phone || DEFAULT_PERSONAL_INFO.phone,
        about: personalInfo.about || DEFAULT_PERSONAL_INFO.about,
        photo: personalInfo.photo || null,
        cv_data: personalInfo.cv_data || null,
        cv_filename: personalInfo.cv_filename || null,
        cv_type: personalInfo.cv_type || null,
        // Utiliser les colonnes séparées (priorité) ou l'objet stats (rétrocompatibilité)
        experience: personalInfo.experience || 
                    (personalInfo.stats?.experience ? personalInfo.stats.experience : DEFAULT_PERSONAL_INFO.experience),
        projects: personalInfo.projects || 
                  (personalInfo.stats?.projects ? personalInfo.stats.projects : DEFAULT_PERSONAL_INFO.projects),
        availability: personalInfo.availability || 
                     (personalInfo.stats?.availability ? personalInfo.stats.availability : DEFAULT_PERSONAL_INFO.availability),
        created_at: personalInfo.created_at,
        updated_at: personalInfo.updated_at
      }
    } else {
      personalData = DEFAULT_PERSONAL_INFO
    }

    return {
      personalInfo: personalData,
      projects: formattedProjects,
      skills: formattedSkills,
      certifications: formattedCertifications,
      timeline: formattedTimeline
    }
  } catch (error) {
    console.error("🚨 Erreur lors du chargement des données:", error)
    // Retourner les données par défaut en cas d'erreur
    return {
      personalInfo: DEFAULT_PERSONAL_INFO,
      projects: [],
      skills: [],
      certifications: [],
      timeline: []
    }
  }
}

// ================= PORTFOLIO MAIN COMPONENT =================
export default function Portfolio() {
  const [activeSection, setActiveSection] = useState<string>("home")
  const [data, setData] = useState<PortfolioData>({
    personalInfo: null,
    projects: [],
    skills: [],
    certifications: [],
    timeline: []
  })
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [sphereSpeed, setSphereSpeed] = useState<number>(1)
  const [autoSpeed, setAutoSpeed] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(true)
  const [showNotification, setShowNotification] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<string>("")

  const sections = {
    home: useRef<HTMLElement>(null),
    projects: useRef<HTMLElement>(null),
    skills: useRef<HTMLElement>(null),
    certs: useRef<HTMLElement>(null),
    contact: useRef<HTMLElement>(null),
  }

  // Fonction pour charger les données
  const loadData = async () => {
    setLoading(true)
    try {
      const portfolioData = await loadPortfolioData()
      setData(portfolioData)
      setLastUpdate(new Date().toLocaleTimeString())
      console.log("✅ Données chargées avec succès")
    } catch (error) {
      console.error("Erreur lors du chargement:", error)
      setShowNotification("Erreur de chargement des données")
    } finally {
      setLoading(false)
    }
  }

  // Charger les données initiales
  useEffect(() => {
    loadData()
  }, [])

  // ================= SUIVI EN TEMPS RÉEL =================
  useEffect(() => {
    console.log("🔔 Initialisation du suivi en temps réel...")
    
    // S'abonner aux changements de toutes les tables
    const personalInfoChannel = supabase
      .channel('personal_info_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'personal_info' }, 
        (payload) => {
          console.log("📊 Changement détecté dans personal_info:", payload)
          setShowNotification("✅ Informations personnelles mises à jour")
          setTimeout(loadData, 500) // Recharger après 0.5s
        }
      )
      .subscribe()

    const projectsChannel = supabase
      .channel('projects_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'projects' }, 
        (payload) => {
          console.log("📊 Changement détecté dans projects:", payload)
          setShowNotification("📁 Projets mis à jour")
          setTimeout(loadData, 500)
        }
      )
      .subscribe()

    const skillsChannel = supabase
      .channel('skills_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'skills' }, 
        (payload) => {
          console.log("📊 Changement détecté dans skills:", payload)
          setShowNotification("⚡ Compétences mises à jour")
          setTimeout(loadData, 500)
        }
      )
      .subscribe()

    const certificationsChannel = supabase
      .channel('certifications_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'certifications' }, 
        (payload) => {
          console.log("📊 Changement détecté dans certifications:", payload)
          setShowNotification("🏆 Certifications mises à jour")
          setTimeout(loadData, 500)
        }
      )
      .subscribe()

    const timelineChannel = supabase
      .channel('timeline_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'timeline' }, 
        (payload) => {
          console.log("📊 Changement détecté dans timeline:", payload)
          setShowNotification("📅 Parcours mis à jour")
          setTimeout(loadData, 500)
        }
      )
      .subscribe()

    // Nettoyer les abonnements à la fin
    return () => {
      console.log("🔕 Désabonnement des canaux de suivi...")
      supabase.removeChannel(personalInfoChannel)
      supabase.removeChannel(projectsChannel)
      supabase.removeChannel(skillsChannel)
      supabase.removeChannel(certificationsChannel)
      supabase.removeChannel(timelineChannel)
    }
  }, [])

  const scrollTo = (section: string) => {
    const sectionRef = sections[section as keyof typeof sections]
    sectionRef.current?.scrollIntoView({ behavior: "smooth" })
    setActiveSection(section)
  }

  // Accélération automatique
  useEffect(() => {
    if (!autoSpeed) return
    
    const interval = setInterval(() => {
      setSphereSpeed(prev => {
        if (prev < 2.5) {
          return prev + 0.002
        }
        return prev
      })
    }, 100)
    
    return () => clearInterval(interval)
  }, [autoSpeed])

  // Gestionnaire de notification
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showNotification])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-400">Chargement du portfolio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black text-gray-200 min-h-screen relative overflow-x-hidden">
      {/* Notification en temps réel */}
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 bg-green-600 text-white flex items-center gap-2"
        >
          <RefreshCw className="animate-spin" size={16} />
          <span>{showNotification}</span>
        </motion.div>
      )}

      {/* Indicateur de mise à jour en temps réel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed top-4 left-4 z-40"
      >
        <div className="flex items-center gap-2 bg-gray-900/80 backdrop-blur-lg border border-gray-800 rounded-lg px-3 py-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-300">En direct</span>
          </div>
          <span className="text-xs text-gray-400">Dernière mise à jour: {lastUpdate}</span>
          <button 
            onClick={loadData}
            className="text-gray-400 hover:text-white transition-colors"
            title="Actualiser manuellement"
          >
            <RefreshCw size={12} />
          </button>
        </div>
      </motion.div>

      {/* ================= BACKGROUND ================= */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-transparent"></div>
      </div>

      {/* ================= NAVBAR ================= */}
      <nav className="fixed w-full z-50 bg-black/90 backdrop-blur-lg border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <ShieldIcon className="text-cyan-400" />
              </motion.div>
              <span className="text-white font-bold text-lg">{data.personalInfo?.name || "Portfolio"}</span>
            </div>

            <div className="hidden md:flex items-center gap-6">
              {['home', 'projects', 'skills', 'certs', 'contact'].map((section) => (
                <motion.button
                  key={section}
                  onClick={() => scrollTo(section)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative text-sm transition-colors ${
                    activeSection === section 
                      ? 'text-cyan-400' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {section === 'home' && 'Accueil'}
                  {section === 'projects' && 'Projets'}
                  {section === 'skills' && 'Compétences'}
                  {section === 'certs' && 'Certifications'}
                  {section === 'contact' && 'Contact'}
                  {activeSection === section && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cyan-400 rounded-full"
                    />
                  )}
                </motion.button>
              ))}
            </div>

            <button className="md:hidden text-gray-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* ================= PROJECT DETAILS MODAL ================= */}
      {selectedProject && (
        <ProjectDetailsPage
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {/* ================= HERO SECTION ================= */}
      <section ref={sections.home} className="min-h-screen flex items-center justify-center pt-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* GAUCHE - INFOS PERSONNELLES */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="flex flex-col lg:flex-row items-start gap-8">
                {/* Photo de profil */}
                <div className="relative mx-auto lg:mx-0">
                  <div className="w-48 h-48 rounded-full border-4 border-cyan-500/30 overflow-hidden bg-gradient-to-br from-gray-900 to-black shadow-2xl shadow-cyan-500/20">
                    {data.personalInfo?.photo ? (
                      <img 
                        src={data.personalInfo.photo} 
                        alt={data.personalInfo.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-900/20 to-purple-900/20">
                        <User size={96} className="text-cyan-400" />
                      </div>
                    )}
                  </div>
                  {/* Badge en ligne */}
                  <div className="absolute -bottom-2 -right-2 w-14 h-14 bg-gradient-to-br from-cyan-600 to-purple-600 rounded-full flex items-center justify-center border-4 border-black shadow-lg">
                    <ShieldCheck className="text-white" size={24} />
                  </div>
                  {/* Effet de scan */}
                  <motion.div 
                    className="absolute inset-0 rounded-full border-2 border-cyan-400/20"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </div>

                <div className="flex-1 text-center lg:text-left">
                  <motion.h1 
                    className="text-4xl md:text-5xl font-bold text-white mb-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {data.personalInfo?.name || "Nom non défini"}
                  </motion.h1>
                  <motion.p 
                    className="text-xl text-cyan-300 mb-4 flex items-center justify-center lg:justify-start gap-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <ShieldIcon size={22} /> {data.personalInfo?.title || "Expert Cybersécurité"}
                  </motion.p>
                  
                  <motion.div 
                    className="flex flex-wrap gap-2 justify-center lg:justify-start mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <span className="text-sm bg-red-900/30 text-red-300 px-3 py-1 rounded-full border border-red-700/50">
                      🔓 Pentesting
                    </span>
                    <span className="text-sm bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full border border-blue-700/50">
                      🛡️ Cybersécurité
                    </span>
                    <span className="text-sm bg-cyan-900/30 text-cyan-300 px-3 py-1 rounded-full border border-cyan-700/50">
                      💻 Full Stack
                    </span>
                  </motion.div>
                </div>
              </div>

              <motion.p 
                className="text-gray-300 text-lg leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {data.personalInfo?.about || "Spécialiste en cybersécurité offensive et défensive avec plusieurs années d'expérience."}
              </motion.p>

              <motion.div 
                className="grid grid-cols-3 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="bg-gradient-to-br from-gray-900/50 to-black/50 p-4 rounded-xl border border-gray-800 text-center">
                  <div className="text-2xl font-bold text-cyan-400">
                    {data.personalInfo?.experience || "3+ années"}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">Expérience</div>
                </div>
                <div className="bg-gradient-to-br from-gray-900/50 to-black/50 p-4 rounded-xl border border-gray-800 text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {data.personalInfo?.projects || "20+ projets"}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">Projets</div>
                </div>
                <div className="bg-gradient-to-br from-gray-900/50 to-black/50 p-4 rounded-xl border border-gray-800 text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {data.personalInfo?.availability || "Disponible"}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">Disponible</div>
                </div>
              </motion.div>

              <motion.div 
                className="flex flex-wrap gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <button 
                  onClick={() => {
                    if (data.personalInfo?.cv_data) {
                      downloadCVFromBase64(
                        data.personalInfo.cv_data,
                        data.personalInfo.cv_filename,
                        data.personalInfo.cv_type
                      )
                    } else {
                      setShowNotification("CV non disponible. Veuillez d'abord uploader votre CV via le dashboard.")
                    }
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-lg transition-all flex items-center gap-2 group"
                >
                  <Download size={20} />
                  <span className="relative">
                    Télécharger CV
                    <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-0.5 bg-white transition-all duration-300"></span>
                  </span>
                </button>
                <motion.button 
                  onClick={() => scrollTo('contact')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700"
                >
                  <span className="flex items-center gap-2">
                    <Mail size={18} /> Me contacter
                  </span>
                </motion.button>
              </motion.div>
            </motion.div>

            {/* DROITE - VISUALISATION 3D */}
            <motion.div 
              className="h-[500px] relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 5, 5]} intensity={0.8} color="#22d3ee" />
                
                <OrbitControls 
                  enableZoom={true}
                  autoRotate={autoSpeed}
                  autoRotateSpeed={sphereSpeed}
                  enablePan={false}
                  maxDistance={6}
                  minDistance={2.5}
                  rotateSpeed={0.5}
                />

                <SimpleGlobeWithChase speed={sphereSpeed} />
              </Canvas>
              
              <div className="absolute top-4 right-4">
                <div className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                  autoSpeed 
                    ? 'bg-cyan-600/80 text-white' 
                    : 'bg-gray-800/80 text-gray-400'
                }`}>
                  AUTO
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= PROJETS ================= */}
      <Section 
        title="Mes Projets" 
        subtitle="Découvrez mes réalisations en cybersécurité et développement"
        refProp={sections.projects}
        bg="bg-gradient-to-b from-black to-gray-950"
      >
        {data.projects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.projects.map((project, i) => (
              <ProjectCard 
                key={project.id}
                project={project}
                index={i}
                onClick={setSelectedProject}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Code className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500">Aucun projet disponible pour le moment.</p>
          </div>
        )}
      </Section>

      {/* ================= COMPÉTENCES ================= */}
      <Section 
        title="Mes Compétences" 
        subtitle="Expertises techniques en cybersécurité et développement"
        refProp={sections.skills}
        bg="bg-gradient-to-b from-gray-950 to-black"
      >
        {data.skills.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.skills.map((skill, i) => (
              <SkillCard 
                key={skill.id}
                skill={skill}
                index={i}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Cpu className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500">Aucune compétence disponible pour le moment.</p>
          </div>
        )}
        
        {/* Statistiques supplémentaires */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          <div className="bg-gradient-to-br from-gray-900/50 to-black/50 p-6 rounded-xl border border-gray-800 text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-2">50+</div>
            <div className="text-gray-400">Vulnérabilités trouvées</div>
          </div>
          <div className="bg-gradient-to-br from-gray-900/50 to-black/50 p-6 rounded-xl border border-gray-800 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">30+</div>
            <div className="text-gray-400">Systèmes audités</div>
          </div>
          <div className="bg-gradient-to-br from-gray-900/50 to-black/50 p-6 rounded-xl border border-gray-800 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">24/7</div>
            <div className="text-gray-400">Surveillance</div>
          </div>
          <div className="bg-gradient-to-br from-gray-900/50 to-black/50 p-6 rounded-xl border border-gray-800 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">100%</div>
            <div className="text-gray-400">Satisfaction client</div>
          </div>
        </div>
      </Section>

      {/* ================= CERTIFICATIONS ================= */}
      <Section 
        title="Certifications" 
        subtitle="Accréditations professionnelles en cybersécurité"
        refProp={sections.certs}
        bg="bg-gradient-to-b from-black to-gray-950"
      >
        {data.certifications.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.certifications.map((cert, i) => (
              <CertificationCard 
                key={cert.id}
                certification={cert}
                index={i}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500">Aucune certification disponible pour le moment.</p>
          </div>
        )}
        
        {/* Timeline */}
        {data.timeline.length > 0 && (
          <div className="mt-12">
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-cyan-500 to-purple-500"></div>
              
              {data.timeline.map((item, i) => (
                <TimelineItemComponent key={item.id} item={item} index={i} />
              ))}
            </div>
          </div>
        )}
      </Section>

      {/* ================= CONTACT ================= */}
      <Section 
        title="Contact" 
        subtitle="Travaillons ensemble pour sécuriser votre futur"
        refProp={sections.contact}
        bg="bg-gradient-to-b from-gray-950 to-black"
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            <ContactCard 
              icon={<Mail className="text-cyan-400" size={24} />}
              title="Email Professionnel"
              description="Contactez-moi pour des consultations"
              link={`mailto:${data.personalInfo?.email || 'contact@example.com'}`}
              pulse={true}
            />
            
            <ContactCard 
              icon={<Phone className="text-cyan-400" size={24} />}
              title="Appel Sécurisé"
              description="Discutons de votre projet"
              link={`tel:${data.personalInfo?.phone || '+22800000000'}`}
              pulse={true}
            />
            
            <ContactCard 
              icon={<Github className="text-white" size={24} />}
              title="GitHub"
              description="Voir mes projets open-source"
              link="https://github.com"
              pulse={false}
            />
            
            <ContactCard 
              icon={<Linkedin className="text-white" size={24} />}
              title="LinkedIn"
              description="Connectons-nous professionnellement"
              link="https://linkedin.com"
              pulse={false}
            />
          </div>
          
          {/* Formulaire de contact */}
          <div className="mt-12 bg-gradient-to-br from-gray-900/50 to-black/50 rounded-xl p-8 border border-gray-800">
            <h3 className="text-xl font-bold text-white mb-6">Envoyez un message</h3>
            <form className="space-y-6" onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault()
              setShowNotification("Message envoyé avec succès!")
              const form = e.target as HTMLFormElement
              form.reset()
            }}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Nom</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Email</label>
                  <input 
                    type="email" 
                    required
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Sujet</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="Sujet du message"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Message</label>
                <textarea 
                  rows={4}
                  required
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                  placeholder="Décrivez votre projet..."
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Mail size={18} />
                Envoyer le message
              </button>
            </form>
          </div>
        </div>
      </Section>

      {/* ================= FOOTER ================= */}
      <footer className="py-8 border-t border-gray-800/50 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <ShieldIcon className="text-cyan-400" />
              </motion.div>
              <div>
                <div className="text-white font-bold text-lg">{data.personalInfo?.name || "Portfolio"}</div>
                <div className="text-gray-400 text-sm">Expert Cybersécurité & Développement</div>
              </div>
            </div>
            
            <div className="flex gap-6">
              <a href="https://github.com" className="text-gray-400 hover:text-white transition-colors">
                <Github size={20} />
              </a>
              <a href="https://linkedin.com" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
              <a href={`mailto:${data.personalInfo?.email || 'contact@example.com'}`} className="text-gray-400 hover:text-white transition-colors">
                <Mail size={20} />
              </a>
            </div>
            
            <div className="text-gray-500 text-sm text-center md:text-right">
              <div>© {new Date().getFullYear()} {data.personalInfo?.name || "Portfolio"}. Tous droits réservés.</div>
              <div className="flex items-center gap-2 justify-center md:justify-end mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Système sécurisé et opérationnel</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* ================= ADMIN ACCESS BADGE ================= */}
      <motion.a
        href="/admin"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="fixed bottom-4 right-4 px-4 py-2 bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-lg rounded-lg border border-gray-700 z-40 text-sm text-gray-300 hover:text-white transition-all flex items-center gap-2"
        title="Accéder au dashboard admin"
      >
        <Settings size={14} />
        Admin
      </motion.a>

      {/* ================= REFRESH BUTTON ================= */}
      <motion.button
        onClick={loadData}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="fixed bottom-4 left-4 px-4 py-2 bg-cyan-600/80 hover:bg-cyan-700/80 backdrop-blur-lg rounded-lg border border-cyan-700 z-40 text-sm text-white transition-all flex items-center gap-2"
        title="Actualiser les données"
      >
        <RefreshCw size={14} />
        Actualiser
      </motion.button>
    </div>
  )
}