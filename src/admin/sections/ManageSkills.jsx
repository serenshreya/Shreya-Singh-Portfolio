import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import toast from 'react-hot-toast'
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'

const CATEGORIES = ['Languages', 'Cybersecurity', 'AI/ML', 'Tools']
const EMPTY = { name: '', category: 'Languages', proficiency: 80 }

export default function ManageSkills() {
  const [skills, setSkills] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)

  const fetchSkills = async () => {
    const { data } = await supabase.from('skills').select('*').order('category').order('proficiency', { ascending: false })
    if (data) setSkills(data)
  }

  useEffect(() => { fetchSkills() }, [])

  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowModal(true) }
  const openEdit = (s) => {
    setEditing(s.id)
    setForm({ name: s.name, category: s.category, proficiency: s.proficiency })
    setShowModal(true)
  }

  const handleSave = async () => {
    try {
      if (editing) {
        const { error } = await supabase.from('skills').update(form).eq('id', editing)
        if (error) throw error
        toast.success('Skill updated!')
      } else {
        const { error } = await supabase.from('skills').insert([form])
        if (error) throw error
        toast.success('Skill added!')
      }
      setShowModal(false)
      fetchSkills()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this skill?')) return
    try {
      const { error } = await supabase.from('skills').delete().eq('id', id)
      if (error) throw error
      toast.success('Skill deleted')
      fetchSkills()
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <>
      <div className="admin-header">
        <h1>Manage Skills</h1>
        <button className="btn-primary" onClick={openAdd}><FaPlus /> Add Skill</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Proficiency</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {skills.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.category}</td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="skill-bar" style={{ width: 100 }}>
                    <div className="skill-bar-inner" style={{ width: `${s.proficiency}%` }} />
                  </div>
                  <span style={{ color: 'var(--accent)', fontSize: 12 }}>{s.proficiency}%</span>
                </div>
              </td>
              <td>
                <div className="admin-actions">
                  <button className="admin-btn-edit" onClick={() => openEdit(s)}><FaEdit /> Edit</button>
                  <button className="admin-btn-delete" onClick={() => handleDelete(s.id)}><FaTrash /> Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h2>{editing ? 'Edit Skill' : 'Add Skill'}</h2>
            <div className="admin-form">
              <div>
                <label>Skill Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label>Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label>Proficiency: {form.proficiency}%</label>
                <input type="range" min="0" max="100" value={form.proficiency} onChange={e => setForm({ ...form, proficiency: parseInt(e.target.value) })} />
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
