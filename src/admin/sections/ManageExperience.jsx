import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import toast from 'react-hot-toast'
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'

const EMPTY = { role: '', company: '', duration: '', description: '', type: 'work', is_current: false }

export default function ManageExperience() {
  const [experiences, setExperiences] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)

  const fetchExp = async () => {
    const { data } = await supabase.from('experience').select('*').order('created_at', { ascending: false })
    if (data) setExperiences(data)
  }

  useEffect(() => { fetchExp() }, [])

  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowModal(true) }
  const openEdit = (e) => {
    setEditing(e.id)
    setForm({
      role: e.role, company: e.company, duration: e.duration || '',
      description: e.description || '', type: e.type || 'work',
      is_current: e.is_current || false
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    try {
      if (editing) {
        const { error } = await supabase.from('experience').update(form).eq('id', editing)
        if (error) throw error
        toast.success('Experience updated!')
      } else {
        const { error } = await supabase.from('experience').insert([form])
        if (error) throw error
        toast.success('Experience added!')
      }
      setShowModal(false)
      fetchExp()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this entry?')) return
    try {
      const { error } = await supabase.from('experience').delete().eq('id', id)
      if (error) throw error
      toast.success('Deleted')
      fetchExp()
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <>
      <div className="admin-header">
        <h1>Manage Experience & Education</h1>
        <button className="btn-primary" onClick={openAdd}><FaPlus /> Add Entry</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Role</th>
            <th>Company</th>
            <th>Duration</th>
            <th>Type</th>
            <th>Current</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {experiences.map(e => (
            <tr key={e.id}>
              <td>{e.role}</td>
              <td>{e.company}</td>
              <td>{e.duration}</td>
              <td><span className="timeline-type">{e.type}</span></td>
              <td>{e.is_current ? '✅' : '—'}</td>
              <td>
                <div className="admin-actions">
                  <button className="admin-btn-edit" onClick={() => openEdit(e)}><FaEdit /> Edit</button>
                  <button className="admin-btn-delete" onClick={() => handleDelete(e.id)}><FaTrash /> Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h2>{editing ? (form.type === 'education' ? 'Edit Education' : 'Edit Experience') : (form.type === 'education' ? 'Add Education' : 'Add Experience')}</h2>
            <div className="admin-form">
              <div className="admin-form-row">
                <div>
                  <label>{form.type === 'education' ? 'Degree / Program' : 'Role'}</label>
                  <input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
                </div>
                <div>
                  <label>{form.type === 'education' ? 'Institution / University' : 'Company'}</label>
                  <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
                </div>
              </div>
              <div className="admin-form-row">
                <div>
                  <label>Duration</label>
                  <input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="2023 - Present" />
                </div>
                <div>
                  <label>Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    <option value="work">Work</option>
                    <option value="education">Education</option>
                  </select>
                </div>
              </div>
              <div>
                <label>Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="admin-form-row">
                <div className="admin-form-toggle">
                  <input type="checkbox" checked={form.is_current} onChange={e => setForm({ ...form, is_current: e.target.checked })} />
                  <label style={{ margin: 0 }}>Currently Active</label>
                </div>
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
