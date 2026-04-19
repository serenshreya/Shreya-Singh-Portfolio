import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import toast from 'react-hot-toast'
import { FaTrash, FaCheck, FaEnvelopeOpen, FaEnvelope } from 'react-icons/fa'

export default function ManageContact() {
  const [messages, setMessages] = useState([])

  const fetchMessages = async () => {
    const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
    if (data) setMessages(data)
  }

  useEffect(() => { fetchMessages() }, [])

  const toggleRead = async (msg) => {
    try {
      const { error } = await supabase.from('contact_messages').update({ read: !msg.read }).eq('id', msg.id)
      if (error) throw error
      fetchMessages()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return
    try {
      const { error } = await supabase.from('contact_messages').delete().eq('id', id)
      if (error) throw error
      toast.success('Message deleted')
      fetchMessages()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const formatDate = (d) => new Date(d).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  const unreadCount = messages.filter(m => !m.read).length

  return (
    <>
      <div className="admin-header">
        <h1>Contact Messages</h1>
        <span style={{ color: 'var(--muted)', fontSize: 14 }}>
          {unreadCount} unread · {messages.length} total
        </span>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Status</th>
            <th>Name</th>
            <th>Email</th>
            <th>Message</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {messages.map(m => (
            <tr key={m.id} style={{ opacity: m.read ? 0.6 : 1 }}>
              <td>
                {m.read ? (
                  <FaEnvelopeOpen style={{ color: 'var(--muted)' }} />
                ) : (
                  <FaEnvelope style={{ color: 'var(--accent)' }} />
                )}
              </td>
              <td><strong>{m.name}</strong></td>
              <td style={{ color: 'var(--accent)', fontSize: 13 }}>{m.email}</td>
              <td style={{ maxWidth: 300, whiteSpace: 'pre-wrap', fontSize: 13, color: 'var(--muted)' }}>{m.message}</td>
              <td style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{formatDate(m.created_at)}</td>
              <td>
                <div className="admin-actions">
                  <button className="admin-btn-edit" onClick={() => toggleRead(m)}>
                    <FaCheck /> {m.read ? 'Unread' : 'Read'}
                  </button>
                  <button className="admin-btn-delete" onClick={() => handleDelete(m.id)}>
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {messages.length === 0 && (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--muted)' }}>
          <FaEnvelope style={{ fontSize: 40, marginBottom: 16, opacity: 0.3 }} />
          <p>No messages yet</p>
        </div>
      )}
    </>
  )
}
