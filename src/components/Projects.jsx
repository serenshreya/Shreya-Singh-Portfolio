import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FaArrowRight, FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import { HiArrowUpRight } from 'react-icons/hi2'
import { supabase } from '../lib/supabaseClient'
import { usePersonalInfo } from '../context/PersonalInfoContext'
const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
}

const ensureUrl = (url) => {
  if (!url) return '#'
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `https://${url}`
}

const getDirectImageUrl = (url) => {
  if (!url) return '';
  const driveRegex = /drive\.google\.com\/file\/d\/([^/]+)/;
  const match = url.match(driveRegex);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return url;
}

// Derive a tech "initial" & gradient color from the tech_stack array
const getTechVisual = (techStack) => {
  if (!techStack || techStack.length === 0) return { initial: '</>', gradient: 'from-card to-dark2' }
  const first = techStack[0].toLowerCase()
  if (first.includes('python')) return { initial: 'PY', gradient: 'from-teal-900/40 to-dark2' }
  if (first.includes('c++') || first.includes('cpp')) return { initial: 'C++', gradient: 'from-blue-900/40 to-dark2' }
  if (first.includes('react')) return { initial: 'RE', gradient: 'from-cyan-900/40 to-dark2' }
  if (first.includes('javascript') || first.includes('js')) return { initial: 'JS', gradient: 'from-yellow-900/40 to-dark2' }
  if (first.includes('flask') || first.includes('django')) return { initial: 'PY', gradient: 'from-green-900/40 to-dark2' }
  if (first.includes('node')) return { initial: 'ND', gradient: 'from-lime-900/40 to-dark2' }
  if (first.includes('html')) return { initial: 'HT', gradient: 'from-orange-900/40 to-dark2' }
  return { initial: first.substring(0, 2).toUpperCase(), gradient: 'from-card to-dark2' }
}

// Tech badge overflow with "+N more"
function TechBadges({ stack, maxRows = 2, small = false }) {
  const [overflowCount, setOverflowCount] = useState(0)
  const visibleMax = maxRows === 2 ? 6 : 4 // rough estimate
  const visible = stack?.slice(0, visibleMax) || []
  const extra = (stack?.length || 0) - visibleMax

  return (
    <div className={`flex flex-wrap gap-1.5 overflow-hidden ${maxRows === 2 ? 'max-h-[52px]' : 'max-h-[28px]'}`}>
      {visible.map((tech, j) => (
        <span key={j} className={`tech-pill ${small ? '!text-[9px] !px-2 !py-0.5' : ''} max-w-[120px] truncate`}>{tech}</span>
      ))}
      {extra > 0 && (
        <span className={`text-muted text-[10px] font-semibold self-center`}>+{extra} more</span>
      )}
    </div>
  )
}

