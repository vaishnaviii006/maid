import { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', subject:'', message:'' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success('Message sent! We\'ll get back to you within 24 hours.');
      setForm({ name:'', email:'', phone:'', subject:'', message:'' });
      setLoading(false);
    }, 1200);
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh' }}>
      <Navbar />
      <section style={{ background:'var(--gray-50)', padding:'4rem 0 3rem', textAlign:'center' }}>
        <div className="container" style={{ maxWidth:560 }}>
          <p style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--brand)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.6rem' }}>Contact</p>
          <h1 style={{ fontSize:'clamp(1.8rem,4vw,2.5rem)', fontWeight:800, color:'var(--gray-900)', letterSpacing:'-0.03em', marginBottom:'1rem' }}>We'd love to hear from you</h1>
          <p style={{ color:'var(--gray-500)', lineHeight:1.75 }}>Questions, feedback, or partnership inquiries — our team responds within 24 hours.</p>
        </div>
      </section>
      <section style={{ padding:'4rem 0', background:'white' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1.6fr', gap:'3rem', alignItems:'start', maxWidth:960, margin:'0 auto' }}>
            <div>
              <h2 style={{ fontSize:'1.25rem', fontWeight:800, color:'var(--gray-900)', marginBottom:'1.5rem' }}>Get in touch</h2>
              {[{ Icon:Mail, label:'Email', val:'hello@homehelp.in' },{ Icon:Phone, label:'Phone', val:'+91 98765 43210' },{ Icon:MapPin, label:'Office', val:'Bandra West, Mumbai, Maharashtra 400050' }].map(({Icon,label,val})=>(
                <div key={label} style={{ display:'flex', gap:'0.85rem', marginBottom:'1.25rem' }}>
                  <div style={{ width:40, height:40, borderRadius:10, background:'var(--brand-light)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Icon size={17} color="var(--brand)" />
                  </div>
                  <div>
                    <p style={{ fontSize:'0.75rem', color:'var(--gray-500)', fontWeight:600, marginBottom:'0.1rem' }}>{label}</p>
                    <p style={{ fontSize:'0.88rem', color:'var(--gray-800)', fontWeight:500 }}>{val}</p>
                  </div>
                </div>
              ))}
              <div style={{ background:'var(--gray-50)', borderRadius:12, padding:'1.25rem', marginTop:'2rem' }}>
                <p style={{ fontWeight:700, color:'var(--gray-800)', fontSize:'0.88rem', marginBottom:'0.5rem' }}>Business Hours</p>
                <p style={{ fontSize:'0.83rem', color:'var(--gray-600)' }}>Monday – Saturday: 9 AM – 8 PM</p>
                <p style={{ fontSize:'0.83rem', color:'var(--gray-600)' }}>Sunday: 10 AM – 5 PM</p>
              </div>
            </div>
            <div style={{ background:'var(--gray-50)', borderRadius:16, padding:'2rem', border:'1px solid var(--gray-100)' }}>
              <h2 style={{ fontSize:'1.1rem', fontWeight:800, color:'var(--gray-900)', marginBottom:'1.5rem' }}>Send a message</h2>
              <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                  <div><label>Full Name</label><input className="input" placeholder="Priya Sharma" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required /></div>
                  <div><label>Email</label><input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required /></div>
                </div>
                <div><label>Phone (optional)</label><input className="input" placeholder="9876543210" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /></div>
                <div><label>Subject</label>
                  <select className="input" value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} required>
                    <option value="">Select a topic</option>
                    <option>General Inquiry</option>
                    <option>Worker Complaint</option>
                    <option>Billing Issue</option>
                    <option>Partnership / Business</option>
                    <option>Other</option>
                  </select>
                </div>
                <div><label>Message</label><textarea className="input" rows={4} placeholder="Tell us how we can help..." value={form.message} onChange={e=>setForm({...form,message:e.target.value})} required style={{ resize:'vertical' }} /></div>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ width:'100%', justifyContent:'center' }}>
                  {loading ? 'Sending...' : <><Send size={15} /> Send Message</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
