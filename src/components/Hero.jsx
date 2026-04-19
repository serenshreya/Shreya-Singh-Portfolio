import { motion } from 'framer-motion'
import { FaArrowRight, FaPlay, FaChevronDown } from 'react-icons/fa'
import { usePersonalInfo } from '../context/PersonalInfoContext'
import useGithubStats from '../hooks/useGithubStats'

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
}

export default function Hero() {
  const { personalInfo, loading: infoLoading } = usePersonalInfo()
  const { stats, loading: ghLoading } = useGithubStats(personalInfo?.github_username)

  const heroTitle = personalInfo?.display_title || ''
  const heroSubtitle = personalInfo?.hero_subtitle || ''

  const words = heroTitle.split(' ')
  const midPoint = Math.ceil(words.length / 2)
  const line1 = words.slice(0, midPoint).join(' ')
  const line2 = words.slice(midPoint).join(' ')

  const yearsOnGithub = stats?.createdAt
    ? new Date().getFullYear() - new Date(stats.createdAt).getFullYear()
    : 0

  return (
    <section className="min-h-screen flex items-center relative overflow-hidden pt-20 w-full max-w-full" id="home">
      {/* Grid background */}
      <div className="absolute inset-0 z-0" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[120px_1fr_380px] gap-10 items-center">
          {/* Stats column */}
          <motion.div
            className="grid grid-cols-4 lg:grid-cols-1 gap-4 lg:gap-12 order-3 lg:order-1 mb-4 lg:mb-0"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            {[
              { val: ghLoading ? '—' : stats.repos, label: 'Repos' },
              { val: ghLoading ? '—' : stats.stars, label: 'Stars' },
              { val: ghLoading ? '—' : stats.followers, label: 'Followers' },
              { val: ghLoading ? '—' : yearsOnGithub, label: 'Yrs GitHub' },
            ].map((s, i) => (
              <div key={i} className="text-center lg:text-left">
                <h3 className="font-display text-3xl md:text-4xl lg:text-[56px] text-accent leading-none">{s.val}</h3>
                <p className="text-[10px] md:text-[11px] uppercase tracking-[0.12em] text-muted mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Main content */}
          <motion.div
            className="relative z-[2] text-center lg:text-left order-2"
            initial="initial"
            animate="animate"
            variants={{ animate: { transition: { staggerChildren: 0.12 } } }}
          >
            {infoLoading ? (
              <div className="w-4/5 h-[100px] bg-white/5 rounded-lg animate-pulse" />
            ) : (
              <motion.h1
                className="font-display leading-[0.9] tracking-wide uppercase mb-6"
                style={{ fontSize: 'clamp(60px, 10vw, 140px)' }}
                variants={fadeUp}
              >
                {line1}
                <br />
                <span style={{ WebkitTextStroke: '2px var(--accent)', color: 'transparent' }}>{line2}</span>
              </motion.h1>
            )}

            <motion.p className="text-base text-muted max-w-[480px] leading-relaxed mb-10 mx-auto lg:mx-0" variants={fadeUp}>
              {heroSubtitle}
            </motion.p>
            <motion.div className="flex gap-4 items-center justify-center lg:justify-start" variants={fadeUp}>
              <a
                href={personalInfo?.resume_url || '#contact'}
                target={personalInfo?.resume_url ? '_blank' : '_self'}
                rel="noreferrer"
                className="btn-primary"
              >
                Get Started <FaArrowRight />
              </a>
              <a href="#projects" className="btn-outline">
                <FaPlay style={{ fontSize: 10 }} /> View Work
              </a>
            </motion.div>
          </motion.div>

          {/* Photo */}
          <motion.div
            className="relative z-[1] max-w-[280px] lg:max-w-none mx-auto order-1 lg:order-3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="absolute -top-5 -right-5 w-full h-full border-2 border-accent opacity-30 z-[-1]"
              style={{ clipPath: 'polygon(0 0, 85% 0, 100% 15%, 100% 100%, 15% 100%, 0 85%)' }} />
            <img
              src={personalInfo?.hero_photo || stats?.avatar_url || '/shreya.jpg'}
              alt={personalInfo?.full_name || 'Profile'}
              className="w-full h-[500px] object-cover border-2 border-accent grayscale-[20%] contrast-[1.1] hover:grayscale-0 hover:contrast-100 transition-all duration-500"
              style={{ clipPath: 'polygon(0 0, 85% 0, 100% 15%, 100% 100%, 15% 100%, 0 85%)' }}
              onError={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #1a1a1a, #0a0a0a)'
                e.target.style.display = 'flex'
                e.target.alt = ''
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator — hidden on mobile to avoid overlap with stats */}
      <div className="hidden md:flex absolute bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-muted text-[11px] tracking-[0.2em] uppercase animate-bounce-down">
        <span>Scroll Down</span>
        <FaChevronDown />
      </div>
    </section>
  )
}
