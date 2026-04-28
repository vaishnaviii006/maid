import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const steps = [
  { num:'01', title:'Sign up for free', desc:'Create your account as a household user. Takes under 2 minutes — no credit card needed.', detail:'Choose your role, add your address, and you\'re ready to browse workers in your area.' },
  { num:'02', title:'Choose your service', desc:'Pick from Maid, Cook, Nanny, or Elder Caregiver based on what your home needs.', detail:'You can have multiple active subscriptions for different services simultaneously.' },
  { num:'03', title:'Browse verified workers', desc:'Filter by city, rating, availability and experience. Read reviews from real families.', detail:'Every worker is Aadhaar-verified, police-checked, and has completed our onboarding training.' },
  { num:'04', title:'Select a time slot', desc:'Choose your preferred daily time window. Morning (6–12), Afternoon (12–6), or Evening (6–10).', detail:'Time slots are guaranteed. If a worker is late or absent, you\'re notified immediately.' },
  { num:'05', title:'Start your subscription', desc:'Confirm your booking. The monthly subscription auto-renews and attendance is tracked daily.', detail:'You receive a detailed invoice every month with breakdowns of present days, absent deductions, and final amount.' },
  { num:'06', title:'Review & manage', desc:'Rate your worker monthly, request replacements if needed, and manage everything from your dashboard.', detail:'Our support team is available 24/7 for any issues.' },
];

export default function HowItWorksPage() {
  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh' }}>
      <Navbar />
      <section style={{ background:'var(--gray-50)', padding:'4rem 0 3rem', textAlign:'center' }}>
        <div className="container" style={{ maxWidth:640 }}>
          <p style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--brand)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.6rem' }}>How It Works</p>
          <h1 style={{ fontSize:'clamp(1.8rem,4vw,2.5rem)', fontWeight:800, color:'var(--gray-900)', letterSpacing:'-0.03em', marginBottom:'1rem' }}>From signup to first visit in 24 hours</h1>
          <p style={{ color:'var(--gray-500)', fontSize:'1rem', lineHeight:1.75 }}>Our process is built for busy people. Simple, fast, and transparent at every step.</p>
        </div>
      </section>
      <section style={{ padding:'4rem 0', background:'white' }}>
        <div className="container" style={{ maxWidth:800 }}>
          <div style={{ display:'flex', flexDirection:'column', gap:'0' }}>
            {steps.map((step, i) => (
              <div key={step.num} style={{ display:'grid', gridTemplateColumns:'80px 1fr', gap:'1.5rem', paddingBottom:'2.5rem', position:'relative' }}>
                <div style={{ textAlign:'center' }}>
                  <div style={{ width:44, height:44, borderRadius:'50%', background: i < 3 ? 'var(--brand)' : 'var(--gray-100)', color: i < 3 ? 'white' : 'var(--gray-500)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'0.85rem', margin:'0 auto' }}>{step.num}</div>
                  {i < steps.length - 1 && <div style={{ width:2, height:'calc(100% - 44px)', background:'var(--gray-100)', margin:'8px auto 0' }} />}
                </div>
                <div style={{ paddingTop:'0.6rem' }}>
                  <h3 style={{ fontWeight:700, color:'var(--gray-900)', marginBottom:'0.4rem', fontSize:'1rem' }}>{step.title}</h3>
                  <p style={{ color:'var(--gray-700)', fontSize:'0.9rem', marginBottom:'0.5rem' }}>{step.desc}</p>
                  <p style={{ color:'var(--gray-500)', fontSize:'0.83rem', lineHeight:1.65 }}>{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:'center', marginTop:'1rem' }}>
            <Link to="/signup" className="btn btn-primary btn-lg">Get Started Now <ArrowRight size={17} /></Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
