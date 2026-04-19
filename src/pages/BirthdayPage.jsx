import { useEffect, useState, useRef, useCallback } from 'react'
import { usePersonalInfo } from '../context/PersonalInfoContext'
import useGithubStats from '../hooks/useGithubStats'

/* ── Confetti particles ── */
class P {
  constructor(x,y,c,vx,vy,sz){this.x=x;this.y=y;this.c=c;this.vx=vx;this.vy=vy;this.sz=sz||5;this.r=Math.random()*6.28;this.rs=(Math.random()-.5)*.1;this.life=1;this.d=.005+Math.random()*.005;this.g=.04;this.wo=Math.random()*100}
  update(t){this.vy+=this.g;this.vx+=Math.sin(t*.001+this.wo)*.03;this.x+=this.vx;this.y+=this.vy;this.r+=this.rs;this.life-=this.d}
  draw(ctx){if(this.life<=0)return;ctx.save();ctx.globalAlpha=this.life;ctx.translate(this.x,this.y);ctx.rotate(this.r);ctx.fillStyle=this.c;ctx.fillRect(-this.sz/2,-this.sz/4,this.sz,this.sz/2);ctx.restore()}
}
function useConfetti(ref){
  const ps=useRef([]);const raf=useRef(null)
  const cols=['#e74c3c','#f39c12','#2ecc71','#3498db','#9b59b6','#e91e63','#FF6B9D','#FCD34D']
  const mob=typeof window!=='undefined'&&window.innerWidth<768
  const max=mob?50:120
  const spawn=useCallback((x,y,n=1,burst=false)=>{for(let i=0;i<n;i++){if(ps.current.length>=max)ps.current.shift();const a=burst?Math.random()*6.28:0,sp=burst?3+Math.random()*6:0;ps.current.push(new P(x,y,cols[Math.floor(Math.random()*cols.length)],burst?Math.cos(a)*sp:(Math.random()-.5)*1,burst?Math.sin(a)*sp-1.5:Math.random()*.8+.3,3+Math.random()*5))}},[max])
  useEffect(()=>{const c=ref.current;if(!c)return;const ctx=c.getContext('2d');const rs=()=>{c.width=window.innerWidth;c.height=window.innerHeight};rs();window.addEventListener('resize',rs);const loop=()=>{const t=Date.now();ctx.clearRect(0,0,c.width,c.height);for(let i=ps.current.length-1;i>=0;i--){ps.current[i].update(t);ps.current[i].draw(ctx);if(ps.current[i].life<=0||ps.current[i].y>c.height+30)ps.current.splice(i,1)};raf.current=requestAnimationFrame(loop)};loop();return()=>{cancelAnimationFrame(raf.current);window.removeEventListener('resize',rs)}},[ref,spawn])
  return spawn
}

/* ── Hand-drawn doodle SVGs ── */
const Doodle = ({type,style,className=''}) => {
  const doodles = {
    star: <svg viewBox="0 0 40 40" className={className} style={style}><path d="M20 2 L24 15 L38 15 L27 23 L31 37 L20 29 L9 37 L13 23 L2 15 L16 15Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    heart: <svg viewBox="0 0 40 40" className={className} style={style}><path d="M20 35 C12 28 3 22 3 14 C3 8 8 3 14 3 C17 3 19 5 20 7 C21 5 23 3 26 3 C32 3 37 8 37 14 C37 22 28 28 20 35Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
    swirl: <svg viewBox="0 0 40 40" className={className} style={style}><path d="M10 30 Q5 20 15 15 Q25 10 25 20 Q25 28 18 25" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
    confetti: <svg viewBox="0 0 40 40" className={className} style={style}><line x1="5" y1="35" x2="15" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="18" cy="8" r="3" fill="currentColor"/><rect x="25" y="15" width="6" height="6" rx="1" fill="currentColor" transform="rotate(20 28 18)"/><circle cx="30" cy="30" r="2" fill="currentColor"/></svg>,
    cake: <svg viewBox="0 0 50 50" className={className} style={style}><rect x="10" y="25" width="30" height="15" rx="3" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M10 30 Q25 22 40 30" fill="none" stroke="currentColor" strokeWidth="2"/><line x1="20" y1="25" x2="20" y2="18" stroke="currentColor" strokeWidth="2"/><line x1="25" y1="25" x2="25" y2="16" stroke="currentColor" strokeWidth="2"/><line x1="30" y1="25" x2="30" y2="18" stroke="currentColor" strokeWidth="2"/><circle cx="20" cy="16" r="2" fill="#e74c3c"/><circle cx="25" cy="14" r="2" fill="#f39c12"/><circle cx="30" cy="16" r="2" fill="#e74c3c"/></svg>,
    balloon: <svg viewBox="0 0 30 50" className={className} style={style}><ellipse cx="15" cy="18" rx="12" ry="16" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M15 34 Q15 38 13 42 Q11 46 15 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    gift: <svg viewBox="0 0 40 40" className={className} style={style}><rect x="5" y="15" width="30" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/><rect x="5" y="15" width="30" height="7" rx="2" fill="none" stroke="currentColor" strokeWidth="2"/><line x1="20" y1="15" x2="20" y2="35" stroke="currentColor" strokeWidth="2"/><path d="M20 15 Q15 5 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M20 15 Q25 5 30 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
    music: <svg viewBox="0 0 30 40" className={className} style={style}><circle cx="8" cy="32" r="5" fill="none" stroke="currentColor" strokeWidth="2"/><line x1="13" y1="32" x2="13" y2="5" stroke="currentColor" strokeWidth="2"/><path d="M13 5 Q20 3 25 8 Q20 10 13 12" fill="currentColor" opacity=".4"/></svg>,
  }
  return doodles[type] || null
}

