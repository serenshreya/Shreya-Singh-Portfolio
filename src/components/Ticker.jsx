import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Ticker() {
  const [taglines, setTaglines] = useState([])

  useEffect(() => {
    async function fetchTaglines() {
      const { data } = await supabase
        .from('site_config')
        .select('*')
        .like('key', 'tagline_%')
      if (data) {
        setTaglines(data.sort((a, b) => a.key.localeCompare(b.key)).map(d => d.value))
      }
    }
    fetchTaglines()
  }, [])

  const defaultTaglines = ['CYBERSECURITY', 'ETHICAL HACKING', 'AI DEVELOPMENT', 'C++ & DSA', 'HEALIX AI', 'PARUL UNIVERSITY']
  const items = taglines.length > 0 ? taglines : defaultTaglines

  const renderTrack = () => (
    <>
      {[...Array(3)].map((_, setIndex) => (
        items.map((item, i) => (
          <span className="font-display text-lg tracking-[0.1em] uppercase px-6 flex items-center gap-6" key={`${setIndex}-${i}`}>
            {item}
            <span className="w-2 h-2 bg-current rotate-45 flex-shrink-0" />
          </span>
        ))
      ))}
    </>
  )

  return (
    <div className="overflow-hidden border-t border-b border-white/[0.08] w-full max-w-full">
      <div className="bg-accent flex whitespace-nowrap py-4 text-black">
        <div className="flex animate-ticker">
          {renderTrack()}
        </div>
      </div>
      <div className="flex whitespace-nowrap py-4">
        <div className="flex animate-ticker-reverse">
          {renderTrack()}
        </div>
      </div>
    </div>
  )
}
