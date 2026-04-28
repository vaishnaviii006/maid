import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const plans = [
  { name:'Basic', price:'₹2,999', desc:'Single service household', color:'white', features:['1 Service Category','1 Worker Assignment','Attendance Tracking','Monthly Invoice','Email Support'], notIncluded:['Replacements','Multiple Workers','Society Integration'] },
  { name:'Standard', price:'₹4,999', desc:'Growing family', color:'var(--brand)', textColor:'white', features:['2 Service Categories','2 Worker Assignments','Attendance + Billing','Replacement Requests','Priority Support','Society Integration'], notIncluded:[] },
  { name:'Premium', price:'₹7,999', desc:'Full household management', color:'white', features:['All Service Categories','Unlimited Workers','Advanced Analytics','Dedicated Manager','24/7 Support','Custom Billing Cycles','API Access'], notIncluded:[] },
];

const faqs = [
  { q:'Can I cancel anytime?', a:'Yes. Cancel your subscription at any time from your dashboard. No lock-in periods, no cancellation fees.' },
  { q:'What happens if my worker is absent?', a:'Absent days are automatically deducted from your monthly bill. You only pay for days the worker actually showed up.' },
  { q:'Can I get a replacement worker?', a:'Yes. Request a temporary or permanent replacement from your dashboard. Standard and Premium plans get same-day replacements.' },
  { q:'Is there a trial period?', a:'We offer a 7-day satisfaction guarantee. If you\'re not happy in the first week, we\'ll refund your subscription in full.' },
];

export default function PricingPage() {
  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh' }}>
      <Navbar />
      <section style={{ background:'var(--gray-50)', padding:'4rem 0 3rem', textAlign:'center' }}>
        <div className="container" style={{ maxWidth:600 }}>
          <p style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--brand)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.6rem' }}>Pricing</p>
          <h1 style={{ fontSize:'clamp(1.8rem,4vw,2.5rem)', fontWeight:800, color:'var(--gray-900)', letterSpacing:'-0.03em', marginBottom:'1rem' }}>Simple pricing, no surprises</h1>
          <p style={{ color:'var(--gray-500)', lineHeight:1.75 }}>Platform fee only. Worker wages are billed separately based on actual attendance.</p>
        </div>
      </section>
      <section style={{ padding:'4rem 0', background:'white' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:'1.25rem', maxWidth:900, margin:'0 auto 4rem' }}>
            {plans.map(plan => (
              <div key={plan.name} style={{ background:plan.color, borderRadius:16, padding:'2rem', border:`1.5px solid ${plan.color==='var(--brand)'?'var(--brand)':'var(--gray-200)'}`, position:'relative' }}>
                {plan.color==='var(--brand)' && <div style={{ position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', background:'#1338A8', color:'white', fontSize:'0.7rem', fontWeight:700, padding:'0.2rem 0.85rem', borderRadius:99 }}>MOST POPULAR</div>}
                <p style={{ fontWeight:700, color:plan.textColor||'var(--gray-900)', marginBottom:'0.25rem', fontSize:'1rem' }}>{plan.name}</p>
                <p style={{ fontSize:'0.8rem', color:plan.textColor ? 'rgba(255,255,255,0.7)' : 'var(--gray-500)', marginBottom:'1rem' }}>{plan.desc}</p>
                <p style={{ fontSize:'2rem', fontWeight:800, color:plan.textColor||'var(--gray-900)', letterSpacing:'-0.03em', marginBottom:'1.5rem' }}>{plan.price}<span style={{ fontSize:'0.85rem', fontWeight:400, opacity:0.6 }}>/mo</span></p>
                <div style={{ display:'flex', flexDirection:'column', gap:'0.55rem', marginBottom:'1.75rem' }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display:'flex', gap:'0.5rem', alignItems:'center', fontSize:'0.83rem', color:plan.textColor||'var(--gray-700)' }}>
                      <CheckCircle size={13} color={plan.textColor ? 'rgba(255,255,255,0.8)' : 'var(--success)'} />{f}
                    </div>
                  ))}
                </div>
                <Link to="/signup" className={`btn ${plan.color==='var(--brand)' ? 'btn-outline' : 'btn-primary'}`}
                  style={{ width:'100%', justifyContent:'center', ...(plan.color==='var(--brand)' ? { borderColor:'white', color:'white' } : {}) }}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>

          <div style={{ maxWidth:640, margin:'0 auto' }}>
            <h2 style={{ fontSize:'1.5rem', fontWeight:800, color:'var(--gray-900)', letterSpacing:'-0.02em', marginBottom:'1.75rem', textAlign:'center' }}>Frequently asked questions</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              {faqs.map(faq => (
                <div key={faq.q} style={{ background:'var(--gray-50)', borderRadius:12, padding:'1.25rem 1.5rem' }}>
                  <p style={{ fontWeight:700, color:'var(--gray-900)', marginBottom:'0.5rem', fontSize:'0.92rem' }}>{faq.q}</p>
                  <p style={{ color:'var(--gray-600)', fontSize:'0.85rem', lineHeight:1.65 }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
