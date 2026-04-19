import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

const PersonalInfoContext = createContext({})

export function PersonalInfoProvider({ children }) {
  const [personalInfo, setPersonalInfo] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchInfo() {
      const { data } = await supabase.from('personal_info').select('*')
      if (data) {
        const infoObj = {}
        data.forEach(row => {
          infoObj[row.key] = row.value || ''
        })
        setPersonalInfo(infoObj)
      }
      setLoading(false)
    }

    fetchInfo()

    // Realtime subscription for instant updates across tabs/changes
    const channel = supabase.channel('personal_info_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'personal_info' },
        (payload) => {
          setPersonalInfo(prev => {
            const newObj = { ...prev }
            if (payload.eventType === 'DELETE') {
              // Wait, Supabase DELETE payload unreliably has `key` depending on REPLICA IDENTITY, 
              // so a safe bet is to just re-fetch everything or update if we know what got removed.
              // Re-fetching is simple enough for small table.
              fetchInfo()
            } else if (payload.new && payload.new.key) {
              newObj[payload.new.key] = payload.new.value || ''
            }
            return newObj
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <PersonalInfoContext.Provider value={{ personalInfo, loading }}>
      {children}
    </PersonalInfoContext.Provider>
  )
}

export function usePersonalInfo() {
  const context = useContext(PersonalInfoContext)
  if (!context) {
    console.warn('usePersonalInfo must be used within a PersonalInfoProvider')
    return { personalInfo: {}, loading: true }
  }
  return context
}
