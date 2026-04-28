import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { ArrowRight, Star, Shield, Clock, Users, CheckCircle, Sparkles } from 'lucide-react';

const services = [
  { icon: '🧹', title: 'Maid / House Help', desc: 'Daily cleaning and household chores on a fixed monthly schedule.', color: '#EEF2FF' },
  { icon: '👩‍🍳', title: 'Cook Services', desc: 'Home-cooked meals by experienced cooks. Morning or evening slots.', color: '#F0FDF4' },
  { icon: '👶', title: 'Nanny / Babysitter', desc: 'Certified caregivers for your children. Safe and fully verified.', color: '#FFF7ED' },
  { icon: '🤝', title: 'Elder Caregiver', desc: 'Compassionate support for elderly family members.', color: '#FDF4FF' },
];

const steps = [
  { num: '01', title: 'Choose your service', desc: 'Select from maid, cook, nanny, or elder care.' },
  { num: '02', title: 'Pick a time slot', desc: 'Morning, afternoon, or evening — your call.' },
  { num: '03', title: 'Browse workers', desc: 'View profiles, ratings, and background checks.' },
  { num: '04', title: 'Subscribe monthly', desc: 'Attendance tracked, billing is automatic.' },
];

const testimonials = [
  { name: 'Priya Mehta', loc: 'Mumbai', text: 'Sunita has been coming for 8 months. Punctual, trustworthy, and excellent at her work. HomeHelp+ made the whole process seamless.', role: 'Working Professional' },
  { name: 'Rajesh Khanna', loc: 'Bangalore', text: 'The cook we found feels like family now. The subscription model means I never worry about payment calculations.', role: 'Father of 2' },
  { name: 'Anita Desai', loc: 'Pune', text: 'As a society admin, the worker entry tracking alone is worth it. Everything organized, nothing slips through.', role: 'Society Manager' },
];

const pricing = [
  { name: 'Basic', price: '₹2,999', desc: 'For a single service', features: ['1 Service Category', '1 Worker', 'Attendance Tracking', 'Monthly Invoice'], popular: false },
  { name: 'Standard', price: '₹4,999', desc: 'Most popular for families', features: ['2 Service Categories', '2 Workers', 'Billing + Deductions', 'Replacement Requests', 'Priority Support'], popular: true },
  { name: 'Premium', price: '₹7,999', desc: 'Full household management', features: ['All Categories', 'Unlimited Workers', 'Advanced Analytics', 'Dedicated Manager', '24/7 Support'], popular: false },
];

