import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import useGithubStats from '../../hooks/useGithubStats'
import { FaArrowRight, FaFolderOpen, FaEnvelope, FaPenNib, FaGithub } from 'react-icons/fa'

export default function AdminOverview() {
  const [stats, setStats] = useState({
    projects: 0,
    messages: 0,
    blogs: 0,
    ghUsername: ''
  })
  const [recentMessages, setRecentMessages] = useState([])
  const { stats: ghStats, loading: ghLoading } = useGithubStats(stats.ghUsername)

  useEffect(() => {
    async function fetchDashboardStats() {
      // Fetch projects count
      const { count: pCount } = await supabase.from('projects').select('*', { count: 'exact', head: true })
      
      // Fetch unread messages
      const { count: mCount } = await supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('read', false)
      
      // Fetch published blogs
      const { count: bCount } = await supabase.from('blog').select('*', { count: 'exact', head: true }).eq('published', true)

      // Fetch GitHub username context
      const { data: uData } = await supabase.from('personal_info').select('value').eq('key', 'github_username').single()

      setStats({
        projects: pCount || 0,
        messages: mCount || 0,
        blogs: bCount || 0,
        ghUsername: uData?.value || ''
      })

      // Fetch recent messages
      const { data: msgs } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(3)
      if (msgs) setRecentMessages(msgs)
    }

    fetchDashboardStats()
  }, [])

  return (
    <>
      <div className="admin-header">
        <h1>Dashboard Overview</h1>
        <p style={{ color: 'var(--muted)', marginTop: 8 }}>Welcome back. Here's what's happening.</p>
      </div>

      {/* TOP STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <StatCard icon={<FaFolderOpen />} label="Total Projects" value={stats.projects} color="#00ff88" />
        <StatCard icon={<FaEnvelope />} label="Unread Messages" value={stats.messages} color="#ff3366" highlight={stats.messages > 0} />
        <StatCard icon={<FaPenNib />} label="Published Blogs" value={stats.blogs} color="#33ccff" />
        <StatCard icon={<FaGithub />} label="GitHub Followers" value={ghLoading ? '...' : ghStats.followers} color="var(--accent)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
        
        {/* GitHub Summary */}
        <div className="admin-card" style={{ padding: '32px', background: 'var(--bg3)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '18px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--white)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaGithub /> GitHub Activity
          </h2>
          {ghLoading ? (
            <p style={{ color: 'var(--muted)' }}>Fetching live data...</p>
          ) : (
            <div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
                <img src={ghStats.avatar_url || '/shreya.jpg'} alt="GitHub Avatar" style={{ width: 56, height: 56, borderRadius: '50%' }} />
                <div>
                  <a href={`https://github.com/${stats.ghUsername}`} target="_blank" rel="noreferrer" style={{ fontSize: '20px', fontWeight: 600, color: 'var(--accent)', textDecoration: 'none' }}>
                    @{stats.ghUsername}
                  </a>
                  {ghStats.createdAt && (
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>
                      Joined {new Date(ghStats.createdAt).getFullYear()}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: 'var(--bg2)', padding: '16px', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Public Repos</div>
                  <div style={{ fontSize: '24px', fontFamily: 'var(--font-display)', color: 'var(--white)' }}>{ghStats.repos}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Total Stars</div>
                  <div style={{ fontSize: '24px', fontFamily: 'var(--font-display)', color: 'var(--white)' }}>{ghStats.stars}</div>
                </div>
                <div style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--border)', paddingTop: '12px', marginTop: '4px' }}>
                   <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Latest Push</div>
                   <div style={{ fontSize: '14px', color: 'var(--accent)' }}>{ghStats.latestRepo ? ghStats.latestRepo.name : '—'}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recent Messages */}
        <div className="admin-card" style={{ padding: '32px', background: 'var(--bg3)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '18px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--white)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FaEnvelope /> Recent Messages</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
             {recentMessages.length === 0 ? (
                <p style={{ color: 'var(--muted)', fontSize: '14px' }}>No messages yet.</p>
             ) : (
                recentMessages.map(msg => (
                  <div key={msg.id} style={{ background: 'var(--bg2)', padding: '16px', borderRadius: '8px', position: 'relative' }}>
                    {!msg.read && <div style={{ position: 'absolute', top: 16, right: 16, width: 8, height: 8, borderRadius: '50%', background: '#ff3366' }} />}
                    <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--white)', marginBottom: '4px' }}>{msg.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>{msg.email}</div>
                    <div style={{ fontSize: '13px', color: '#ccc', lineHeight: 1.5 }}>
                      {msg.message.length > 60 ? msg.message.slice(0, 60) + '...' : msg.message}
                    </div>
                  </div>
                ))
             )}
          </div>
        </div>

      </div>
    </>
  )
}

function StatCard({ icon, label, value, color, highlight }) {
  return (
    <div style={{ 
      background: 'var(--bg3)', 
      padding: '24px', 
      borderRadius: '12px', 
      border: highlight ? `1px solid ${color}` : '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      gap: '20px'
    }}>
      <div style={{ 
        width: 48, height: 48, 
        borderRadius: '12px', 
        background: `rgba(${color === 'var(--accent)' ? '200,255,0' : (color === '#ff3366' ? '255,51,102' : '0,255,136')}, 0.1)`, 
        color: color, 
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '20px'
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{label}</div>
        <div style={{ fontSize: '32px', fontFamily: 'var(--font-display)', color: 'var(--white)', lineHeight: 1 }}>{value}</div>
      </div>
    </div>
  )
}
