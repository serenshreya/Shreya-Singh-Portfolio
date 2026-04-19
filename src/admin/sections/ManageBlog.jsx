import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import toast from 'react-hot-toast'
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import CloudinaryUpload from '../components/CloudinaryUpload'

const EMPTY = { title: '', slug: '', excerpt: '', content: '', cover_image: '', tags: '', published: false }

function slugify(text) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/--+/g, '-').trim()
}

const RichTextEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  return (
    <div className="tiptap-container">
      {editor && (
        <div className="tiptap-toolbar">
          <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'active' : ''}>Bold</button>
          <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'active' : ''}>Italic</button>
          <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'active' : ''}>H2</button>
          <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'active' : ''}>H3</button>
          <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'active' : ''}>Bullet</button>
          <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'active' : ''}>Number</button>
          <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={editor.isActive('codeBlock') ? 'active' : ''}>Code</button>
        </div>
      )}
      <EditorContent editor={editor} className="tiptap-editor" />
    </div>
  )
}

export default function ManageBlog() {
  const [posts, setPosts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)

  const fetchPosts = async () => {
    const { data } = await supabase.from('blog').select('*').order('created_at', { ascending: false })
    if (data) setPosts(data)
  }

  useEffect(() => { fetchPosts() }, [])

  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowModal(true) }
  const openEdit = (p) => {
    setEditing(p.id)
    setForm({
      title: p.title, slug: p.slug, excerpt: p.excerpt || '',
      content: p.content || '', cover_image: p.cover_image || '',
      tags: p.tags?.join(', ') || '', published: p.published || false
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    const payload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      excerpt: form.excerpt,
      content: form.content,
      cover_image: form.cover_image,
      tags: form.tags ? (typeof form.tags === 'string' ? form.tags.split(',').map(s => s.trim()).filter(Boolean) : form.tags) : [],
      published: form.published
    }

    try {
      if (editing) {
        const { error } = await supabase.from('blog').update(payload).eq('id', editing)
        if (error) throw error
        toast.success('Post updated!')
      } else {
        const { error } = await supabase.from('blog').insert([payload])
        if (error) throw error
        toast.success('Post created!')
      }
      setShowModal(false)
      fetchPosts()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this post?')) return
    try {
      const { error } = await supabase.from('blog').delete().eq('id', id)
      if (error) throw error
      toast.success('Post deleted')
      fetchPosts()
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <>
      <div className="admin-header">
        <h1>Manage Blog</h1>
        <button className="btn-primary" onClick={openAdd}><FaPlus /> New Post</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Slug</th>
            <th>Tags</th>
            <th>Published</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(p => (
            <tr key={p.id}>
              <td>{p.title}</td>
              <td style={{ color: 'var(--muted)', fontSize: 12 }}>{p.slug}</td>
              <td>{p.tags?.join(', ')}</td>
              <td>{p.published ? '🟢' : '⚪'}</td>
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
            <h2>{editing ? 'Edit Post' : 'New Post'}</h2>
            <div className="admin-form">
              <div>
                <label>Title</label>
                <input value={form.title} onChange={e => {
                  setForm({ ...form, title: e.target.value, slug: editing ? form.slug : slugify(e.target.value) })
                }} />
              </div>
              <div>
                <label>Slug</label>
                <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} />
              </div>
              <div>
                <label>Excerpt</label>
                <textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} rows={2} />
              </div>
              <div>
                <label>Content</label>
                <RichTextEditor content={form.content} onChange={val => setForm({ ...form, content: val })} />
              </div>
              <div className="admin-form-row">
                <div>
                  <CloudinaryUpload 
                    label="Cover Image URL (Or Upload directly)"
                    currentUrl={form.cover_image} 
                    onUploadSuccess={(url) => setForm({ ...form, cover_image: url })} 
                  />
                </div>
                <div>
                  <label>Tags (comma-separated)</label>
                  <input value={Array.isArray(form.tags) ? form.tags.join(', ') : form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="cybersecurity, ai" />
                </div>
              </div>
              <div className="admin-form-toggle">
                <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} />
                <label style={{ margin: 0 }}>Published</label>
              </div>
              <div className="admin-form-actions">
                <button className="btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn-primary" onClick={handleSave}>{editing ? 'Update' : 'Create'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
