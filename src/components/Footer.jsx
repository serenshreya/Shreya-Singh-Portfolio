import { FaGithub, FaLinkedinIn, FaEnvelope, FaHeart } from 'react-icons/fa'
import { usePersonalInfo } from '../context/PersonalInfoContext'

export default function Footer() {
  const footerTaglines = ['OPEN TO WORK', 'CYBERSECURITY', 'AI', 'HIRE ME', 'C++ DSA', 'ETHICAL HACKING']
  const { personalInfo } = usePersonalInfo()

  return (
    <footer className="pt-20 border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10">
        <div className="font-display text-center leading-[0.9] uppercase tracking-wide opacity-[0.08] select-none"
          style={{ fontSize: 'clamp(60px, 12vw, 200px)' }}>
          {personalInfo?.full_name ? personalInfo.full_name.toUpperCase() : ''}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center py-10 border-t border-white/[0.08] mt-10 gap-5 text-center md:text-left">
          <p className="text-[13px] text-muted">
            © {new Date().getFullYear()} {personalInfo?.full_name || ''}. Built with <FaHeart className="inline text-accent text-xs align-middle" /> and code.
          </p>

          <div className="flex gap-6">
            {['home', 'about', 'projects', 'contact'].map(s => (
              <a key={s} href={`#${s}`} className="text-[13px] text-muted uppercase tracking-wider hover:text-accent transition-colors">
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </a>
            ))}
          </div>

          <div className="flex gap-4">
            {personalInfo?.github_url && (
              <a href={personalInfo.github_url} target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 border border-white/[0.08] flex items-center justify-center text-muted hover:text-accent hover:border-accent hover:bg-accent/5 transition-all">
                <FaGithub />
              </a>
            )}
            {personalInfo?.linkedin_url && (
              <a href={personalInfo.linkedin_url} target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 border border-white/[0.08] flex items-center justify-center text-muted hover:text-accent hover:border-accent hover:bg-accent/5 transition-all">
                <FaLinkedinIn />
              </a>
            )}
            {personalInfo?.email && (
              <a href={`mailto:${personalInfo.email}`}
                 className="w-10 h-10 border border-white/[0.08] flex items-center justify-center text-muted hover:text-accent hover:border-accent hover:bg-accent/5 transition-all">
                <FaEnvelope />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Footer ticker */}
      <div className="overflow-hidden border-t border-b border-white/[0.08] mt-10 w-full max-w-full">
        <div className="bg-accent flex whitespace-nowrap py-4">
          <div className="flex animate-ticker">
            {[...Array(4)].map((_, setIdx) =>
              footerTaglines.map((tag, i) => (
                <span className="font-display text-lg tracking-[0.1em] uppercase px-6 flex items-center gap-6 text-black" key={`${setIdx}-${i}`}>
                  {tag}
                  <span className="w-2 h-2 bg-current rotate-45 flex-shrink-0" />
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
