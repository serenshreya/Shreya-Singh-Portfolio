import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || '').trim()
if (!apiKey) console.warn('⚠️ VITE_GEMINI_API_KEY is missing or empty. Chatbot and AI features will not work.')
const genAI = new GoogleGenerativeAI(apiKey)

export const SHREYA_SYSTEM_CONTEXT = `
You are Shreya's personal AI assistant embedded in her portfolio website.
You know everything about her and answer questions about her professionally and warmly.

ABOUT SHREYA SINGH:
- Full Name: Shreya Singh
- GitHub: https://github.com/serenshreya (2 repos, 44 stars given, Pull Shark & Quickdraw achievements)
- LinkedIn: https://www.linkedin.com/in/shreya-singh-b03a74379
- Currently: Cybersecurity Specialist at Parul University
- Focus Areas: C++ DSA, Ethical Hacking, AI Development
- Currently Building: Healix AI (AI-powered healthcare platform)
- Goal: Tier-1 Security roles
- Skills: C++, Python, JavaScript, React, Ethical Hacking, Penetration Testing, Network Security, Machine Learning, Linux, Git
- Personality: Calculated, focused, ambitious — like a chess player (she uses ♟️ emoji)
- Achievements: Pull Shark, Quickdraw on GitHub

HOW TO RESPOND:
- Be warm, confident, and professional
- Speak as if you are Shreya's assistant who knows her well
- For project/skill questions, give detailed answers from the info above
- For contact/hire questions, direct to her LinkedIn and GitHub
- Keep responses concise (2-4 sentences max unless asked for detail)
- If asked something you don't know, say "Shreya hasn't shared that with me yet — reach out to her directly on LinkedIn!"
- Never make up false information about her
`

export async function chatWithGemini(userMessage, conversationHistory = []) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const chat = model.startChat({
    history: [
      {
        role: 'user',
        parts: [{ text: SHREYA_SYSTEM_CONTEXT }]
      },
      {
        role: 'model',
        parts: [{ text: "Got it! I'm ready to help visitors learn about Shreya Singh. I'll answer questions about her skills, projects, experience, and more!" }]
      },
      ...conversationHistory
    ]
  })

  const result = await chat.sendMessage(userMessage)
  return result.response.text()
}

export async function generateProjectDescription(projectTitle, techStack, format) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const formatInstructions = {
    'showcase': `Write a compelling project showcase description. 
      - 3-4 sentences max
      - Lead with the IMPACT and PURPOSE of the project
      - Mention key technologies naturally
      - End with what problem it solves
      - Tone: excited, proud, confident
      - NO bullet points, flowing paragraph only`,

    'resume': `Write a job-ready resume bullet-point description.
      - Start with a strong action verb (Built, Developed, Engineered, Architected, Designed)
      - Include quantifiable impact where possible (e.g., "reducing X by Y%", "handling Z requests")
      - Mention 2-3 key technologies
      - 2-3 bullet points, each starting with •
      - Tone: professional, achievement-focused, ATS-friendly
      - Format: bullet points only`,

    'readme': `Write a GitHub README-style project description.
      - Start with a one-liner tagline in bold
      - Then 2 sentences of "what it does" and "why it matters"
      - Then a short "Built With" line listing tech stack
      - Tone: developer-friendly, clear, informative
      - Keep it under 80 words`,

    'recruiter': `Write a recruiter-optimized project description.
      - Open with business value / real-world application
      - Use keywords recruiters search for in cybersecurity/AI/dev roles
      - Highlight: scale, complexity, skills demonstrated
      - 3 sentences max
      - Tone: professional but accessible to non-technical readers`,

    'technical': `Write a deep technical description for a security/AI portfolio.
      - Start with the core technical challenge solved
      - Mention architecture decisions, algorithms, or security approaches used
      - Include stack depth (e.g., "FastAPI backend with JWT auth, scikit-learn pipeline, React frontend")
      - 3-4 sentences, technical vocabulary appropriate
      - Tone: expert, precise, shows depth of knowledge`
  }

  const prompt = `
You are a professional technical writer helping a Cybersecurity & AI developer named Shreya Singh 
write a portfolio project description.

Project Title: "${projectTitle}"
Tech Stack: ${techStack || 'Not specified'}
Shreya's background: Cybersecurity Specialist, AI Builder, C++ DSA expert, building Healix AI

${formatInstructions[format] || formatInstructions['showcase']}

Write ONLY the description text. No intro, no "Here is your description:", no quotes around it.
Make it specific to "${projectTitle}" — do not write generic filler.
If tech stack is provided, weave it in naturally.
`

  const result = await model.generateContent(prompt)
  return result.response.text().trim()
}
