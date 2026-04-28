import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { CheckCircle, Users, Shield, Star } from 'lucide-react';
const team = [
  { name: 'Kiran Patel', role: 'CEO & Co-founder', bio: 'Former Zomato product lead. Passionate about the gig economy and homemaker rights.', initials: 'KP', color: '#EEF2FF' },
  { name: 'Meera Nair', role: 'CTO', bio: '10 years in fintech infrastructure. Building trust through technology.', initials: 'MN', color: '#F0FDF4' },
  { name: 'Arjun Singh', role: 'Head of Operations', bio: 'Built worker networks across 50+ cities. Ex-UrbanClap.', initials: 'AS', color: '#FFF7ED' },
];
export default function AboutPage() {
  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh' }}>
      <Navbar />
      <section style={{ background:'var(--gray-50)', padding:'5rem 0 3rem', textAlign:'center' }}>
        <div className="container" style={{ maxWidth:720 }}>
          <p style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--brand)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.75rem' }}>Our Story</p>
          <h1 style={{ fontSize:'clamp(1.8rem,4vw,2.6rem)', fontWeight:800, color:'var(--gray-900)', letterSpacing:'-0.03em', marginBottom:'1.25rem' }}>Built by frustrated parents, for every Indian family</h1>
          <p style={{ fontSize:'1rem', color:'var(--gray-600)', lineHeight:1.8 }}>In 2022, our founders spent weeks finding a reliable maid in Mumbai. The process was opaque, billing confusing, replacements impossible. HomeHelp+ was born from that frustration.</p>
        </div>
      </section>
      <section style={{ padding:'5rem 0', background:'white' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'1rem', marginBottom:'4rem' }}>
            {[{icon:Shield,title:'Safety First',desc:'Every worker is background verified before joining.',color:'#EEF2FF',ic:'var(--brand)'},
              {icon:Star,title:'Quality Focus',desc:'Continuous ratings keep standards high.',color:'#FFF7ED',ic:'#D97706'},
              {icon:Users,title:'Worker Welfare',desc:'Fair pay, stable income, and recognition.',color:'#F0FDF4',ic:'#059669'},
              {icon:CheckCircle,title:'Transparency',desc:'Every rupee accounted for. No hidden charges.',color:'#FDF4FF',ic:'#7C3AED'}
            ].map(({icon:Icon,title,desc,color,ic})=>(
              <div key={title} style={{ background:color, borderRadius:12, padding:'1.5rem' }}>
                <Icon size={22} color={ic} style={{ marginBottom:'0.75rem' }} />
                <p style={{ fontWeight:700, color:'var(--gray-900)', fontSize:'0.9rem', marginBottom:'0.35rem' }}>{title}</p>
                <p style={{ fontSize:'0.82rem', color:'var(--gray-600)', lineHeight:1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
          <h2 style={{ fontSize:'1.6rem', fontWeight:800, color:'var(--gray-900)', letterSpacing:'-0.02em', marginBottom:'2rem', textAlign:'center' }}>Meet the team</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))', gap:'1.25rem' }}>
            {team.map(m=>(
              <div key={m.name} style={{ background:m.color, borderRadius:14, padding:'2rem', textAlign:'center' }}>
                <div className="avatar" style={{ width:52,height:52,fontSize:'1rem',background:'white',color:'var(--brand)',margin:'0 auto 1rem',fontWeight:800 }}>{m.initials}</div>
                <p style={{ fontWeight:700, color:'var(--gray-900)', marginBottom:'0.2rem' }}>{m.name}</p>
                <p style={{ fontSize:'0.75rem', color:'var(--brand)', fontWeight:600, marginBottom:'0.65rem' }}>{m.role}</p>
                <p style={{ fontSize:'0.82rem', color:'var(--gray-600)', lineHeight:1.6 }}>{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
