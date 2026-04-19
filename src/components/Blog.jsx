import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FaArrowRight, FaBookOpen } from 'react-icons/fa'
import { supabase } from '../lib/supabaseClient'

export default function Blog() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    async function fetchPosts() {
      const { data } = await supabase
        .from('blog')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
      if (data) setPosts(data)
    }
    fetchPosts()
  }, [])

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    })
  }

  return (
    <section className="py-20 md:py-28 w-full max-w-full" id="blog">
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-10">
        <motion.div
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-accent mb-4 before:content-[''] before:w-5 before:h-0.5 before:bg-accent"
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6 }}
        >
          Insights
        </motion.div>
        <motion.h2
          className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-wide uppercase"
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6 }}
        >
          Latest <span className="accent">Blog</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {posts.length === 0 ? (
            <motion.div
              className="col-span-full text-center py-20 px-10 bg-card border border-white/[0.08]"
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            >
              <FaBookOpen className="text-[40px] text-accent mb-4 mx-auto" />
              <h3 className="font-display text-4xl uppercase mb-3">Coming Soon</h3>
              <p className="text-muted text-[15px]">Shreya's insights on cybersecurity, AI, and building in public — stay tuned!</p>
            </motion.div>
          ) : (
            posts.map((post, i) => (
              <motion.div
                key={post.id}
                className={`bg-card border border-white/[0.08] overflow-hidden transition-all duration-300 hover:border-accent hover:-translate-y-1 ${
                  i === 0 ? 'col-span-full grid grid-cols-1 md:grid-cols-2' : ''
                }`}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className={`bg-gradient-to-br from-dark2 to-card flex items-center justify-center ${i === 0 ? 'h-full min-h-[300px]' : 'h-[200px]'}`}>
                  {post.cover_image ? (
                    <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
                  ) : (
                    <FaBookOpen className="text-[40px] text-accent opacity-30" />
                  )}
                </div>
                <div className="p-6">
                  <div className="flex gap-2 flex-wrap mb-3">
                    {post.tags?.map((tag, j) => (
                      <span key={j} className="tech-pill">{tag}</span>
                    ))}
                  </div>
                  <h3 className="font-display text-2xl tracking-wide uppercase mb-2 leading-tight">{post.title}</h3>
                  <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                  <p className="text-xs text-muted tracking-wider">{formatDate(post.created_at)}</p>
                  <a href={`/blog/${post.slug}`} className="inline-flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-wider text-accent mt-3 hover:gap-3 transition-all">
                    Read More <FaArrowRight />
                  </a>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
