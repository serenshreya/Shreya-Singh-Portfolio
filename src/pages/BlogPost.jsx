import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaCalendar } from 'react-icons/fa'
import { supabase } from '../lib/supabaseClient'

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPost() {
      const { data } = await supabase
        .from('blog')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single()
      setPost(data)
      setLoading(false)
    }
    fetchPost()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex gap-1 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-muted animate-dot-bounce" />
          <span className="w-1.5 h-1.5 rounded-full bg-muted animate-dot-bounce" style={{ animationDelay: '0.2s' }} />
          <span className="w-1.5 h-1.5 rounded-full bg-muted animate-dot-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-5">
        <h1 className="font-display text-5xl uppercase">Post Not Found</h1>
        <Link to="/" className="btn-primary"><FaArrowLeft /> Back Home</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-[800px] mx-auto px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/#blog" className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-accent mb-8 before:content-[''] before:w-5 before:h-0.5 before:bg-accent">
            <FaArrowLeft /> Back to Blog
          </Link>

          <div className="flex gap-2 mb-4">
            {post.tags?.map((tag, i) => (
              <span key={i} className="tech-pill">{tag}</span>
            ))}
          </div>

          <h1 className="font-display uppercase mb-4" style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}>
            {post.title}
          </h1>

          <p className="text-muted text-sm flex items-center gap-2 mb-10">
            <FaCalendar />
            {new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          {post.cover_image && (
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-[400px] object-cover mb-10 border border-white/[0.08]"
            />
          )}

          <div className="tiptap-editor">
            <div className="ProseMirror text-muted text-base leading-[1.8]" style={{ padding: 0 }} dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
