import { useState, useEffect } from 'react'

const CACHE_MINUTES = 10

export default function useGithubStats(username) {
  const [stats, setStats] = useState({
    repos: 0,
    stars: 0,
    followers: 0,
    avatar_url: '',
    createdAt: null,
    latestRepo: null
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!username) return

    let isMounted = true

    async function fetchGitHub() {
      setLoading(true)
      const cacheKey = `gh_stats_${username}`
      const cached = sessionStorage.getItem(cacheKey)
      
      if (cached) {
        try {
          const parsed = JSON.parse(cached)
          const age = (Date.now() - parsed.timestamp) / 1000 / 60
          if (age < CACHE_MINUTES) {
            if (isMounted) {
              setStats(parsed.data)
              setLoading(false)
            }
            return
          }
        } catch (e) {
          // ignore cache parse error
        }
      }

      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`)
        ])

        if (!userRes.ok) throw new Error('User not found')
        const userData = await userRes.json()
        
        let reposData = []
        if (reposRes.ok) {
          reposData = await reposRes.json()
        }

        const totalStars = reposData.reduce((acc, repo) => acc + repo.stargazers_count, 0)
        const latestRepo = reposData.length > 0 ? {
          name: reposData[0].name,
          pushed_at: reposData[0].pushed_at
        } : null

        const freshStats = {
          repos: userData.public_repos,
          stars: totalStars,
          followers: userData.followers,
          avatar_url: userData.avatar_url,
          createdAt: userData.created_at,
          latestRepo
        }

        sessionStorage.setItem(cacheKey, JSON.stringify({
          timestamp: Date.now(),
          data: freshStats
        }))

        if (isMounted) {
          setStats(freshStats)
          setError(null)
        }
      } catch (err) {
        console.error('GitHub fetch error:', err)
        if (isMounted) setError(err.message)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchGitHub()

    return () => {
      isMounted = false
    }
  }, [username])

  return { stats, loading, error }
}
