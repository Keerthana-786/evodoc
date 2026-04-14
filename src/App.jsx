import { useState } from "react";
import {
  LayoutDashboard, Calendar, Users, ClipboardList, Stethoscope,
  Search, Bell, Settings, ChevronRight, Plus, Check, X, Edit,
  Eye, XCircle, Phone, Mail, FileText, AlertTriangle, CheckCircle,
  Clock, User, Save, Activity, Filter
} from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --n:#0a1628;--n2:#132244;--n3:#1b3060;
  --t:#00c9a7;--td:#009e83;--tl:#e0faf5;
  --bg:#f0f4fa;--wh:#fff;
  --tx:#0f172a;--t2:#475569;--t3:#94a3b8;
  --bd:#e1e8f0;
  --ok:#10b981;--okbg:#ecfdf5;
  --wn:#f59e0b;--wnbg:#fffbeb;
  --er:#ef4444;--erbg:#fef2f2;
  --inf:#3b82f6;--infbg:#eff6ff;
  --r:10px;--rl:16px;--rs:6px;
  --s0:0 1px 3px rgba(10,22,40,.07);
  --s1:0 4px 14px rgba(10,22,40,.09);
  --s2:0 10px 32px rgba(10,22,40,.13);
  --f:'Sora',sans-serif;--fm:'IBM Plex Mono',monospace;
}
html,body,#root{height:100%;font-family:var(--f);background:var(--bg);color:var(--tx)}
.app{display:flex;height:100vh;overflow:hidden}
.sb{width:244px;background:linear-gradient(175deg,var(--n) 0%,#060e1f 100%);display:flex;flex-direction:column;flex-shrink:0;overflow-y:auto;overflow-x:hidden;border-right:1px solid rgba(255,255,255,.05)}
.sb-logo{padding:22px 20px 16px;border-bottom:1px solid rgba(255,255,255,.07)}
.logo-b{display:flex;align-items:center;gap:10px}
.logo-ic{width:36px;height:36px;background:linear-gradient(135deg,var(--t),#008f72);border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.logo-tx{font-size:17px;font-weight:700;color:#fff;letter-spacing:-.3px}
.logo-sub{font-size:10px;color:rgba(255,255,255,.35);letter-spacing:1px;text-transform:uppercase;margin-top:1px}
.pt-sw{margin:12px 12px 0;background:rgba(255,255,255,.07);border-radius:8px;padding:3px;display:flex;gap:2px}
.pt-b{flex:1;padding:7px 4px;border:none;border-radius:6px;font-family:var(--f);font-size:10px;font-weight:600;letter-spacing:.3px;cursor:pointer;transition:all .2s;color:rgba(255,255,255,.45);background:transparent;text-align:center}
.pt-b.on{background:var(--t);color:var(--n)}
.nav-s{padding:6px 12px 4px}
.nav-lb{font-size:9px;font-weight:700;color:rgba(255,255,255,.22);letter-spacing:1.5px;text-transform:uppercase;padding:10px 8px 6px}
.nav-i{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:8px;cursor:pointer;transition:all .2s;color:rgba(255,255,255,.5);font-size:13px;font-weight:500;margin-bottom:2px;border:none;background:none;width:100%;text-align:left}
.nav-i:hover{background:rgba(255,255,255,.07);color:rgba(255,255,255,.85)}
.nav-i.on{background:rgba(0,201,167,.14);color:var(--t)}
.sb-ft{margin-top:auto;padding:12px;border-top:1px solid rgba(255,255,255,.07)}
.u-card{display:flex;align-items:center;gap:10px;padding:10px;border-radius:8px;background:rgba(255,255,255,.05)}
.u-av{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--t),#0090d4);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0}
.u-nm{font-size:12px;font-weight:600;color:#fff}
.u-rl{font-size:10px;color:rgba(255,255,255,.38)}
.main{flex:1;overflow-y:auto;overflow-x:hidden}
.topbar{display:flex;align-items:center;justify-content:space-between;padding:14px 26px;background:var(--wh);border-bottom:1px solid var(--bd);position:sticky;top:0;z-index:10}
.pg-t{font-size:17px;font-weight:700;color:var(--tx);letter-spacing:-.3px}
.pg-s{font-size:12px;color:var(--t3);margin-top:2px}
.tb-acts{display:flex;align-items:center;gap:10px}
.ic-b{width:34px;height:34px;border-radius:8px;border:1px solid var(--bd);background:var(--bg);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .15s;color:var(--t2)}
.ic-b:hover{background:var(--wh);border-color:var(--t3)}
.nd{position:relative}
.nd::after{content:'';position:absolute;top:7px;right:7px;width:6px;height:6px;background:var(--er);border-radius:50%;border:2px solid var(--bg)}
.cont{padding:22px 26px}
.card{background:var(--wh);border-radius:var(--rl);border:1px solid var(--bd);box-shadow:var(--s0)}
.c-hd{padding:16px 20px;border-bottom:1px solid var(--bd);display:flex;align-items:center;justify-content:space-between}
.c-t{font-size:14px;font-weight:700;color:var(--tx)}
.c-s{font-size:11px;color:var(--t3);margin-top:2px}
.c-bd{padding:20px}
.fs{margin-bottom:26px}
.sec-t{font-size:11px;font-weight:700;color:var(--t2);letter-spacing:.8px;text-transform:uppercase;padding-bottom:12px;border-bottom:1px solid var(--bd);margin-bottom:16px;display:flex;align-items:center;gap:8px}
.sec-d{width:6px;height:6px;border-radius:50%;background:var(--t);flex-shrink:0}
.fg{display:grid;gap:14px}
.fg2{grid-template-columns:1fr 1fr}
.fg3{grid-template-columns:1fr 1fr 1fr}
.fgp{display:flex;flex-direction:column;gap:5px}
.fl{font-size:11px;font-weight:600;color:var(--t2);letter-spacing:.1px}
.fl span{color:var(--er);margin-left:2px}
.fi,.fsl,.fta{padding:8px 11px;border:1.5px solid var(--bd);border-radius:var(--rs);font-family:var(--f);font-size:13px;color:var(--tx);background:var(--wh);transition:border-color .15s,box-shadow .15s;outline:none;width:100%}
.fi:focus,.fsl:focus,.fta:focus{border-color:var(--t);box-shadow:0 0 0 3px rgba(0,201,167,.1)}
.fi.err,.fsl.err{border-color:var(--er)}
.ferr{font-size:11px;color:var(--er)}
.fta{resize:vertical;min-height:78px}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:8px 16px;border-radius:var(--rs);font-family:var(--f);font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;border:none;letter-spacing:.1px}
.btn-p{background:var(--t);color:var(--n)}
.btn-p:hover{background:var(--td);transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,201,167,.3)}
.btn-s{background:var(--wh);color:var(--tx);border:1.5px solid var(--bd)}
.btn-s:hover{background:var(--bg)}
.btn-d{background:var(--erbg);color:var(--er);border:1.5px solid #fecaca}
.btn-d:hover{background:#fee2e2}
.btn-g{background:transparent;color:var(--t2);padding:6px 9px}
.btn-g:hover{background:var(--bg);color:var(--tx)}
.sm{padding:6px 11px;font-size:12px}
.bdg{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:600}
.bdg-sch{background:var(--infbg);color:var(--inf)}
.bdg-com{background:var(--okbg);color:var(--ok)}
.bdg-can{background:var(--erbg);color:var(--er)}
.tbl-w{overflow-x:auto}
table{width:100%;border-collapse:collapse}
thead tr{border-bottom:2px solid var(--bd)}
th{padding:10px 13px;font-size:10px;font-weight:700;color:var(--t3);letter-spacing:.8px;text-transform:uppercase;text-align:left;white-space:nowrap}
td{padding:11px 13px;font-size:13px;color:var(--tx);border-bottom:1px solid var(--bd);vertical-align:middle}
tbody tr:last-child td{border-bottom:none}
tbody tr:hover td{background:#f8fafc}
.sg{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:22px}
.sc{background:var(--wh);border:1px solid var(--bd);border-radius:var(--rl);padding:16px 18px;box-shadow:var(--s0)}
.sl{font-size:10.5px;font-weight:600;color:var(--t3);letter-spacing:.5px;text-transform:uppercase}
.sv{font-size:26px;font-weight:800;letter-spacing:-1px;margin-top:5px}
.sch{font-size:11px;color:var(--t3);margin-top:3px}
.s-ic{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:10px}
.ac{background:var(--wh);border:1px solid var(--bd);border-radius:var(--r);padding:14px 16px;margin-bottom:9px;box-shadow:var(--s0);display:flex;align-items:center;gap:14px;transition:box-shadow .2s,border-color .2s;cursor:pointer}
.ac:hover{box-shadow:var(--s1);border-color:#c7d2e8}
.at-b{min-width:58px;text-align:center;padding:7px;background:var(--bg);border-radius:7px;flex-shrink:0}
.at-h{font-size:13px;font-weight:700;color:var(--tx);font-family:var(--fm)}
.at-d{font-size:9px;color:var(--t3);margin-top:2px}
.a-inf{flex:1}
.a-pt{font-size:13.5px;font-weight:600;color:var(--tx)}
.a-mt{font-size:11px;color:var(--t2);margin-top:3px}
.sw{position:relative}
.s-ic2{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--t3)}
.si{padding:8px 11px 8px 32px;border:1.5px solid var(--bd);border-radius:var(--rs);font-family:var(--f);font-size:12.5px;color:var(--tx);background:var(--wh);outline:none;width:100%;transition:border-color .15s}
.si:focus{border-color:var(--t)}
.tabs{display:flex;gap:3px;border-bottom:2px solid var(--bd);margin-bottom:18px}
.tab{padding:8px 14px;font-size:12.5px;font-weight:600;color:var(--t2);cursor:pointer;border:none;background:none;font-family:var(--f);border-bottom:2px solid transparent;margin-bottom:-2px;transition:all .15s}
.tab:hover{color:var(--tx)}
.tab.on{color:var(--t);border-bottom-color:var(--t)}
.fb{display:flex;align-items:center;gap:9px;margin-bottom:16px;flex-wrap:wrap}
.al{padding:11px 14px;border-radius:var(--rs);font-size:12.5px;display:flex;align-items:flex-start;gap:9px;margin-bottom:12px}
.al-ok{background:var(--okbg);color:#065f46;border:1px solid #a7f3d0}
.al-inf{background:var(--infbg);color:#1e40af;border:1px solid #bfdbfe}
.ov{position:fixed;inset:0;background:rgba(10,22,40,.5);backdrop-filter:blur(2px);display:flex;align-items:center;justify-content:center;z-index:100}
.md{background:var(--wh);border-radius:var(--rl);padding:26px;width:420px;box-shadow:var(--s2);animation:mdi .2s ease}
@keyframes mdi{from{opacity:0;transform:scale(.96) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
.md-t{font-size:15px;font-weight:700;margin-bottom:7px}
.md-b{font-size:13px;color:var(--t2);margin-bottom:18px;line-height:1.55}
.ir{display:flex;gap:8px;align-items:flex-start;margin-bottom:9px}
.il{font-size:11px;font-weight:600;color:var(--t3);text-transform:uppercase;letter-spacing:.5px;width:110px;flex-shrink:0;padding-top:1px}
.iv{font-size:13px;color:var(--tx);font-weight:500}
.ph{background:linear-gradient(135deg,var(--n) 0%,var(--n3) 100%);border-radius:var(--rl);padding:22px 26px;color:#fff;margin-bottom:18px;display:flex;align-items:center;gap:18px}
.p-av{width:52px;height:52px;border-radius:50%;background:rgba(0,201,167,.18);border:2px solid rgba(0,201,167,.35);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;color:var(--t);flex-shrink:0}
.p-nm{font-size:19px;font-weight:700}
.p-mr{display:flex;gap:14px;margin-top:5px}
.p-mi{font-size:11.5px;color:rgba(255,255,255,.55);display:flex;align-items:center;gap:5px}
.2col{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.ni{padding:13px 15px;background:var(--bg);border-radius:var(--rs);border-left:3px solid var(--t);margin-bottom:9px}
.nm{font-size:11px;color:var(--t3);margin-bottom:4px;display:flex;gap:10px}
.nt{font-size:13px;color:var(--tx);line-height:1.5}
.av-d{width:6px;height:6px;border-radius:50%}
.av-y{background:var(--ok)}
.av-n{background:var(--t3)}
.ql{display:flex;align-items:center;gap:9px;padding:10px 13px;background:var(--bg);border-radius:var(--rs);cursor:pointer;transition:all .15s;border:1px solid transparent;font-size:13px;font-weight:500;color:var(--tx);margin-bottom:7px}
.ql:hover{background:var(--wh);border-color:var(--bd);box-shadow:var(--s0)}
.ql-ic{width:30px;height:30px;border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.sel-av{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--t),#0090d4);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff;flex-shrink:0}
.dd{border:1.5px solid var(--bd);border-radius:var(--rs);background:var(--wh);box-shadow:var(--s1);max-height:200px;overflow-y:auto;padding:4px}
.psi{padding:9px 11px;border-radius:var(--rs);cursor:pointer;font-size:13px;transition:background .1s;display:flex;align-items:center;gap:9px}
.psi:hover{background:var(--bg)}
.psi.on{background:var(--tl)}
.pe{animation:pe .2s ease}
@keyframes pe{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
.nf-i{padding:11px;border-radius:var(--rs);background:var(--bg);margin-bottom:7px;border-left:3px solid var(--t)}
.nf-t{font-size:12px;font-weight:600;color:var(--tx)}
.nf-tm{font-size:10.5px;color:var(--t3);margin-top:2px}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:10px}
`;

const PATIENTS = [
  { id:1, name:'Priya Sharma', dob:'1990-05-15', age:35, gender:'Female', contact:'+91 98765 43210', email:'priya@email.com', blood:'B+', allergies:'Penicillin', conditions:'Hypertension', medications:'Amlodipine 5mg once daily', emergency:{name:'Rahul Sharma', relation:'Husband', contact:'+91 98765 43211'} },
  { id:2, name:'Arjun Mehta', dob:'1985-08-22', age:40, gender:'Male', contact:'+91 91234 56789', email:'arjun@email.com', blood:'O+', allergies:'None', conditions:'Type 2 Diabetes', medications:'Metformin 500mg twice daily', emergency:{name:'Meena Mehta', relation:'Wife', contact:'+91 91234 56790'} },
  { id:3, name:'Sunita Reddy', dob:'1978-11-30', age:47, gender:'Female', contact:'+91 99887 76655', email:'sunita@email.com', blood:'A-', allergies:'Sulfa drugs', conditions:'Asthma', medications:'Salbutamol inhaler as needed', emergency:{name:'Ravi Reddy', relation:'Son', contact:'+91 99887 76656'} },
  { id:4, name:'Vikram Nair', dob:'1995-03-10', age:31, gender:'Male', contact:'+91 93456 78901', email:'vikram@email.com', blood:'AB+', allergies:'Latex', conditions:'None', medications:'None', emergency:{name:'Uma Nair', relation:'Mother', contact:'+91 93456 78902'} },
];

const DOCTORS = [
  { id:1, name:'Dr. Kavitha Iyer', specialty:'General Medicine', available:true, today:8, week:32, slots:['09:00','10:00','11:00','14:00','15:00'] },
  { id:2, name:'Dr. Rajesh Kumar', specialty:'Cardiology', available:true, today:6, week:24, slots:['09:30','11:30','14:30','16:00'] },
  { id:3, name:'Dr. Meena Pillai', specialty:'Pediatrics', available:false, today:0, week:18, slots:[] },
  { id:4, name:'Dr. Suresh Babu', specialty:'Orthopedics', available:true, today:5, week:20, slots:['10:00','12:00','15:00'] },
];

const INIT_APPTS = [
  { id:1, patientId:1, patient:'Priya Sharma', doctorId:1, doctor:'Dr. Kavitha Iyer', date:'2026-04-14', time:'09:00', type:'Consultation', status:'scheduled', notes:'Follow-up for BP management' },
  { id:2, patientId:2, patient:'Arjun Mehta', doctorId:2, doctor:'Dr. Rajesh Kumar', date:'2026-04-14', time:'09:30', type:'Review', status:'completed', notes:'Cardiac review post ECG' },
  { id:3, patientId:3, patient:'Sunita Reddy', doctorId:1, doctor:'Dr. Kavitha Iyer', date:'2026-04-14', time:'11:00', type:'Emergency', status:'scheduled', notes:'Breathing difficulty episode' },
  { id:4, patientId:4, patient:'Vikram Nair', doctorId:4, doctor:'Dr. Suresh Babu', date:'2026-04-15', time:'10:00', type:'Consultation', status:'scheduled', notes:'Knee pain evaluation' },
  { id:5, patientId:1, patient:'Priya Sharma', doctorId:3, doctor:'Dr. Meena Pillai', date:'2026-04-13', time:'14:00', type:'Review', status:'cancelled', notes:'Cancelled by patient' },
  { id:6, patientId:2, patient:'Arjun Mehta', doctorId:1, doctor:'Dr. Kavitha Iyer', date:'2026-04-16', time:'11:00', type:'Consultation', status:'scheduled', notes:'Diabetes quarterly checkup' },
];

const INIT_NOTES = [
  { id:1, patientId:1, date:'2026-03-15', doctor:'Dr. Kavitha Iyer', note:'BP 140/90. Advised lifestyle changes and low-sodium diet. Continued Amlodipine. Follow-up in 4 weeks.' },
  { id:2, patientId:1, date:'2026-02-10', doctor:'Dr. Kavitha Iyer', note:'Initial consultation. Patient presents with elevated blood pressure (152/96). Started on Amlodipine 5mg once daily.' },
  { id:3, patientId:2, date:'2026-03-20', doctor:'Dr. Rajesh Kumar', note:'ECG normal. HbA1c: 7.2%. Continue Metformin. Diet counselling provided. Next review in 3 months.' },
];

const ini = n => n.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase();

function Badge({ s }) {
  const m = { scheduled:'bdg-sch', completed:'bdg-com', cancelled:'bdg-can' };
  const l = { scheduled:'Scheduled', completed:'Completed', cancelled:'Cancelled' };
  return <span className={`bdg ${m[s]||'bdg-sch'}`}>{l[s]||s}</span>;
}

function FG({ label, req, err, children, span }) {
  return (
    <div className="fgp" style={span?{gridColumn:'1/-1'}:{}}>
      {label && <label className="fl">{label}{req&&<span>*</span>}</label>}
      {children}
      {err && <span className="ferr">{err}</span>}
    </div>
  );
}

function Input({ label, req, err, span, ...p }) {
  return <FG label={label} req={req} err={err} span={span}><input className={`fi${err?' err':''}`} {...p}/></FG>;
}
function Sel({ label, req, err, span, children, ...p }) {
  return <FG label={label} req={req} err={err} span={span}><select className={`fsl${err?' err':''}`} {...p}>{children}</select></FG>;
}
function Area({ label, span, ...p }) {
  return <FG label={label} span={span}><textarea className="fta" {...p}/></FG>;
}

function SecTitle({ ic, children }) {
  return <div className="sec-t"><span className="sec-d"/>{ic&&<span style={{color:'var(--t)',display:'flex'}}>{ic}</span>}{children}</div>;
}

// ── Patient Intake ──────────────────────────────────────────────
function PatientIntake() {
  const e0 = {fullName:'',dob:'',gender:'',contact:'',email:'',eName:'',eRel:'',eCon:'',blood:'',allergies:'',conditions:'',medications:''};
  const [f, setF] = useState(e0);
  const [err, setErr] = useState({});
  const [ok, setOk] = useState('');
  const s = k => e => setF(p=>({...p,[k]:e.target.value}));

  const validate = () => {
    const e = {};
    if (!f.fullName.trim()) e.fullName='Full name is required';
    if (!f.dob) e.dob='Date of birth is required';
    if (!f.gender) e.gender='Please select gender';
    if (!f.contact.trim()) e.contact='Contact number is required';
    else if (!/^\+?[\d\s\-(]{8,16}$/.test(f.contact)) e.contact='Enter a valid phone number';
    if (!f.eName.trim()) e.eName='Emergency contact name required';
    if (!f.eCon.trim()) e.eCon='Emergency contact number required';
    if (!f.blood) e.blood='Blood group required';
    return e;
  };

  const submit = () => {
    const e = validate();
    setErr(e);
    if (!Object.keys(e).length) { setOk('submitted'); setF(e0); setTimeout(()=>setOk(''),3500); }
  };
  const save = () => {
    setOk('saved'); setTimeout(()=>setOk(''),3000);
  };

  return (
    <div className="pe">
      {ok && <div className={`al al-ok`} style={{marginBottom:14}}><CheckCircle size={15}/><span>{ok==='submitted'?'Patient intake form submitted and saved successfully.':'Draft saved successfully.'}</span></div>}
      <div className="card">
        <div className="c-hd"><div><div className="c-t">New Patient Registration</div><div className="c-s">Complete all required fields to register a new patient</div></div></div>
        <div className="c-bd">
          <div className="fs">
            <SecTitle ic={<User size={12}/>}>Personal Information</SecTitle>
            <div className="fg fg2">
              <Input label="Full Name" req placeholder="e.g. Priya Sharma" value={f.fullName} onChange={s('fullName')} err={err.fullName}/>
              <Input label="Date of Birth" req type="date" value={f.dob} onChange={s('dob')} err={err.dob}/>
              <Sel label="Gender" req value={f.gender} onChange={s('gender')} err={err.gender}>
                <option value="">Select gender</option>
                <option>Male</option><option>Female</option><option>Other</option><option>Prefer not to say</option>
              </Sel>
              <Input label="Contact Number" req placeholder="+91 98765 43210" value={f.contact} onChange={s('contact')} err={err.contact}/>
              <Input label="Email Address" placeholder="patient@email.com" type="email" value={f.email} onChange={s('email')} span/>
            </div>
          </div>
          <div className="fs">
            <SecTitle ic={<Phone size={12}/>}>Emergency Contact</SecTitle>
            <div className="fg fg3">
              <Input label="Contact Name" req placeholder="Full name" value={f.eName} onChange={s('eName')} err={err.eName}/>
              <Input label="Relationship" placeholder="e.g. Spouse, Parent" value={f.eRel} onChange={s('eRel')}/>
              <Input label="Contact Number" req placeholder="+91 98765 43210" value={f.eCon} onChange={s('eCon')} err={err.eCon}/>
            </div>
          </div>
          <div className="fs">
            <SecTitle ic={<Activity size={12}/>}>Medical Information</SecTitle>
            <div className="fg fg2">
              <Sel label="Blood Group" req value={f.blood} onChange={s('blood')} err={err.blood}>
                <option value="">Select blood group</option>
                {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b=><option key={b}>{b}</option>)}
              </Sel>
              <Input label="Known Allergies" placeholder="e.g. Penicillin, Latex (or None)" value={f.allergies} onChange={s('allergies')}/>
              <Area label="Chronic Conditions" placeholder="e.g. Hypertension, Diabetes (or None)" value={f.conditions} onChange={s('conditions')} style={{minHeight:72}}/>
              <Area label="Current Medications" placeholder="e.g. Amlodipine 5mg once daily (or None)" value={f.medications} onChange={s('medications')} style={{minHeight:72}}/>
            </div>
          </div>
          <div style={{display:'flex',gap:9,justifyContent:'flex-end'}}>
            <button className="btn btn-s sm" onClick={()=>setF(e0)}>Clear Form</button>
            <button className="btn btn-s sm" onClick={save}><Save size={13}/>Save Draft</button>
            <button className="btn btn-p sm" onClick={submit}><Check size={13}/>Submit Patient</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Appointment Registration ────────────────────────────────────
function ApptReg() {
  const [selPt, setSelPt] = useState(null);
  const [ptQ, setPtQ] = useState('');
  const [showDd, setShowDd] = useState(false);
  const [docId, setDocId] = useState('');
  const [date, setDate] = useState('2026-04-14');
  const [time, setTime] = useState('');
  const [type, setType] = useState('');
  const [notes, setNotes] = useState('');
  const [err, setErr] = useState({});
  const [modal, setModal] = useState(false);
  const [done, setDone] = useState(false);

  const pts = PATIENTS.filter(p=>p.name.toLowerCase().includes(ptQ.toLowerCase()));
  const doc = DOCTORS.find(d=>d.id===Number(docId));

  const validate = () => {
    const e={};
    if (!selPt) e.pt='Please select a patient';
    if (!docId) e.doc='Please select a doctor';
    if (!date) e.date='Date required';
    if (!time) e.time='Please select a time slot';
    if (!type) e.type='Appointment type required';
    return e;
  };

  const confirm = () => { const e=validate(); setErr(e); if (!Object.keys(e).length) setModal(true); };
  const finalise = () => {
    setModal(false); setDone(true); setTimeout(()=>setDone(false),4000);
    setSelPt(null); setDocId(''); setTime(''); setType(''); setNotes(''); setPtQ('');
  };

  return (
    <div className="pe">
      {done && <div className="al al-ok" style={{marginBottom:14}}><CheckCircle size={15}/><span>Appointment confirmed and booked successfully!</span></div>}
      {modal && (
        <div className="ov">
          <div className="md">
            <div className="md-t">Confirm Booking</div>
            <div className="md-b">
              <div className="ir"><span className="il">Patient</span><span className="iv">{selPt?.name}</span></div>
              <div className="ir"><span className="il">Doctor</span><span className="iv">{doc?.name}</span></div>
              <div className="ir"><span className="il">Date & Time</span><span className="iv" style={{fontFamily:'var(--fm)'}}>{date} at {time}</span></div>
              <div className="ir"><span className="il">Type</span><span className="iv">{type}</span></div>
              {notes && <div className="ir"><span className="il">Notes</span><span className="iv">{notes}</span></div>}
            </div>
            <div style={{display:'flex',gap:9,justifyContent:'flex-end'}}>
              <button className="btn btn-s sm" onClick={()=>setModal(false)}>Back</button>
              <button className="btn btn-p sm" onClick={finalise}><Check size={13}/>Confirm Booking</button>
            </div>
          </div>
        </div>
      )}
      <div className="card">
        <div className="c-hd"><div><div className="c-t">New Appointment</div><div className="c-s">Schedule for a new or returning patient</div></div></div>
        <div className="c-bd">
          <div className="fs">
            <SecTitle ic={<User size={12}/>}>Patient</SecTitle>
            <div style={{maxWidth:420,position:'relative'}}>
              <div className="fgp">
                <label className="fl">Search Patient<span>*</span></label>
                <div className="sw">
                  <Search size={13} className="s-ic2"/>
                  <input className={`si${err.pt?' err':''}`}
                    placeholder="Search by name..."
                    value={selPt?selPt.name:ptQ}
                    onFocus={()=>{setShowDd(true);if(selPt){setSelPt(null);setPtQ('');}}}
                    onChange={e=>{setPtQ(e.target.value);setShowDd(true);setSelPt(null);}}
                  />
                </div>
                {err.pt && <span className="ferr">{err.pt}</span>}
              </div>
              {showDd && !selPt && (
                <div className="dd" style={{position:'absolute',top:'100%',left:0,right:0,zIndex:20,marginTop:3}}>
                  {pts.map(p=>(
                    <div key={p.id} className="psi" onClick={()=>{setSelPt(p);setShowDd(false);}}>
                      <div className="sel-av">{ini(p.name)}</div>
                      <div><div style={{fontWeight:600,fontSize:13}}>{p.name}</div><div style={{fontSize:11,color:'var(--t3)'}}>{p.dob} · {p.blood}</div></div>
                    </div>
                  ))}
                  {pts.length===0&&<div style={{padding:'10px 12px',fontSize:12,color:'var(--t3)'}}>No patients found</div>}
                </div>
              )}
            </div>
            {selPt && <div className="al al-inf" style={{marginTop:9,maxWidth:480}}><User size={14}/><span>Returning patient — {selPt.name} · Blood: {selPt.blood} · {selPt.conditions}</span></div>}
          </div>
          <div className="fs">
            <SecTitle ic={<Stethoscope size={12}/>}>Doctor & Schedule</SecTitle>
            <div className="fg fg2">
              <div className="fgp">
                <label className="fl">Doctor<span>*</span></label>
                <select className={`fsl${err.doc?' err':''}`} value={docId} onChange={e=>{setDocId(e.target.value);setTime('');}}>
                  <option value="">Select doctor</option>
                  {DOCTORS.map(d=><option key={d.id} value={d.id} disabled={!d.available}>{d.name} — {d.specialty}{!d.available?' (Unavailable)':''}</option>)}
                </select>
                {err.doc && <span className="ferr">{err.doc}</span>}
                {doc && <div style={{marginTop:4,display:'flex',alignItems:'center',gap:5,fontSize:11,color:'var(--t2)'}}><span className={`av-d ${doc.available?'av-y':'av-n'}`}/>{doc.available?'Available today':'Off today'} · {doc.specialty}</div>}
              </div>
              <div className="fgp">
                <label className="fl">Date<span>*</span></label>
                <input className={`fi${err.date?' err':''}`} type="date" value={date} onChange={e=>setDate(e.target.value)} min="2026-04-14"/>
                {err.date && <span className="ferr">{err.date}</span>}
              </div>
            </div>
            {doc && doc.available && doc.slots.length > 0 && (
              <div style={{marginTop:12}}>
                <label className="fl" style={{marginBottom:8,display:'block'}}>Available Slots<span>*</span></label>
                <div style={{display:'flex',gap:7,flexWrap:'wrap'}}>
                  {doc.slots.map(sl=>(
                    <button key={sl} onClick={()=>setTime(sl)} style={{padding:'6px 13px',borderRadius:7,border:`1.5px solid ${time===sl?'var(--t)':'var(--bd)'}`,background:time===sl?'var(--tl)':'var(--wh)',color:time===sl?'var(--td)':'var(--tx)',fontFamily:'var(--fm)',fontSize:12,fontWeight:600,cursor:'pointer',transition:'all .15s'}}>
                      {sl}
                    </button>
                  ))}
                </div>
                {err.time && <span className="ferr" style={{marginTop:5,display:'block'}}>{err.time}</span>}
              </div>
            )}
          </div>
          <div className="fs">
            <SecTitle ic={<FileText size={12}/>}>Details</SecTitle>
            <div className="fg fg2">
              <Sel label="Appointment Type" req value={type} onChange={e=>setType(e.target.value)} err={err.type}>
                <option value="">Select type</option>
                <option>Consultation</option><option>Review</option><option>Follow-up</option><option>Emergency</option><option>Procedure</option>
              </Sel>
              <div/>
              <Area label="Notes (optional)" placeholder="Any relevant notes for the doctor..." value={notes} onChange={e=>setNotes(e.target.value)} span style={{minHeight:68}}/>
            </div>
          </div>
          <div style={{display:'flex',gap:9,justifyContent:'flex-end'}}>
            <button className="btn btn-s sm">Clear</button>
            <button className="btn btn-p sm" onClick={confirm}><Check size={13}/>Confirm Booking</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Appointments List ───────────────────────────────────────────
function ApptList({ nav }) {
  const [appts, setAppts] = useState(INIT_APPTS);
  const [q, setQ] = useState('');
  const [fSt, setFSt] = useState('all');
  const [fDoc, setFDoc] = useState('all');
  const [fDt, setFDt] = useState('');
  const [cancelId, setCancelId] = useState(null);

  const rows = appts.filter(a=>{
    return a.patient.toLowerCase().includes(q.toLowerCase()) &&
      (fSt==='all'||a.status===fSt) &&
      (fDoc==='all'||a.doctor===fDoc) &&
      (!fDt||a.date===fDt);
  });

  const doCancel = id => { setAppts(p=>p.map(a=>a.id===id?{...a,status:'cancelled'}:a)); setCancelId(null); };

  return (
    <div className="pe">
      {cancelId && (
        <div className="ov">
          <div className="md">
            <div className="md-t">Cancel Appointment?</div>
            <div className="md-b">This will mark the appointment as cancelled. The patient and doctor should be notified separately.</div>
            <div style={{display:'flex',gap:9,justifyContent:'flex-end'}}>
              <button className="btn btn-s sm" onClick={()=>setCancelId(null)}>Keep</button>
              <button className="btn btn-d sm" onClick={()=>doCancel(cancelId)}><XCircle size={13}/>Cancel It</button>
            </div>
          </div>
        </div>
      )}
      <div className="card">
        <div className="c-hd"><div><div className="c-t">All Appointments</div><div className="c-s">{rows.length} results</div></div><button className="btn btn-p sm"><Plus size={13}/>New</button></div>
        <div style={{padding:'13px 18px',borderBottom:'1px solid var(--bd)'}}>
          <div className="fb">
            <div className="sw"><Search size={13} className="s-ic2"/><input className="si" placeholder="Search patient..." value={q} onChange={e=>setQ(e.target.value)}/></div>
            <input className="fi" style={{padding:'7px 10px',fontSize:12,width:138}} type="date" value={fDt} onChange={e=>setFDt(e.target.value)}/>
            <select className="fsl" style={{padding:'7px 10px',fontSize:12,width:130}} value={fSt} onChange={e=>setFSt(e.target.value)}>
              <option value="all">All Status</option><option value="scheduled">Scheduled</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option>
            </select>
            <select className="fsl" style={{padding:'7px 10px',fontSize:12,width:188}} value={fDoc} onChange={e=>setFDoc(e.target.value)}>
              <option value="all">All Doctors</option>
              {DOCTORS.map(d=><option key={d.id} value={d.name}>{d.name}</option>)}
            </select>
          </div>
        </div>
        <div className="tbl-w">
          <table>
            <thead><tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Type</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {rows.map(a=>(
                <tr key={a.id}>
                  <td><div style={{display:'flex',alignItems:'center',gap:8}}><div className="sel-av">{ini(a.patient)}</div><span style={{fontWeight:600}}>{a.patient}</span></div></td>
                  <td style={{color:'var(--t2)',fontSize:12}}>{a.doctor}</td>
                  <td style={{fontFamily:'var(--fm)',fontSize:12}}>{a.date}</td>
                  <td style={{fontFamily:'var(--fm)',fontSize:12,fontWeight:600}}>{a.time}</td>
                  <td style={{fontSize:11,fontWeight:600,color:'var(--t2)'}}>{a.type}</td>
                  <td><Badge s={a.status}/></td>
                  <td>
                    <div style={{display:'flex',gap:3}}>
                      <button className="btn btn-g sm" title="View" onClick={()=>nav('pt-nurse',PATIENTS.find(p=>p.name===a.patient)?.id||1)}><Eye size={13}/></button>
                      {a.status==='scheduled'&&<>
                        <button className="btn btn-g sm" title="Edit"><Edit size={13}/></button>
                        <button className="btn btn-g sm" title="Cancel" style={{color:'var(--er)'}} onClick={()=>setCancelId(a.id)}><XCircle size={13}/></button>
                      </>}
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length===0&&<tr><td colSpan={7} style={{textAlign:'center',padding:30,color:'var(--t3)'}}>No appointments found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Doctor Dashboard ────────────────────────────────────────────
function DocDashboard({ nav }) {
  const todayAppts = INIT_APPTS.filter(a=>a.date==='2026-04-14');
  const stats = [
    {label:"Today's Appointments",val:8,sub:'2 remaining',c:'#3b82f6',bg:'#eff6ff',ic:<Calendar size={17}/>},
    {label:'This Week',val:32,sub:'4 days left',c:'#8b5cf6',bg:'#f5f3ff',ic:<Clock size={17}/>},
    {label:'Patients Seen',val:3,sub:'Today',c:'var(--t)',bg:'var(--tl)',ic:<Users size={17}/>},
    {label:'Pending Reviews',val:4,sub:'Action needed',c:'var(--wn)',bg:'var(--wnbg)',ic:<AlertTriangle size={17}/>},
  ];
  return (
    <div className="pe">
      <div className="sg">
        {stats.map((s,i)=>(
          <div className="sc" key={i}>
            <div className="s-ic" style={{background:s.bg,color:s.c}}>{s.ic}</div>
            <div className="sl">{s.label}</div>
            <div className="sv" style={{color:s.c}}>{s.val}</div>
            <div className="sch">{s.sub}</div>
          </div>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
        <div>
          <div className="card" style={{marginBottom:18}}>
            <div className="c-hd"><div className="c-t">Today's Schedule</div><button className="btn btn-g sm" onClick={()=>nav('doc-appts')}><ChevronRight size={13}/>All</button></div>
            <div style={{padding:'6px 10px'}}>
              {todayAppts.slice(0,4).map(a=>(
                <div className="ac" key={a.id} onClick={()=>nav('pt-doc',PATIENTS.find(p=>p.name===a.patient)?.id||1)}>
                  <div className="at-b"><div className="at-h">{a.time}</div><div className="at-d">Today</div></div>
                  <div className="a-inf"><div className="a-pt">{a.patient}</div><div className="a-mt">{a.type} · {a.notes?.slice(0,38)}</div></div>
                  <Badge s={a.status}/>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="c-hd"><div className="c-t">Notifications</div></div>
            <div style={{padding:'10px 14px'}}>
              {[{t:'Lab results ready — Arjun Mehta',tm:'10 min ago'},{t:'New appointment: Vikram Nair on Apr 15',tm:'1 hr ago'},{t:'Prescription renewal — Sunita Reddy',tm:'2 hrs ago'}].map((n,i)=>(
                <div className="nf-i" key={i}><div className="nf-t">{n.t}</div><div className="nf-tm">{n.tm}</div></div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className="card" style={{marginBottom:18}}>
            <div className="c-hd"><div className="c-t">Quick Links</div></div>
            <div style={{padding:'10px 14px'}}>
              {[{l:'Appointments',ic:<Calendar size={13}/>,c:'#3b82f6',bg:'#eff6ff',p:'doc-appts'},{l:'Patient Records',ic:<Users size={13}/>,c:'var(--t)',bg:'var(--tl)',p:'doc-pts'},{l:'Patient Details',ic:<FileText size={13}/>,c:'#8b5cf6',bg:'#f5f3ff',p:'pt-doc'}].map((x,i)=>(
                <div className="ql" key={i} onClick={()=>nav(x.p)}>
                  <div className="ql-ic" style={{background:x.bg,color:x.c}}>{x.ic}</div>
                  <span>{x.l}</span>
                  <ChevronRight size={13} style={{marginLeft:'auto',color:'var(--t3)'}}/>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="c-hd"><div className="c-t">Recent Patients</div><button className="btn btn-g sm" onClick={()=>nav('doc-pts')}><ChevronRight size={13}/>All</button></div>
            <div style={{padding:'6px 14px'}}>
              {PATIENTS.slice(0,3).map(p=>(
                <div key={p.id} style={{display:'flex',alignItems:'center',gap:9,padding:'9px 3px',borderBottom:'1px solid var(--bd)',cursor:'pointer'}} onClick={()=>nav('pt-doc',p.id)}>
                  <div className="sel-av" style={{width:32,height:32,fontSize:11}}>{ini(p.name)}</div>
                  <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{p.name}</div><div style={{fontSize:11,color:'var(--t3)'}}>{p.conditions}</div></div>
                  <span className="bdg" style={{background:'var(--bg)',color:'var(--t2)',fontSize:10,fontFamily:'var(--fm)'}}>{p.blood}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Doctor Appointments ─────────────────────────────────────────
function DocAppts({ nav }) {
  const [tab, setTab] = useState('up');
  const [q, setQ] = useState('');
  const [fSt, setFSt] = useState('all');
  const now = '2026-04-14';
  const rows = INIT_APPTS.filter(a=>{
    const up = a.date >= now;
    return (tab==='up'?up:!up) && a.patient.toLowerCase().includes(q.toLowerCase()) && (fSt==='all'||a.status===fSt);
  });
  return (
    <div className="pe">
      <div className="tabs">
        <button className={`tab${tab==='up'?' on':''}`} onClick={()=>setTab('up')}>Upcoming</button>
        <button className={`tab${tab==='past'?' on':''}`} onClick={()=>setTab('past')}>Past / Completed</button>
      </div>
      <div className="fb">
        <div className="sw"><Search size={13} className="s-ic2"/><input className="si" placeholder="Search patient..." value={q} onChange={e=>setQ(e.target.value)}/></div>
        <select className="fsl" style={{padding:'7px 10px',fontSize:12,width:138}} value={fSt} onChange={e=>setFSt(e.target.value)}>
          <option value="all">All Status</option><option value="scheduled">Scheduled</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option>
        </select>
      </div>
      {rows.map(a=>(
        <div className="ac" key={a.id} onClick={()=>nav('pt-doc',PATIENTS.find(p=>p.name===a.patient)?.id||1)}>
          <div className="at-b"><div className="at-h">{a.time}</div><div className="at-d">{a.date}</div></div>
          <div style={{display:'flex',alignItems:'center',gap:9,flex:1}}>
            <div className="sel-av">{ini(a.patient)}</div>
            <div className="a-inf"><div className="a-pt">{a.patient}</div><div className="a-mt">{a.type} · {a.notes}</div></div>
          </div>
          <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:5}}>
            <Badge s={a.status}/>
            <span style={{fontSize:11,color:'var(--t3)'}}>{a.doctor}</span>
          </div>
        </div>
      ))}
      {rows.length===0&&<div style={{textAlign:'center',padding:40,color:'var(--t3)',fontSize:13}}>No appointments found</div>}
    </div>
  );
}

// ── Patient Details ─────────────────────────────────────────────
function PtDetails({ ptId, portal }) {
  const [tab, setTab] = useState('ov');
  const [notes, setNotes] = useState(INIT_NOTES);
  const [newNote, setNewNote] = useState('');
  const [noteDone, setNoteDone] = useState(false);
  const pt = PATIENTS.find(p=>p.id===ptId)||PATIENTS[0];
  const ptAppts = INIT_APPTS.filter(a=>a.patient===pt.name);
  const ptNotes = notes.filter(n=>n.patientId===pt.id);

  const addNote = () => {
    if (!newNote.trim()) return;
    setNotes(p=>[...p,{id:Date.now(),patientId:pt.id,date:'2026-04-14',doctor:'Dr. Kavitha Iyer',note:newNote}]);
    setNewNote(''); setNoteDone(true); setTimeout(()=>setNoteDone(false),2500);
  };

  return (
    <div className="pe">
      <div className="ph">
        <div className="p-av">{ini(pt.name)}</div>
        <div style={{flex:1}}>
          <div className="p-nm">{pt.name}</div>
          <div className="p-mr">
            <span className="p-mi"><User size={11}/>{pt.gender}</span>
            <span className="p-mi"><Calendar size={11}/>{pt.dob} · Age {pt.age}</span>
            <span className="p-mi"><Phone size={11}/>{pt.contact}</span>
            <span className="p-mi"><Mail size={11}/>{pt.email}</span>
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:7}}>
          <span className="bdg" style={{background:'rgba(0,201,167,.16)',color:'var(--t)',fontSize:13,padding:'5px 13px',fontFamily:'var(--fm)'}}>{pt.blood}</span>
          {portal==='doc' && <button className="btn btn-s sm"><Edit size={12}/>Edit Record</button>}
        </div>
      </div>
      <div className="tabs">
        {[['ov','Overview'],['med','Medical History'],['vis','Visit Notes']].map(([k,l])=>(
          <button key={k} className={`tab${tab===k?' on':''}`} onClick={()=>setTab(k)}>{l}</button>
        ))}
      </div>
      {tab==='ov' && (
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
          <div className="card">
            <div className="c-hd"><div className="c-t">Contact Info</div></div>
            <div className="c-bd">
              <div className="ir"><span className="il">Phone</span><span className="iv">{pt.contact}</span></div>
              <div className="ir"><span className="il">Email</span><span className="iv">{pt.email}</span></div>
              <div className="ir"><span className="il">Gender</span><span className="iv">{pt.gender}</span></div>
              <div className="ir"><span className="il">Date of Birth</span><span className="iv">{pt.dob}</span></div>
            </div>
          </div>
          <div className="card">
            <div className="c-hd"><div className="c-t">Emergency Contact</div></div>
            <div className="c-bd">
              <div className="ir"><span className="il">Name</span><span className="iv">{pt.emergency.name}</span></div>
              <div className="ir"><span className="il">Relationship</span><span className="iv">{pt.emergency.relation}</span></div>
              <div className="ir"><span className="il">Phone</span><span className="iv">{pt.emergency.contact}</span></div>
            </div>
          </div>
          <div className="card" style={{gridColumn:'1/-1'}}>
            <div className="c-hd"><div className="c-t">Appointment History</div></div>
            <div className="tbl-w">
              <table>
                <thead><tr><th>Date</th><th>Time</th><th>Doctor</th><th>Type</th><th>Status</th><th>Notes</th></tr></thead>
                <tbody>
                  {ptAppts.map(a=>(
                    <tr key={a.id}>
                      <td style={{fontFamily:'var(--fm)',fontSize:12}}>{a.date}</td>
                      <td style={{fontFamily:'var(--fm)',fontSize:12,fontWeight:600}}>{a.time}</td>
                      <td style={{fontSize:12,color:'var(--t2)'}}>{a.doctor}</td>
                      <td style={{fontSize:12}}>{a.type}</td>
                      <td><Badge s={a.status}/></td>
                      <td style={{fontSize:12,color:'var(--t2)'}}>{a.notes}</td>
                    </tr>
                  ))}
                  {ptAppts.length===0&&<tr><td colSpan={6} style={{textAlign:'center',padding:24,color:'var(--t3)'}}>No appointments</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {tab==='med' && (
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
          <div className="card">
            <div className="c-hd"><div className="c-t">Medical Summary</div></div>
            <div className="c-bd">
              <div className="ir"><span className="il">Blood Group</span><span className="iv" style={{fontWeight:700,color:'var(--er)',fontFamily:'var(--fm)'}}>{pt.blood}</span></div>
              <div className="ir"><span className="il">Allergies</span><span className="iv">{pt.allergies}</span></div>
              <div className="ir"><span className="il">Conditions</span><span className="iv">{pt.conditions}</span></div>
              <div className="ir"><span className="il">Medications</span><span className="iv">{pt.medications}</span></div>
            </div>
          </div>
          <div className="card">
            <div className="c-hd"><div className="c-t">Allergy Alert</div></div>
            <div className="c-bd">
              {pt.allergies!=='None'?(
                <div style={{display:'flex',alignItems:'flex-start',gap:10,padding:'12px 14px',background:'var(--erbg)',borderRadius:8,border:'1px solid #fecaca'}}>
                  <AlertTriangle size={15} style={{color:'var(--er)',flexShrink:0,marginTop:1}}/>
                  <div><div style={{fontSize:13,fontWeight:700,color:'var(--er)'}}>Known Allergy</div><div style={{fontSize:12,color:'#7f1d1d',marginTop:3}}>{pt.allergies}</div></div>
                </div>
              ):(
                <div style={{display:'flex',alignItems:'center',gap:7,fontSize:13,color:'var(--t2)'}}><CheckCircle size={14} style={{color:'var(--ok)'}}/>No known allergies on record</div>
              )}
            </div>
          </div>
        </div>
      )}
      {tab==='vis' && (
        <div>
          {noteDone && <div className="al al-ok" style={{marginBottom:12}}><CheckCircle size={14}/><span>Clinical note added.</span></div>}
          {portal==='doc' && (
            <div className="card" style={{marginBottom:18}}>
              <div className="c-hd"><div className="c-t">Add Clinical Note</div></div>
              <div className="c-bd">
                <textarea className="fta" placeholder="Enter clinical observations, diagnosis, and treatment plan..." value={newNote} onChange={e=>setNewNote(e.target.value)} style={{minHeight:88}}/>
                <div style={{display:'flex',justifyContent:'flex-end',marginTop:10}}>
                  <button className="btn btn-p sm" onClick={addNote}><Plus size={13}/>Add Note</button>
                </div>
              </div>
            </div>
          )}
          {ptNotes.length===0&&<div style={{textAlign:'center',padding:36,color:'var(--t3)',fontSize:13}}>No visit notes yet</div>}
          {[...ptNotes].reverse().map(n=>(
            <div className="ni" key={n.id}>
              <div className="nm">
                <span style={{display:'flex',alignItems:'center',gap:4}}><Calendar size={11}/>{n.date}</span>
                <span style={{display:'flex',alignItems:'center',gap:4}}><Stethoscope size={11}/>{n.doctor}</span>
              </div>
              <div className="nt">{n.note}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Patients List (Doctor) ──────────────────────────────────────
function DocPatients({ nav }) {
  const [q, setQ] = useState('');
  const rows = PATIENTS.filter(p=>p.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="pe">
      <div className="card">
        <div className="c-hd"><div><div className="c-t">Patient Records</div><div className="c-s">{rows.length} patients</div></div></div>
        <div style={{padding:'12px 18px',borderBottom:'1px solid var(--bd)'}}>
          <div className="sw" style={{maxWidth:320}}><Search size={13} className="s-ic2"/><input className="si" placeholder="Search patients..." value={q} onChange={e=>setQ(e.target.value)}/></div>
        </div>
        <div className="tbl-w">
          <table>
            <thead><tr><th>Name</th><th>DOB</th><th>Gender</th><th>Contact</th><th>Blood</th><th>Conditions</th><th>Action</th></tr></thead>
            <tbody>
              {rows.map(p=>(
                <tr key={p.id}>
                  <td><div style={{display:'flex',alignItems:'center',gap:8}}><div className="sel-av">{ini(p.name)}</div><span style={{fontWeight:600}}>{p.name}</span></div></td>
                  <td style={{fontFamily:'var(--fm)',fontSize:12}}>{p.dob}</td>
                  <td>{p.gender}</td>
                  <td style={{fontSize:12,color:'var(--t2)'}}>{p.contact}</td>
                  <td style={{fontWeight:700,color:'var(--er)',fontFamily:'var(--fm)',fontSize:12}}>{p.blood}</td>
                  <td style={{fontSize:12,color:'var(--t2)'}}>{p.conditions}</td>
                  <td><button className="btn btn-g sm" onClick={()=>nav('pt-doc',p.id)}><Eye size={13}/>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Sidebar ─────────────────────────────────────────────────────
const N_NAV = [
  { p:'intake', l:'Patient Intake', ic:<ClipboardList size={15}/> },
  { p:'reg', l:'Book Appointment', ic:<Calendar size={15}/> },
  { p:'appts', l:'Appointments', ic:<Users size={15}/> },
];
const D_NAV = [
  { p:'doc-dash', l:'Dashboard', ic:<LayoutDashboard size={15}/> },
  { p:'doc-appts', l:'Appointments', ic:<Calendar size={15}/> },
  { p:'doc-pts', l:'Patients', ic:<Users size={15}/> },
];

function Sidebar({ portal, setPortal, page, setPage }) {
  const nav = portal==='nurse' ? N_NAV : D_NAV;
  const u = portal==='nurse'
    ? { nm:'R. Preethi', rl:'Receptionist', av:'RP' }
    : { nm:'Dr. Kavitha Iyer', rl:'General Medicine', av:'KI' };
  return (
    <aside className="sb">
      <div className="sb-logo">
        <div className="logo-b">
          <div className="logo-ic"><Stethoscope size={17} color="#fff"/></div>
          <div><div className="logo-tx">EvoDoc</div><div className="logo-sub">Healthcare Portal</div></div>
        </div>
      </div>
      <div style={{padding:'10px 12px 0'}}>
        <div className="pt-sw">
          <button className={`pt-b${portal==='nurse'?' on':''}`} onClick={()=>{setPortal('nurse');setPage('intake');}}>Nurse / Recep.</button>
          <button className={`pt-b${portal==='doctor'?' on':''}`} onClick={()=>{setPortal('doctor');setPage('doc-dash');}}>Doctor</button>
        </div>
      </div>
      <nav className="nav-s">
        <div className="nav-lb">Navigation</div>
        {nav.map(n=>(
          <button key={n.p} className={`nav-i${page===n.p||page.startsWith(n.p)?' on':''}`} onClick={()=>setPage(n.p)}>
            {n.ic}{n.l}
          </button>
        ))}
      </nav>
      <div className="sb-ft">
        <div className="u-card">
          <div className="u-av">{u.av}</div>
          <div><div className="u-nm">{u.nm}</div><div className="u-rl">{u.rl}</div></div>
        </div>
      </div>
    </aside>
  );
}

const PAGE_META = {
  intake:{ t:'Patient Intake', s:'Register a new patient' },
  reg:{ t:'Book Appointment', s:'Schedule a new appointment' },
  appts:{ t:'Appointments', s:'Manage all appointments' },
  'doc-dash':{ t:'Dashboard', s:"Your overview for today, April 14" },
  'doc-appts':{ t:'Appointments', s:'Your upcoming and past appointments' },
  'doc-pts':{ t:'Patient Records', s:'All registered patients' },
  'pt-nurse':{ t:'Patient Details', s:'View patient information' },
  'pt-doc':{ t:'Patient Details', s:'View and update clinical records' },
};

export default function App() {
  const [portal, setPortal] = useState('nurse');
  const [page, setPage] = useState('intake');
  const [ptId, setPtId] = useState(1);

  const nav = (p, id) => { if(id) setPtId(id); setPage(p); };
  const info = PAGE_META[page] || { t:'EvoDoc', s:'' };

  const renderPage = () => {
    switch(page) {
      case 'intake': return <PatientIntake/>;
      case 'reg': return <ApptReg/>;
      case 'appts': return <ApptList nav={nav}/>;
      case 'doc-dash': return <DocDashboard nav={nav}/>;
      case 'doc-appts': return <DocAppts nav={nav}/>;
      case 'doc-pts': return <DocPatients nav={nav}/>;
      case 'pt-nurse': return <PtDetails ptId={ptId} portal="nurse"/>;
      case 'pt-doc': return <PtDetails ptId={ptId} portal="doc"/>;
      default: return <PatientIntake/>;
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <Sidebar portal={portal} setPortal={setPortal} page={page} setPage={setPage}/>
        <div className="main">
          <div className="topbar">
            <div><div className="pg-t">{info.t}</div><div className="pg-s">{info.s}</div></div>
            <div className="tb-acts">
              <div className="ic-b nd"><Bell size={14}/></div>
              <div className="ic-b"><Settings size={14}/></div>
            </div>
          </div>
          <div className="cont">{renderPage()}</div>
        </div>
      </div>
    </>
  );
}
