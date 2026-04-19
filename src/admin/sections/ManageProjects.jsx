import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { generateProjectDescription } from '../../lib/geminiClient'
import toast from 'react-hot-toast'
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'
import CloudinaryUpload from '../components/CloudinaryUpload'

const EMPTY = { title: '', description: '', tech_stack: '', github_url: '', live_url: '', image_url: '', featured: false }

const FORMAT_OPTIONS = [
  { id: 'showcase',  emoji: '🚀', label: 'Project Showcase',       hint: 'Best for portfolio' },
  { id: 'resume',    emoji: '💼', label: 'Resume / Job-Ready',     hint: 'ATS-friendly bullets' },
  { id: 'readme',    emoji: '📄', label: 'GitHub README Style',    hint: 'Dev-friendly' },
  { id: 'recruiter', emoji: '🎯', label: 'Recruiter-Focused',      hint: 'Non-technical readers' },
  { id: 'technical', emoji: '🔐', label: 'Security/Technical Deep', hint: 'Shows depth' },
]

export default function ManageProjects() {
  const [projects, setProjects] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [showFormatPicker, setShowFormatPicker] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState('showcase')
  const [isGenerating, setIsGenerating] = useState(false)

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
    if (data) setProjects(data)
  }

  useEffect(() => { fetchProjects() }, [])

  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowModal(true) }
  const openEdit = (p) => {
    setEditing(p.id)
    setForm({
      title: p.title || '',
      description: p.description || '',
      tech_stack: p.tech_stack?.join(', ') || '',
      github_url: p.github_url || '',
      live_url: p.live_url || '',
      image_url: p.image_url || '',
      featured: p.featured || false
    })
    setShowModal(true)
  }

  const handleGenerateDescription = async () => {
    if (!form.title) {
      toast.error('Add a project title first!')
      return
    }
    setIsGenerating(true)
    setShowFormatPicker(false)
    try {
      const generated = await generateProjectDescription(
        form.title,
        form.tech_stack,
        selectedFormat
      )
      setForm(prev => ({ ...prev, description: generated }))
      toast.success('Description generated! ✨')
    } catch (err) {
      console.error('Gemini Generation Error:', err)
      toast.error(`Generation failed: ${err.message || 'Check your API key in .env'}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = async () => {
    const payload = {
      title: form.title,
      description: form.description,
      tech_stack: form.tech_stack.split(',').map(s => s.trim()).filter(Boolean),
      github_url: form.github_url,
      live_url: form.live_url,
      image_url: form.image_url,
      featured: form.featured
    }

    try {
      if (editing) {
        const { error } = await supabase.from('projects').update(payload).eq('id', editing)
        if (error) throw error
        toast.success('Project updated!')
      } else {
        const { error } = await supabase.from('projects').insert([payload])
        if (error) throw error
        toast.success('Project added!')
      }
      setShowModal(false)
      fetchProjects()
    } catch (err) {
      toast.error(err.message || 'Operation failed')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id)
      if (error) throw error
      toast.success('Project deleted')
      fetchProjects()
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <>
      <div className="admin-header">
        <h1>Manage Projects</h1>
        <button className="btn-primary" onClick={openAdd}><FaPlus /> Add Project</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Tech Stack</th>
            <th>Featured</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(p => (
            <tr key={p.id}>
              <td>{p.title}</td>
              <td>{p.tech_stack?.join(', ')}</td>
              <td>{p.featured ? '⭐' : '—'}</td>
              <td>
                <div className="admin-actions">
                  <button className="admin-btn-edit" onClick={() => openEdit(p)}><FaEdit /> Edit</button>
                  <button className="admin-btn-delete" onClick={() => handleDelete(p.id)}><FaTrash /> Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h2>{editing ? 'Edit Project' : 'Add Project'}</h2>
            <div className="admin-form">
              <div>
                <label>Title</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div>
                <label>Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />

                {/* AI Generate Button */}
                <div style={{ position: 'relative', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setShowFormatPicker(!showFormatPicker)}
                    disabled={isGenerating}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      background: 'transparent',
                      border: '1px solid var(--accent)',
                      color: 'var(--accent)',
                      padding: '8px 16px',
                      fontFamily: 'var(--font-body)',
                      fontWeight: 600, fontSize: '12px',
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      cursor: isGenerating ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      opacity: isGenerating ? 0.6 : 1
                    }}
                  >
                    ✨ {isGenerating ? 'GENERATING...' : 'GENERATE WITH AI'} ▾
                  </button>

                  {showFormatPicker && (
                    <div style={{
                      position: 'absolute', top: '44px', left: 0, zIndex: 100,
                      background: '#1a1a1a', border: '1px solid var(--border)',
                      minWidth: '300px', padding: '12px',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.5)'
                    }}>
                      <p style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '12px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Choose Format
                      </p>
                      {FORMAT_OPTIONS.map(opt => (
                        <label key={opt.id} style={{
                          display: 'flex', alignItems: 'center', gap: '12px',
                          padding: '10px', cursor: 'pointer',
                          background: selectedFormat === opt.id ? 'rgba(200,255,0,0.08)' : 'transparent',
                          border: selectedFormat === opt.id ? '1px solid rgba(200,255,0,0.3)' : '1px solid transparent',
                          marginBottom: '4px', transition: 'all 0.15s'
                        }}>
                          <input
                            type="radio" name="format"
                            value={opt.id}
                            checked={selectedFormat === opt.id}
                            onChange={() => setSelectedFormat(opt.id)}
                            style={{ accentColor: 'var(--accent)' }}
                          />
                          <span style={{ fontSize: '18px' }}>{opt.emoji}</span>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--white)' }}>{opt.label}</div>
                            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{opt.hint}</div>
                          </div>
                        </label>
                      ))}
                      <button
                        type="button"
                        onClick={handleGenerateDescription}
                        disabled={isGenerating}
                        style={{
                          width: '100%', marginTop: '12px',
                          background: 'var(--accent)', color: '#000',
                          border: 'none', padding: '10px',
                          fontWeight: 700, fontSize: '13px',
                          fontFamily: 'var(--font-body)',
                          letterSpacing: '0.1em', textTransform: 'uppercase',
                          cursor: isGenerating ? 'not-allowed' : 'pointer',
                          opacity: isGenerating ? 0.6 : 1
                        }}
                      >
                        {isGenerating ? '⏳ GENERATING...' : 'GENERATE →'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label>Tech Stack (comma-separated)</label>
                <input value={form.tech_stack} onChange={e => setForm({ ...form, tech_stack: e.target.value })} placeholder="React, Python, FastAPI" />
              </div>
              <div className="admin-form-row">
                <div>
                  <label>GitHub URL</label>
                  <input value={form.github_url} onChange={e => setForm({ ...form, github_url: e.target.value })} />
                </div>
                <div>
                  <label>Live URL</label>
                  <input value={form.live_url} onChange={e => setForm({ ...form, live_url: e.target.value })} />
                </div>
              </div>
              <div>
                <CloudinaryUpload 
                  label="Image URL (Or Upload directly)"
                  currentUrl={form.image_url} 
                  onUploadSuccess={(url) => setForm({ ...form, image_url: url })} 
                />
              </div>
              <div className="admin-form-toggle">
                <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />
                <label style={{ margin: 0 }}>Featured Project</label>
              </div>
              <div className="admin-form-actions">
                <button className="btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn-primary" onClick={handleSave}>{editing ? 'Update' : 'Add'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
