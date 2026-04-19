import { useState } from 'react'
import { FaUpload, FaSpinner } from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function CloudinaryUpload({ onUploadSuccess, currentUrl, label = "Upload Image" }) {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'portfolio_uploads') // We created this preset

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/dci0cfoi3/image/upload`, {
        method: 'POST',
        body: formData
      })
      const data = await response.json()
      
      if (data.secure_url) {
        onUploadSuccess(data.secure_url)
        toast.success('Image uploaded successfully!')
      } else {
        throw new Error(data.error?.message || 'Upload failed')
      }
    } catch (err) {
      toast.error('Failed to upload image: ' + err.message)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </label>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <label style={{ 
            cursor: uploading ? 'not-allowed' : 'pointer', 
            margin: 0,
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'var(--bg3)', border: '1px solid var(--border)',
            padding: '8px 16px', borderRadius: '6px',
            color: 'var(--white)', fontSize: '14px', transition: '0.2s',
            opacity: uploading ? 0.7 : 1
          }}
          onMouseOver={(e) => { if(!uploading) e.currentTarget.style.borderColor = 'var(--accent)' }}
          onMouseOut={(e) => { if(!uploading) e.currentTarget.style.borderColor = 'var(--border)' }}
        >
          {uploading ? <FaSpinner className="spin" /> : <FaUpload />} 
          {uploading ? 'Uploading...' : 'Upload'}
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleUpload} 
            style={{ display: 'none' }}
            disabled={uploading}
          />
        </label>
        
        {/* We can show a small preview if an image already exists */}
        {currentUrl && (
          <div style={{ position: 'relative', width: 40, height: 40, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border)' }}>
            <img src={currentUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
      </div>
      
      {/* We still keep the direct input field so they can paste links directly if they prefer */}
      <input 
        type="text" 
        value={currentUrl} 
        onChange={(e) => onUploadSuccess(e.target.value)} 
        placeholder="Or paste an image link here..."
        style={{ marginTop: '8px' }}
      />
    </div>
  )
}
