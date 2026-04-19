import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import toast from 'react-hot-toast'
import { FaSave } from 'react-icons/fa'

export default function ManageSiteConfig() {
  const [configs, setConfigs] = useState([])
  const [values, setValues] = useState({})
  const [saving, setSaving] = useState(false)

  const fetchConfig = async () => {
    const { data } = await supabase.from('site_config').select('*').order('key')
    if (data) {
      setConfigs(data)
      const vals = {}
      data.forEach(c => { vals[c.key] = c.value })
      setValues(vals)
    }
  }

  useEffect(() => { fetchConfig() }, [])

  const handleSaveAll = async () => {
    setSaving(true)
    try {
      for (const config of configs) {
        if (values[config.key] !== config.value) {
          const { error } = await supabase
            .from('site_config')
            .update({ value: values[config.key] })
            .eq('id', config.id)
          if (error) throw error
        }
      }
      toast.success('Site config saved!')
      fetchConfig()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const formatLabel = (key) => key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

  return (
    <>
      <div className="admin-header">
        <h1>Site Configuration</h1>
        <button className="btn-primary" onClick={handleSaveAll} disabled={saving}>
          <FaSave /> {saving ? 'Saving...' : 'Save All'}
        </button>
      </div>

      <div className="admin-form" style={{ maxWidth: 700 }}>
        {configs.map(c => (
          <div key={c.id}>
            <label>{formatLabel(c.key)}</label>
            {c.value && c.value.length > 80 ? (
              <textarea
                value={values[c.key] || ''}
                onChange={e => setValues({ ...values, [c.key]: e.target.value })}
                rows={3}
              />
            ) : (
              <input
                value={values[c.key] || ''}
                onChange={e => setValues({ ...values, [c.key]: e.target.value })}
              />
            )}
          </div>
        ))}
      </div>
    </>
  )
}
