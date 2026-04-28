import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const services = [
  { icon: '🧹', title: 'Maid / House Help', price: 'From ₹3,500/mo', features: ['Daily cleaning & mopping', 'Utensil washing', 'Dusting & arranging', 'Flexible time slots'], color: '#EEF2FF' },
  { icon: '👩‍🍳', title: 'Cook Services', price: 'From ₹5,000/mo', features: ['Breakfast & dinner prep', 'Meal planning', 'Groceries assistance', 'Regional cuisine expertise'], color: '#F0FDF4' },
  { icon: '👶', title: 'Nanny / Babysitter', price: 'From ₹6,000/mo', features: ['Infant & toddler care', 'School pick-up & drop', 'Homework assistance', 'Play & learning activities'], color: '#FFF7ED' },
  { icon: '🤝', title: 'Elder Caregiver', price: 'From ₹7,000/mo', features: ['Daily routine assistance', 'Medication reminders', 'Mobility support', 'Companionship & monitoring'], color: '#FDF4FF' },
];

export default function ServicesPage() {
  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh' }}>
      <Navbar />
      <section style={{ background:'var(--gray-50)', padding:'4rem 0 3rem', textAlign:'center' }}>
        <div className="container" style={{ maxWidth:640 }}>
          <p style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--brand)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.6rem' }}>Services</p>
          <h1 style={{ fontSize:'clamp(1.8rem,4vw,2.5rem)', fontWeight:800, color:'var(--gray-900)', letterSpacing:'-0.03em', marginBottom:'1rem' }}>All services on one platform</h1>
          <p style={{ color:'var(--gray-500)', fontSize:'1rem', lineHeight:1.75 }}>Monthly recurring subscriptions for every domestic help need. Verified workers, fixed slots, zero hassle.</p>
        </div>
      </section>
      <section style={{ padding:'4rem 0', background:'white' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:'1.5rem' }}>
            {services.map(s => (
              <div key={s.title} style={{ background:s.color, borderRadius:16, padding:'2rem', border:'1px solid rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize:'2.25rem', marginBottom:'1rem' }}>{s.icon}</div>
                <h2 style={{ fontWeight:800, color:'var(--gray-900)', fontSize:'1.05rem', marginBottom:'0.25rem' }}>{s.title}</h2>
                <p style={{ fontSize:'0.82rem', fontWeight:700, color:'var(--brand)', marginBottom:'1.25rem' }}>{s.price}</p>
                <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'0.5rem', marginBottom:'1.75rem' }}>
                  {s.features.map(f => (
                    <li key={f} style={{ fontSize:'0.83rem', color:'var(--gray-700)', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                      <span style={{ color:'var(--success)', fontWeight:700 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/signup" className="btn btn-primary" style={{ width:'100%', justifyContent:'center' }}>Book Now <ArrowRight size={14} /></Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section style={{ padding:'4rem 0', background:'var(--gray-50)', textAlign:'center' }}>
        <div className="container" style={{ maxWidth:600 }}>
          <h2 style={{ fontSize:'1.65rem', fontWeight:800, color:'var(--gray-900)', letterSpacing:'-0.02em', marginBottom:'0.75rem' }}>Not sure which service you need?</h2>
          <p style={{ color:'var(--gray-500)', marginBottom:'1.75rem' }}>Our team can help you figure out the right fit for your household. Reach out anytime.</p>
          <Link to="/contact" className="btn btn-outline btn-lg">Talk to Us</Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