// === STANDARD CARD ===
function StandardCard({ project, index, isWide = false }) {
  const { initial, gradient } = getTechVisual(project.tech_stack)

  if (isWide) {
    // Full-width split card — Row 2
    return (
      <motion.div
        className="group col-span-2 bg-card border border-white/10 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-accent hover:shadow-[0_20px_60px_rgba(200,255,0,0.08)]"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[200px]">
          {/* Left half */}
          <div className="p-8 flex flex-col justify-center border-r-0 md:border-r border-white/10">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-display text-3xl tracking-wide uppercase">{project.title}</h3>
              <a href={ensureUrl(project.live_url || project.github_url)} target="_blank" rel="noopener noreferrer" className="text-accent">
                <HiArrowUpRight className="text-xl transition-transform duration-300 group-hover:rotate-45" />
              </a>
            </div>
            <TechBadges stack={project.tech_stack} />
            <div className="flex gap-4 mt-6">
              {project.github_url && (
                <a href={ensureUrl(project.github_url)} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted hover:text-accent transition-colors min-h-[44px]">
                  <FaGithub /> GitHub
                </a>
              )}
              {project.live_url && (
                <a href={ensureUrl(project.live_url)} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted hover:text-accent transition-colors min-h-[44px]">
                  <FaExternalLinkAlt /> Live Demo
                </a>
              )}
            </div>
          </div>
          {/* Right half — description */}
          <div className="p-8 flex items-center">
            <p className="text-sm text-muted leading-relaxed">{project.description}</p>
          </div>
        </div>
      </motion.div>
    )
  }

  // Standard card — Row 1
  return (
    <motion.div
      className="group bg-card border border-white/10 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-accent hover:shadow-[0_20px_60px_rgba(200,255,0,0.08)]"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Card header: iframe > uploaded image > gradient fallback */}
      <div className={`h-[180px] bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden`}>
        {project.live_url ? (
          <div className="w-full h-full overflow-hidden relative">
            <iframe
              src={ensureUrl(project.live_url)}
              title={project.title}
              className="border-0 pointer-events-none absolute top-0 left-0 origin-top-left"
              style={{ width: '286%', height: '286%', transform: 'scale(0.35)' }}
              loading="lazy"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        ) : project.image_url ? (
          <img
            src={getDirectImageUrl(project.image_url)}
            alt={project.title}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML += `<span class="font-display text-7xl text-white/[0.07] select-none absolute inset-0 flex items-center justify-center">${initial}</span>` }}
          />
        ) : (
          <span className="font-display text-7xl text-white/[0.07] select-none">{initial}</span>
        )}
      </div>
      {/* Body */}
      <div className="p-6 md:p-8">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-display text-[26px] tracking-wide uppercase">{project.title}</h3>
          <a href={ensureUrl(project.live_url || project.github_url)} target="_blank" rel="noopener noreferrer" className="text-accent">
            <HiArrowUpRight className="text-xl transition-transform duration-300 group-hover:rotate-45" />
          </a>
        </div>
        <p className="text-sm text-muted leading-relaxed mb-5 line-clamp-2">{project.description}</p>
        <TechBadges stack={project.tech_stack} />
        <div className="flex gap-4 mt-5 pt-5 border-t border-white/10">
          {project.github_url && (
            <a href={ensureUrl(project.github_url)} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted hover:text-accent transition-colors min-h-[44px]">
              <FaGithub /> GitHub
            </a>
          )}
          {project.live_url && (
            <a href={ensureUrl(project.live_url)} target="_blank" rel="noopener noreferrer"
               className="ml-auto flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted hover:text-accent transition-colors min-h-[44px]">
              <FaExternalLinkAlt /> Live Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// === FEATURED CARD ===
function FeaturedCard({ project }) {
  const imgUrl = getDirectImageUrl(project.image_url)

  return (
    <motion.div
      className="group col-span-2 relative min-h-[400px] bg-card border border-white/10 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-accent hover:shadow-[0_20px_60px_rgba(200,255,0,0.08)]"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {/* Background image */}
      {imgUrl && (
        <img
          src={imgUrl}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { e.target.style.display = 'none' }}
        />
      )}
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/[0.92] via-black/50 to-transparent" />

      {/* FEATURED badge */}
      <div className="absolute top-6 left-6 z-10">
        <span className="bg-accent text-black text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1">FEATURED</span>
      </div>

      {/* Arrow top-right */}
      <a href={ensureUrl(project.live_url || project.github_url)} target="_blank" rel="noopener noreferrer"
         className="absolute top-6 right-6 z-10 text-accent">
        <HiArrowUpRight className="text-2xl transition-transform duration-300 group-hover:rotate-45" />
      </a>

      {/* Content at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
        <h3 className="font-display text-4xl md:text-5xl tracking-wide uppercase mb-3">{project.title}</h3>
        <p className="text-sm text-white/70 leading-relaxed max-w-2xl line-clamp-2 mb-4">{project.description}</p>
        <TechBadges stack={project.tech_stack} small />
        {/* Icon-only links bottom right */}
        <div className="flex gap-3 mt-4 justify-end">
          {project.github_url && (
            <a href={ensureUrl(project.github_url)} target="_blank" rel="noopener noreferrer"
               className="w-10 h-10 border border-white/20 flex items-center justify-center text-white/70 hover:text-accent hover:border-accent transition-all min-h-[44px]">
              <FaGithub />
            </a>
          )}
          {project.live_url && (
            <a href={ensureUrl(project.live_url)} target="_blank" rel="noopener noreferrer"
               className="w-10 h-10 border border-white/20 flex items-center justify-center text-white/70 hover:text-accent hover:border-accent transition-all min-h-[44px]">
              <FaExternalLinkAlt />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const [projects, setProjects] = useState([])
  const { personalInfo } = usePersonalInfo()

  useEffect(() => {
    async function fetchProjects() {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) setProjects(data)
    }
    fetchProjects()
  }, [])

  const featured = projects.find(p => p.featured)
  const nonFeatured = projects.filter(p => !p.featured).slice(0, 3)

  // Row 1: first 2, Row 2: third, Row 3: featured
  const row1 = nonFeatured.slice(0, 2)
  const row2 = nonFeatured[2] || null

  return (
    <section className="py-20 md:py-28 w-full max-w-full" id="projects" style={{ background: 'var(--bg2)' }}>
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10">
        <motion.div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-accent mb-4 before:content-[''] before:w-5 before:h-0.5 before:bg-accent" {...fadeUp}>
          Selected Work
        </motion.div>
        <motion.h2 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-wide uppercase mb-12" {...fadeUp}>
          Featured <span className="accent">Projects</span>
        </motion.h2>

        {/* Desktop: Magazine grid | Mobile: Vertical stack */}
        <div className="flex flex-col gap-6">
          {/* Mobile: Featured first */}
          {featured && (
            <div className="block md:hidden">
              <FeaturedCard project={featured} />
            </div>
          )}

          {/* Row 1: Two cards side by side */}
          {row1.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {row1.map((p, i) => (
                <StandardCard key={p.id} project={p} index={i} />
              ))}
            </div>
          )}

          {/* Row 2: Full-width wide card */}
          {row2 && (
            <div className="grid grid-cols-2">
              <StandardCard project={row2} index={2} isWide />
            </div>
          )}

          {/* Row 3: Featured (desktop only) */}
          {featured && (
            <div className="hidden md:grid grid-cols-2">
              <FeaturedCard project={featured} />
            </div>
          )}
        </div>

        {personalInfo.github_url && (
          <motion.div className="text-center mt-12" {...fadeUp}>
            <a href={personalInfo.github_url} target="_blank" rel="noopener noreferrer" className="btn-outline">
              All Projects <FaArrowRight />
            </a>
          </motion.div>
        )}
      </div>
    </section>
  )
}
