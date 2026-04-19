import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabaseClient'

export default function Experience() {
  const [experiences, setExperiences] = useState([])

  useEffect(() => {
    async function fetchExp() {
      const { data } = await supabase
        .from('experience')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) setExperiences(data)
    }
    fetchExp()
  }, [])

  return (
    <section className="py-20 md:py-28 w-full max-w-full" id="experience" style={{ background: 'var(--bg2)' }}>
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10">
        <motion.div
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-accent mb-4 before:content-[''] before:w-5 before:h-0.5 before:bg-accent"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          Journey
        </motion.div>
        <motion.h2
          className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-wide uppercase"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          Experience & <span className="accent">Education</span>
        </motion.h2>

        <div className="relative mt-12 pl-10 before:content-[''] before:absolute before:left-[15px] before:top-0 before:bottom-0 before:w-0.5 before:bg-white/[0.08]">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.id}
              className="relative pb-12 last:pb-0"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              {/* Timeline dot */}
              <div className={`absolute -left-[33px] top-1.5 w-3 h-3 rounded-full z-[2] border-2 ${
                exp.is_current
                  ? 'bg-accent border-accent shadow-[0_0_0_4px_rgba(200,255,0,0.2)] animate-pulse-ring'
                  : 'bg-card border-muted'
              }`} />

              <div className="text-xs text-accent font-semibold tracking-widest uppercase mb-2">{exp.duration}</div>
              <h3 className="font-display text-[28px] tracking-wide uppercase mb-1">{exp.role}</h3>
              <p className="text-sm text-muted mb-3">{exp.company}</p>
              <p className="text-sm text-muted leading-[1.7] max-w-[600px]">{exp.description}</p>
              <span className="timeline-type">{exp.type}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