export default function HomePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg,#EEF2FF 0%,#F0F9FF 60%,#F0FDF4 100%)', padding: '5rem 0 4rem' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: 99, padding: '0.3rem 0.85rem', marginBottom: '1.5rem' }}>
              <Sparkles size={13} color="var(--brand)" />
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--brand)' }}>India's #1 Recurring Domestic Help Platform</span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.9rem)', fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1.2, letterSpacing: '-0.03em', marginBottom: '1.25rem' }}>
              Trusted home help,<br /><span style={{ color: 'var(--brand)' }}>every single day</span>
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--gray-600)', lineHeight: 1.75, marginBottom: '2rem', maxWidth: 460 }}>
              Subscribe to verified maids, cooks, nannies and elder caregivers with fixed time slots, automatic attendance, and transparent monthly billing.
            </p>
            <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <Link to="/signup" className="btn btn-primary btn-lg">Get Started Free <ArrowRight size={17} /></Link>
              <Link to="/how-it-works" className="btn btn-outline btn-lg">How It Works</Link>
            </div>
            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
              {['Background Verified', 'Monthly Billing', 'Replacements Guaranteed'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--gray-600)' }}>
                  <CheckCircle size={14} color="var(--success)" />{f}
                </div>
              ))}
            </div>
          </div>
          {/* Preview card */}
          <div style={{ background: 'white', borderRadius: 16, padding: '1.75rem', boxShadow: '0 20px 60px rgba(27,79,216,0.12)', border: '1px solid var(--gray-100)', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Your Worker Today</p>
                <p style={{ fontWeight: 700, color: 'var(--gray-900)' }}>Sunita Devi — Maid</p>
              </div>
              <span className="badge badge-green">● Active</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div className="avatar" style={{ width: 44, height: 44, fontSize: '1rem', background: 'var(--brand-light)', color: 'var(--brand)', flexShrink: 0 }}>S</div>
              <div>
                <div style={{ display: 'flex', gap: '2px', marginBottom: '0.2rem' }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={12} fill="#F59E0B" color="#F59E0B" />)}
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--gray-500)' }}>5 years exp · Check-in: 7:05 AM</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
              {[{l:'Present',v:24,c:'#16A34A'},{l:'Absent',v:2,c:'#DC2626'},{l:'Days Left',v:5,c:'#D97706'}].map(s=>(
                <div key={s.l} style={{ background:'var(--gray-50)', borderRadius:8, padding:'0.6rem', textAlign:'center' }}>
                  <p style={{ fontWeight:700, fontSize:'1.1rem', color:s.c }}>{s.v}</p>
                  <p style={{ fontSize:'0.68rem', color:'var(--gray-500)' }}>{s.l}</p>
                </div>
              ))}
            </div>
            <div style={{ background:'var(--brand-light)', borderRadius:9, padding:'0.65rem 0.9rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <p style={{ fontSize:'0.72rem', color:'var(--brand)', fontWeight:600 }}>April Invoice</p>
                <p style={{ fontWeight:700, color:'var(--brand)', fontSize:'1.05rem' }}>₹4,154</p>
              </div>
              <span className="badge badge-green">Paid ✓</span>
            </div>
            <div style={{ position:'absolute', top:-14, right:-14, background:'white', borderRadius:10, padding:'0.5rem 0.8rem', boxShadow:'0 6px 20px rgba(0,0,0,0.1)', border:'1px solid var(--gray-100)', display:'flex', alignItems:'center', gap:'0.4rem' }}>
              <Shield size={14} color="var(--success)" />
              <span style={{ fontSize:'0.75rem', fontWeight:700, color:'var(--gray-700)' }}>Police Verified</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background:'white', borderBottom:'1px solid var(--gray-100)', padding:'2rem 0' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem' }}>
            {[{v:'50,000+',l:'Families Served'},{v:'8,000+',l:'Verified Workers'},{v:'120+',l:'Cities Covered'},{v:'4.8★',l:'Average Rating'}].map(s=>(
              <div key={s.l} style={{ textAlign:'center' }}>
                <p style={{ fontSize:'1.75rem', fontWeight:800, color:'var(--brand)', letterSpacing:'-0.03em' }}>{s.v}</p>
                <p style={{ fontSize:'0.85rem', color:'var(--gray-500)' }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section style={{ padding:'5rem 0', background:'white' }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
            <p style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--brand)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.5rem' }}>Services</p>
            <h2 style={{ fontSize:'1.9rem', fontWeight:800, color:'var(--gray-900)', letterSpacing:'-0.02em' }}>Everything your home needs</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))', gap:'1.25rem' }}>
            {services.map(s=>(
              <Link key={s.title} to="/services" style={{ background:s.color, borderRadius:14, padding:'1.75rem', textDecoration:'none', display:'block', transition:'transform 0.2s' }}
                onMouseEnter={e=>e.currentTarget.style.transform='translateY(-3px)'}
                onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
                <div style={{ fontSize:'2rem', marginBottom:'1rem' }}>{s.icon}</div>
                <h3 style={{ fontWeight:700, color:'var(--gray-900)', marginBottom:'0.4rem', fontSize:'0.95rem' }}>{s.title}</h3>
                <p style={{ fontSize:'0.83rem', color:'var(--gray-600)', lineHeight:1.6 }}>{s.desc}</p>
                <div style={{ marginTop:'1rem', fontSize:'0.8rem', fontWeight:600, color:'var(--brand)', display:'flex', alignItems:'center', gap:'0.3rem' }}>Explore <ArrowRight size={12} /></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding:'5rem 0', background:'var(--gray-50)' }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
            <p style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--brand)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.5rem' }}>Process</p>
            <h2 style={{ fontSize:'1.9rem', fontWeight:800, color:'var(--gray-900)', letterSpacing:'-0.02em' }}>Up and running in 4 steps</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))', gap:'1.25rem' }}>
            {steps.map(step=>(
              <div key={step.num} style={{ background:'white', borderRadius:14, padding:'1.75rem', border:'1px solid var(--gray-100)' }}>
                <p style={{ fontSize:'0.7rem', fontWeight:800, color:'var(--brand)', opacity:0.4, letterSpacing:'0.1em', marginBottom:'1rem' }}>{step.num}</p>
                <h3 style={{ fontWeight:700, color:'var(--gray-900)', marginBottom:'0.4rem', fontSize:'0.92rem' }}>{step.title}</h3>
                <p style={{ fontSize:'0.83rem', color:'var(--gray-500)', lineHeight:1.65 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding:'5rem 0', background:'white' }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
            <p style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--brand)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.5rem' }}>Testimonials</p>
            <h2 style={{ fontSize:'1.9rem', fontWeight:800, color:'var(--gray-900)', letterSpacing:'-0.02em' }}>What families are saying</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(270px,1fr))', gap:'1.25rem' }}>
            {testimonials.map(t=>(
              <div key={t.name} style={{ background:'var(--gray-50)', borderRadius:14, padding:'1.75rem' }}>
                <div style={{ display:'flex', gap:'2px', marginBottom:'1rem' }}>
                  {[1,2,3,4,5].map(s=><Star key={s} size={13} fill="#F59E0B" color="#F59E0B" />)}
                </div>
                <p style={{ color:'var(--gray-700)', lineHeight:1.7, fontSize:'0.88rem', marginBottom:'1.25rem' }}>"{t.text}"</p>
                <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
                  <div className="avatar" style={{ width:34, height:34, fontSize:'0.82rem', background:'var(--brand-light)', color:'var(--brand)', flexShrink:0 }}>{t.name[0]}</div>
                  <div>
                    <p style={{ fontWeight:700, color:'var(--gray-800)', fontSize:'0.85rem' }}>{t.name}</p>
                    <p style={{ fontSize:'0.72rem', color:'var(--gray-500)' }}>{t.role} · {t.loc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding:'5rem 0', background:'var(--gray-50)' }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
            <p style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--brand)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.5rem' }}>Pricing</p>
            <h2 style={{ fontSize:'1.9rem', fontWeight:800, color:'var(--gray-900)', letterSpacing:'-0.02em' }}>Simple, transparent pricing</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'1.25rem', maxWidth:860, margin:'0 auto' }}>
            {pricing.map(plan=>(
              <div key={plan.name} style={{ background:'white', borderRadius:14, padding:'2rem', border:`1.5px solid ${plan.popular ? 'var(--brand)' : 'var(--gray-200)'}`, position:'relative' }}>
                {plan.popular && <div style={{ position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', background:'var(--brand)', color:'white', fontSize:'0.7rem', fontWeight:700, padding:'0.2rem 0.8rem', borderRadius:99 }}>POPULAR</div>}
                <p style={{ fontWeight:700, color:'var(--gray-900)', marginBottom:'0.25rem' }}>{plan.name}</p>
                <p style={{ fontSize:'0.78rem', color:'var(--gray-500)', marginBottom:'1rem' }}>{plan.desc}</p>
                <p style={{ fontSize:'1.85rem', fontWeight:800, color:'var(--gray-900)', letterSpacing:'-0.03em', marginBottom:'1.5rem' }}>{plan.price}<span style={{ fontSize:'0.85rem', fontWeight:400, color:'var(--gray-400)' }}>/mo</span></p>
                <div style={{ display:'flex', flexDirection:'column', gap:'0.55rem', marginBottom:'1.5rem' }}>
                  {plan.features.map(f=>(
                    <div key={f} style={{ display:'flex', gap:'0.5rem', alignItems:'center', fontSize:'0.83rem', color:'var(--gray-700)' }}>
                      <CheckCircle size={13} color="var(--success)" />{f}
                    </div>
                  ))}
                </div>
                <Link to="/signup" className={`btn ${plan.popular ? 'btn-primary' : 'btn-outline'}`} style={{ width:'100%', justifyContent:'center' }}>Get Started</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'4rem 0', background:'linear-gradient(135deg,var(--brand) 0%,#0EA5E9 100%)' }}>
        <div className="container" style={{ textAlign:'center' }}>
          <h2 style={{ fontSize:'1.85rem', fontWeight:800, color:'white', letterSpacing:'-0.02em', marginBottom:'0.75rem' }}>Ready to transform your home life?</h2>
          <p style={{ color:'rgba(255,255,255,0.8)', marginBottom:'2rem' }}>Join thousands of families who trust HomeHelp+ every day.</p>
          <Link to="/signup" style={{ background:'white', color:'var(--brand)', padding:'0.8rem 2rem', borderRadius:9, fontWeight:700, textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'0.5rem' }}>
            Start Free Today <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
