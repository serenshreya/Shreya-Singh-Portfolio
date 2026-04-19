import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import toast from 'react-hot-toast'
import { FaToggleOn, FaToggleOff, FaCopy, FaExternalLinkAlt, FaMagic, FaPlus, FaTrash } from 'react-icons/fa'
import { chatWithGemini } from '../../lib/geminiClient'

const EMPTY = {
  recipient_name: '', full_name: '', birthday_message: '', birthday_date: '',
  photo_url: '', fun_facts: [''], is_active: false,
  accent_color: '#C8FF00', secondary_color: '#1A1AFF'
}

export default function ManageBirthday() {
  const [form, setForm] = useState(EMPTY)
  const [existingId, setExistingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase.from('birthday_config').select('*').limit(1).single()
      if (data) {
        setExistingId(data.id)
        setForm({
          recipient_name: data.recipient_name || '',
          full_name: data.full_name || '',
          birthday_message: data.birthday_message || '',
          birthday_date: data.birthday_date || '',
          photo_url: data.photo_url || '',
          fun_facts: data.fun_facts?.length ? data.fun_facts : [''],
          is_active: data.is_active || false,
          accent_color: data.accent_color || '#C8FF00',
          secondary_color: data.secondary_color || '#1A1AFF',
        })
      }
    }
    fetch()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = {
        ...form,
        fun_facts: form.fun_facts.filter(f => f.trim()),
      }
      if (existingId) {
        const { error } = await supabase.from('birthday_config').update(payload).eq('id', existingId)
        if (error) throw error
      } else {
        const { data, error } = await supabase.from('birthday_config').insert([payload]).select().single()
        if (error) throw error
        if (data) setExistingId(data.id)
      }
      toast.success('Birthday page updated! 🎂')
    } catch (err) {
      toast.error('Failed: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleGenerate = async () => {
    if (!form.full_name) { toast.error('Enter the full name first'); return }
    setGenerating(true)
    try {
      const prompt = `Write a short, warm, celebratory birthday message for ${form.full_name}, a Cybersecurity Specialist and AI Builder at Parul University who is building Healix AI. Make it personal, excited, and mention their technical work. Max 2 sentences. No quotes around the message.`
      const msg = await chatWithGemini(prompt, [])
      setForm(prev => ({ ...prev, birthday_message: msg }))
      toast.success('Message generated!')
    } catch (err) {
      toast.error('AI generation failed')
    } finally {
      setGenerating(false)
    }
  }

  const daysUntil = () => {
    if (!form.birthday_date) return null
    const today = new Date()
    const bd = new Date(form.birthday_date)
    bd.setFullYear(today.getFullYear())
    if (bd < today) bd.setFullYear(today.getFullYear() + 1)
    const diff = Math.ceil((bd - today) / (1000 * 60 * 60 * 24))
    if (diff === 0 || (bd.getMonth() === today.getMonth() && bd.getDate() === today.getDate())) return 'today'
    return diff
  }

  const days = daysUntil()

  const copyUrl = () => {
    navigator.clipboard.writeText(`${window.location.origin}/birthday`)
    toast.success('URL copied!')
  }

  return (
    <>
      <div className="admin-header">
        <h1>Birthday Page</h1>
      </div>

      <div style={{ maxWidth: 800, display: 'grid', gap: 32, paddingBottom: 40 }}>

        {/* Master toggle */}
        <section className="admin-card" style={{ textAlign: 'center', padding: 32 }}>
          <button onClick={() => setForm(p => ({ ...p, is_active: !p.is_active }))}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 12, fontSize: 20 }}>
            {form.is_active
              ? <><FaToggleOn size={48} style={{ color: 'var(--accent)' }} /> <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: '0.05em' }}>BIRTHDAY PAGE LIVE</span></>
              : <><FaToggleOff size={48} style={{ color: 'var(--muted)' }} /> <span style={{ color: 'var(--muted)', fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: '0.05em' }}>BIRTHDAY PAGE OFF</span></>
            }
          </button>
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <code style={{ fontSize: 13, color: 'var(--muted)', background: 'var(--bg)', padding: '6px 12px', border: '1px solid var(--border)' }}>
              {window.location.origin}/birthday
            </code>
            <button onClick={copyUrl} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer' }}><FaCopy /></button>
          </div>
        </section>

        {/* Who we're celebrating */}
        <section className="admin-card" style={{ padding: 32 }}>
          <h2 style={{ fontSize: 20, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent)', marginBottom: 24 }}>Who We're Celebrating</h2>
          <div className="admin-form">
            <div>
              <label>Recipient Name (shown giant on page)</label>
              <input value={form.recipient_name} onChange={e => setForm(p => ({ ...p, recipient_name: e.target.value }))} placeholder="SHREYA" />
              {form.recipient_name && (
                <div style={{ marginTop: 8, fontFamily: 'var(--font-display)', fontSize: 36, color: 'var(--accent)', letterSpacing: '0.05em' }}>
                  {form.recipient_name}
                </div>
              )}
            </div>
            <div>
              <label>Full Name</label>
              <input value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} placeholder="Shreya Singh" />
            </div>
            <div>
              <label>Photo URL</label>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input value={form.photo_url} onChange={e => setForm(p => ({ ...p, photo_url: e.target.value }))} placeholder="/shreya.jpg" style={{ flex: 1 }} />
                <button className="admin-btn-small" onClick={() => setForm(p => ({ ...p, photo_url: '/shreya.jpg' }))}>Use portfolio photo</button>
              </div>
              {form.photo_url && (
                <img src={form.photo_url} alt="Preview" style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', marginTop: 8, border: '2px solid var(--accent)' }} />
              )}
            </div>
          </div>
        </section>

        {/* Message */}
        <section className="admin-card" style={{ padding: 32 }}>
          <h2 style={{ fontSize: 20, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent)', marginBottom: 24 }}>The Message</h2>
          <div className="admin-form">
            <div>
              <label>Birthday Date</label>
              <input type="date" value={form.birthday_date} onChange={e => setForm(p => ({ ...p, birthday_date: e.target.value }))} />
              {days !== null && (
                <p style={{ fontSize: 13, marginTop: 8, color: days === 'today' ? 'var(--accent)' : 'var(--muted)' }}>
                  {days === 'today' ? '🎂 IT\'S TODAY!' : `Days until birthday: ${days}`}
                </p>
              )}
            </div>
            <div>
              <label>Birthday Message</label>
              <textarea value={form.birthday_message} onChange={e => setForm(p => ({ ...p, birthday_message: e.target.value.slice(0, 200) }))} rows={4} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                <button className="admin-btn-small" onClick={handleGenerate} disabled={generating} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FaMagic /> {generating ? 'Generating...' : 'Generate with AI'}
                </button>
                <span style={{ fontSize: 12, color: 'var(--muted)' }}>{(form.birthday_message || '').length} / 200</span>
              </div>
            </div>
          </div>
        </section>

        {/* Fun facts */}
        <section className="admin-card" style={{ padding: 32 }}>
          <h2 style={{ fontSize: 20, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent)', marginBottom: 24 }}>Fun Facts Ticker</h2>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>These scroll across the bottom of the birthday page</p>
          <div className="admin-form">
            {form.fun_facts.map((fact, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input value={fact} onChange={e => {
                  const nf = [...form.fun_facts]; nf[i] = e.target.value;
                  setForm(p => ({ ...p, fun_facts: nf }))
                }} placeholder={`Fun fact ${i + 1}`} style={{ flex: 1 }} />
                {form.fun_facts.length > 1 && (
                  <button className="admin-btn-delete" style={{ padding: '6px 10px' }}
                    onClick={() => setForm(p => ({ ...p, fun_facts: p.fun_facts.filter((_, j) => j !== i) }))}>
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
            {form.fun_facts.length < 5 && (
              <button className="admin-btn-small" onClick={() => setForm(p => ({ ...p, fun_facts: [...p.fun_facts, ''] }))}
                style={{ display: 'flex', alignItems: 'center', gap: 6, width: 'fit-content' }}>
                <FaPlus /> Add another fact
              </button>
            )}
          </div>
        </section>

        {/* Colors */}
        <section className="admin-card" style={{ padding: 32 }}>
          <h2 style={{ fontSize: 20, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent)', marginBottom: 24 }}>Color Customization</h2>
          <div className="admin-form" style={{ display: 'flex', gap: 24, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div>
              <label>Primary Accent</label>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input type="color" value={form.accent_color} onChange={e => setForm(p => ({ ...p, accent_color: e.target.value }))}
                  style={{ width: 48, height: 36, padding: 0, border: 'none', borderRadius: 4, cursor: 'pointer' }} />
                <code style={{ fontSize: 12, color: 'var(--muted)' }}>{form.accent_color}</code>
              </div>
            </div>
            <div>
              <label>Secondary</label>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input type="color" value={form.secondary_color} onChange={e => setForm(p => ({ ...p, secondary_color: e.target.value }))}
                  style={{ width: 48, height: 36, padding: 0, border: 'none', borderRadius: 4, cursor: 'pointer' }} />
                <code style={{ fontSize: 12, color: 'var(--muted)' }}>{form.secondary_color}</code>
              </div>
            </div>
            <button className="admin-btn-small" onClick={() => setForm(p => ({ ...p, accent_color: '#C8FF00', secondary_color: '#1A1AFF' }))}>
              Reset to Portfolio Colors
            </button>
            <div style={{ display: 'flex', gap: 4 }}>
              <div style={{ width: 40, height: 40, background: form.accent_color, border: '1px solid var(--border)' }} />
              <div style={{ width: 40, height: 40, background: form.secondary_color, border: '1px solid var(--border)' }} />
            </div>
          </div>
        </section>

        {/* Save */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ flex: 1, justifyContent: 'center' }}>
            {saving ? 'Saving...' : 'SAVE BIRTHDAY CONFIG'} 🎂
          </button>
          <a href="/birthday" target="_blank" rel="noreferrer" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            PREVIEW PAGE <FaExternalLinkAlt />
          </a>
        </div>
      </div>
    </>
  )
}
