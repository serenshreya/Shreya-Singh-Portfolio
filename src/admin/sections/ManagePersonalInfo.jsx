import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import toast from 'react-hot-toast'
import useGithubStats from '../../hooks/useGithubStats'
import { FaExternalLinkAlt, FaSync } from 'react-icons/fa'
import CloudinaryUpload from '../components/CloudinaryUpload'

export default function ManagePersonalInfo() {
  const [fields, setFields] = useState([])
  const [formData, setFormData] = useState({})
  const [savingGroup, setSavingGroup] = useState('')

  const fetchFields = async () => {
    const { data } = await supabase.from('personal_info').select('*').order('sort_order', { ascending: true })
    if (data) {
      setFields(data)
      const initialForm = {}
      data.forEach(item => {
        initialForm[item.key] = item.value || ''
      })
      setFormData(initialForm)
    }
  }

  useEffect(() => {
    fetchFields()
  }, [])

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleSaveGroup = async (groupName) => {
    setSavingGroup(groupName)
    try {
      // Find all fields belonging to this group
      const groupFields = fields.filter(f => f.group_name === groupName)
      
      // We will perform upserts manually
      const updates = groupFields.map(f => ({
        id: f.id,
        key: f.key,
        value: formData[f.key],
        label: f.label,
        input_type: f.input_type,
        group_name: f.group_name,
        sort_order: f.sort_order
      }))
      
      const { error } = await supabase.from('personal_info').upsert(updates)
      
      if (error) throw error
      
      // Auto-update github_url if username changed in 'social'
      if (groupName === 'social' && formData.github_username) {
        const urlField = fields.find(f => f.key === 'github_url')
        if (urlField && (!formData.github_url || formData.github_url.includes('github.com'))) {
            const expectedUrl = `https://github.com/${formData.github_username}`
            if(formData.github_url !== expectedUrl) {
                setFormData(prev => ({ ...prev, github_url: expectedUrl }))
                await supabase.from('personal_info').upsert([{
                    ...urlField,
                    value: expectedUrl
                }])
            }
        }
      }

      toast.success(`${groupName.charAt(0).toUpperCase() + groupName.slice(1)} settings saved ✓`)
    } catch (err) {
      toast.error('Failed to save settings: ' + err.message)
    } finally {
      setSavingGroup('')
    }
  }

  // Handle photo upload — upserts directly to personal_info
  const handlePhotoUpload = async (key, url) => {
    setFormData(prev => ({ ...prev, [key]: url }))
    try {
      // Check if the key already exists
      const existing = fields.find(f => f.key === key)
      if (existing) {
        const { error } = await supabase.from('personal_info').update({ value: url }).eq('id', existing.id)
        if (error) throw error
      } else {
        // Create the row if it doesn't exist yet
        const { error } = await supabase.from('personal_info').insert([{
          key: key,
          value: url,
          label: key === 'hero_photo' ? 'Hero Section Photo' : 'About Section Photo',
          input_type: 'url',
          group_name: 'photos',
          sort_order: key === 'hero_photo' ? 50 : 51
        }])
        if (error) throw error
        // Refresh fields so future saves work correctly
        fetchFields()
      }
      toast.success(url ? 'Photo saved!' : 'Photo removed!')
    } catch (err) {
      toast.error('Failed to save photo: ' + err.message)
    }
  }

  // Grouping fields
  const identityFields = fields.filter(f => f.group_name === 'identity')
  const socialFields = fields.filter(f => f.group_name === 'social')
  const contactFields = fields.filter(f => f.group_name === 'contact')

  return (
    <>
      <div className="admin-header">
        <h1>Personal Info</h1>
        <p style={{ color: 'var(--muted)', marginTop: 8 }}>Manage your unified identity profile.</p>
      </div>

      <div style={{ display: 'grid', gap: '32px', maxWidth: '800px', paddingBottom: '40px', width: '100%', boxSizing: 'border-box' }}>
        
        {/* IDENTITY SECTION */}
        <section className="admin-card admin-pi-section">
          <h2 style={{ fontSize: '20px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent)', marginBottom: '24px' }}>Identity</h2>
          <div className="admin-form">
            {identityFields.map(field => (
              <div key={field.id} style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '13px', color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>{field.label}</label>
                {field.input_type === 'textarea' ? (
                  <textarea 
                    value={formData[field.key] || ''} 
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    rows={4}
                    className="admin-pi-input"
                  />
                ) : (
                  <input 
                    type="text" 
                    value={formData[field.key] || ''} 
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="admin-pi-input"
                  />
                )}
              </div>
            ))}
            <button 
              className="btn-primary" 
              onClick={() => handleSaveGroup('identity')}
              disabled={savingGroup === 'identity'}
              style={{ marginTop: '12px' }}
            >
              {savingGroup === 'identity' ? 'Saving...' : 'Save Identity'}
            </button>
          </div>
        </section>

        {/* PHOTOS SECTION */}
        <section className="admin-card admin-pi-section">
          <h2 style={{ fontSize: '20px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent)', marginBottom: '8px' }}>Profile Photos</h2>
          <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '24px' }}>Upload custom photos for your Hero and About sections. If not uploaded, your GitHub profile photo will be used as fallback.</p>
          <div className="admin-pi-photos-grid">
            <div>
              <CloudinaryUpload
                label="Hero Section Photo"
                currentUrl={formData.hero_photo || ''}
                onUploadSuccess={(url) => handlePhotoUpload('hero_photo', url)}
              />
              {formData.hero_photo && (
                <div style={{ marginTop: '12px', position: 'relative' }}>
                  <img src={formData.hero_photo} alt="Hero preview" style={{ width: '100%', height: '200px', objectFit: 'cover', border: '1px solid var(--border)' }} />
                  <button onClick={() => handlePhotoUpload('hero_photo', '')} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(255,68,68,0.9)', border: 'none', color: '#fff', padding: '4px 8px', fontSize: '10px', cursor: 'pointer', textTransform: 'uppercase', fontWeight: 700 }}>Remove</button>
                </div>
              )}
            </div>
            <div>
              <CloudinaryUpload
                label="About Section Photo"
                currentUrl={formData.about_photo || ''}
                onUploadSuccess={(url) => handlePhotoUpload('about_photo', url)}
              />
              {formData.about_photo && (
                <div style={{ marginTop: '12px', position: 'relative' }}>
                  <img src={formData.about_photo} alt="About preview" style={{ width: '100%', height: '200px', objectFit: 'cover', border: '1px solid var(--border)' }} />
                  <button onClick={() => handlePhotoUpload('about_photo', '')} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(255,68,68,0.9)', border: 'none', color: '#fff', padding: '4px 8px', fontSize: '10px', cursor: 'pointer', textTransform: 'uppercase', fontWeight: 700 }}>Remove</button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SOCIAL LINKS SECTION */}
        <section className="admin-card admin-pi-section">
          <h2 style={{ fontSize: '20px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent)', marginBottom: '24px' }}>Social Links</h2>
          <div className="admin-form">
            {socialFields.map(field => (
              <div key={field.id} style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '13px', color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>
                  {field.label}
                  {field.input_type === 'url' && formData[field.key] && (
                    <a href={formData[field.key]} target="_blank" rel="noreferrer" style={{ marginLeft: 8, color: 'var(--accent)' }}><FaExternalLinkAlt size={10} /></a>
                  )}
                </label>
                <input 
                  type={field.input_type} 
                  value={formData[field.key] || ''} 
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="admin-pi-input"
                />
                {field.key === 'github_username' && (
                  <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '8px', fontStyle: 'italic' }}>
                    Preview: github.com/{formData[field.key] || 'username'} <br />
                    <span style={{ color: 'var(--accent)' }}>Note: Changing this automatically updates site-wide GitHub stats.</span>
                  </div>
                )}
              </div>
            ))}
            <button 
              className="btn-primary" 
              onClick={() => handleSaveGroup('social')}
              disabled={savingGroup === 'social'}
              style={{ marginTop: '12px' }}
            >
              {savingGroup === 'social' ? 'Saving...' : 'Save Social Links'}
            </button>
          </div>

          <GithubStatsPreview username={formData.github_username} />

        </section>

        {/* CONTACT SECTION */}
        <section className="admin-card admin-pi-section">
          <h2 style={{ fontSize: '20px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent)', marginBottom: '24px' }}>Contact Details</h2>
          <div className="admin-form">
            {contactFields.map(field => (
              <div key={field.id} style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '13px', color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>{field.label}</label>
                <input 
                  type={field.input_type} 
                  value={formData[field.key] || ''} 
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="admin-pi-input"
                  placeholder={field.key === 'resume_url' ? 'https://link-to-google-drive.pdf' : ''}
                />
                {field.key === 'resume_url' && (
                  <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '8px' }}>
                    Upload your PDF to Google Drive or Dropbox, make it publicly accessible, paste the direct link here.
                  </p>
                )}
              </div>
            ))}
            <button 
              className="btn-primary" 
              onClick={() => handleSaveGroup('contact')}
              disabled={savingGroup === 'contact'}
              style={{ marginTop: '12px' }}
            >
              {savingGroup === 'contact' ? 'Saving...' : 'Save Contact Details'}
            </button>
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="admin-card admin-pi-section">
          <h2 style={{ fontSize: '20px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent)', marginBottom: '24px' }}>Bottom Stats (About Section)</h2>
          <div className="admin-form admin-pi-stats-grid">
            {fields.filter(f => f.group_name === 'stats').map(field => (
              <div key={field.id}>
                <label style={{ fontSize: '13px', color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>{field.label}</label>
                <input 
                  type={field.input_type} 
                  value={formData[field.key] || ''} 
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="admin-pi-input"
                />
              </div>
            ))}
          </div>
          <button 
            className="btn-primary" 
            onClick={() => handleSaveGroup('stats')}
            disabled={savingGroup === 'stats'}
            style={{ marginTop: '24px' }}
          >
            {savingGroup === 'stats' ? 'Saving...' : 'Save Stats'}
          </button>
        </section>


      </div>
    </>
  )
}

