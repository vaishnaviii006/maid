import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { workerNav } from '../../utils/navConfig';
import { workersAPI } from '../../api';
import { Upload, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const docTypes = [
  { key:'aadhaar', label:'Aadhaar Card', required:true },
  { key:'pan', label:'PAN Card', required:false },
  { key:'photo', label:'Profile Photo', required:true },
  { key:'addressProof', label:'Address Proof', required:true },
  { key:'policeVerification', label:'Police Verification', required:true },
];

export default function WorkerDocuments() {
  const [profile, setProfile] = useState(null);
  const [uploading, setUploading] = useState('');
  const [urlInput, setUrlInput] = useState({ key:'', url:'' });

  useEffect(() => {
    workersAPI.getMe().then(r=>setProfile(r.data.worker)).catch(()=>{});
  }, []);

  const handleUpload = async () => {
    if (!urlInput.key || !urlInput.url) return;
    setUploading(urlInput.key);
    try {
      const res = await workersAPI.uploadKyc({ docType: urlInput.key, url: urlInput.url });
      setProfile(res.data.worker);
      toast.success('Document uploaded successfully');
      setUrlInput({ key:'', url:'' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally { setUploading(''); }
  };

  const getDoc = (key) => profile?.kyc?.[key];

  return (
    <DashboardLayout navItems={workerNav} role="worker">
      <div className="section-header">
        <div>
          <h1 style={{ fontSize:'1.3rem', fontWeight:800, color:'var(--gray-900)' }}>KYC Documents</h1>
          <p style={{ color:'var(--gray-500)', fontSize:'0.875rem' }}>Upload verification documents for approval</p>
        </div>
      </div>

      <div style={{ background:'#FEF3C7', border:'1px solid #FDE68A', borderRadius:10, padding:'0.9rem 1.1rem', marginBottom:'1.5rem', fontSize:'0.85rem', color:'#92400E' }}>
        ⚠️ All documents are verified by our team within 24–48 hours. Your profile won't be approved until all required documents are submitted.
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
        {docTypes.map(doc => {
          const uploaded = getDoc(doc.key);
          return (
            <div key={doc.key} style={{ background:'white', borderRadius:12, border:'1px solid var(--gray-100)', padding:'1.25rem 1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem' }}>
              <div style={{ display:'flex', gap:'0.75rem', alignItems:'center' }}>
                <div style={{ width:40, height:40, borderRadius:10, background: uploaded?.url ? '#DCFCE7' : 'var(--gray-100)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {uploaded?.url ? <CheckCircle size={19} color="#16A34A" /> : <Clock size={19} color="var(--gray-400)" />}
                </div>
                <div>
                  <p style={{ fontWeight:700, color:'var(--gray-900)', fontSize:'0.9rem' }}>
                    {doc.label} {doc.required && <span style={{ color:'var(--danger)', fontSize:'0.75rem' }}>*</span>}
                  </p>
                  <p style={{ fontSize:'0.75rem', color: uploaded?.url ? 'var(--success)' : 'var(--gray-400)' }}>
                    {uploaded?.url ? (uploaded?.verified ? '✓ Verified' : 'Uploaded — Pending verification') : 'Not uploaded'}
                  </p>
                </div>
              </div>
              <div style={{ display:'flex', gap:'0.5rem', alignItems:'center' }}>
                {urlInput.key === doc.key ? (
                  <>
                    <input className="input" style={{ width:240, fontSize:'0.8rem' }} placeholder="Paste document URL..." value={urlInput.url} onChange={e=>setUrlInput({...urlInput,url:e.target.value})} />
                    <button className="btn btn-primary btn-sm" onClick={handleUpload} disabled={uploading===doc.key}>{uploading===doc.key?'Uploading...':'Submit'}</button>
                    <button className="btn btn-ghost btn-sm" onClick={()=>setUrlInput({key:'',url:''})}>Cancel</button>
                  </>
                ) : (
                  <button className="btn btn-outline btn-sm" onClick={()=>setUrlInput({key:doc.key,url:''})}>
                    <Upload size={13} /> {uploaded?.url ? 'Re-upload' : 'Upload'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
