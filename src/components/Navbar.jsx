import { useState, useEffect } from 'react'
import { FaGithub } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { usePersonalInfo } from '../context/PersonalInfoContext'

const NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const { personalInfo } = usePersonalInfo()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      const sections = NAV_ITEMS.map(i => i.href.replace('#', ''))
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i])
        if (el && el.getBoundingClientRect().top <= 200) {
          setActiveSection(sections[i])
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleNavClick = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 w-full z-[1000] py-5 transition-all duration-500 ${
          scrolled ? 'bg-dark/95 backdrop-blur-xl border-b border-white/[0.08] py-3' : ''
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10 flex items-center justify-between">
          <a href="#home" className="flex items-center gap-3 font-display text-2xl tracking-[0.1em]" onClick={(e) => handleNavClick(e, '#home')}>
            <span className="text-accent font-bold">{personalInfo?.full_name ? personalInfo.full_name.match(/\b\w/g)?.join('').substring(0,2).toUpperCase() : 'SS'}</span>
            <span>{personalInfo?.full_name ? personalInfo.full_name.toUpperCase() : ''}</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map(item => (
              <a
                key={item.href}
                href={item.href}
                className={`text-[13px] font-medium uppercase tracking-widest relative transition-colors duration-300
                  after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:bg-accent after:transition-all after:duration-300
                  ${activeSection === item.href.replace('#', '')
                    ? 'text-accent after:w-full'
                    : 'text-muted hover:text-accent after:w-0 hover:after:w-full'
                  }`}
                onClick={(e) => handleNavClick(e, item.href)}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {personalInfo?.github_url && (
              <a href={personalInfo.github_url} target="_blank" rel="noopener noreferrer" className="text-muted text-xl hover:text-accent transition-colors">
                <FaGithub />
              </a>
            )}
            <a href="#contact" className="btn-primary !py-2.5 !px-6 !text-xs hidden md:inline-flex" onClick={(e) => handleNavClick(e, '#contact')}>
              Hire Me
            </a>
            <button
              className="flex md:hidden flex-col gap-[5px] bg-transparent border-none p-1 cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 bg-dark/[0.98] backdrop-blur-xl z-[999] flex flex-col items-center justify-center gap-8"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {NAV_ITEMS.map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                className="font-display text-4xl tracking-wide uppercase text-white hover:text-accent transition-colors"
                onClick={(e) => handleNavClick(e, item.href)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 + 0.1 }}
              >
                {item.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