function GithubStatsPreview({ username }) {
  const { stats, loading, error } = useGithubStats(username)
  
  const handleRefresh = () => {
    sessionStorage.removeItem(`gh_stats_${username}`)
    window.location.reload()
  }

  if (!username) return null

  return (
    <div style={{ marginTop: '40px', padding: '24px', background: '#111', border: '1px solid rgba(200,255,0,0.2)', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '15px', color: 'var(--white)', textTransform: 'uppercase', margin: 0 }}>Live GitHub Stats Preview</h3>
        <button onClick={handleRefresh} style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', textTransform: 'uppercase' }}>
          <FaSync /> Refresh
        </button>
      </div>

      {loading && <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Fetching from GitHub API...</p>}
      {error && <p style={{ color: '#ff4444', fontSize: '14px' }}>Error: {error}</p>}
      
      {!loading && !error && (
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {stats.avatar_url && (
            <img src={stats.avatar_url} alt="GitHub Avatar" style={{ width: 64, height: 64, borderRadius: '50%', border: '2px solid var(--accent)' }} />
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase' }}>Public Repos</div>
                <div style={{ fontSize: '24px', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>{stats.repos}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase' }}>Total Stars</div>
                <div style={{ fontSize: '24px', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>{stats.stars}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase' }}>Followers</div>
                <div style={{ fontSize: '24px', color: 'var(--accent)', fontFamily: 'var(--font-display)' }}>{stats.followers}</div>
              </div>
            </div>
            {stats.latestRepo && (
              <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '8px' }}>
                Latest Push: <span style={{ color: 'var(--white)' }}>{stats.latestRepo.name}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
