import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { supabase } from '../lib/supabaseClient'
import {
  SiCplusplus, SiPython, SiJavascript, SiReact, SiLinux, SiGit,
  SiTensorflow, SiSupabase
} from 'react-icons/si'
import { FaShieldAlt, FaNetworkWired, FaBrain, FaTools, FaBug, FaLock } from 'react-icons/fa'

const ICON_MAP = {
  'C++': SiCplusplus,
  'Python': SiPython,
  'JavaScript': SiJavascript,
  'React': SiReact,
  'Linux': SiLinux,
  'Git': SiGit,
  'TensorFlow': SiTensorflow,
  'Supabase': SiSupabase,
  'Ethical Hacking': FaBug,
  'Penetration Testing': FaLock,
  'Network Security': FaNetworkWired,
  'Machine Learning': FaBrain,
}

const CATEGORY_ORDER = ['Languages', 'Cybersecurity', 'AI/ML', 'Tools']

export default function Skills() {
  const [skills, setSkills] = useState([])
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    async function fetchSkills() {
      const { data } = await supabase.from('skills').select('*').order('proficiency', { ascending: false })
      if (data) setSkills(data)
    }
    fetchSkills()
  }, [])

  const grouped = CATEGORY_ORDER.map(cat => ({
    category: cat,
    items: skills.filter(s => s.category === cat)
  })).filter(g => g.items.length > 0)

  return (
    <section className="py-20 md:py-28 w-full max-w-full" id="skills">
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10">
        <motion.div
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-accent mb-4 before:content-[''] before:w-5 before:h-0.5 before:bg-accent"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          Expertise
        </motion.div>
        <motion.h2
          className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-wide uppercase"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          What I <span className="accent">Know</span>
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12" ref={ref}>
          {grouped.map((group, gi) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: gi * 0.1 }}
            >
              <h3 className="font-display text-2xl tracking-wider uppercase mb-6 pb-3 border-b-2 border-accent">{group.category}</h3>
              <div className="flex flex-col gap-5">
                {group.items.map((skill, si) => {
                  const IconComp = ICON_MAP[skill.name] || FaTools
                  return (
                    <div key={skill.id || si}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[13px] font-semibold uppercase tracking-wider flex items-center gap-2">
                          <IconComp className="text-accent text-base" />
                          {skill.name}
                        </span>
                        <span className="text-xs text-accent font-bold">{skill.proficiency}%</span>
                      </div>
                      <div className="w-full h-[3px] bg-dark rounded-sm overflow-hidden">
                        <div
                          className="h-full rounded-sm transition-all duration-[1.5s] ease-[cubic-bezier(0.22,1,0.36,1)]"
                          style={{
                            width: isInView ? `${skill.proficiency}%` : '0%',
                            background: 'linear-gradient(90deg, var(--blue), var(--accent))'
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
