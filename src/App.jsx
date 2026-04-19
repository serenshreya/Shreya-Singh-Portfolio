import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { PersonalInfoProvider } from './context/PersonalInfoContext'

// Portfolio components
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Ticker from './components/Ticker'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Blog from './components/Blog'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ChatbotWidget from './components/ChatbotWidget'
import MobileNav from './components/MobileNav'

// Admin
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'

// Blog Post page
import BlogPost from './pages/BlogPost'

// Birthday page
import BirthdayPage from './pages/BirthdayPage'

function Portfolio() {
  return (
    <PersonalInfoProvider>
      <Navbar />
      <Hero />
      <Ticker />
      <About />
      <Projects />
      <Skills />
      <Experience />
      <Blog />
      <Contact />
      <Footer />
      <ChatbotWidget />
      <MobileNav />
    </PersonalInfoProvider>
  )
}


export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.08)',
            fontFamily: "'Inter', sans-serif"
          },
          success: {
            iconTheme: { primary: '#C8FF00', secondary: '#000' }
          }
        }}
      />
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/birthday" element={<PersonalInfoProvider><BirthdayPage /></PersonalInfoProvider>} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
