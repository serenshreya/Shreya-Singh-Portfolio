import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaArrowRight, FaGithub, FaLinkedinIn, FaEnvelope, FaPhone, FaCalendarAlt, FaFileDownload } from 'react-icons/fa'
import { supabase } from '../lib/supabaseClient'
import { usePersonalInfo } from '../context/PersonalInfoContext'
import toast from 'react-hot-toast'

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)
  const { personalInfo } = usePersonalInfo()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all fields')
      return
    }
    setSending(true)
    try {
      const { error } = await supabase.from('contact_messages').insert([form])
      if (error) throw error
      toast.success('Message sent successfully! 🚀')
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      toast.error('Failed to send message. Try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="py-20 md:py-28 w-full max-w-full" id="contact">
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
          <motion.div {...fadeUp}>
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-accent mb-4 before:content-[''] before:w-5 before:h-0.5 before:bg-accent">
              Get in Touch
            </div>
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-wide uppercase mb-6">
              Let's Create<br />
              Something<br />
              <span className="accent">Extraordinary</span><br />
              Together.
            </h2>

            <div className="flex flex-col gap-4 mt-8">
              {personalInfo?.github_url && (
                <a href={personalInfo.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-muted hover:text-accent transition-colors">
                  <FaGithub className="text-accent text-lg" />
                  <span>github.com/{personalInfo.github_username}</span>
                </a>
              )}
              {personalInfo?.linkedin_url && (
                <a href={personalInfo.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-muted hover:text-accent transition-colors">
                  <FaLinkedinIn className="text-accent text-lg" />
                  <span>LinkedIn Profile</span>
                </a>
              )}
              {personalInfo?.email && (
                <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-3 text-sm text-muted hover:text-accent transition-colors">
                  <FaEnvelope className="text-accent text-lg" />
                  <span>{personalInfo.email}</span>
                </a>
              )}
              {personalInfo?.phone && (
                <a href={`tel:${personalInfo.phone}`} className="flex items-center gap-3 text-sm text-muted hover:text-accent transition-colors">
                  <FaPhone className="text-accent text-lg" />
                  <span>{personalInfo.phone}</span>
                </a>
              )}
            </div>

            <div className="flex gap-4 mt-8 flex-wrap">
              {personalInfo?.calendly_url && (
                <a href={personalInfo.calendly_url} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  <FaCalendarAlt /> Book a Call
                </a>
              )}
              {personalInfo?.resume_url && (
                <a href={personalInfo.resume_url} target="_blank" rel="noopener noreferrer" className="btn-outline">
                  <FaFileDownload /> Download Resume
                </a>
              )}
            </div>
          </motion.div>

          <motion.form className="flex flex-col gap-8" onSubmit={handleSubmit} {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }}>
            <div>
              <input
                type="text"
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-transparent border-0 border-b border-white/[0.08] py-4 text-white font-sans text-[15px] outline-none focus:border-accent transition-colors placeholder:text-muted placeholder:uppercase placeholder:text-xs placeholder:tracking-widest"
                inputMode="text"
                autoComplete="name"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Your Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-transparent border-0 border-b border-white/[0.08] py-4 text-white font-sans text-[15px] outline-none focus:border-accent transition-colors placeholder:text-muted placeholder:uppercase placeholder:text-xs placeholder:tracking-widest"
                inputMode="email"
                autoComplete="email"
              />
            </div>
            <div>
              <textarea
                placeholder="Your Message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={5}
                className="w-full bg-transparent border-0 border-b border-white/[0.08] py-4 text-white font-sans text-[15px] outline-none focus:border-accent transition-colors placeholder:text-muted placeholder:uppercase placeholder:text-xs placeholder:tracking-widest resize-none min-h-[120px]"
              />
            </div>
            <button type="submit" className="btn-primary w-full md:w-auto justify-center" disabled={sending}>
              {sending ? 'Sending...' : 'Send Message'} <FaArrowRight />
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