/* ── Reveal ── */
function Reveal({children,className='',delay=0}){
  const ref=useRef(null);const[vis,setVis]=useState(false)
  useEffect(()=>{const el=ref.current;if(!el)return;const ob=new IntersectionObserver(([e])=>{if(e.isIntersecting)setVis(true)},{threshold:.1});ob.observe(el);return()=>ob.disconnect()},[])
  return<div ref={ref} className={`transition-all duration-700 ${vis?'opacity-100 translate-y-0':'opacity-0 translate-y-6'} ${className}`} style={{transitionDelay:`${delay}ms`}}>{children}</div>
}

/* ════════════════════════════════
   🎂 BIRTHDAY — Scrapbook Style
   ════════════════════════════════ */
export default function BirthdayPage(){
  const{personalInfo:info,loading}=usePersonalInfo()
  const{stats}=useGithubStats(info?.github_username)
  const canvasRef=useRef(null)
  const[stage,setStage]=useState(0)
  const spawn=useConfetti(canvasRef)
  const mob=typeof window!=='undefined'&&window.innerWidth<768

  const firstName=(info?.full_name||'STAR').split(' ')[0].toUpperCase()
  const fullName=info?.full_name||''
  const photoUrl=info?.hero_photo||stats?.avatar_url||'/shreya.jpg'

  useEffect(()=>{const ts=[0,300,600,900,1200,1500];const t=ts.map((d,i)=>setTimeout(()=>setStage(i+1),d));return()=>t.forEach(clearTimeout)},[])
  const onClick=(e)=>{spawn(e.clientX,e.clientY,30,true)}

  if(loading)return<div className="fixed inset-0 flex items-center justify-center" style={{background:'#f5f0e8'}}><div className="text-5xl animate-bounce">🎂</div></div>

  return(
    <div className="min-h-screen relative" style={{background:'#f5f0e8'}} onClick={onClick}>
      {/* Paper texture */}
      <div className="fixed inset-0 pointer-events-none" style={{zIndex:0,backgroundImage:`url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E")`,opacity:.6}}/>
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none" style={{zIndex:50}}/>

      {/* ═══ THE CARD ═══ */}
      <div className="relative max-w-[520px] mx-auto" style={{zIndex:10,padding:mob?'16px':'32px 32px 60px'}}>
        <div className="relative rounded-lg overflow-hidden" style={{background:'#faf7f0',border:'3px solid #2d5016',boxShadow:'8px 8px 0px rgba(0,0,0,0.08)'}}>

          {/* Scattered doodles — left side */}
          <Doodle type="star" className="absolute w-7 h-7" style={{top:60,left:12,color:'#f39c12',transform:'rotate(15deg)'}}/>
          <Doodle type="heart" className="absolute w-6 h-6" style={{top:180,left:16,color:'#e74c3c',transform:'rotate(-10deg)'}}/>
          <Doodle type="swirl" className="absolute w-8 h-8" style={{top:320,left:10,color:'#3498db',transform:'rotate(5deg)'}}/>
          <Doodle type="balloon" className="absolute w-6 h-10" style={{top:430,left:18,color:'#9b59b6'}}/>
          <Doodle type="music" className="absolute w-5 h-7" style={{top:550,left:14,color:'#e91e63',transform:'rotate(-15deg)'}}/>
          <Doodle type="confetti" className="absolute w-7 h-7" style={{top:680,left:12,color:'#2ecc71'}}/>

          {/* Scattered doodles — right side */}
          <Doodle type="heart" className="absolute w-5 h-5" style={{top:80,right:14,color:'#e91e63',transform:'rotate(20deg)'}}/>
          <Doodle type="gift" className="absolute w-7 h-7" style={{top:200,right:12,color:'#e74c3c',transform:'rotate(-5deg)'}}/>
          <Doodle type="star" className="absolute w-6 h-6" style={{top:360,right:16,color:'#f39c12',transform:'rotate(30deg)'}}/>
          <Doodle type="balloon" className="absolute w-5 h-8" style={{top:480,right:14,color:'#e74c3c',transform:'rotate(10deg)'}}/>
          <Doodle type="cake" className="absolute w-8 h-8" style={{top:600,right:10,color:'#2d5016'}}/>
          <Doodle type="swirl" className="absolute w-6 h-6" style={{top:720,right:14,color:'#9b59b6',transform:'rotate(-20deg)'}}/>

          {/* Inner content */}
          <div className="relative px-6 md:px-10 py-8 md:py-12">

            {/* ── BIG TITLE ── */}
            <div className={`text-center mb-6 transition-all duration-700 ${stage>=1?'opacity-100 translate-y-0':'opacity-0 translate-y-6'}`}>
              <h1 style={{fontFamily:"'Permanent Marker',cursive",fontSize:mob?'clamp(42px,12vw,56px)':'clamp(52px,8vw,72px)',lineHeight:1.1,color:'#1a1a1a',textAlign:'center'}}>
                COME<br/>CELEBRATE<br/>WITH ME!
              </h1>
              {/* Small candy decoration */}
              <div className="flex justify-center mt-3 gap-1">
                <span className="text-xl">🎀</span>
              </div>
            </div>

            {/* ── PHOTO — Polaroid style ── */}
            <div className={`flex justify-center mb-6 transition-all duration-700 ${stage>=2?'opacity-100 scale-100 rotate-0':'opacity-0 scale-75 rotate-6'}`} style={{transitionTimingFunction:'cubic-bezier(.34,1.56,.64,1)'}}>
              <div className="relative" style={{background:'#fff',padding:'10px 10px 36px',boxShadow:'4px 4px 12px rgba(0,0,0,0.12)',transform:'rotate(-2deg)'}}>
                <img src={photoUrl} alt={firstName} className="block object-cover" style={{width:mob?'60vw':'280px',height:mob?'70vw':'320px'}} onError={e=>{e.target.style.display='none'}}/>
                {/* Handwritten caption on polaroid */}
                <p className="text-center mt-1" style={{fontFamily:"'Caveat',cursive",fontSize:18,color:'#333'}}>
                  it's my birthday! 🎂
                </p>
                {/* Tape strips */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 rounded-sm" style={{background:'rgba(200,180,140,0.6)',transform:'rotate(-3deg)'}}/>
              </div>
            </div>

            {/* ── Handwritten message ── */}
            <div className={`text-center mb-8 transition-all duration-700 ${stage>=3?'opacity-100 translate-y-0':'opacity-0 translate-y-6'}`}>
              <p style={{fontFamily:"'Caveat',cursive",fontSize:mob?20:24,lineHeight:1.6,color:'#444',maxWidth:360,margin:'0 auto'}}>
                Come celebrate another year of being absolutely amazing! Let's make some memories ✨
              </p>
            </div>

            {/* ── Divider ── */}
            <div className={`flex items-center justify-center gap-3 mb-6 transition-all duration-500 ${stage>=3?'opacity-100':'opacity-0'}`}>
              <div style={{width:60,height:2,background:'#2d5016',opacity:.3}}/>
              <span>🌟</span>
              <div style={{width:60,height:2,background:'#2d5016',opacity:.3}}/>
            </div>

            {/* ── Details ── */}
            <div className={`space-y-4 mb-8 transition-all duration-700 ${stage>=4?'opacity-100 translate-y-0':'opacity-0 translate-y-6'}`}>
              <div className="text-center">
                <p style={{fontFamily:"'Permanent Marker',cursive",fontSize:mob?15:17,color:'#1a1a1a',letterSpacing:'.05em'}}>
                  🎂 WHO: {fullName || firstName}
                </p>
              </div>
              <div className="text-center">
                <p style={{fontFamily:"'Permanent Marker',cursive",fontSize:mob?15:17,color:'#1a1a1a',letterSpacing:'.05em'}}>
                  🎉 WHAT: BIRTHDAY CELEBRATION!
                </p>
              </div>
              <div className="text-center">
                <p style={{fontFamily:"'Permanent Marker',cursive",fontSize:mob?15:17,color:'#1a1a1a',letterSpacing:'.05em'}}>
                  💖 MOOD: GOOD VIBES ONLY
                </p>
              </div>
            </div>

            {/* ── Sticker section ── */}
            <div className={`flex flex-wrap justify-center gap-3 mb-8 transition-all duration-700 ${stage>=4?'opacity-100 scale-100':'opacity-0 scale-90'}`}>
              {[
                {emoji:'👑',label:'Queen'},
                {emoji:'💖',label:'Sweetest'},
                {emoji:'✨',label:'Magic'},
                {emoji:'🦋',label:'Beautiful'},
                {emoji:'🔥',label:'Iconic'},
                {emoji:'💫',label:'One of a kind'},
              ].map((s,i)=>(
                <div key={i} className="flex flex-col items-center p-2 md:p-3 rounded-xl transition-transform duration-200 hover:scale-110 hover:rotate-3 cursor-default" style={{background:'rgba(45,80,22,0.06)',border:'1.5px dashed rgba(45,80,22,0.2)',minWidth:mob?70:80}}>
                  <span className="text-xl md:text-2xl mb-1">{s.emoji}</span>
                  <span style={{fontFamily:"'Caveat',cursive",fontSize:mob?13:15,color:'#2d5016'}}>{s.label}</span>
                </div>
              ))}
            </div>

            {/* ── Birthday wishes ── */}
            <div className={`mb-8 transition-all duration-700 ${stage>=5?'opacity-100 translate-y-0':'opacity-0 translate-y-6'}`}>
              <div className="p-4 md:p-6 rounded-xl" style={{background:'rgba(233,30,99,0.04)',border:'1.5px dashed rgba(233,30,99,0.2)'}}>
                <p className="text-center mb-3" style={{fontFamily:"'Permanent Marker',cursive",fontSize:mob?16:18,color:'#e91e63'}}>
                  💌 Birthday Wishes 💌
                </p>
                <div className="space-y-3">
                  {[
                    'May all your dreams come true this year 🌟',
                    'Wishing you endless happiness & laughter 😄',
                    'You deserve the whole world and more 💜',
                    'This year is YOUR year — own it! 👑',
                    'Stay amazing, stay you, stay golden ✨',
                  ].map((w,i)=>(
                    <p key={i} className="text-center" style={{fontFamily:"'Caveat',cursive",fontSize:mob?17:20,color:'#555',lineHeight:1.4}}>
                      {w}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Bring section ── */}
            <div className={`mb-8 text-center transition-all duration-700 ${stage>=5?'opacity-100':'opacity-0'}`}>
              <p style={{fontFamily:"'Permanent Marker',cursive",fontSize:mob?15:17,color:'#1a1a1a'}}>
                BRING: GOOD ENERGY, BIG SMILES,
              </p>
              <p style={{fontFamily:"'Permanent Marker',cursive",fontSize:mob?15:17,color:'#1a1a1a'}}>
                AND YOUR BEST DANCE MOVES! 💃
              </p>
            </div>

            {/* ── Sign off ── */}
            <div className={`text-center mt-8 transition-all duration-700 ${stage>=5?'opacity-100 translate-y-0':'opacity-0 translate-y-4'}`}>
              <p style={{fontFamily:"'Caveat',cursive",fontSize:mob?20:24,color:'#2d5016'}}>
                See you there! 💖
              </p>
              <p style={{fontFamily:"'Caveat',cursive",fontSize:mob?22:28,color:'#e91e63',marginTop:4}}>
                — {firstName.charAt(0) + firstName.slice(1).toLowerCase()} &lt;3
              </p>
            </div>

            {/* ── Bottom doodles ── */}
            <div className="flex justify-center gap-4 mt-6 text-2xl">
              {['🎂','🎈','🎉','🎁','🎊'].map((e,i)=>(
                <span key={i} className="animate-bounce" style={{animationDelay:`${i*.15}s`,animationDuration:'2s'}}>{e}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Back to portfolio ── */}
        <div className="text-center mt-8 mb-8">
          <a href="/" onClick={e=>e.stopPropagation()} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs tracking-wider uppercase transition-all duration-300 hover:scale-105" style={{fontFamily:"'Permanent Marker',cursive",color:'#2d5016',border:'2px solid #2d5016',background:'transparent',fontSize:13}}>
            ← Back to Portfolio
          </a>
        </div>

        {/* Click hint */}
        <p className="text-center text-xs mb-4" style={{fontFamily:"'Caveat',cursive",color:'#999',fontSize:15}}>
          ✨ tap anywhere for confetti! ✨
        </p>
      </div>

      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Caveat:wght@400;600&display=swap" rel="stylesheet"/>
      <style>{`
        @keyframes floatUp{0%{transform:translateY(0) rotate(0);opacity:0}10%{opacity:.15}90%{opacity:.1}100%{transform:translateY(-100vh) rotate(180deg);opacity:0}}
      `}</style>
    </div>
  )
}
