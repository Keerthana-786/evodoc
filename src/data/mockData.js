export const PATIENTS = [
  { id:1, name:'Priya Sharma', dob:'1990-05-15', age:35, gender:'Female', contact:'+91 98765 43210', email:'priya@email.com', blood:'B+', allergies:'Penicillin', conditions:'Hypertension', medications:'Amlodipine 5mg once daily', emergency:{name:'Rahul Sharma', relation:'Husband', contact:'+91 98765 43211'} },
  { id:2, name:'Arjun Mehta', dob:'1985-08-22', age:40, gender:'Male', contact:'+91 91234 56789', email:'arjun@email.com', blood:'O+', allergies:'None', conditions:'Type 2 Diabetes', medications:'Metformin 500mg twice daily', emergency:{name:'Meena Mehta', relation:'Wife', contact:'+91 91234 56790'} },
  { id:3, name:'Sunita Reddy', dob:'1978-11-30', age:47, gender:'Female', contact:'+91 99887 76655', email:'sunita@email.com', blood:'A-', allergies:'Sulfa drugs', conditions:'Asthma', medications:'Salbutamol inhaler as needed', emergency:{name:'Ravi Reddy', relation:'Son', contact:'+91 99887 76656'} },
  { id:4, name:'Vikram Nair', dob:'1995-03-10', age:31, gender:'Male', contact:'+91 93456 78901', email:'vikram@email.com', blood:'AB+', allergies:'Latex', conditions:'None', medications:'None', emergency:{name:'Uma Nair', relation:'Mother', contact:'+91 93456 78902'} },
];

export const DOCTORS = [
  { id:1, name:'Dr. Kavitha Iyer', specialty:'General Medicine', available:true, today:8, week:32, slots:['09:00','10:00','11:00','14:00','15:00'] },
  { id:2, name:'Dr. Rajesh Kumar', specialty:'Cardiology', available:true, today:6, week:24, slots:['09:30','11:30','14:30','16:00'] },
  { id:3, name:'Dr. Meena Pillai', specialty:'Pediatrics', available:false, today:0, week:18, slots:[] },
  { id:4, name:'Dr. Suresh Babu', specialty:'Orthopedics', available:true, today:5, week:20, slots:['10:00','12:00','15:00'] },
];

export const INIT_APPTS = [
  { id:1, patientId:1, patient:'Priya Sharma', doctorId:1, doctor:'Dr. Kavitha Iyer', date:'2026-04-14', time:'09:00', type:'Consultation', status:'scheduled', notes:'Follow-up for BP management' },
  { id:2, patientId:2, patient:'Arjun Mehta', doctorId:2, doctor:'Dr. Rajesh Kumar', date:'2026-04-14', time:'09:30', type:'Review', status:'completed', notes:'Cardiac review post ECG' },
  { id:3, patientId:3, patient:'Sunita Reddy', doctorId:1, doctor:'Dr. Kavitha Iyer', date:'2026-04-14', time:'11:00', type:'Emergency', status:'scheduled', notes:'Breathing difficulty episode' },
  { id:4, patientId:4, patient:'Vikram Nair', doctorId:4, doctor:'Dr. Suresh Babu', date:'2026-04-15', time:'10:00', type:'Consultation', status:'scheduled', notes:'Knee pain evaluation' },
  { id:5, patientId:1, patient:'Priya Sharma', doctorId:3, doctor:'Dr. Meena Pillai', date:'2026-04-13', time:'14:00', type:'Review', status:'cancelled', notes:'Cancelled by patient' },
  { id:6, patientId:2, patient:'Arjun Mehta', doctorId:1, doctor:'Dr. Kavitha Iyer', date:'2026-04-16', time:'11:00', type:'Consultation', status:'scheduled', notes:'Diabetes quarterly checkup' },
];

export const INIT_NOTES = [
  { id:1, patientId:1, date:'2026-03-15', doctor:'Dr. Kavitha Iyer', note:'BP 140/90. Advised lifestyle changes and low-sodium diet. Continued Amlodipine. Follow-up in 4 weeks.' },
  { id:2, patientId:1, date:'2026-02-10', doctor:'Dr. Kavitha Iyer', note:'Initial consultation. Patient presents with elevated blood pressure (152/96). Started on Amlodipine 5mg once daily.' },
  { id:3, patientId:2, date:'2026-03-20', doctor:'Dr. Rajesh Kumar', note:'ECG normal. HbA1c: 7.2%. Continue Metformin. Diet counselling provided. Next review in 3 months.' },
];

export const getInitials = n => n.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase();
