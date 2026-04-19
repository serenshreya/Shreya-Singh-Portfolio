import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FaArrowRight, FaGithub, FaStar, FaRocket } from 'react-icons/fa'
import { supabase } from '../lib/supabaseClient'
import { usePersonalInfo } from '../context/PersonalInfoContext'
import useGithubStats from '../hooks/useGithubStats'

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
}

export default function About() {
  const [topSkills, setTopSkills] = useState([])
  const { personalInfo } = usePersonalInfo()
  const { stats } = useGithubStats(personalInfo?.github_username)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    async function fetchData() {
      const { data: skillsData } = await supabase
        .from('skills')
        .select('*')
        .order('proficiency', { ascending: false })
        .limit(5)
      if (skillsData) setTopSkills(skillsData)
    }
    fetchData()
  }, [])

  return (
    <section className="py-20 md:py-28 relative w-full max-w-full" id="about"
      style={{
        backgroundImage: 'linear-gradient(rgba(200,255,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(200,255,0,0.03) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10">
        <motion.div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-accent mb-4 before:content-[''] before:w-5 before:h-0.5 before:bg-accent" {...fadeUp}>
          Who I Am
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_360px_1fr] gap-8 lg:gap-12 mt-6" ref={ref}>
          {/* Column 1: Text + Badges */}
          <motion.div {...fadeUp}>
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[0.95] uppercase tracking-wide mb-5">
              Creativity<br />
              Meets<br />
              <span className="accent">Strategy.</span>
            </h2>
            <p className="text-[15px] text-muted leading-[1.8] mb-7">
              {personalInfo?.about_paragraph || ''}
            </p>
            <div className="flex flex-col gap-2.5 mb-7">
              {personalInfo?.university && (
                <div className="flex items-center gap-2.5 text-sm font-medium">
                  <span className="text-lg">♟</span>
                  <span>{personalInfo.university}</span>
                </div>
              )}
              {personalInfo?.current_project && (
                <div className="flex items-center gap-2.5 text-sm font-medium">
                  <span className="text-lg">🚀</span>
                  <span>Building {personalInfo.current_project}</span>
                </div>
              )}
              {personalInfo?.career_goal && (
                <div className="flex items-center gap-2.5 text-sm font-medium">
                  <span className="text-lg">🛡</span>
                  <span>{personalInfo.career_goal}</span>
                </div>
              )}
            </div>
            <div className="flex gap-4 flex-wrap">
              <a href="#contact" className="btn-primary">About Me <FaArrowRight /></a>
              {personalInfo?.linkedin_url && (
                <a href={personalInfo.linkedin_url} target="_blank" rel="noopener noreferrer" className="btn-outline">
                  LinkedIn <FaArrowRight />
                </a>
              )}
            </div>
          </motion.div>

          {/* Column 2: Photo */}
          <motion.div
            className="relative order-first md:order-none max-w-[340px] mx-auto md:max-w-none"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="relative">
              <div className="absolute top-5 -right-5 w-full h-full border-2 border-accent z-0" />
              <img
                src={personalInfo?.about_photo || stats?.avatar_url || '/shreya.jpg'}
                alt={personalInfo?.full_name || 'Profile'}
                className="w-full h-[460px] object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-500 relative z-[1]"
                onError={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, rgba(200,255,0,0.1), #1a1a1a)'
                  e.target.alt = ''
                }}
              />
              {/* Open to Work badge */}
              <div className="absolute bottom-5 -left-3 z-[2] bg-accent text-black py-2 px-4 text-[11px] font-extrabold tracking-[0.12em] uppercase flex items-center gap-2 font-sans">
                <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse-dot" />
                OPEN TO WORK
              </div>
              {/* Years badge */}
              {stats?.createdAt && (
                <div className="absolute top-4 -left-4 z-[2] bg-dark2 border border-white/[0.08] py-2.5 px-3.5 flex flex-col items-center gap-0.5">
                  <span className="font-display text-[28px] text-accent leading-none">{new Date().getFullYear() - new Date(stats.createdAt).getFullYear()}+</span>
                  <span className="text-[9px] font-bold tracking-[0.15em] uppercase text-muted">YRS GITHUB</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Column 3: Skill bars + GitHub stats */}
          <motion.div className="flex flex-col gap-6 lg:col-span-1 md:col-span-2 lg:col-auto" {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }}>
            <div className="flex flex-col gap-5">
              {topSkills.map((skill, i) => (
                <div key={skill.id || i}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[13px] font-semibold uppercase tracking-wider">{skill.name}</span>
                    <span className="text-xs text-accent font-bold">{skill.proficiency}%</span>
                  </div>
                  <div className="skill-bar-bg">
                    <motion.div
                      className="skill-bar-fill"
                      initial={{ width: 0 }}
                      animate={{ width: isInView ? `${skill.proficiency}%` : 0 }}
                      transition={{ duration: 1.2, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* GitHub mini stats card */}
            <div className="bg-card border border-white/[0.08] p-5 flex flex-col gap-3.5">
              <div className="flex items-center gap-2.5">
                <FaGithub className="text-muted text-sm" />
                <span className="text-[13px] text-muted flex-1">Repositories</span>
                <span className="font-display text-[22px] text-accent leading-none">{stats?.repos || 0}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FaStar className="text-muted text-sm" />
                <span className="text-[13px] text-muted flex-1">Stars Earned</span>
                <span className="font-display text-[22px] text-accent leading-none">{stats?.stars || 0}</span>
              </div>
              {stats?.latestRepo && (
                <div className="flex items-center gap-2.5">
                  <FaRocket className="text-muted text-sm" />
                  <span className="text-[13px] text-muted flex-1">Latest Push:</span>
                  <span className="text-[13px] text-white font-semibold">{stats.latestRepo.name}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Bottom stats bar */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 mt-12 border border-white/[0.08] bg-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {[
            { val: personalInfo?.stat_1_val || '300+', label: personalInfo?.stat_1_label || 'Commits' },
            { val: personalInfo?.stat_2_val || '200+', label: personalInfo?.stat_2_label || 'Hours Coded' },
            { val: personalInfo?.stat_3_val || '100%', label: personalInfo?.stat_3_label || 'Dedication' },
            { val: personalInfo?.stat_4_val || '♟', label: personalInfo?.stat_4_label || 'Chess Mindset' },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center justify-center py-7 px-4 gap-1.5 border-r border-white/[0.08] last:border-r-0">
              <span className="font-display text-4xl text-accent leading-none">{s.val}</span>
              <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-muted">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
