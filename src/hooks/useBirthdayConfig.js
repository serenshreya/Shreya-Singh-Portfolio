import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function useBirthdayConfig() {
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchConfig() {
      const { data, error } = await supabase
        .from('birthday_config')
        .select('*')
        .limit(1)
        .single()
      if (data) setConfig(data)
      setLoading(false)
    }
    fetchConfig()
  }, [])

  return { config, loading }
}
