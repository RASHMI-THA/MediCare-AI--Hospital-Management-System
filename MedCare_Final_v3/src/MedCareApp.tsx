import { useState, useEffect, useRef, useCallback } from "react";

//  SEED DATA 
const USERS = [
  { email:"admin@medcare.com",  pass:"Admin123",  role:"Admin",   name:"Admin User",       dept:"All" },
  { email:"doctor@medcare.com", pass:"Doctor456", role:"Doctor",  name:"Dr. Rajesh Mehta", dept:"Cardiology" },
  { email:"staff@medcare.com",  pass:"Staff789",  role:"Staff",   name:"Meena Pillai",     dept:"ICU" },
];
const ROLE_CREDS = {
  Admin:  { email:"admin@medcare.com",  pass:"Admin123"  },
  Doctor: { email:"doctor@medcare.com", pass:"Doctor456" },
  Staff:  { email:"staff@medcare.com",  pass:"Staff789"  },
  Patient: null,
};
const INIT_PATIENTS = [
  { id:"P-1001", fname:"Ravi",   lname:"Kumar", age:45, gender:"Male",   dept:"Cardiology",   doctor:"Dr. Rajesh Mehta", admitted:"01 Apr 2026", status:"Admitted",   blood:"B+",  phone:"9876543001" },
  { id:"P-1002", fname:"Priya",  lname:"Singh", age:32, gender:"Female", dept:"Gynaecology",  doctor:"Dr. Anita Shah",   admitted:"28 Mar 2026", status:"Discharged", blood:"A+",  phone:"9876543002" },
  { id:"P-1003", fname:"Arjun",  lname:"Rao",   age:58, gender:"Male",   dept:"Orthopaedics", doctor:"Dr. Vikram Sharma",admitted:"03 Apr 2026", status:"OPD",        blood:"O+",  phone:"9876543003" },
  { id:"P-1004", fname:"Sunita", lname:"Nair",  age:27, gender:"Female", dept:"Neurology",    doctor:"Dr. Kavita Nair",  admitted:"05 Apr 2026", status:"Critical",   blood:"AB-", phone:"9876543004" },
  { id:"P-1005", fname:"Mohan",  lname:"Das",   age:63, gender:"Male",   dept:"Urology",      doctor:"Dr. Rajesh Mehta", admitted:"04 Apr 2026", status:"Admitted",   blood:"B-",  phone:"9876543005" },
  { id:"P-1006", fname:"Ananya", lname:"Iyer",  age:19, gender:"Female", dept:"Paediatrics",  doctor:"Dr. Sunil Patel",  admitted:"30 Mar 2026", status:"Discharged", blood:"O+",  phone:"9876543006" },
  { id:"P-1007", fname:"Suresh", lname:"Menon", age:52, gender:"Male",   dept:"Gastrology",   doctor:"Dr. Ramesh Gupta", admitted:"02 Apr 2026", status:"Admitted",   blood:"A-",  phone:"9876543007" },
];
const INIT_DOCTORS = [
  { id:"D-001", name:"Dr. Rajesh Mehta",  spec:"Cardiology",   qual:"MD, DM Cardio", exp:"18 yrs", today:12, phone:"9800001111", status:"On Duty"  },
  { id:"D-002", name:"Dr. Anita Shah",    spec:"Gynaecology",  qual:"MS OBG",        exp:"14 yrs", today:8,  phone:"9800002222", status:"On Duty"  },
  { id:"D-003", name:"Dr. Vikram Sharma", spec:"Orthopaedics", qual:"MS Ortho",      exp:"20 yrs", today:6,  phone:"9800003333", status:"On Leave" },
  { id:"D-004", name:"Dr. Kavita Nair",   spec:"Neurology",    qual:"DM Neuro",      exp:"10 yrs", today:9,  phone:"9800004444", status:"On Duty"  },
  { id:"D-005", name:"Dr. Sunil Patel",   spec:"Paediatrics",  qual:"MD Paeds",      exp:"12 yrs", today:15, phone:"9800005555", status:"On Duty"  },
  { id:"D-006", name:"Dr. Ramesh Gupta",  spec:"Gastrology",   qual:"DM Gastro",     exp:"16 yrs", today:7,  phone:"9800006666", status:"On Duty"  },
];
const INIT_APPTS = [
  { token:"#T101", pid:"P-1001", patient:"Ravi Kumar",   doctor:"Dr. Rajesh Mehta", dept:"Cardiology",   date:"05 Apr", time:"09:00", type:"OPD",       status:"Confirmed"   },
  { token:"#T102", pid:"P-1002", patient:"Priya Singh",  doctor:"Dr. Anita Shah",   dept:"Gynae",        date:"05 Apr", time:"10:30", type:"Follow-up", status:"In Progress" },
  { token:"#T103", pid:"P-1004", patient:"Sunita Nair",  doctor:"Dr. Kavita Nair",  dept:"Neurology",    date:"05 Apr", time:"11:00", type:"OPD",       status:"Pending"     },
  { token:"#T104", pid:"P-1003", patient:"Arjun Rao",    doctor:"Dr. Vikram Sharma",dept:"Ortho",        date:"06 Apr", time:"09:30", type:"Emergency", status:"Pending"     },
  { token:"#T105", pid:"P-1005", patient:"Mohan Das",    doctor:"Dr. Rajesh Mehta", dept:"Urology",      date:"06 Apr", time:"14:00", type:"OPD",       status:"Confirmed"   },
];
const INIT_RECORDS = [
  { id:"R-2001", patient:"Ravi Kumar",  age:45, diagnosis:"Hypertension, Arrhythmia", doctor:"Dr. Rajesh Mehta", prescription:"Amlodipine, Metoprolol", date:"01 Apr 2026" },
  { id:"R-2002", patient:"Priya Singh", age:32, diagnosis:"Gestational Diabetes",     doctor:"Dr. Anita Shah",   prescription:"Insulin, Metformin",     date:"03 Apr 2026" },
  { id:"R-2003", patient:"Sunita Nair", age:27, diagnosis:"Migraine, Vertigo",        doctor:"Dr. Kavita Nair",  prescription:"Sumatriptan",            date:"04 Apr 2026" },
  { id:"R-2004", patient:"Mohan Das",   age:63, diagnosis:"Kidney Stones",            doctor:"Dr. Rajesh Mehta", prescription:"Tamsulosin, Analgesics", date:"05 Apr 2026" },
];
const INIT_LAB = [
  { id:"L-501", patient:"Ravi Kumar",  test:"ECG + Lipid Panel", orderedBy:"Dr. Rajesh Mehta", date:"04 Apr", status:"Ready"      },
  { id:"L-502", patient:"Sunita Nair", test:"MRI Brain",         orderedBy:"Dr. Kavita Nair",  date:"05 Apr", status:"Processing" },
  { id:"L-503", patient:"Arjun Rao",   test:"X-Ray Knee",        orderedBy:"Dr. Vikram Sharma",date:"05 Apr", status:"Ready"      },
  { id:"L-504", patient:"Mohan Das",   test:"Urine Culture",     orderedBy:"Dr. Rajesh Mehta", date:"05 Apr", status:"Pending"    },
  { id:"L-505", patient:"Priya Singh", test:"HbA1c, FBS",        orderedBy:"Dr. Anita Shah",   date:"05 Apr", status:"Ready"      },
];
const INIT_PHARMA = [
  { name:"Paracetamol 500mg", cat:"Analgesic",      mfg:"Cipla",       stock:120,  reorder:200, expiry:"Dec 2026", price:2.50  },
  { name:"Amoxicillin 250mg", cat:"Antibiotic",     mfg:"Sun Pharma",  stock:850,  reorder:200, expiry:"Mar 2027", price:8.00  },
  { name:"Metformin 500mg",   cat:"Anti-Diabetic",  mfg:"Dr. Reddy's", stock:600,  reorder:200, expiry:"Jun 2027", price:5.50  },
  { name:"Atorvastatin 10mg", cat:"Lipid-Lowering", mfg:"Lupin",       stock:200,  reorder:150, expiry:"Jan 2027", price:12.00 },
  { name:"Ondansetron 4mg",   cat:"Antiemetic",     mfg:"Cipla",       stock:50,   reorder:100, expiry:"Nov 2026", price:18.00 },
];
const INIT_SURGERY = [
  { id:"SG-001", patient:"Ravi Kumar",  procedure:"Coronary Angioplasty", surgeon:"Dr. Rajesh Mehta", ot:"OT-1", datetime:"05 Apr, 08:00", status:"Completed" },
  { id:"SG-002", patient:"Arjun Rao",   procedure:"Knee Replacement",     surgeon:"Dr. Vikram Sharma",ot:"OT-2", datetime:"05 Apr, 15:00", status:"Scheduled" },
  { id:"SG-003", patient:"Mohan Das",   procedure:"Ureteroscopy",         surgeon:"Dr. Rajesh Mehta", ot:"OT-3", datetime:"06 Apr, 10:00", status:"Pending"   },
  { id:"SG-004", patient:"Suresh Menon",procedure:"Appendectomy",         surgeon:"Dr. Ramesh Gupta", ot:"OT-1", datetime:"07 Apr, 09:30", status:"Scheduled" },
];
const INIT_WARDS = [
  { name:"General Ward A", type:"General",     beds:30, occupied:24, rate:1500  },
  { name:"General Ward B", type:"General",     beds:30, occupied:18, rate:1500  },
  { name:"ICU",            type:"ICU",         beds:10, occupied:8,  rate:8000  },
  { name:"NICU",           type:"NICU",        beds:6,  occupied:3,  rate:10000 },
  { name:"Private Room",   type:"Private",     beds:15, occupied:12, rate:5000  },
  { name:"Semi-Private",   type:"Semi-Private",beds:20, occupied:14, rate:3000  },
  { name:"Maternity Ward", type:"Maternity",   beds:12, occupied:7,  rate:4000  },
];
const INIT_BLOOD = { "A+":42,"B+":38,"O+":15,"AB+":22,"A-":8,"B-":5,"O-":3,"AB-":6 };
const INIT_DONORS = [
  { name:"Arun Sharma", bg:"O+", units:2, date:"02 Apr 2026", status:"Verified", phone:"9811001111" },
  { name:"Lakshmi R.",  bg:"A+", units:1, date:"03 Apr 2026", status:"Verified", phone:"9811002222" },
  { name:"Karthik N.",  bg:"B+", units:1, date:"04 Apr 2026", status:"Testing",  phone:"9811003333" },
];
const INIT_STAFF = [
  { id:"ST-001", name:"Meena Pillai", role:"Head Nurse",       dept:"ICU",       shift:"Morning", salary:45000, phone:"9700001111", status:"Active"   },
  { id:"ST-002", name:"Rajesh Verma", role:"Lab Technician",   dept:"Pathology", shift:"Morning", salary:32000, phone:"9700002222", status:"Active"   },
  { id:"ST-003", name:"Sunita Devi",  role:"Pharmacist",       dept:"Pharmacy",  shift:"Evening", salary:38000, phone:"9700003333", status:"Active"   },
  { id:"ST-004", name:"Anil Kumar",   role:"Receptionist",     dept:"OPD",       shift:"Morning", salary:22000, phone:"9700004444", status:"Active"   },
  { id:"ST-005", name:"Priya Joshi",  role:"Nurse",            dept:"Ward A",    shift:"Night",   salary:35000, phone:"9700005555", status:"On Leave" },
  { id:"ST-006", name:"Deepak Singh", role:"Ambulance Driver", dept:"Emergency", shift:"Night",   salary:28000, phone:"9700006666", status:"Active"   },
];
const INIT_BILLING = [
  { inv:"INV-3001", patientId:"P-1001", patient:"Ravi Kumar",  dept:"Cardiology",   doctor:"Dr. Rajesh Mehta", services:"Surgery + Bed + Meds", total:85000, insurance:60000, paid:0,    mode:"Insurance", status:"Partial", billDate:"2026-04-05", dueDate:"2026-04-12", enteredBy:"Admin User", enteredRole:"Admin" },
  { inv:"INV-3002", patientId:"P-1002", patient:"Priya Singh", dept:"Gynaecology",  doctor:"Dr. Anita Shah",   services:"OPD + Lab",            total:3500,  insurance:0,     paid:3500, mode:"UPI",       status:"Paid",    billDate:"2026-04-05", dueDate:"2026-04-05", enteredBy:"Meena Pillai", enteredRole:"Staff" },
  { inv:"INV-3003", patientId:"P-1004", patient:"Sunita Nair", dept:"Neurology",    doctor:"Dr. Kavita Nair",  services:"MRI + Consult",        total:12000, insurance:8000,  paid:0,    mode:"Pending",   status:"Unpaid",  billDate:"2026-04-06", dueDate:"2026-04-13", enteredBy:"Meena Pillai", enteredRole:"Staff" },
  { inv:"INV-3004", patientId:"P-1005", patient:"Mohan Das",   dept:"Urology",      doctor:"Dr. Rajesh Mehta", services:"Urology + Ward B",     total:28000, insurance:20000, paid:2000, mode:"Cash",      status:"Partial", billDate:"2026-04-06", dueDate:"2026-04-14", enteredBy:"Admin User", enteredRole:"Admin" },
];
const INIT_INVENTORY = [
  { name:"Surgical Gloves",  cat:"PPE",        qty:2400, unit:"Pairs",     reorder:500 },
  { name:"IV Drip Set",      cat:"Consumable", qty:180,  unit:"Pcs",       reorder:200 },
  { name:"Oxygen Cylinders", cat:"Equipment",  qty:45,   unit:"Cylinders", reorder:20  },
  { name:"N95 Masks",        cat:"PPE",        qty:300,  unit:"Pcs",       reorder:100 },
  { name:"Syringes 10ml",    cat:"Consumable", qty:90,   unit:"Pcs",       reorder:500 },
];
const INIT_AMBULANCE = [
  { id:"AMB-001", vehicleNo:"KA-01-MC-1101", type:"ALS",      driver:"Suresh K.",  paramedic:"Nurse Meera",  phone:"9900001111", patient:"Ravi Kumar",  location:"Koramangala 5th Block", destination:"St. John Road",  etaMin:12, speed:42, fuelPct:68, lat:"12.9352", lng:"77.6245", lastUpdate:"2 min ago", status:"Dispatched" },
  { id:"AMB-002", vehicleNo:"KA-01-MC-1102", type:"BLS",      driver:"Ramesh P.",  paramedic:"Nurse Kiran",  phone:"9900002222", patient:"-",           location:"Hospital Base",         destination:"-",             etaMin:0,  speed:0,  fuelPct:84, lat:"12.9348", lng:"77.6102", lastUpdate:"Just now", status:"Available"  },
  { id:"AMB-003", vehicleNo:"KA-01-MC-1103", type:"BLS",      driver:"Kishore V.", paramedic:"Tech. Sanjay", phone:"9900003333", patient:"Sunita Nair", location:"Indiranagar 100ft Rd", destination:"MG Road Metro",  etaMin:9,  speed:36, fuelPct:52, lat:"12.9719", lng:"77.6412", lastUpdate:"1 min ago", status:"Dispatched" },
  { id:"AMB-004", vehicleNo:"KA-01-MC-1104", type:"Neonatal", driver:"Praveen S.", paramedic:"Nurse Anju",   phone:"9900004444", patient:"-",           location:"Hospital Base",         destination:"-",             etaMin:0,  speed:0,  fuelPct:91, lat:"12.9348", lng:"77.6102", lastUpdate:"Just now", status:"Available"  },
];
const INIT_NOTIFICATIONS = [
  { msg:"Surgery SG-002 scheduled today",      color:"info",    src:"Surgery",    read:false, time:"10 min ago" },
  { msg:"Blood stock O- critically low (3u)",  color:"danger",  src:"Blood Bank", read:false, time:"30 min ago" },
  { msg:"New patient P-1007 admitted",         color:"success", src:"Patients",   read:true,  time:"1 hr ago"   },
];
const INIT_AUDIT = [
  { msg:"Admin logged in",           color:"info",    time:"5 min ago"  },
  { msg:"Patient P-1001 admitted",   color:"success", time:"1 hr ago"   },
  { msg:"Surgery SG-001 completed",  color:"success", time:"2 hrs ago"  },
  { msg:"Low stock: Paracetamol",    color:"warning", time:"3 hrs ago"  },
  { msg:"Staff ST-005 on leave",     color:"danger",  time:"4 hrs ago"  },
];

//  HELPERS 
const rupee = n => "Rs " + n.toLocaleString("en-IN");
const today = () => new Date().toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
const billingTotal = b => Number(b?.total || 0);
const billingCovered = b => {
  const ins = Number(b?.insurance || 0);
  const paid = Number(b?.paid || 0);
  return Math.min(billingTotal(b), Math.max(0, ins + paid));
};
const billingBalance = b => Math.max(0, billingTotal(b) - billingCovered(b));
const billingStatus = b => {
  const bal = billingBalance(b);
  if (bal <= 0) return "Paid";
  return billingCovered(b) > 0 ? "Partial" : "Unpaid";
};
const statusColor = s => ({
  Admitted:"#1a63c8", Discharged:"#166534", OPD:"#155e75", Critical:"#9b1c1c",
  Confirmed:"#166534", Pending:"#92400e", "In Progress":"#1a63c8", Cancelled:"#9b1c1c",
  Completed:"#166534", Scheduled:"#1a63c8", Ready:"#166534", Processing:"#92400e",
  Active:"#166534", "On Duty":"#166534", "On Leave":"#92400e", "On Call":"#1a63c8",
  Available:"#166534", Dispatched:"#1a63c8", Paid:"#166534", Partial:"#92400e",
  Unpaid:"#9b1c1c", Verified:"#166534", Testing:"#92400e",
  "Follow-up":"#4c1d95", Emergency:"#9b1c1c", "Low Stock":"#9b1c1c", "In Stock":"#166534",
  Full:"#9b1c1c", High:"#92400e",
}[s] || "#92400e");
const statusBg = s => ({
  Admitted:"#dbeafe", Discharged:"#dcfce7", OPD:"#cffafe", Critical:"#fee2e2",
  Confirmed:"#dcfce7", Pending:"#fef3c7", "In Progress":"#dbeafe", Cancelled:"#fee2e2",
  Completed:"#dcfce7", Scheduled:"#dbeafe", Ready:"#dcfce7", Processing:"#fef3c7",
  Active:"#dcfce7", "On Duty":"#dcfce7", "On Leave":"#fef3f7", "On Call":"#dbeafe",
  Available:"#dcfce7", Dispatched:"#dbeafe", Paid:"#dcfce7", Partial:"#fef3f7",
  Unpaid:"#fee2e2", Verified:"#dcfce7", Testing:"#fef3f7",
  "Follow-up":"#ede9fe", Emergency:"#fee2e2", "Low Stock":"#fee2e2", "In Stock":"#dcfce7",
  Full:"#fee2e2", High:"#fef3f7",
}[s] || "#fef3c7");

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = x => x * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const r = 6371;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return r * c;
};

function Badge({ s }) {
  return (
    <span style={{ background:statusBg(s), color:statusColor(s), padding:"2px 8px", borderRadius:20, fontSize:11, fontWeight:600, whiteSpace:"nowrap" }}>{s}</span>
  );
}
function Modal({ title, onClose, children, wide }: { title:any; onClose:any; children:any; wide?: any }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.35)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:9999 }}
      onClick={onClose}>
      <div style={{ background:"#fff", borderRadius:12, padding:24, width:wide||440, maxHeight:"88vh", overflowY:"auto", boxShadow:"0 12px 48px rgba(0,0,0,0.18)" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
          <div style={{ fontWeight:700, fontSize:15 }}>{title}</div>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:18, cursor:"pointer", color:"#6b7280" }}>X</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type="text", placeholder="" }) {
  return (
    <div style={{ marginBottom:12 }}>
      {label && <div style={{ fontSize:10, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:4 }}>{label}</div>}
      <input value={value} onChange={e => onChange(e.target.value)} type={type} placeholder={placeholder}
        style={{ width:"100%", padding:"8px 10px", border:"1px solid #dde2eb", borderRadius:8, fontSize:13, fontFamily:"inherit", outline:"none", boxSizing:"border-box" }} />
    </div>
  );
}

function Sel({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom:12 }}>
      {label && <div style={{ fontSize:10, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:4 }}>{label}</div>}
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ width:"100%", padding:"8px 10px", border:"1px solid #dde2eb", borderRadius:8, fontSize:13, fontFamily:"inherit", background:"#fff" }}>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Btn({ children, onClick, primary = false, danger = false, small = false }: { children:any; onClick:any; primary?:boolean; danger?:boolean; small?:boolean }) {
  return (
    <button onClick={onClick} style={{
      padding: small ? "4px 10px" : "8px 16px", borderRadius:8, fontSize: small ? 11 : 13,
      fontWeight:600, cursor:"pointer", border:"1px solid",
      background: primary ? "#1a63c8" : danger ? "#fee2e2" : "#fff",
      color: primary ? "#fff" : danger ? "#9b1c1c" : "#374151",
      borderColor: primary ? "#1a63c8" : danger ? "#fecaca" : "#dde2eb",
      fontFamily:"inherit"
    }}>{children}</button>
  );
}

function Card({ children, style }: { children:any; style?: any }) {
  return <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, padding:16, boxShadow:"0 1px 4px rgba(0,0,0,0.07)", marginBottom:14, ...style }}>{children}</div>;
}

function StatCard({ label, value, sub, color, onClick }: { label:any; value:any; sub?:any; color:any; onClick?: any }) {
  return (
    <div onClick={onClick} style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, padding:"14px 16px", boxShadow:"0 1px 4px rgba(0,0,0,0.07)", cursor: onClick ? "pointer" : "default", borderLeft:`3px solid ${color||"#1a63c8"}` }}>
      <div style={{ fontSize:10, color:"#6b7280", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:4 }}>{label}</div>
      <div style={{ fontSize:26, fontWeight:800, color:color||"#1a1d24", lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:"#6b7280", marginTop:6 }}>{sub}</div>}
    </div>
  );
}

function Table({ heads, rows }) {
  return (
    <div style={{ overflowX:"auto" }}>
      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12.5 }}>
        <thead>
          <tr style={{ borderBottom:"1px solid #e5e7eb" }}>
            {heads.map(h => <th key={h} style={{ textAlign:"left", padding:"7px 10px", fontSize:10.5, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.05em", whiteSpace:"nowrap" }}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ borderBottom: i < rows.length-1 ? "1px solid #f3f4f6" : "none" }}>
              {r.map((c, j) => <td key={j} style={{ padding:"8px 10px", verticalAlign:"middle", whiteSpace:"nowrap" }}>{c}</td>)}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td colSpan={heads.length} style={{ textAlign:"center", padding:24, color:"#9ca3af", fontSize:13 }}>No data yet</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const ASSISTANT_SYSTEM_PROMPT = [
  "You are MedCare AI, a realistic hospital management assistant inside the MedCare HMS app.",
  "Answer from the provided app context when it contains the information. Be specific with names, counts, statuses, balances, and page names.",
  "If the context does not contain an answer, say what is missing and suggest the page where the user can check or enter it.",
  "Do not invent patient records, clinical results, medicines, payments, or ambulance locations.",
  "For medical symptoms or treatment advice, give only general safety guidance and ask the user to contact a clinician or emergency service.",
  "Keep replies conversational, professional, and concise."
].join(" ");

const pageName = page => PAGE_TITLES?.[page] || page || "Dashboard";
const fullPatientName = p => `${p?.fname || p?.name || ""} ${p?.lname || ""}`.trim();
const cleanText = value => String(value || "").toLowerCase();
const hasAny = (text, words) => words.some(word => text.includes(word));
const formatItems = (items, mapper, empty = "None found.") => {
  if (!items?.length) return empty;
  return items.slice(0, 5).map(mapper).join("\n");
};

function findPatientInQuestion(question, patients = []) {
  const q = cleanText(question);
  return patients.find(p => {
    const name = fullPatientName(p).toLowerCase();
    const nameParts = name.split(" ").filter(part => part.length > 2);
    return q.includes(cleanText(p.id)) || (name && q.includes(name)) || nameParts.some(part => q.includes(part));
  });
}

function buildAssistantContext(state, user, page) {
  const patients = state?.patients || [];
  const doctors = state?.doctors || [];
  const appointments = state?.appointments || [];
  const billing = state?.billing || [];
  const wards = state?.wards || [];
  const pharmacy = state?.pharmacy || [];
  const labReports = state?.labReports || [];
  const surgeries = state?.surgeries || [];
  const ambulance = state?.ambulance || [];
  const staff = state?.staff || [];
  const records = state?.records || [];
  const bloodStock = state?.bloodStock || {};
  const totalBeds = wards.reduce((sum, ward) => sum + Number(ward.beds || 0), 0);
  const occupiedBeds = wards.reduce((sum, ward) => sum + Number(ward.occupied || 0), 0);
  const pendingBalance = billing.reduce((sum, bill) => sum + billingBalance(bill), 0);

  return {
    user: user ? { name: user.name, role: user.role, email: user.email } : null,
    currentPage: pageName(page),
    summary: {
      patients: patients.length,
      admitted: patients.filter(p => p.status === "Admitted").length,
      critical: patients.filter(p => p.status === "Critical").length,
      doctorsOnDuty: doctors.filter(d => d.status === "On Duty").length,
      pendingAppointments: appointments.filter(a => a.status === "Pending").length,
      labPending: labReports.filter(l => l.status === "Pending" || l.status === "Processing").length,
      activeAmbulances: ambulance.filter(a => a.status === "Dispatched").length,
      freeBeds: totalBeds - occupiedBeds,
      pendingBilling: pendingBalance,
    },
    patients: patients.map(p => ({ id:p.id, name:fullPatientName(p), age:p.age, gender:p.gender, dept:p.dept, doctor:p.doctor, admitted:p.admitted, status:p.status, blood:p.blood, phone:p.phone })),
    doctors: doctors.map(d => ({ id:d.id, name:d.name, spec:d.spec, status:d.status, today:d.today, phone:d.phone })),
    appointments,
    billing: billing.map(b => ({ ...b, balance: billingBalance(b), status: billingStatus(b) })),
    wards: wards.map(w => ({ ...w, freeBeds: Number(w.beds || 0) - Number(w.occupied || 0) })),
    pharmacy,
    labReports,
    records,
    surgeries,
    ambulance,
    staff,
    bloodStock,
  };
}

async function askAiAssistant(question, context) {
  const prompt = question?.trim();
  if (!prompt) {
    return "Please type a question so I can assist you with MedCare.";
  }

  if (!OPENAI_API_KEY) {
    return getLocalAssistantReply(prompt, context);
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: ASSISTANT_SYSTEM_PROMPT },
          { role: "system", content: `Current MedCare app context:\n${JSON.stringify(context || {}, null, 2)}` },
          { role: "user", content: prompt },
        ],
        max_tokens: 550,
        temperature: 0.35,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI error", error);
      return "I couldn't connect to the AI service. Please check your API key or network.";
    }

    const data = await response.json();
    return data?.choices?.[0]?.message?.content?.trim() || "I couldn't generate an answer. Please try again.";
  } catch (error) {
    console.error(error);
    return "The AI assistant encountered an error. Please try again later.";
  }
}

function getLocalAssistantReply(question, context = {}) {
  const q = question.toLowerCase();
  const patients = context.patients || [];
  const doctors = context.doctors || [];
  const appointments = context.appointments || [];
  const billing = context.billing || [];
  const wards = context.wards || [];
  const pharmacy = context.pharmacy || [];
  const labReports = context.labReports || [];
  const records = context.records || [];
  const surgeries = context.surgeries || [];
  const ambulance = context.ambulance || [];
  const staff = context.staff || [];
  const bloodStock = context.bloodStock || {};
  const patient = findPatientInQuestion(question, patients);

  if (hasAny(q, ["hi", "hello", "hey"]) && q.length < 18) {
    return `Hello${context.user?.name ? ` ${context.user.name}` : ""}. I can answer using the live MedCare data. You are on ${context.currentPage || "the current page"}. Try asking "Who is critical?", "Ravi Kumar bill", "free beds", or "low stock medicines".`;
  }

  if (hasAny(q, ["summary", "dashboard", "overview", "today status", "hospital status"])) {
    const s = context.summary || {};
    return [
      "Current hospital snapshot:",
      `Patients: ${s.patients || 0} total, ${s.admitted || 0} admitted, ${s.critical || 0} critical.`,
      `Doctors on duty: ${s.doctorsOnDuty || 0}. Pending appointments: ${s.pendingAppointments || 0}.`,
      `Beds free: ${s.freeBeds || 0}. Active ambulances: ${s.activeAmbulances || 0}.`,
      `Pending billing balance: ${rupee(s.pendingBilling || 0)}.`
    ].join("\n");
  }

  if (patient) {
    const patientBills = billing.filter(b => b.patientId === patient.id || cleanText(b.patient).includes(cleanText(patient.name)));
    const patientAppts = appointments.filter(a => a.pid === patient.id || cleanText(a.patient).includes(cleanText(patient.name)));
    const patientLabs = labReports.filter(l => cleanText(l.patient).includes(cleanText(patient.name)));
    const patientRecords = records.filter(r => cleanText(r.patient).includes(cleanText(patient.name)));
    const balance = patientBills.reduce((sum, bill) => sum + Number(bill.balance || 0), 0);
    return [
      `${patient.name} (${patient.id}) is listed as ${patient.status} in ${patient.dept}.`,
      `Doctor: ${patient.doctor}. Age/Gender: ${patient.age}/${patient.gender}. Blood group: ${patient.blood || "not recorded"}.`,
      patientAppts.length ? `Appointments:\n${formatItems(patientAppts, a => `- ${a.token}: ${a.date} ${a.time}, ${a.type} with ${a.doctor} (${a.status})`)}` : "No appointments are currently linked to this patient.",
      patientLabs.length ? `Lab reports:\n${formatItems(patientLabs, l => `- ${l.test}: ${l.status}, ordered by ${l.orderedBy} on ${l.date}`)}` : "No lab reports are currently linked.",
      patientRecords.length ? `Medical records:\n${formatItems(patientRecords, r => `- ${r.date}: ${r.diagnosis}; prescription ${r.prescription || "not recorded"}`)}` : "",
      patientBills.length ? `Billing: ${patientBills.length} invoice(s), outstanding balance ${rupee(balance)}.` : "No billing invoices are currently linked."
    ].filter(Boolean).join("\n");
  }

  if (hasAny(q, ["critical", "serious"])) {
    const critical = patients.filter(p => p.status === "Critical");
    return `Critical patients (${critical.length}):\n${formatItems(critical, p => `- ${p.name} (${p.id}), ${p.dept}, doctor ${p.doctor}`)}`;
  }

  if (q.includes("ambulance") || q.includes("driver") || q.includes("eta") || q.includes("distance") || q.includes("current location")) {
    const dispatched = ambulance.filter(a => a.status === "Dispatched");
    const available = ambulance.filter(a => a.status === "Available");
    if (ambulance.length) {
      return [
        `Ambulance status: ${dispatched.length} dispatched, ${available.length} available.`,
        dispatched.length ? `Currently dispatched:\n${formatItems(dispatched, a => `- ${a.id} (${a.type}) for ${a.patient}; driver ${a.driver}, ETA ${a.etaMin} min, last update ${a.lastUpdate}`)}` : "No ambulance is currently dispatched.",
        "Open the Ambulance page and use 'Use my location' to calculate nearest vehicle distance from the user's live location."
      ].join("\n");
    }
    return "I can help you track an ambulance! Head to the Ambulance page where you can enter your current GPS coordinates or use the 'Use my location' button. Once you provide your location, I'll show you the distance to the nearest ambulance and how long it should take to reach you. You'll also see a live map and detailed tracking for each vehicle.";
  }
  if (q.includes("download") && q.includes("report")) {
    return "Great! To download a report, go to the Reports page in the System menu. You'll find various report types like Patient Summary, Revenue, Pharmacy, etc. Click the report you want, and you can either save it as PDF or print it directly. The app also opens a preview so you can review before downloading.";
  }
  if (q.includes("patient") && (q.includes("add") || q.includes("create") || q.includes("new"))) {
    return "To add a new patient, open the Patients page and look for the 'Add Patient' button. You'll need to enter their basic information including name, age, gender, department, assigned doctor, blood type, and contact details. Once registered, they'll get a unique patient ID and can access their records.";
  }
  if (q.includes("patient") || q.includes("medical record") || q.includes("record")) {
    if (patients.length) {
      const admitted = patients.filter(p => p.status === "Admitted").length;
      const opd = patients.filter(p => p.status === "OPD").length;
      return `There are ${patients.length} patients in MedCare: ${admitted} admitted, ${opd} OPD, and ${patients.filter(p => p.status === "Critical").length} critical. Recent patients:\n${formatItems(patients, p => `- ${p.name} (${p.id}) - ${p.status}, ${p.dept}, ${p.doctor}`)}`;
    }
  }
  if (q.includes("appointment") || q.includes("schedule") || q.includes("visit")) {
    if (appointments.length) {
      const pending = appointments.filter(a => a.status === "Pending");
      return `Appointments: ${appointments.length} total, ${pending.length} pending.\n${formatItems(appointments, a => `- ${a.token}: ${a.patient} with ${a.doctor}, ${a.date} ${a.time}, ${a.status}`)}`;
    }
  }
  if (q.includes("billing") || q.includes("invoice") || q.includes("payment")) {
    if (billing.length) {
      const dueBills = billing.filter(b => Number(b.balance || 0) > 0);
      const totalDue = dueBills.reduce((sum, bill) => sum + Number(bill.balance || 0), 0);
      return `Billing has ${billing.length} invoice(s). Outstanding balance is ${rupee(totalDue)} across ${dueBills.length} unpaid or partial invoice(s).\n${formatItems(dueBills, b => `- ${b.inv}: ${b.patient}, ${billingStatus(b)}, balance ${rupee(b.balance || billingBalance(b))}`)}`;
    }
  }
  if (q.includes("doctor") || q.includes("specialist") || q.includes("department")) {
    if (doctors.length) {
      const onDuty = doctors.filter(d => d.status === "On Duty");
      return `Doctors on duty: ${onDuty.length}/${doctors.length}.\n${formatItems(doctors, d => `- ${d.name}, ${d.spec}, ${d.status}, ${d.today} patients today`)}`;
    }
  }
  if (q.includes("lab") || q.includes("test") || q.includes("result")) {
    if (labReports.length) {
      const pendingLabs = labReports.filter(l => l.status === "Pending" || l.status === "Processing");
      return `Lab reports: ${labReports.length} total, ${pendingLabs.length} pending or processing.\n${formatItems(labReports, l => `- ${l.id}: ${l.patient}, ${l.test}, ${l.status}`)}`;
    }
  }
  if (q.includes("pharmacy") || q.includes("medicine") || q.includes("drug") || q.includes("stock")) {
    if (pharmacy.length) {
      const lowStock = pharmacy.filter(m => Number(m.stock || 0) < Number(m.reorder || 0));
      return `Pharmacy has ${pharmacy.length} medicines. Low-stock items: ${lowStock.length}.\n${formatItems(lowStock.length ? lowStock : pharmacy, m => `- ${m.name}: ${m.stock} in stock, reorder at ${m.reorder}, expires ${m.expiry}`)}`;
    }
  }
  if (q.includes("ward") || q.includes("bed") || q.includes("room") || q.includes("occupy")) {
    if (wards.length) {
      const totalBeds = wards.reduce((sum, ward) => sum + Number(ward.beds || 0), 0);
      const occupiedBeds = wards.reduce((sum, ward) => sum + Number(ward.occupied || 0), 0);
      return `Rooms & Wards: ${totalBeds - occupiedBeds} free beds out of ${totalBeds}.\n${formatItems(wards, w => `- ${w.name}: ${w.freeBeds} free of ${w.beds}, ${rupee(w.rate)}/day`)}`;
    }
  }
  if (q.includes("staff") || q.includes("nurse") || q.includes("attendance")) {
    if (staff.length) {
      const active = staff.filter(s => s.status === "Active");
      return `Staff status: ${active.length}/${staff.length} active.\n${formatItems(staff, s => `- ${s.name}, ${s.role}, ${s.dept}, ${s.shift} shift, ${s.status}`)}`;
    }
  }
  if (q.includes("blood") || q.includes("donor")) {
    const groups = Object.entries(bloodStock).sort((a, b) => Number(a[1]) - Number(b[1]));
    if (groups.length) {
      const critical = groups.filter(([, units]) => Number(units) < 8);
      return `Blood bank stock${critical.length ? ` has ${critical.length} critical group(s)` : " is above the critical threshold"}.\n${formatItems(groups, ([group, units]) => `- ${group}: ${units} unit(s)`)}`;
    }
  }
  if (q.includes("surgery") || q.includes("operation") || q.includes("ot")) {
    if (surgeries.length) {
      const active = surgeries.filter(s => s.status !== "Completed");
      return `Surgery/OT has ${active.length} active scheduled or pending procedure(s).\n${formatItems(surgeries, s => `- ${s.id}: ${s.procedure} for ${s.patient}, ${s.ot}, ${s.datetime}, ${s.status}`)}`;
    }
  }
  if (q.includes("patient") || q.includes("medical record") || q.includes("record")) {
    return "You can access all patient information from the Patients page. Click on any patient to view their full profile, medical history, current status (Admitted/OPD/Discharged), assigned doctor, and admission date. For detailed medical records, visit the Medical Records section where you can search and view diagnoses, prescriptions, and treatment history.";
  }
  if (q.includes("appointment") || q.includes("schedule") || q.includes("visit")) {
    return "The Appointments page shows all scheduled consultations with patient names, doctors, appointment types, dates, times, and current status. You can create new appointments, check confirmation status, view pending ones, and update details. Patients can also see their own appointments when logged in.";
  }
  if (q.includes("billing") || q.includes("invoice") || q.includes("payment")) {
    return "The Billing section lets you manage all patient invoices. You can create new bills, track payment status (Paid, Partial, Unpaid), view insurance coverage details, and calculate outstanding balances. Each invoice shows services provided, total cost, paid amount, and remaining dues. You can also filter by status or search by patient name.";
  }
  if (q.includes("doctor") || q.includes("specialist") || q.includes("department")) {
    return "The Doctors page displays the complete roster of specialists with their qualifications, experience, specializations, and current availability status. You can see how many patients each doctor is seeing today, their contact details, and department assignments. This helps you assign the right specialist to each patient based on their needs.";
  }
  if (q.includes("lab") || q.includes("test") || q.includes("result")) {
    return "The Lab Reports page tracks all diagnostic tests ordered for patients. You can see test status (Pending, Processing, Ready), the ordering doctor, test date, and patient details. Once results are ready, they appear here for doctor review. You can also order new tests and track turnaround times.";
  }
  if (q.includes("pharmacy") || q.includes("medicine") || q.includes("drug") || q.includes("stock")) {
    return "The Pharmacy page shows your complete medicine inventory with stock levels, expiry dates, manufacturer, price per unit, and reorder thresholds. The system alerts you when stock falls below reorder levels or approaches expiry. You can quickly identify low-stock items, manage inventory, and track pharmacy costs.";
  }
  if (q.includes("ward") || q.includes("bed") || q.includes("room") || q.includes("occupy")) {
    return "In Rooms & Wards, you can see all available wards with capacity details—total beds, currently occupied, and remaining free beds. Each ward has a daily rate for billing purposes. This helps you quickly find available beds when admitting patients and manage ward occupancy efficiently.";
  }
  if (q.includes("staff") || q.includes("nurse") || q.includes("attendance")) {
    return "The Staff page shows your entire team with their roles, departments, shifts, and current status (Active/On Leave/Off Duty). You can add new staff members, update their information, and track attendance. It's useful for managing schedules and ensuring proper staffing across departments.";
  }
  if (q.includes("blood") || q.includes("donor")) {
    return "The Blood Bank page tracks blood inventory by group with current stock levels and critical alerts if supplies run low. You can also view donor records, donation dates, and verification status. This helps you quickly check if the needed blood type is available and manage donor relationships.";
  }
  if (q.includes("surgery") || q.includes("operation") || q.includes("ot")) {
    return "The Surgery/OT page manages all surgical procedures with scheduling, surgeon details, operating theatre assignments, and procedure status. You can schedule surgeries, track completion, and view upcoming procedures. This helps coordinate between doctors, surgical staff, and OT availability.";
  }
  if (q.includes("login") || q.includes("sign in") || q.includes("register")) {
    return "To log in, select your role (Admin, Doctor, Staff, or Patient) and enter your credentials. If you're a new patient, click Register to create an account with your name, email, age, and gender. Once registered, you'll be logged in automatically and can access your appointments, medical records, and ambulance tracking.";
  }
  if (q.includes("help") || q.includes("feature") || q.includes("how to")) {
    return "I'm here to help! I can guide you on using any feature in MedCare—from managing patients and appointments to billing, lab reports, pharmacy inventory, ambulance tracking, and more. Just ask about what you'd like to do, and I'll walk you through it step by step.";
  }
  return "Hi! I'm MedCare AI, your hospital management assistant. I can help you navigate the system and answer questions about patients, appointments, billing, doctors, lab reports, pharmacy, ambulances, wards, staff, blood bank, surgery scheduling, and reports. What would you like help with?";
}

function ChatModal({ messages, value, onChange, onSend, onClose, loading }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.32)", display: "flex", alignItems: "flex-end", justifyContent: "flex-end", zIndex: 100000, padding: 20 }} onClick={onClose}>
      <div style={{ width: 390, maxWidth: "calc(100vw - 40px)", height: 560, maxHeight: "calc(100vh - 40px)", background: "#fff", border:"1px solid #dfe7f1", borderRadius: 14, overflow: "hidden", boxShadow: "0 18px 48px rgba(15,23,42,0.22)" }} onClick={e => e.stopPropagation()}>
        <div style={{ background: "#fff", color: "#0f172a", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom:"1px solid #e5e7eb" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:9, background:"#e8f0ff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>🏥</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14 }}>MedCare AI</div>
              <div style={{ fontSize: 11, color: "#607187", marginTop: 2 }}>Hospital assistant</div>
            </div>
          </div>
          <button onClick={onClose} style={{ border: "1px solid #d7e0eb", background: "#fff", color: "#64748b", width:28, height:28, borderRadius:8, fontSize: 15, cursor: "pointer" }}>×</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", height: "calc(100% - 126px)", overflowY: "auto", padding: 14, gap: 10, background: "#f8fafc" }}>
          {messages.map((msg, index) => (
            <div key={index} style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "assistant" ? "flex-start" : "flex-end" }}>
              <div style={{ maxWidth: "92%", background: msg.role === "assistant" ? "#fff" : "#2663c6", color: msg.role === "assistant" ? "#0f172a" : "#fff", border:"1px solid "+(msg.role === "assistant" ? "#e3eaf3" : "#2663c6"), borderRadius: 12, padding: "10px 12px", fontSize: 13, lineHeight: 1.5, whiteSpace: "pre-wrap", boxShadow: msg.role === "assistant" ? "0 1px 2px rgba(15,23,42,0.06)" : "none" }}>{msg.content}</div>
              <div style={{ fontSize: 10, color: "#6b7280", marginTop: 4 }}>{msg.role === "assistant" ? "Assistant" : "You"}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: 14, background: "#fff", borderTop: "1px solid #e5e7eb" }}>
          <div style={{ display: "flex", gap: 10 }}>
            <input value={value} onChange={e => onChange(e.target.value)} placeholder="Type your question..."
              style={{ flex: 1, padding: "10px 12px", borderRadius: 9, border: "1px solid #c9d2df", fontSize: 13, outline: "none", fontFamily:"inherit" }}
              onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); onSend(); } }} />
            <button onClick={onSend} disabled={loading} style={{ border: "none", background: "#2663c6", color: "#fff", borderRadius: 9, padding: "10px 16px", cursor: loading ? "not-allowed" : "pointer", fontWeight: 700, fontSize: 13, fontFamily:"inherit" }}>{loading ? "..." : "Send"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatButton({ onOpen }) {
  return (
    <button onClick={onOpen} style={{ position: "fixed", right: 18, bottom: 18, zIndex: 99999, border: "1px solid #d7e0eb", borderRadius: 10, background: "#fff", color: "#0f172a", padding: "9px 13px", fontWeight: 700, cursor: "pointer", boxShadow: "0 10px 24px rgba(15,23,42,0.16)", display:"flex", alignItems:"center", gap:8, fontFamily:"inherit", fontSize:13 }}>
      <span style={{ width:24, height:24, borderRadius:8, background:"conic-gradient(from 210deg,#7c3aed,#2563eb,#06b6d4,#22c55e,#f59e0b,#ec4899,#7c3aed)", display:"inline-flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:13, fontWeight:800, boxShadow:"inset 0 0 0 1px rgba(255,255,255,0.45)" }}>✦</span>
      Chat
    </button>
  );
}

function ProgressBar({ pct, color }) {
  return (
    <div style={{ height:6, background:"#f0f2f7", borderRadius:3, overflow:"hidden", marginTop:4 }}>
      <div style={{ height:"100%", width:`${Math.min(pct,100)}%`, background:color||"#1a63c8", borderRadius:3, transition:"width 0.7s" }} />
    </div>
  );
}

//  PAGES 

function Dashboard({ state, setPage, addAudit, addNotif }) {
  const patients = state.patients||[];
  const doctors = state.doctors||[];
  const appointments = state.appointments||[];
  const billing = state.billing||[];
  const wards = state.wards||[];
  const bloodStock: Record<string, number> = state.bloodStock||{};
  const labReports = state.labReports||[];
  const surgeries = state.surgeries||[];
  const ambulance = state.ambulance||[];
  const staff = state.staff||[];
  const notifications = state.notifications||[];
  const auditLog = state.auditLog||[];
  const [tick, setTick] = useState(0);
  useEffect(() => { const id = setInterval(() => setTick(t=>t+1), 30000); return () => clearInterval(id); }, []);

  const now = new Date();
  const clockStr = now.toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" });
  const dateStr  = now.toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long", year:"numeric" });

  const admitted      = patients.filter(p => p.status === "Admitted").length;
  const critical      = patients.filter(p => p.status === "Critical").length;
  const discharged    = patients.filter(p => p.status === "Discharged").length;
  const onDuty        = doctors.filter(d => d.status === "On Duty").length;
  const pendingAppts  = appointments.filter(a => a.status === "Pending").length;
  const paidRev       = billing.reduce((s,b) => s + billingCovered(b), 0);
  const pendingDues   = billing.reduce((s,b) => s + billingBalance(b), 0);
  const totalBeds     = wards.reduce((s,w) => s+w.beds, 0);
  const occupiedBeds  = wards.reduce((s,w) => s+w.occupied, 0);
  const bedPct        = totalBeds > 0 ? Math.round((occupiedBeds/totalBeds)*100) : 0;
  const lowMeds       = state.pharmacy.filter(m => m.stock < m.reorder).length;
  const critBlood     = Object.entries(bloodStock).filter(([,u]) => u < 8);
  const pendingLab    = labReports.filter(l => l.status === "Pending" || l.status === "Processing").length;
  const scheduledSurg = surgeries.filter(s => s.status !== "Completed").length;
  const dispatchedAmb = ambulance.filter(a => a.status === "Dispatched").length;
  const unread        = notifications.filter(n => !n.read).length;
  const dotC = { success:"#22c55e", warning:"#f59e0b", danger:"#ef4444", info:"#1a63c8" };
  const fmt = n => n >= 100000 ? ""+(n/100000).toFixed(1)+"L" : rupee(n);

  const deptCounts: Record<string, number> = {};
  patients.forEach(p => { deptCounts[p.dept] = (deptCounts[p.dept]||0)+1; });
  const topDepts = (Object.entries(deptCounts) as [string, number][]).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const deptColors = ["#1a63c8","#9b1c1c","#92400e","#166534","#4c1d95"];

  return (
    <div style={{ animation:"fadeIn 0.3s" }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16, padding:"4px 0" }}>
        <div>
          <div style={{ fontSize:16, fontWeight:800, color:"#1a1d24" }}>Hospital Dashboard</div>
          <div style={{ fontSize:11, color:"#6b7280", marginTop:2 }}>{dateStr}</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:24, fontWeight:800, color:"#1a63c8", fontFamily:"monospace" }}>{clockStr}</div>
          <div style={{ fontSize:10, color:"#9ca3af" }}> Live data</div>
        </div>
      </div>

      {/* Row 1  4 primary KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:12 }}>
        <StatCard label="Total Patients" value={patients.length} color="#1a63c8"
          sub={`${admitted} admitted  ${critical} critical  ${discharged} discharged`} onClick={() => setPage("patients")} />
        <StatCard label="Doctors On Duty" value={onDuty} color="#166534"
          sub={`${doctors.length - onDuty} off  ${doctors.length} total`} onClick={() => setPage("doctors")} />
        <StatCard label="Appointments" value={appointments.length} color="#92400e"
          sub={`${pendingAppts} pending  ${appointments.length - pendingAppts} confirmed`} onClick={() => setPage("appointments")} />
        <StatCard label="Total Billing" value={fmt(paidRev + pendingDues)} color="#9b1c1c"
          sub={`${fmt(paidRev)} paid  ${fmt(pendingDues)} due`} onClick={() => setPage("billing")} />
      </div>

      {/* Row 2  secondary KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:12 }}>
        <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, padding:"14px 16px", boxShadow:"0 1px 4px rgba(0,0,0,0.07)", borderLeft:"3px solid #1a63c8", cursor:"pointer" }} onClick={() => setPage("rooms")}>
          <div style={{ fontSize:10, color:"#6b7280", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:4 }}>Bed Occupancy</div>
          <div style={{ fontSize:26, fontWeight:800, color:"#1a63c8" }}>{bedPct}%</div>
          <div style={{ fontSize:11, color:"#6b7280", marginTop:4 }}>{occupiedBeds}/{totalBeds} beds  {totalBeds-occupiedBeds} free</div>
          <ProgressBar pct={bedPct} color={bedPct>=90?"#9b1c1c":bedPct>=70?"#92400e":"#1a63c8"} />
        </div>
        <StatCard label="Pharmacy Alerts" value={lowMeds} color="#92400e"
          sub="medicines below reorder" onClick={() => setPage("pharmacy")} />
        <StatCard label="Blood Bank" value={critBlood.length > 0 ? `${critBlood.length} Critical` : " OK"} color={critBlood.length > 0 ? "#9b1c1c" : "#166534"}
          sub={critBlood.length > 0 ? critBlood.map(([bg,u]) => `${bg}(${u}u)`).join("  ") : "All groups stocked"} onClick={() => setPage("blood")} />
        <StatCard label="Active Staff" value={staff.filter(s=>s.status==="Active").length} color="#166534"
          sub={`${staff.length} total  ${staff.filter(s=>s.status==="On Leave").length} on leave`} onClick={() => setPage("staff")} />
      </div>

      {/* Row 3  mini tiles + dept chart */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
        <Card>
          <div style={{ fontWeight:700, fontSize:13, marginBottom:12 }}>Live Module Summary</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
            {[
              { label:"Lab Pending",      val:pendingLab,                             col:"#92400e", page:"lab"           },
              { label:"Surgery Sched.",   val:scheduledSurg,                          col:"#1a63c8", page:"surgery"       },
              { label:"Ambulance Out",    val:dispatchedAmb,                          col:"#9b1c1c", page:"ambulance"     },
              { label:"Invoices Unpaid",  val:billing.filter(b=>billingStatus(b)!=="Paid").length, col:"#92400e", page:"billing" },
              { label:"Notifications",    val:unread,                                 col:unread>0?"#9b1c1c":"#166534", page:"notifications" },
              { label:"OPD Patients",     val:patients.filter(p=>p.status==="OPD").length, col:"#1a63c8", page:"patients"  },
            ].map(item => (
              <div key={item.label} onClick={() => setPage(item.page)} style={{ background:"#f8faff", borderRadius:8, padding:10, cursor:"pointer" }}>
                <div style={{ fontSize:9, color:"#9ca3af", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em" }}>{item.label}</div>
                <div style={{ fontSize:22, fontWeight:800, color:item.col, marginTop:2 }}>{item.val}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div style={{ fontWeight:700, fontSize:13, marginBottom:12 }}>Patient Distribution</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {topDepts.map(([dept, count], i) => {
              const pct = Math.round((count / Math.max(patients.length,1)) * 100);
              return (
                <div key={dept}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:2 }}>
                    <span>{dept}</span>
                    <span style={{ color:"#6b7280" }}>{count} ({pct}%)</span>
                  </div>
                  <ProgressBar pct={pct} color={deptColors[i]} />
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Row 4  Activity + Appointments */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
        <Card>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <div style={{ fontWeight:700, fontSize:13 }}>Recent Activity</div>
            <Btn small onClick={() => setPage("admin")}>Audit Log</Btn>
          </div>
          {auditLog.slice(0,6).map((a,i) => (
            <div key={i} style={{ display:"flex", gap:10, padding:"7px 0", borderBottom: i<5?"1px solid #f3f4f6":"none" }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:dotC[a.color]||"#1a63c8", marginTop:4, flexShrink:0 }} />
              <div>
                <div style={{ fontSize:12.5 }}>{a.msg}</div>
                <div style={{ fontSize:10.5, color:"#9ca3af", marginTop:2 }}>{a.time}</div>
              </div>
            </div>
          ))}
        </Card>
        <Card>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <div style={{ fontWeight:700, fontSize:13 }}>Today's Appointments ({appointments.length})</div>
            <Btn small onClick={() => setPage("appointments")}>View All</Btn>
          </div>
          <Table heads={["Patient","Doctor","Time","Status"]}
            rows={appointments.slice(0,4).map(a => [a.patient, a.doctor, a.time, <Badge s={a.status} />])} />
        </Card>
      </div>

      {/* Row 5  Recent Patients */}
      <Card>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <div style={{ fontWeight:700, fontSize:13 }}>Recent Patients ({patients.length} total)</div>
          <Btn small onClick={() => setPage("patients")}>View All</Btn>
        </div>
        <Table heads={["ID","Name","Age","Dept","Doctor","Admitted","Status"]}
          rows={[...patients].reverse().slice(0,5).map(p => [p.id, p.fname+" "+p.lname, p.age, p.dept, p.doctor, p.admitted, <Badge s={p.status} />])} />
      </Card>

      {/* Row 6  Blood Bank + Surgeries */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Card>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <div style={{ fontWeight:700, fontSize:13 }}>Blood Bank{critBlood.length>0&&<span style={{ color:"#9b1c1c", fontSize:11, marginLeft:8 }}> {critBlood.length} critical</span>}</div>
            <Btn small onClick={() => setPage("blood")}>Manage</Btn>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
            {["A+","B+","O+","AB+","A-","B-","O-","AB-"].map(bg => {
              const u = bloodStock[bg]||0;
              const low = u < 8;
              return (
                <div key={bg} style={{ textAlign:"center", padding:"8px 4px", borderRadius:8, border:`1px solid ${low?"#fca5a5":"#e5e7eb"}`, background:low?"#fef2f2":"#f9fafb" }}>
                  <div style={{ fontWeight:800, fontSize:14, color:low?"#9b1c1c":"#1a1d24" }}>{bg}</div>
                  <div style={{ fontSize:10.5, color:low?"#9b1c1c":"#6b7280", marginTop:2 }}>{u}u{low?" ":""}</div>
                </div>
              );
            })}
          </div>
        </Card>
        <Card>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <div style={{ fontWeight:700, fontSize:13 }}>Upcoming Surgeries ({scheduledSurg})</div>
            <Btn small onClick={() => setPage("surgery")}>View All</Btn>
          </div>
          <Table heads={["ID","Patient","Procedure","OT","Status"]}
            rows={surgeries.filter(s=>s.status!=="Completed").slice(0,4).map(s => [s.id, s.patient, s.procedure, s.ot, <Badge s={s.status} />])} />
        </Card>
      </div>
    </div>
  );
}

function PatientsPage({ state, setState, toast, addAudit, currentUser, updateAcrossState, deleteAcrossState }) {
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [viewId, setViewId] = useState(null);
  const [form, setForm] = useState({ fname:"", lname:"", age:"", gender:"Male", dept:"Cardiology", doctor:"Dr. Rajesh Mehta", blood:"A+", status:"OPD", phone:"" });
  const f = k => v => setForm(p => ({...p,[k]:v}));
  const isAdmin = currentUser?.role === "Admin";
  const depts = ["Cardiology","Neurology","Orthopaedics","Paediatrics","Gynaecology","Urology","Gastrology"];
  const doctorOptions = state.doctors.map(d => d.name).filter(Boolean);
  const filtered = state.patients.filter(p => !search || (p.fname+" "+p.lname).toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()));

  const handleAdd = () => {
    if(!form.fname||!form.lname){toast("Name required");return;}
    const nums = state.patients.map(p=>parseInt(p.id.replace(/\D/g,""))).filter(n=>!isNaN(n));
    const id = "P-"+(Math.max(0,...nums)+1);
    const newP = {...form, id, age:parseInt(form.age)||0, admitted:today(), email:"", admType:"OPD"};
    setState(s=>({...s, patients:[...s.patients, newP]}));
    addAudit(`Patient ${id} registered  ${form.dept}`, "success");
    setShowAdd(false); setForm({ fname:"", lname:"", age:"", gender:"Male", dept:"Cardiology", doctor:"Dr. Rajesh Mehta", blood:"A+", status:"OPD", phone:"" });
    toast(` Patient ${id} added!`);
  };


  const handleEdit = () => {
    const oldP = state.patients.find(p => p.id === editId);
    const newFull = form.fname + " " + form.lname;
    setState(s=>({
      ...s,
      patients: s.patients.map(p=>p.id===editId?{...p,...form,age:parseInt(form.age)||p.age}:p),
      appointments: s.appointments.map(a => a.pid===editId ? { ...a, patient: newFull } : a),
      records: s.records.map(r => r.patient=== (oldP ? `${oldP.fname} ${oldP.lname}` : '') ? { ...r, patient: newFull } : r),
      labReports: s.labReports.map(l => l.patient=== (oldP ? `${oldP.fname} ${oldP.lname}` : '') ? { ...l, patient: newFull } : l),
      surgeries: s.surgeries.map(x => x.patient=== (oldP ? `${oldP.fname} ${oldP.lname}` : '') ? { ...x, patient: newFull } : x),
      billing: s.billing.map(b => b.patientId===editId || b.patient=== (oldP ? `${oldP.fname} ${oldP.lname}` : '') ? { ...b, patientId: editId, patient: newFull } : b),
    }));
    addAudit(`Patient ${editId} updated`, "info");
    setEditId(null); toast(` Patient ${editId} updated`);
  };
  const openEdit = id => {
    const p = state.patients.find(x=>x.id===id);
    setForm({fname:p.fname,lname:p.lname,age:String(p.age),gender:p.gender,dept:p.dept,doctor:p.doctor,blood:p.blood,status:p.status,phone:p.phone||""});
    setEditId(id);
  };
  const handleDelete = id => {
    const p = state.patients.find(x => x.id === id);
    const fullName = p ? `${p.fname} ${p.lname}` : "";
    setState(s => ({
      ...s,
      patients: s.patients.filter(x => x.id !== id),
      appointments: s.appointments.filter(a => a.pid !== id && a.patient !== fullName),
      records: s.records.filter(r => r.patient !== fullName),
      labReports: s.labReports.filter(l => l.patient !== fullName),
      surgeries: s.surgeries.filter(x => x.patient !== fullName),
      billing: s.billing.filter(b => b.patientId !== id && b.patient !== fullName),
    }));
    addAudit(`Patient ${id} deleted`, "danger");
    toast(` Patient ${id} deleted`);
  };
  const viewP = viewId ? state.patients.find(p=>p.id===viewId) : null;

  return (
    <div>
      <div style={{ display:"flex", gap:8, marginBottom:12, alignItems:"center" }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search patient"
          style={{ padding:"8px 12px", border:"1px solid #dde2eb", borderRadius:8, fontSize:13, width:220, fontFamily:"inherit" }} />
        <div style={{ flex:1 }}/>
        {(!currentUser || currentUser.role !== 'Patient') && <Btn primary onClick={()=>setShowAdd(true)}>+ Add Patient</Btn>}
      </div>
      <Card>
        <Table heads={["ID","Name","Age","Gender","Dept","Doctor","Admitted","Status","Actions"]}
          rows={filtered.map(p => [p.id, p.fname+" "+p.lname, p.age, p.gender[0], p.dept, p.doctor, p.admitted, <Badge s={p.status}/>,
            currentUser?.role === 'Patient'
              ? <Btn small onClick={()=>setViewId(p.id)}>View</Btn>
              : <div style={{display:"flex",gap:4}}>
                  <Btn small onClick={()=>setViewId(p.id)}>View</Btn>
                  <Btn small primary onClick={()=>openEdit(p.id)}>Edit</Btn>
                  {isAdmin && <Btn small danger onClick={()=>handleDelete(p.id)}>Delete</Btn>}
                </div>])} />
      </Card>

      {(showAdd||editId) && (
        <Modal title={editId?`Edit Patient  ${editId}`:"Register New Patient"} onClose={()=>{setShowAdd(false);setEditId(null);}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Input label="First Name" value={form.fname} onChange={f("fname")} />
            <Input label="Last Name" value={form.lname} onChange={f("lname")} />
            <Input label="Age" type="number" value={form.age} onChange={f("age")} />
            <Sel label="Gender" value={form.gender} onChange={f("gender")} options={["Male","Female","Other"]} />
            <Input label="Phone" value={form.phone} onChange={f("phone")} />
            <Sel label="Blood Group" value={form.blood} onChange={f("blood")} options={["A+","B+","O+","AB+","A-","B-","O-","AB-"]} />
            <Sel label="Department" value={form.dept} onChange={f("dept")} options={depts} />
            <Sel label="Doctor" value={form.doctor} onChange={f("doctor")} options={doctorOptions.length ? doctorOptions : ["Dr. Rajesh Mehta"]} />
            <Sel label="Status" value={form.status} onChange={f("status")} options={["Admitted","Discharged","OPD","Critical"]} />
          </div>
          <div style={{display:"flex",gap:8,marginTop:8}}><Btn primary onClick={editId?handleEdit:handleAdd}>{editId?"Save Changes":"Register Patient"}</Btn><Btn onClick={()=>{setShowAdd(false);setEditId(null);}}>Cancel</Btn></div>
        </Modal>
      )}
      {viewP && (
        <Modal title={`Patient  ${viewP.id}`} onClose={()=>setViewId(null)}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,fontSize:13}}>
            {[["Name",viewP.fname+" "+viewP.lname],["Age/Gender",`${viewP.age} / ${viewP.gender}`],["Department",viewP.dept],["Doctor",viewP.doctor],["Blood Group",viewP.blood],["Phone",viewP.phone||""],["Admitted",viewP.admitted],["Status",<Badge s={viewP.status}/>]].map(([k,v])=>
              <div key={k}><div style={{fontSize:10,color:"#6b7280",fontWeight:700,textTransform:"uppercase",marginBottom:2}}>{k}</div><div style={{fontWeight:500}}>{v}</div></div>)}
          </div>
          <div style={{marginTop:16,textAlign:"right"}}><Btn onClick={()=>setViewId(null)}>Close</Btn></div>
        </Modal>
      )}
    </div>
  );
}

function DoctorsPage({ state, setState, toast, addAudit, currentUser }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [viewId, setViewId] = useState(null);
  const [form, setForm] = useState({ name:"", spec:"Cardiology", qual:"", exp:"", phone:"", status:"On Duty" });
  const f = k => v => setForm(p=>({...p,[k]:v}));
  const specs = ["Cardiology","Neurology","Orthopaedics","Paediatrics","Gynaecology","Urology","Gastrology","Radiology","General Medicine"];
  const viewD = viewId ? state.doctors.find(d=>d.id===viewId) : null;
  const isAdmin = currentUser?.role === "Admin";
  const canManageDoctors = !currentUser || !['Patient','Doctor'].includes(currentUser.role);

  const handleAdd = () => {
    if(!form.name){toast("Name required");return;}
    const nums = state.doctors.map(d=>parseInt(d.id.replace(/\D/g,""))).filter(n=>!isNaN(n));
    const id = "D-"+String(Math.max(0,...nums)+1).padStart(3,"0");
    const full = form.name.startsWith("Dr.") ? form.name : "Dr. "+form.name;
    setState(s=>({...s,doctors:[...s.doctors,{...form,name:full,id,today:0}]}));
    addAudit(`Doctor ${id} registered  ${form.spec}`,"success");
    setShowAdd(false); setForm({name:"",spec:"Cardiology",qual:"",exp:"",phone:"",status:"On Duty"});
    toast(` ${full} added!`);
  };
  const handleEdit = () => {
    setState(s=>({...s,doctors:s.doctors.map(d=>d.id===editId?{...d,...form}:d)}));
    addAudit(`Doctor ${editId} updated`,"info");
    setEditId(null); toast(" Doctor updated");
  };
  const openEdit = id => { const d=state.doctors.find(x=>x.id===id); setForm({name:d.name,spec:d.spec,qual:d.qual,exp:d.exp,phone:d.phone,status:d.status}); setEditId(id); };
  const handleDelete = id => {
    const d = state.doctors.find(x => x.id === id);
    const dName = d?.name || "";
    setState(s => ({
      ...s,
      doctors: s.doctors.filter(x => x.id !== id),
      appointments: s.appointments.filter(a => a.doctor !== dName),
      surgeries: s.surgeries.filter(x => x.surgeon !== dName),
      patients: s.patients.map(p => p.doctor === dName ? { ...p, doctor:"Unassigned" } : p),
      records: s.records.map(r => r.doctor === dName ? { ...r, doctor:"-" } : r),
      labReports: s.labReports.map(l => l.orderedBy === dName ? { ...l, orderedBy:"-" } : l),
      billing: s.billing.map(b => b.doctor === dName ? { ...b, doctor:"-" } : b),
    }));
    addAudit(`Doctor ${id} removed`, "danger");
    toast(` Doctor ${id} deleted`);
  };

  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:12}}>
        <StatCard label="Total Doctors" value={state.doctors.length} color="#1a63c8" />
        <StatCard label="On Duty" value={state.doctors.filter(d=>d.status==="On Duty").length} color="#166534" />
        <StatCard label="Today's Patients" value={state.doctors.reduce((s,d)=>s+d.today,0)} color="#92400e" />
      </div>
      {canManageDoctors && (
        <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}>
          <Btn primary onClick={()=>setShowAdd(true)}>+ Add Doctor</Btn>
        </div>
      )}
      <Card>
        <Table heads={["ID","Name","Specialisation","Qualification","Exp","Phone","Status","Actions"]}
          rows={state.doctors.map(d=>[d.id,d.name,d.spec,d.qual,d.exp,d.phone,<Badge s={d.status}/>,
            !canManageDoctors
              ? <Btn small onClick={()=>setViewId(d.id)}>Profile</Btn>
              : <div style={{display:"flex",gap:4}}>
                  <Btn small onClick={()=>setViewId(d.id)}>Profile</Btn>
                  <Btn small primary onClick={()=>openEdit(d.id)}>Edit</Btn>
                  {isAdmin && <Btn small danger onClick={()=>handleDelete(d.id)}>Delete</Btn>}
                </div>])} />
      </Card>
      {(showAdd||editId) && (
        <Modal title={editId?`Edit Doctor  ${editId}`:"Add New Doctor"} onClose={()=>{setShowAdd(false);setEditId(null);}}>
          <Input label="Full Name *" value={form.name} onChange={f("name")} placeholder="Dr. Priya Sharma" />
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Sel label="Specialisation *" value={form.spec} onChange={f("spec")} options={specs} />
            <Input label="Qualification" value={form.qual} onChange={f("qual")} placeholder="MD, DM" />
            <Input label="Experience" value={form.exp} onChange={f("exp")} placeholder="10 yrs" />
            <Input label="Phone" value={form.phone} onChange={f("phone")} />
            {canManageDoctors && <Sel label="Status" value={form.status} onChange={f("status")} options={["On Duty","On Leave","Off Duty","On Call"]} />}
          </div>
          <div style={{display:"flex",gap:8,marginTop:8}}><Btn primary onClick={editId?handleEdit:handleAdd}>{editId?"Save":"Add Doctor"}</Btn><Btn onClick={()=>{setShowAdd(false);setEditId(null);}}>Cancel</Btn></div>
        </Modal>
      )}
      {viewD && (
        <Modal title={`Doctor Profile  ${viewD.id}`} onClose={()=>setViewId(null)}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,fontSize:13}}>
            {[["Name",viewD.name],["Specialisation",viewD.spec],["Qualification",viewD.qual],["Experience",viewD.exp],["Phone",viewD.phone],["Status",<Badge s={viewD.status}/>],["Today's Patients",viewD.today]].map(([k,v])=>
              <div key={k}><div style={{fontSize:10,color:"#6b7280",fontWeight:700,textTransform:"uppercase",marginBottom:2}}>{k}</div><div style={{fontWeight:500}}>{v}</div></div>)}
          </div>
          <div style={{marginTop:16,display:"flex",gap:8,justifyContent:"flex-end"}}>{canManageDoctors && <Btn primary onClick={()=>{setViewId(null);openEdit(viewD.id);}}>Edit</Btn>}<Btn onClick={()=>setViewId(null)}>Close</Btn></div>
        </Modal>
      )}
    </div>
  );
}

function AppointmentsPage({ state, setState, toast, addAudit, addNotif, currentUser }) {
  const [showAdd, setShowAdd] = useState(false);
  const [tab, setTab]         = useState('all'); // 'all' | 'pending' | 'mine'
  const [form, setForm]       = useState({ patient:'', doctor:'Dr. Rajesh Mehta', dept:'Cardiology', date:new Date().toISOString().slice(0,10), time:'', type:'OPD' });
  const f = k => v => setForm(p => ({ ...p, [k]: v }));
  const role = currentUser?.role || 'Admin';
  const isAdmin = role === "Admin";

  // When Patient books  status is always "Pending" (awaiting doctor acceptance)
  const handleAdd = () => {
    if (!form.patient || !form.date) { toast('Patient name and date required'); return; }
    const nums  = state.appointments.map(a => parseInt(a.token.replace(/\D/g, ''))).filter(n => !isNaN(n));
    const token = '#T' + (Math.max(0, ...nums) + 1);
    const dateStr = new Date(form.date).toLocaleDateString('en-IN', { day:'2-digit', month:'short' });
    const newStatus = role === 'Patient' ? 'Pending' : 'Confirmed';
    setState(s => ({ ...s, appointments: [...s.appointments, { token, patient: form.patient, pid:'CUSTOM', doctor: form.doctor, dept: form.dept, date: dateStr, time: form.time, type: form.type, status: newStatus }] }));
    addAudit('Appointment ' + token + ' booked by ' + (currentUser?.name || role), 'success');
    if (role === 'Patient') {
      addNotif('New appointment request ' + token + ' from ' + form.patient + '  awaiting doctor approval', 'warning', 'Appointments');
      toast(' Appointment ' + token + ' requested! Awaiting doctor acceptance.');
    } else {
      toast(' Appointment ' + token + ' booked!');
    }
    setShowAdd(false);
    setForm({ patient:'', doctor:'Dr. Rajesh Mehta', dept:'Cardiology', date:new Date().toISOString().slice(0,10), time:'', type:'OPD' });
  };

  const accept = (token) => {
    setState(s => ({ ...s, appointments: s.appointments.map(a => a.token === token ? { ...a, status:'Confirmed' } : a) }));
    addAudit('Appointment ' + token + ' accepted', 'success');
    addNotif('Appointment ' + token + ' has been accepted by the doctor', 'success', 'Appointments');
    toast(' Appointment ' + token + ' accepted');
  };

  const reject = (token) => {
    setState(s => ({ ...s, appointments: s.appointments.map(a => a.token === token ? { ...a, status:'Cancelled' } : a) }));
    addAudit('Appointment ' + token + ' rejected', 'danger');
    addNotif('Appointment ' + token + ' was rejected', 'danger', 'Appointments');
    toast(' Appointment ' + token + ' rejected');
  };

  const cancel = (token) => {
    setState(s => ({ ...s, appointments: s.appointments.map(a => a.token === token ? { ...a, status:'Cancelled' } : a) }));
    addAudit('Appointment ' + token + ' cancelled', 'danger');
    toast(' Appointment cancelled');
  };

  const complete = (token) => {
    setState(s => ({ ...s, appointments: s.appointments.map(a => a.token === token ? { ...a, status:'Completed' } : a) }));
    addAudit('Appointment ' + token + ' completed', 'success');
    toast(' Marked as completed');
  };
  const removeAppt = (token) => {
    setState(s => ({ ...s, appointments: s.appointments.filter(a => a.token !== token) }));
    addAudit('Appointment ' + token + ' deleted', 'danger');
    toast(' Appointment deleted');
  };

  // Filter appointments by role
  const allAppts = state.appointments;
  const pending  = allAppts.filter(a => a.status === 'Pending');
  const myAppts  = role === 'Doctor'
    ? allAppts.filter(a => a.doctor === currentUser?.name)
    : role === 'Patient'
    ? allAppts.filter(a => a.patient === currentUser?.name)
    : allAppts;

  const displayed = tab === 'pending' ? pending : tab === 'mine' ? myAppts : allAppts;

  // Action buttons per role per status
  const actionBtns = (a) => {
    const delBtn = isAdmin
      ? <button onClick={() => removeAppt(a.token)} style={{padding:'3px 8px',borderRadius:6,border:'none',background:'#fee2e2',color:'#9b1c1c',fontSize:11,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>Delete</button>
      : null;
    // Accept / Reject  DOCTOR ONLY
    if (role === 'Doctor') {
      if (a.status === 'Pending')
        return (
          <div style={{display:'flex',gap:4}}>
            <button onClick={() => accept(a.token)} style={{padding:'3px 10px',borderRadius:6,border:'none',background:'#166534',color:'#fff',fontSize:11,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}> Accept</button>
            <button onClick={() => reject(a.token)} style={{padding:'3px 10px',borderRadius:6,border:'none',background:'#9b1c1c',color:'#fff',fontSize:11,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}> Reject</button>
          </div>
        );
      if (a.status === 'Confirmed')
        return <button onClick={() => complete(a.token)} style={{padding:'3px 10px',borderRadius:6,border:'1px solid #1a63c8',background:'#fff',color:'#1a63c8',fontSize:11,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>Complete</button>;
      return <span style={{color:'#9ca3af',fontSize:11}}>{a.status}</span>;
    }
    // Patient  show status text only
    if (role === 'Patient') {
      if (a.status === 'Pending')   return <span style={{color:'#92400e',fontSize:11,fontWeight:600}}> Awaiting Doctor</span>;
      if (a.status === 'Confirmed') return <span style={{color:'#166534',fontSize:11,fontWeight:600}}> Confirmed</span>;
      if (a.status === 'Completed') return <span style={{color:'#1a63c8',fontSize:11,fontWeight:600}}> Completed</span>;
      if (a.status === 'Cancelled') return <span style={{color:'#9b1c1c',fontSize:11,fontWeight:600}}> Cancelled</span>;
      return <span style={{color:'#9ca3af',fontSize:11}}>{a.status}</span>;
    }
    // Admin / Staff  view status, can Cancel confirmed, but NO Accept/Reject
    if (a.status === 'Pending')
      return isAdmin
        ? <div style={{display:'flex',gap:4,alignItems:'center'}}><span style={{color:'#92400e',fontSize:11,fontWeight:600}}> Awaiting Doctor</span>{delBtn}</div>
        : <span style={{color:'#92400e',fontSize:11,fontWeight:600}}> Awaiting Doctor</span>;
    if (a.status === 'Confirmed')
      return (
        <div style={{display:'flex',gap:4}}>
          <button onClick={() => complete(a.token)} style={{padding:'3px 8px',borderRadius:6,border:'1px solid #1a63c8',background:'#fff',color:'#1a63c8',fontSize:11,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>Complete</button>
          <button onClick={() => cancel(a.token)} style={{padding:'3px 8px',borderRadius:6,border:'none',background:'#fee2e2',color:'#9b1c1c',fontSize:11,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>Cancel</button>
          {delBtn}
        </div>
      );
    if (a.status === 'Completed') return isAdmin ? <div style={{display:'flex',gap:4,alignItems:'center'}}><span style={{color:'#166534',fontSize:11,fontWeight:600}}> Completed</span>{delBtn}</div> : <span style={{color:'#166534',fontSize:11,fontWeight:600}}> Completed</span>;
    if (a.status === 'Cancelled') return isAdmin ? <div style={{display:'flex',gap:4,alignItems:'center'}}><span style={{color:'#9b1c1c',fontSize:11,fontWeight:600}}> Cancelled</span>{delBtn}</div> : <span style={{color:'#9b1c1c',fontSize:11,fontWeight:600}}> Cancelled</span>;
    return <span style={{color:'#9ca3af',fontSize:11}}>{a.status}</span>;
  };

  const tabBtn = (id, label, count, color) => (
    <button onClick={() => setTab(id)} style={{
      padding:'6px 14px', borderRadius:8, border:'1px solid', fontFamily:'inherit',
      fontSize:12, fontWeight:600, cursor:'pointer',
      background: tab===id ? '#1a63c8' : '#fff',
      color:       tab===id ? '#fff'    : '#6b7280',
      borderColor: tab===id ? '#1a63c8' : '#e5e7eb',
    }}>
      {label} {count > 0 && <span style={{marginLeft:4,background:tab===id?'rgba(255,255,255,0.3)':color,color:tab===id?'#fff':'#fff',borderRadius:20,padding:'1px 7px',fontSize:10}}>{count}</span>}
    </button>
  );

  return (
    <div>
      {/* KPI row */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:14}}>
        <StatCard label='Total'     value={allAppts.length}                                       color='#1a63c8'/>
        <StatCard label='Pending'   value={pending.length}                                        color='#92400e'
          sub={pending.length > 0 ? 'Awaiting acceptance' : 'None waiting'}/>
        <StatCard label='Confirmed' value={allAppts.filter(a=>a.status==='Confirmed').length}     color='#166534'/>
        <StatCard label='Completed' value={allAppts.filter(a=>a.status==='Completed').length}     color='#1a63c8'/>
      </div>

      {/* Pending alert banner  Doctor only */}
      {pending.length > 0 && role === 'Doctor' && (
        <div style={{background:'#fef3c7',border:'1px solid #fde68a',borderRadius:10,padding:'12px 16px',marginBottom:14,display:'flex',alignItems:'center',gap:12}}>
          <span style={{fontSize:20}}></span>
          <div>
            <div style={{fontWeight:700,fontSize:13,color:'#92400e'}}>{pending.length} appointment{pending.length>1?'s':''} waiting for acceptance</div>
            <div style={{fontSize:12,color:'#92400e',marginTop:2}}>
              {pending.map(a => a.patient + '  ' + a.doctor).join('    ')}
            </div>
          </div>
          <button onClick={() => setTab('pending')} style={{marginLeft:'auto',padding:'6px 14px',borderRadius:8,border:'none',background:'#92400e',color:'#fff',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>
            Review Now
          </button>
        </div>
      )}

      {/* Tab bar + Book button */}
      <div style={{display:'flex',gap:8,marginBottom:14,alignItems:'center',flexWrap:'wrap'}}>
        {tabBtn('all',   'All Appointments', 0, '#1a63c8')}
        {tabBtn('pending',' Pending',       pending.length, '#92400e')}
        {(role === 'Doctor' || role === 'Patient') && tabBtn('mine', role==='Doctor'?'My Patients':'My Appointments', myAppts.length, '#166534')}
        <div style={{flex:1}}/>
        <button onClick={() => setShowAdd(true)} style={{padding:'7px 16px',borderRadius:8,border:'none',background:'#1a63c8',color:'#fff',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>
          + Book Appointment
        </button>
      </div>

      {/* Table */}
      <Card>
        <Table
          heads={['Token','Patient','Doctor','Dept','Date','Time','Type','Status','Action']}
          rows={displayed.map(a => [
            a.token,
            <span style={{fontWeight:500}}>{a.patient}</span>,
            a.doctor, a.dept, a.date,
            a.time || '',
            <Badge s={a.type}/>,
            <Badge s={a.status}/>,
            actionBtns(a)
          ])}
        />
        {displayed.length === 0 && (
          <div style={{textAlign:'center',padding:'24px',color:'#9ca3af',fontSize:13}}>
            {tab === 'pending' ? 'No pending appointments  all caught up! ' : 'No appointments found'}
          </div>
        )}
      </Card>

      {/* Book Modal */}
      {showAdd && (
        <Modal title='Book Appointment' onClose={() => setShowAdd(false)}>
          {role === 'Patient' && (
            <div style={{background:'#eff6ff',border:'1px solid #bfdbfe',borderRadius:8,padding:'10px 14px',marginBottom:12,fontSize:12,color:'#1a63c8'}}>
               Your appointment will be sent for doctor approval. You'll see it confirmed once accepted.
            </div>
          )}
          <Input label='Patient Name *' value={form.patient} onChange={f('patient')} />
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            <Sel label='Doctor'  value={form.doctor}  onChange={f('doctor')}  options={state.doctors.map(d => d.name)} />
            <Sel label='Type'    value={form.type}    onChange={f('type')}    options={['OPD','Follow-up','Emergency']} />
            <div style={{gridColumn:'1/-1'}}>
              <label style={{fontSize:10,fontWeight:700,color:'#6b7280',textTransform:'uppercase',letterSpacing:'0.05em',display:'block',marginBottom:4}}>Date *</label>
              <input type='date' value={form.date} min={new Date().toISOString().slice(0,10)}
                onChange={e=>setForm(p=>({...p,date:e.target.value,time:''}))}
                style={{width:'100%',padding:'8px 10px',border:'1px solid #dde2eb',borderRadius:8,fontSize:13,fontFamily:'inherit',boxSizing:'border-box'}} />
            </div>
            <div style={{gridColumn:'1/-1'}}>
              <label style={{fontSize:10,fontWeight:700,color:'#6b7280',textTransform:'uppercase',letterSpacing:'0.05em',display:'block',marginBottom:6}}>
                Available Time Slots
                {form.date && <span style={{fontSize:10,color:'#9ca3af',marginLeft:6,fontWeight:400}}>
                  {new Date(form.date).toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'short'})}
                </span>}
              </label>
              {!form.date
                ? <div style={{fontSize:12,color:'#9ca3af',padding:'10px 0'}}>Please select a date first</div>
                : (() => {
                    const now        = new Date();
                    const selDate    = new Date(form.date);
                    const isToday    = selDate.toDateString() === now.toDateString();
                    const nowHour    = now.getHours();
                    const nowMin     = now.getMinutes();
                    const slots      = ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30'];
                    const bookedSlots= state.appointments
                      .filter(a => {
                        const aDate = new Date(form.date).toLocaleDateString('en-IN',{day:'2-digit',month:'short'});
                        return a.doctor===form.doctor && a.date===aDate && a.status!=='Cancelled';
                      })
                      .map(a => a.time);
                    return (
                      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:6}}>
                        {slots.map(slot => {
                          const [h,m]  = slot.split(':').map(Number);
                          const isPast = isToday && (h < nowHour || (h === nowHour && m <= nowMin));
                          const isNow  = isToday && h === nowHour;
                          const isBook = bookedSlots.includes(slot);
                          const isSel  = form.time === slot;
                          const disabled = isPast || isBook;
                          return (
                            <button key={slot} disabled={disabled} onClick={()=>!disabled&&setForm(p=>({...p,time:slot}))}
                              style={{
                                padding:'7px 4px', borderRadius:7, fontSize:11.5, fontWeight:600,
                                cursor:disabled?'not-allowed':'pointer', fontFamily:'inherit',
                                border: isSel ? '2px solid #1a63c8' : '1px solid #dde2eb',
                                background: isSel ? '#1a63c8' : isBook ? '#f3f4f6' : isPast ? '#f9fafb' : isNow ? '#fffbeb' : '#fff',
                                color:  isSel ? '#fff' : isBook ? '#9ca3af' : isPast ? '#d1d5db' : isNow ? '#92400e' : '#374151',
                                opacity: disabled ? 0.6 : 1,
                                textDecoration: isPast ? 'line-through' : 'none',
                                position:'relative'
                              }}>
                              {slot}
                              {isNow && !isPast && !isBook && !isSel && <span style={{position:'absolute',top:1,right:2,fontSize:7,color:'#92400e'}}>now</span>}
                              {isBook && <span style={{display:'block',fontSize:9,color:'#9ca3af',marginTop:1}}>booked</span>}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })()
              }
              {form.time && <div style={{marginTop:8,fontSize:12,color:'#1a63c8',fontWeight:600}}> Selected: {form.time}</div>}
            </div>
          </div>
          <div style={{display:'flex',gap:8,marginTop:12}}>
            <Btn primary onClick={handleAdd}>{role === 'Patient' ? 'Request Appointment' : 'Book Appointment'}</Btn>
            <Btn onClick={() => setShowAdd(false)}>Cancel</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

function RecordsPage({ state, setState, toast, addAudit, currentUser }) {
  const isPatient = currentUser?.role === 'Patient';
  const isAdmin = currentUser?.role === "Admin";
  const [showAdd, setShowAdd] = useState(false);
  const [viewId, setViewId] = useState(null);
  const [form, setForm] = useState({ patient:"", age:"", doctor:"", diagnosis:"", prescription:"", notes:"" });
  const f = k => v => setForm(p=>({...p,[k]:v}));
  const viewR = viewId ? state.records.find(r=>r.id===viewId) : null;

  const handleAdd = () => {
    if(!form.diagnosis){toast("Diagnosis required");return;}
    const nums = state.records.map(r=>parseInt(r.id.replace(/\D/g,""))).filter(n=>!isNaN(n));
    const id = "R-"+(Math.max(0,...nums)+1);
    setState(s=>({...s,records:[...s.records,{id,patient:form.patient||"Unknown",age:parseInt(form.age)||0,doctor:form.doctor||"",diagnosis:form.diagnosis,prescription:form.prescription,notes:form.notes,date:today()}]}));
    addAudit(`EMR ${id} created`,"info");
    setShowAdd(false); setForm({patient:"",age:"",doctor:"",diagnosis:"",prescription:"",notes:""});
    toast(` Record ${id} saved!`);
  };
  const handleDelete = id => {
    setState(s => ({ ...s, records: s.records.filter(r => r.id !== id) }));
    addAudit(`EMR ${id} deleted`, "danger");
    toast(` Record ${id} deleted`);
  };

  return (
    <div>
      {(!currentUser || currentUser.role !== 'Patient') && (<div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}><Btn primary onClick={()=>setShowAdd(true)}>+ New Record</Btn></div>)}
      <Card>
        <Table heads={["ID","Patient","Age","Diagnosis","Doctor","Date","Action"]}
          rows={state.records.map(r=>[r.id,r.patient,r.age,r.diagnosis,r.doctor,r.date,
            <div style={{display:"flex",gap:4}}>
              <Btn small onClick={()=>setViewId(r.id)}>View EMR</Btn>
              {isAdmin && <Btn small danger onClick={()=>handleDelete(r.id)}>Delete</Btn>}
            </div>
          ])} />
      </Card>
      {showAdd && (
        <Modal title="New Medical Record" onClose={()=>setShowAdd(false)} wide={520}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Input label="Patient Name" value={form.patient} onChange={f("patient")} />
            <Input label="Age" type="number" value={form.age} onChange={f("age")} />
            <Input label="Doctor" value={form.doctor} onChange={f("doctor")} />
          </div>
          <Input label="Diagnosis *" value={form.diagnosis} onChange={f("diagnosis")} />
          <Input label="Prescription" value={form.prescription} onChange={f("prescription")} />
          <Input label="Notes" value={form.notes} onChange={f("notes")} />
          <div style={{display:"flex",gap:8,marginTop:8}}><Btn primary onClick={handleAdd}>Save Record</Btn><Btn onClick={()=>setShowAdd(false)}>Cancel</Btn></div>
        </Modal>
      )}
      {viewR && (
        <Modal title={`Medical Record  ${viewR.id}`} onClose={()=>setViewId(null)} wide={500}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,fontSize:13}}>
            {[["Patient",viewR.patient],["Age",viewR.age],["Doctor",viewR.doctor],["Date",viewR.date]].map(([k,v])=>
              <div key={k}><div style={{fontSize:10,color:"#6b7280",fontWeight:700,textTransform:"uppercase",marginBottom:2}}>{k}</div><div>{v}</div></div>)}
          </div>
          <div style={{marginTop:12}}><div style={{fontSize:10,color:"#6b7280",fontWeight:700,textTransform:"uppercase",marginBottom:4}}>Diagnosis</div><div style={{fontWeight:600,fontSize:13}}>{viewR.diagnosis}</div></div>
          <div style={{marginTop:10}}><div style={{fontSize:10,color:"#6b7280",fontWeight:700,textTransform:"uppercase",marginBottom:4}}>Prescription</div><div style={{fontSize:13}}>{viewR.prescription||""}</div></div>
          {viewR.notes&&<div style={{marginTop:10}}><div style={{fontSize:10,color:"#6b7280",fontWeight:700,textTransform:"uppercase",marginBottom:4}}>Notes</div><div style={{fontSize:13}}>{viewR.notes}</div></div>}
          <div style={{marginTop:16,textAlign:"right"}}><Btn onClick={()=>setViewId(null)}>Close</Btn></div>
        </Modal>
      )}
    </div>
  );
}

function LabPage({ state, setState, toast, addAudit, currentUser }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ patient:"", test:"CBC", orderedBy:"" });
  const isAdmin = currentUser?.role === "Admin";
  const f = k => v => setForm(p=>({...p,[k]:v}));
  const tests = ["CBC","ECG","MRI Brain","X-Ray","Urine Culture","HbA1c","Lipid Panel","CT Scan","Blood Sugar"];

  const handleAdd = () => {
    if(!form.patient){toast("Patient required");return;}
    const nums = state.labReports.map(l=>parseInt(l.id.replace(/\D/g,""))).filter(n=>!isNaN(n));
    const id = "L-"+(Math.max(0,...nums)+1);
    setState(s=>({...s,labReports:[...s.labReports,{id,patient:form.patient,test:form.test,orderedBy:form.orderedBy||"",date:today().slice(0,6),status:"Pending"}]}));
    addAudit(`Lab ${id} ordered  ${form.test}`,"warning");
    setShowAdd(false); setForm({patient:"",test:"CBC",orderedBy:""});
    toast(` Lab test ${id} ordered!`);
  };
  const handleDelete = id => {
    setState(s => ({ ...s, labReports: s.labReports.filter(l => l.id !== id) }));
    addAudit(`Lab ${id} deleted`, "danger");
    toast(` Lab test ${id} deleted`);
  };

  return (
    <div>
      {(!currentUser || currentUser.role !== 'Patient') && (<div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}><Btn primary onClick={()=>setShowAdd(true)}>+ Order Lab Test</Btn></div>)}
      <Card>
        <Table heads={["ID","Patient","Test","Ordered By","Date","Status", ...(isAdmin ? ["Action"] : [])]}
          rows={state.labReports.map(l=>[
            l.id,l.patient,l.test,l.orderedBy,l.date,<Badge s={l.status}/>,
            ...(isAdmin ? [<Btn small danger onClick={()=>handleDelete(l.id)}>Delete</Btn>] : [])
          ])} />
      </Card>
      {showAdd && (
        <Modal title="Order Lab Test" onClose={()=>setShowAdd(false)}>
          <Input label="Patient Name *" value={form.patient} onChange={f("patient")} />
          <Sel label="Test Type" value={form.test} onChange={f("test")} options={tests} />
          <Input label="Ordered By" value={form.orderedBy} onChange={f("orderedBy")} placeholder="Dr. Mehta" />
          <div style={{display:"flex",gap:8,marginTop:8}}><Btn primary onClick={handleAdd}>Order</Btn><Btn onClick={()=>setShowAdd(false)}>Cancel</Btn></div>
        </Modal>
      )}
    </div>
  );
}

function PharmacyPage({ state, setState, toast, addAudit, currentUser }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name:"", cat:"Analgesic", mfg:"", stock:"", reorder:"100", price:"", expiry:"" });
  const f = k => v => setForm(p=>({...p,[k]:v}));
  const isDoctor = currentUser?.role === 'Doctor';
  const isAdmin = currentUser?.role === "Admin";
  const canManagePharmacy = !currentUser || !['Patient','Doctor'].includes(currentUser.role);
  const getStatus = m => m.stock <= 0 ? "Out of Stock" : m.stock < m.reorder ? "Low Stock" : "In Stock";

  const handleAdd = () => {
    if(!form.name){toast("Name required");return;}
    setState(s=>({...s,pharmacy:[...s.pharmacy,{name:form.name,cat:form.cat,mfg:form.mfg,stock:parseInt(form.stock)||0,reorder:parseInt(form.reorder)||100,price:parseFloat(form.price)||0,expiry:form.expiry||""}]}));
    addAudit(`${form.name} added to pharmacy`,"success");
    setShowAdd(false); setForm({name:"",cat:"Analgesic",mfg:"",stock:"",reorder:"100",price:"",expiry:""});
    toast(" Medicine added!");
  };
  const dispense = i => {
    setState(s=>({...s,pharmacy:s.pharmacy.map((m,idx)=>idx===i?{...m,stock:Math.max(0,m.stock-1)}:m)}));
    toast(" 1 unit dispensed");
  };
  const handleDelete = i => {
    const med = state.pharmacy[i];
    setState(s => ({ ...s, pharmacy: s.pharmacy.filter((_, idx) => idx !== i) }));
    addAudit(`${med?.name || "Medicine"} removed from pharmacy`, "danger");
    toast(" Medicine deleted");
  };

  return (
    <div>
      {canManagePharmacy && (<div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}><Btn primary onClick={()=>setShowAdd(true)}>+ Add Medicine</Btn></div>)}
      <Card>
        <Table heads={["Name","Category","Manufacturer","Stock","Reorder","Expiry","Price","Status", ...(isDoctor ? [] : ["Action"])]}
          rows={state.pharmacy.map((m,i)=>[m.name,m.cat,m.mfg,<strong>{m.stock}</strong>,m.reorder,m.expiry,rupee(m.price),<Badge s={getStatus(m)}/>,
            ...(isDoctor ? [] : [canManagePharmacy
              ? <div style={{display:"flex",gap:4}}>
                  {m.stock<m.reorder ? <Btn small danger onClick={()=>toast("Reorder sent!")}>Reorder</Btn> : <Btn small onClick={()=>dispense(i)}>Dispense</Btn>}
                  {isAdmin && <Btn small danger onClick={()=>handleDelete(i)}>Delete</Btn>}
                </div>
              : <span style={{color:'#9ca3af',fontSize:11}}>View only</span>])])} />
      </Card>
      {showAdd && (
        <Modal title="Add Medicine" onClose={()=>setShowAdd(false)} wide={480}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div style={{gridColumn:"1/-1"}}><Input label="Medicine Name *" value={form.name} onChange={f("name")} /></div>
            <Sel label="Category" value={form.cat} onChange={f("cat")} options={["Analgesic","Antibiotic","Anti-Diabetic","Antiemetic","Lipid-Lowering","Other"]} />
            <Input label="Manufacturer" value={form.mfg} onChange={f("mfg")} />
            <Input label="Stock (units)" type="number" value={form.stock} onChange={f("stock")} />
            <Input label="Price ()" type="number" value={form.price} onChange={f("price")} />
          </div>
          <div style={{display:"flex",gap:8,marginTop:8}}><Btn primary onClick={handleAdd}>Add</Btn><Btn onClick={()=>setShowAdd(false)}>Cancel</Btn></div>
        </Modal>
      )}
    </div>
  );
}

function SurgeryPage({ state, setState, toast, addAudit, currentUser }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ patient:"", procedure:"", surgeon:"Dr. Rajesh Mehta", ot:"OT-1", date:"", time:"" });
  const f = k => v => setForm(p=>({...p,[k]:v}));
  const isAdmin = currentUser?.role === "Admin";

  const handleAdd = () => {
    if(!form.procedure){toast("Procedure required");return;}
    const nums = state.surgeries.map(s=>parseInt(s.id.replace(/\D/g,""))).filter(n=>!isNaN(n));
    const id = "SG-"+String(Math.max(0,...nums)+1).padStart(3,"0");
    const ds = form.date ? new Date(form.date).toLocaleDateString("en-IN",{day:"2-digit",month:"short"})+(form.time?", "+form.time:"") : today().slice(0,6);
    setState(s=>({...s,surgeries:[...s.surgeries,{id,patient:form.patient||"",procedure:form.procedure,surgeon:form.surgeon,ot:form.ot,datetime:ds,status:"Scheduled"}]}));
    addAudit(`Surgery ${id} scheduled`,"info");
    setShowAdd(false); toast(` Surgery ${id} scheduled!`);
  };
  const handleDelete = id => {
    setState(s => ({ ...s, surgeries: s.surgeries.filter(x => x.id !== id) }));
    addAudit(`Surgery ${id} deleted`, "danger");
    toast(` Surgery ${id} deleted`);
  };

  return (
    <div>
      {(!currentUser || currentUser.role !== 'Patient') && (<div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}><Btn primary onClick={()=>setShowAdd(true)}>+ Schedule Surgery</Btn></div>)}
      <Card>
        <Table heads={["ID","Patient","Procedure","Surgeon","OT","Date/Time","Status", ...(isAdmin ? ["Action"] : [])]}
          rows={state.surgeries.map(s=>[
            s.id,s.patient,s.procedure,s.surgeon,s.ot,s.datetime,<Badge s={s.status}/>,
            ...(isAdmin ? [<Btn small danger onClick={()=>handleDelete(s.id)}>Delete</Btn>] : [])
          ])} />
      </Card>
      {showAdd && (
        <Modal title="Schedule Surgery" onClose={()=>setShowAdd(false)}>
          <Input label="Patient Name" value={form.patient} onChange={f("patient")} />
          <Input label="Procedure *" value={form.procedure} onChange={f("procedure")} placeholder="e.g. Appendectomy" />
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Sel label="Surgeon" value={form.surgeon} onChange={f("surgeon")} options={state.doctors.map(d=>d.name)} />
            <Sel label="OT Room" value={form.ot} onChange={f("ot")} options={["OT-1","OT-2","OT-3","OT-4"]} />
            <Input label="Date" type="date" value={form.date} onChange={f("date")} />
            <Input label="Time" type="time" value={form.time} onChange={f("time")} />
          </div>
          <div style={{display:"flex",gap:8,marginTop:8}}><Btn primary onClick={handleAdd}>Schedule</Btn><Btn onClick={()=>setShowAdd(false)}>Cancel</Btn></div>
        </Modal>
      )}
    </div>
  );
}

function WardsPage({ state, setState, toast, currentUser }) {
  const [showAssign, setShowAssign] = useState(false);
  const [showAddWard, setShowAddWard] = useState(false);
  const [form, setForm] = useState({ wardName:"", patient:"", admType:"Regular" });
  const [wardForm, setWardForm] = useState({ name:"", type:"General", beds:"", rate:"" });
  const isAdmin = currentUser?.role === "Admin";
  const f = k => v => setForm(p=>({...p,[k]:v}));
  const wf = k => v => setWardForm(p=>({...p,[k]:v}));
  const totBeds = state.wards.reduce((s,w)=>s+w.beds,0);
  const totOcc  = state.wards.reduce((s,w)=>s+w.occupied,0);

  const handleAssign = () => {
    if(!form.wardName||!form.patient){toast("Select ward and enter patient");return;}
    setState(s=>({...s,wards:s.wards.map(w=>w.name===form.wardName&&w.occupied<w.beds?{...w,occupied:w.occupied+1}:w)}));
    setShowAssign(false); toast(` Bed assigned in ${form.wardName} to ${form.patient}`);
  };
  const handleDelete = wardName => {
    setState(s => ({ ...s, wards: s.wards.filter(w => w.name !== wardName) }));
    toast(` ${wardName} deleted`);
  };
  const handleAddWard = () => {
    if(!wardForm.name){toast("Ward name required");return;}
    const beds = parseInt(wardForm.beds) || 0;
    if (beds <= 0) { toast("Beds must be greater than 0"); return; }
    const rate = parseInt(wardForm.rate) || 0;
    setState(s => ({ ...s, wards: [...s.wards, { name: wardForm.name, type: wardForm.type, beds, occupied:0, rate }] }));
    setShowAddWard(false);
    setWardForm({ name:"", type:"General", beds:"", rate:"" });
    toast(` ${wardForm.name} added`);
  };

  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:12}}>
        <StatCard label="Total Beds" value={totBeds} color="#1a63c8"/>
        <StatCard label="Occupied" value={totOcc} color="#92400e"/>
        <StatCard label="Available" value={totBeds-totOcc} color="#166534"/>
      </div>
      {(!currentUser || currentUser.role !== 'Patient') && (
        <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginBottom:12}}>
          {isAdmin && <Btn onClick={()=>setShowAddWard(true)}>+ Add Ward</Btn>}
          <Btn primary onClick={()=>setShowAssign(true)}>+ Assign Bed</Btn>
        </div>
      )}
      <Card>
        <Table heads={["Ward","Type","Beds","Occupied","Available","Rate/Day","Occupancy","Status", ...(isAdmin ? ["Action"] : [])]}
          rows={state.wards.map(w=>{
            const pct=Math.round((w.occupied/w.beds)*100);
            const st=pct>=90?"Full":pct>=70?"High":"Available";
            return [w.name,w.type,w.beds,w.occupied,w.beds-w.occupied,rupee(w.rate),
              <div style={{width:80}}><ProgressBar pct={pct} color={pct>=90?"#9b1c1c":pct>=70?"#92400e":"#166534"}/><div style={{fontSize:10,color:"#6b7280",marginTop:2}}>{pct}%</div></div>,
              <Badge s={st}/>,
              ...(isAdmin ? [<Btn small danger onClick={()=>handleDelete(w.name)}>Delete</Btn>] : [])
            ];
          })} />
      </Card>
      {showAssign && (
        <Modal title="Assign Bed" onClose={()=>setShowAssign(false)}>
          <Sel label="Ward *" value={form.wardName} onChange={f("wardName")} options={["select",...state.wards.filter(w=>w.occupied<w.beds).map(w=>w.name)]} />
          <Input label="Patient Name *" value={form.patient} onChange={f("patient")} placeholder="Patient name or ID" />
          <Sel label="Admission Type" value={form.admType} onChange={f("admType")} options={["Regular","Emergency","Post-Op","ICU Transfer"]} />
          <div style={{display:"flex",gap:8,marginTop:8}}><Btn primary onClick={handleAssign}>Assign Bed</Btn><Btn onClick={()=>setShowAssign(false)}>Cancel</Btn></div>
        </Modal>
      )}
      {showAddWard && (
        <Modal title="Add Ward" onClose={()=>setShowAddWard(false)}>
          <Input label="Ward Name *" value={wardForm.name} onChange={wf("name")} />
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Sel label="Type" value={wardForm.type} onChange={wf("type")} options={["General","ICU","NICU","Private","Semi-Private","Maternity"]} />
            <Input label="Beds *" type="number" value={wardForm.beds} onChange={wf("beds")} />
            <Input label="Rate/Day ()" type="number" value={wardForm.rate} onChange={wf("rate")} />
          </div>
          <div style={{display:"flex",gap:8,marginTop:8}}><Btn primary onClick={handleAddWard}>Add Ward</Btn><Btn onClick={()=>setShowAddWard(false)}>Cancel</Btn></div>
        </Modal>
      )}
    </div>
  );
}

function BloodBankPage({ state, setState, toast, addAudit, addNotif, currentUser }) {
  const [showDonor, setShowDonor] = useState(false);
  const [showReq, setShowReq]     = useState(false);
  const [viewDonor, setViewDonor] = useState(null);
  const [form,    setForm]   = useState({ name:"", phone:"", altPhone:"", bg:"A+", units:"1", age:"", email:"", address:"" });
  const [rForm,   setRForm]  = useState({ patient:"", bg:"A+", units:"1", priority:"Normal", contactPhone:"" });
  const rf = k => v => setForm(p=>({...p,[k]:v}));
  const rrf = k => v => setRForm(p=>({...p,[k]:v}));
  const order = ["A+","B+","O+","AB+","A-","B-","O-","AB-"];
  const isDoctor = currentUser?.role === 'Doctor';
  const isAdmin = currentUser?.role === "Admin";
  const canManageBloodBank = !currentUser || !['Patient','Doctor'].includes(currentUser.role);

  const handleDonor = () => {
    if(!form.name){toast("Donor name required");return;}
    if(!form.phone){toast("Phone required");return;}
    const u = parseInt(form.units)||1;
    setState(s=>({...s,donors:[{name:form.name,phone:form.phone,altPhone:form.altPhone,bg:form.bg,units:u,date:today(),status:"Testing",age:form.age,email:form.email,address:form.address},...s.donors],bloodStock:{...s.bloodStock,[form.bg]:(s.bloodStock[form.bg]||0)+u}}));
    addAudit(`Blood donation by ${form.name} (${form.bg}, ${u}u)`,"success");
    addNotif(`Donor ${form.name}  +${u}u ${form.bg}`,"success","Blood Bank");
    setShowDonor(false); setForm({name:"",phone:"",altPhone:"",bg:"A+",units:"1",age:"",email:"",address:""});
    toast(` Donor registered! +${u} units of ${form.bg}`);
  };
  const handleReq = () => {
    const u = parseInt(rForm.units)||1;
    const cur = state.bloodStock[rForm.bg]||0;
    if(!rForm.patient){toast("Enter patient name");return;}
    if(cur<u){toast(` Only ${cur} units of ${rForm.bg} available!`);return;}
    setState(s=>({...s,bloodStock:{...s.bloodStock,[rForm.bg]:s.bloodStock[rForm.bg]-u}}));
    addAudit(`Blood issued: ${u}u ${rForm.bg}  ${rForm.patient}`,"info");
    if(cur-u<6) addNotif(` ${rForm.bg} critically low  ${cur-u}u left`,"danger","Blood Bank");
    setShowReq(false); toast(` ${u}u of ${rForm.bg} issued to ${rForm.patient}`);
  };
  const removeDonor = i => {
    const donor = state.donors[i];
    setState(s => ({
      ...s,
      donors: s.donors.filter((_, idx) => idx !== i),
      bloodStock: donor
        ? { ...s.bloodStock, [donor.bg]: Math.max(0, (s.bloodStock[donor.bg] || 0) - (parseInt(donor.units) || 0)) }
        : s.bloodStock
    }));
    addAudit(`Donor ${donor?.name || ""} deleted`, "danger");
    toast(" Donor deleted");
  };

  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
        {order.map(bg=>{
          const u=state.bloodStock[bg]||0,low=u<12,crit=u<6;
          return(
            <div key={bg} style={{background:"#fff",border:`1px solid ${crit?"#fca5a5":low?"#fde68a":"#e5e7eb"}`,borderRadius:10,padding:"12px 8px",textAlign:"center"}}>
              <div style={{fontSize:20,fontWeight:800,color:crit?"#9b1c1c":low?"#92400e":"#1a1d24"}}>{bg}</div>
              <div style={{fontSize:11,color:crit?"#9b1c1c":low?"#92400e":"#6b7280",marginTop:4}}>{u} units{crit?" ":low?" ":""}</div>
              <ProgressBar pct={Math.min(100,Math.round((u/50)*100))} color={crit?"#9b1c1c":low?"#92400e":"#166534"}/>
            </div>
          );
        })}
      </div>
      {canManageBloodBank && (
        <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginBottom:12}}>
          <Btn onClick={()=>setShowReq(true)}> Request Blood</Btn>
          <Btn primary onClick={()=>setShowDonor(true)}>+ Register Donor</Btn>
        </div>
      )}
      <Card>
        <div style={{fontWeight:700,fontSize:13,marginBottom:10}}>Donor Records ({state.donors.length})</div>
        <Table heads={["Donor"," Primary Phone","Alt Phone","Blood Group","Units","Date","Status", ...(isDoctor ? [] : ["Action"])]}
          rows={state.donors.map((d,i)=>[d.name,d.phone||"",d.altPhone||"",<strong style={{color:"#9b1c1c"}}>{d.bg}</strong>,d.units,d.date,<Badge s={d.status}/>,
            ...(isDoctor ? [] : [
              <div style={{display:"flex",gap:4}}>
                <Btn small onClick={()=>setViewDonor(d)}>View</Btn>
                {isAdmin && <Btn small danger onClick={()=>removeDonor(i)}>Delete</Btn>}
              </div>
            ])])} />
      </Card>

      {showDonor && (
        <Modal title="Register Blood Donor" onClose={()=>setShowDonor(false)} wide={480}>
          <Input label="Full Name *" value={form.name} onChange={rf("name")} placeholder="Aditya Sharma" />
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Input label="Primary Phone *" value={form.phone} onChange={rf("phone")} placeholder="+91 98765 43210" />
            <Input label="Alternate Phone" value={form.altPhone} onChange={rf("altPhone")} placeholder="+91 87654 32109" />
            <Sel label="Blood Group *" value={form.bg} onChange={rf("bg")} options={order} />
            <Input label="Units" type="number" value={form.units} onChange={rf("units")} />
            <Input label="Age" type="number" value={form.age} onChange={rf("age")} />
            <Input label="Email" value={form.email} onChange={rf("email")} />
          </div>
          <Input label="Address" value={form.address} onChange={rf("address")} />
          <div style={{display:"flex",gap:8,marginTop:8}}><Btn primary onClick={handleDonor}>Register</Btn><Btn onClick={()=>setShowDonor(false)}>Cancel</Btn></div>
        </Modal>
      )}

      {showReq && (
        <Modal title="Request / Issue Blood" onClose={()=>setShowReq(false)}>
          <Input label="Patient Name *" value={rForm.patient} onChange={rrf("patient")} />
          <Input label="Contact Phone" value={rForm.contactPhone} onChange={rrf("contactPhone")} />
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Sel label="Blood Group" value={rForm.bg} onChange={rrf("bg")} options={order} />
            <Input label="Units" type="number" value={rForm.units} onChange={rrf("units")} />
            <Sel label="Priority" value={rForm.priority} onChange={rrf("priority")} options={["Normal","Urgent","Critical"]} />
          </div>
          <div style={{padding:"10px 14px",borderRadius:8,background:(state.bloodStock[rForm.bg]||0)<parseInt(rForm.units||"1")?"#fef2f2":"#f0fdf4",marginBottom:10,fontSize:12.5,fontWeight:600,color:(state.bloodStock[rForm.bg]||0)<parseInt(rForm.units||"1")?"#9b1c1c":"#166534"}}>
            Available: {state.bloodStock[rForm.bg]||0} units of {rForm.bg}
          </div>
          <div style={{display:"flex",gap:8}}><Btn primary onClick={handleReq}>Issue Blood</Btn><Btn onClick={()=>setShowReq(false)}>Cancel</Btn></div>
        </Modal>
      )}

      {viewDonor && (
        <Modal title="Donor Details" onClose={()=>setViewDonor(null)}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,fontSize:13}}>
            {[["Name",viewDonor.name],["Blood Group",<strong style={{color:"#9b1c1c",fontSize:16}}>{viewDonor.bg}</strong>],["Primary Phone",viewDonor.phone||""],["Alt Phone",viewDonor.altPhone||""],["Age",viewDonor.age||""],["Email",viewDonor.email||""],["Units Donated",viewDonor.units],["Date",viewDonor.date],["Status",<Badge s={viewDonor.status}/>]].map(([k,v])=>
              <div key={k}><div style={{fontSize:10,color:"#6b7280",fontWeight:700,textTransform:"uppercase",marginBottom:2}}>{k}</div><div style={{fontWeight:500}}>{v}</div></div>)}
            {viewDonor.address&&<div style={{gridColumn:"1/-1"}}><div style={{fontSize:10,color:"#6b7280",fontWeight:700,textTransform:"uppercase",marginBottom:2}}>Address</div><div>{viewDonor.address}</div></div>}
          </div>
          <div style={{marginTop:16,textAlign:"right"}}><Btn onClick={()=>setViewDonor(null)}>Close</Btn></div>
        </Modal>
      )}
    </div>
  );
}

function StaffPage({ state, setState, toast, addAudit, currentUser }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId]   = useState(null);
  const [form, setForm] = useState({ name:"", role:"Nurse", dept:"OPD", shift:"Morning", salary:"", phone:"", status:"Active" });
  const f = k => v => setForm(p=>({...p,[k]:v}));
  const isDoctor = currentUser?.role === 'Doctor';
  const isAdmin = currentUser?.role === "Admin";

  const handleAdd = () => {
    if(!form.name){toast("Name required");return;}
    const nums = state.staff.map(s=>parseInt(s.id.replace(/\D/g,""))).filter(n=>!isNaN(n));
    const id = "ST-"+String(Math.max(0,...nums)+1).padStart(3,"0");
    setState(s=>({...s,staff:[...s.staff,{...form,id,salary:parseInt(form.salary)||0}]}));
    addAudit(`Staff ${id} registered  ${form.role}`,"success");
    setShowAdd(false); toast(` ${form.name} added!`);
  };
  const handleEdit = () => {
    setState(s=>({...s,staff:s.staff.map(x=>x.id===editId?{...x,...form,salary:parseInt(form.salary)||x.salary}:x)}));
    addAudit(`Staff ${editId} updated`,"info");
    setEditId(null); toast(" Staff updated");
  };
  const openEdit = id => { const s=state.staff.find(x=>x.id===id); setForm({name:s.name,role:s.role,dept:s.dept,shift:s.shift,salary:String(s.salary),phone:s.phone,status:s.status}); setEditId(id); };
  const handleDelete = id => {
    setState(s => ({ ...s, staff: s.staff.filter(x => x.id !== id) }));
    addAudit(`Staff ${id} deleted`, "danger");
    toast(` Staff ${id} deleted`);
  };

  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:12}}>
        <StatCard label="Total Staff" value={state.staff.length} color="#1a63c8"/>
        <StatCard label="Active" value={state.staff.filter(s=>s.status==="Active").length} color="#166534"/>
        <StatCard label="On Leave" value={state.staff.filter(s=>s.status==="On Leave").length} color="#92400e"/>
      </div>
      {(!currentUser || (currentUser.role !== 'Patient' && !isDoctor)) && (<div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}><Btn primary onClick={()=>setShowAdd(true)}>+ Add Staff</Btn></div>)}
      <Card>
        <Table
          heads={['Patient','Doctor','Staff'].includes(currentUser?.role)
            ? ['ID','Name','Role','Dept','Shift','Phone','Status', ...(isDoctor ? [] : ['Action'])]
            : ['ID','Name','Role','Dept','Shift','Salary','Phone','Status','Action']}
          rows={state.staff.map(s=>['Patient','Doctor','Staff'].includes(currentUser?.role)
            ? [s.id,s.name,s.role,s.dept,s.shift,s.phone,<Badge s={s.status}/>,
               ...(isDoctor ? [] : [currentUser?.role==='Patient'?<span style={{color:'#9ca3af',fontSize:11}}></span>:<Btn small onClick={()=>openEdit(s.id)}>Edit</Btn>])]
            : [s.id,s.name,s.role,s.dept,s.shift,rupee(s.salary),s.phone,<Badge s={s.status}/>,
               <div style={{display:"flex",gap:4}}>
                 <Btn small onClick={()=>openEdit(s.id)}>Edit</Btn>
                 {isAdmin && <Btn small danger onClick={()=>handleDelete(s.id)}>Delete</Btn>}
               </div>])} />
      </Card>

      {/* Staff Attendance */}
      <Card>
        <div style={{fontWeight:700,fontSize:13,marginBottom:4}}>Staff Attendance  Today</div>
        <div style={{fontSize:11.5,color:'#6b7280',marginBottom:12}}>{new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</div>
        <Table heads={['ID','Name','Role','Department','Shift','Status','Attendance', ...(isDoctor ? [] : ['Action'])]}
          rows={state.staff.map((s,i)=>{
            const present = s.status==='Active';
            const onLeave = s.status==='On Leave';
            return [
              s.id, s.name, s.role, s.dept, s.shift,
              <Badge s={s.status}/>,
              present ? <span style={{color:'#166534',fontWeight:600}}> Present</span>
                : onLeave ? <span style={{color:'#92400e',fontWeight:600}}> On Leave</span>
                : <span style={{color:'#9b1c1c',fontWeight:600}}> Absent</span>,
              ...(isDoctor ? [] : [(currentUser?.role==='Patient'||currentUser?.role==='Staff')
                ? <span style={{color:'#9ca3af',fontSize:11}}></span>
                : <div style={{display:'flex',gap:4}}>
                    <Btn small onClick={()=>{setState(s2=>({...s2,staff:s2.staff.map((x,j)=>j===i?{...x,status:'Active'}:x)}));toast(' Marked Present');}}>Present</Btn>
                    <Btn small danger onClick={()=>{setState(s2=>({...s2,staff:s2.staff.map((x,j)=>j===i?{...x,status:'On Leave'}:x)}));toast(' Marked Absent');}}>Absent</Btn>
                  </div>])
            ];
          })} />
      </Card>
      {(showAdd||editId) && (
        <Modal title={editId?`Edit Staff  ${editId}`:"Add New Staff"} onClose={()=>{setShowAdd(false);setEditId(null);}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div style={{gridColumn:"1/-1"}}><Input label="Full Name *" value={form.name} onChange={f("name")} /></div>
            <Sel label="Role" value={form.role} onChange={f("role")} options={["Head Nurse","Nurse","Lab Technician","Pharmacist","Receptionist","Ambulance Driver","Housekeeping"]} />
            <Sel label="Department" value={form.dept} onChange={f("dept")} options={["ICU","OPD","Emergency","Pharmacy","Pathology","Ward A","Ward B","General"]} />
            <Sel label="Shift" value={form.shift} onChange={f("shift")} options={["Morning","Evening","Night"]} />
            <Input label="Phone" value={form.phone} onChange={f("phone")} />
            {currentUser?.role==='Admin' && <Input label="Salary ()" type="number" value={form.salary} onChange={f("salary")} />}
            {currentUser?.role==='Admin' && <Sel label="Status" value={form.status} onChange={f("status")} options={["Active","On Leave","Off Duty"]} />}
          </div>
          <div style={{display:"flex",gap:8,marginTop:8}}><Btn primary onClick={editId?handleEdit:handleAdd}>{editId?"Save":"Add Staff"}</Btn><Btn onClick={()=>{setShowAdd(false);setEditId(null);}}>Cancel</Btn></div>
        </Modal>
      )}
    </div>
  );
}

function BillingPage({ state, setState, toast, addAudit, currentUser }) {
  const [showAdd, setShowAdd] = useState(false);
  const makeEmptyForm = () => {
    const billDate = new Date().toISOString().slice(0,10);
    const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0,10);
    return {
      patientId:"", patient:"", dept:"", doctor:"",
      services:"",
      consultation:"", lab:"", procedure:"", medicine:"", medicineItems:"", room:"",
      discount:"", insurance:"", paid:"",
      mode:"Cash", billDate, dueDate, notes:"",
      status:"Auto",
    };
  };
  const [form, setForm] = useState(makeEmptyForm);
  const f = k => v => setForm(p=>({...p,[k]:v}));
  const isAdmin = currentUser?.role === "Admin";
  const showBillingDetails = isAdmin || currentUser?.role === "Staff";
  const canManageBilling = !currentUser || !['Patient','Doctor'].includes(currentUser.role);
  const patients = state.patients || [];
  const totBilled  = state.billing.reduce((s,b)=>s+billingTotal(b),0);
  const paidAmt    = state.billing.reduce((s,b)=>s+billingCovered(b),0);
  const pendingDue = state.billing.reduce((s,b)=>s+billingBalance(b),0);

  const toAmt = v => {
    const n = parseFloat(v);
    return Number.isFinite(n) && n > 0 ? n : 0;
  };
  const subtotal = toAmt(form.consultation) + toAmt(form.lab) + toAmt(form.procedure) + toAmt(form.medicine) + toAmt(form.room);
  const discount = toAmt(form.discount);
  const grossTotal = Math.max(0, subtotal - discount);
  const insurance = toAmt(form.insurance);
  const paidNow = toAmt(form.paid);
  const coveredNow = Math.min(grossTotal, insurance + paidNow);
  const balanceNow = Math.max(0, grossTotal - coveredNow);
  const autoStatus = balanceNow <= 0 ? "Paid" : coveredNow > 0 ? "Partial" : "Unpaid";

  const pickPatient = pid => {
    const p = patients.find(x => x.id === pid);
    if (!p) { f("patientId")(pid); return; }
    setForm(prev => ({
      ...prev,
      patientId: pid,
      patient: `${p.fname} ${p.lname}`,
      dept: p.dept || "",
      doctor: p.doctor || "",
    }));
  };

  const handleAdd = () => {
    if(!form.patient || !form.services){toast("Select patient and enter services");return;}
    if(grossTotal <= 0){toast("Add at least one charge");return;}
    const nums = state.billing.map(b=>parseInt(b.inv.replace(/\D/g,""))).filter(n=>!isNaN(n));
    const inv = "INV-"+(Math.max(0,...nums)+1);
    const status = isAdmin && form.status !== "Auto" ? form.status : autoStatus;
    setState(s=>({...s,billing:[...s.billing,{
      inv,
      patientId: form.patientId || "N/A",
      patient: form.patient,
      dept: form.dept || "General",
      doctor: form.doctor || "-",
      services: form.services,
      medicineItems: form.medicineItems || "-",
      subtotal,
      discount,
      total: grossTotal,
      insurance,
      paid: paidNow,
      mode: form.mode,
      status,
      billDate: form.billDate || new Date().toISOString().slice(0,10),
      dueDate: form.dueDate || "",
      notes: form.notes || "",
      enteredBy: currentUser?.name || "System",
      enteredRole: currentUser?.role || "Admin",
    }]}));
    addAudit(`Invoice ${inv} generated`,"success");
    setShowAdd(false); setForm(makeEmptyForm());
    toast(` Invoice ${inv} generated!`);
  };

  const markAsPaid = inv => {
    setState(s => ({
      ...s,
      billing: s.billing.map(b => {
        if (b.inv !== inv) return b;
        const bal = billingBalance(b);
        return {
          ...b,
          paid: Number(b.paid || 0) + bal,
          status: "Paid",
          approvedBy: currentUser?.name || "Admin",
        };
      }),
    }));
    addAudit(`Invoice ${inv} marked paid`, "info");
    toast(` ${inv} marked as paid`);
  };
  const handleDelete = inv => {
    setState(s => ({ ...s, billing: s.billing.filter(b => b.inv !== inv) }));
    addAudit(`Invoice ${inv} deleted`, "danger");
    toast(` ${inv} deleted`);
  };

  const fmtDate = d => {
    if (!d) return "";
    const parsed = new Date(d);
    return Number.isNaN(parsed.getTime())
      ? d
      : parsed.toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
  };

  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:12}}>
        <StatCard label="Total Billed" value={rupee(totBilled)} color="#1a63c8"/>
        <StatCard label="Amount Received" value={rupee(paidAmt)} color="#166534"/>
        <StatCard label="Pending Dues" value={rupee(pendingDue)} color="#9b1c1c"/>
      </div>
      {canManageBilling && (<div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}><Btn primary onClick={()=>setShowAdd(true)}>+ New Invoice</Btn></div>)}
      <Card>
        <Table heads={["Invoice","Date","Patient", ...(showBillingDetails ? ["Doctor","Department","Medicines"] : []), "Services","Total", ...(showBillingDetails ? ["Paid"] : []), "Covered","Balance","Mode","Status","Entered By", ...(isAdmin ? ["Action"] : [])]}
          rows={state.billing.map(b=>{
            const covered = billingCovered(b);
            const bal = billingBalance(b);
            const st = billingStatus(b);
            const paid = Number(b.paid || 0);
            const canClose = isAdmin && bal > 0;
            return [
              b.inv,
              fmtDate(b.billDate),
              b.patient,
              ...(showBillingDetails ? [b.doctor || "-", b.dept || "General", b.medicineItems || "-"] : []),
              b.services,
              rupee(billingTotal(b)),
              ...(showBillingDetails ? [rupee(paid)] : []),
              covered > 0 ? rupee(covered) : "",
              <span style={{color:bal>0?"#9b1c1c":"#166534",fontWeight:600}}>{rupee(bal)}</span>,
              b.mode,
              <Badge s={st}/>,
              `${b.enteredBy || "Legacy"} (${b.enteredRole || "Admin"})`,
              ...(isAdmin ? [<div style={{display:"flex",gap:4}}>
                {canClose ? <Btn small primary onClick={()=>markAsPaid(b.inv)}>Mark Paid</Btn> : <span style={{color:'#9ca3af',fontSize:11}}></span>}
                <Btn small danger onClick={()=>handleDelete(b.inv)}>Delete</Btn>
              </div>] : []),
            ];
          })} />
      </Card>
      {showAdd && (
        <Modal title="Generate Invoice" onClose={()=>setShowAdd(false)} wide={760}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Sel label="Patient ID *" value={form.patientId} onChange={pickPatient} options={["", ...patients.map(p => p.id)]} />
            <Input label="Patient Name *" value={form.patient} onChange={f("patient")} />
            <Input label="Department" value={form.dept} onChange={f("dept")} />
            <Input label="Doctor" value={form.doctor} onChange={f("doctor")} />
            <Input label="Medicines" value={form.medicineItems} onChange={f("medicineItems")} placeholder="e.g. Paracetamol, Insulin" />
            <Input label="Bill Date" type="date" value={form.billDate} onChange={f("billDate")} />
            <Input label="Due Date" type="date" value={form.dueDate} onChange={f("dueDate")} />
            <div style={{gridColumn:"1/-1"}}><Input label="Services / Package *" value={form.services} onChange={f("services")} placeholder="CABG package + ICU stay + Pharmacy" /></div>
          </div>
          <div style={{fontSize:11,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.05em",margin:"4px 0 8px"}}>Charge Breakdown</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10}}>
            <Input label="Consultation" type="number" value={form.consultation} onChange={f("consultation")} />
            <Input label="Lab" type="number" value={form.lab} onChange={f("lab")} />
            <Input label="Procedure" type="number" value={form.procedure} onChange={f("procedure")} />
            <Input label="Medicine" type="number" value={form.medicine} onChange={f("medicine")} />
            <Input label="Room" type="number" value={form.room} onChange={f("room")} />
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
            <Input label="Discount ()" type="number" value={form.discount} onChange={f("discount")} />
            <Input label="Insurance ()" type="number" value={form.insurance} onChange={f("insurance")} />
            <Input label="Paid Now ()" type="number" value={form.paid} onChange={f("paid")} />
            <Sel label="Payment Mode" value={form.mode} onChange={f("mode")} options={["Cash","UPI","Card","Net Banking","Insurance","Pending"]} />
          </div>
          {isAdmin && <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Sel label="Invoice Status" value={form.status} onChange={f("status")} options={["Auto","Paid","Partial","Unpaid"]} />
          </div>}
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:10, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:4 }}>Notes</div>
            <textarea value={form.notes} onChange={e => f("notes")(e.target.value)} rows={3}
              style={{ width:"100%", padding:"8px 10px", border:"1px solid #dde2eb", borderRadius:8, fontSize:13, fontFamily:"inherit", outline:"none", boxSizing:"border-box", resize:"vertical" }} />
          </div>
          <div style={{background:"#f8faff",border:"1px solid #dbeafe",borderRadius:8,padding:10,marginBottom:8,display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
            <div><div style={{fontSize:10,color:"#6b7280"}}>Subtotal</div><div style={{fontWeight:700}}>{rupee(subtotal)}</div></div>
            <div><div style={{fontSize:10,color:"#6b7280"}}>Net Total</div><div style={{fontWeight:700}}>{rupee(grossTotal)}</div></div>
            <div><div style={{fontSize:10,color:"#6b7280"}}>Covered</div><div style={{fontWeight:700}}>{rupee(coveredNow)}</div></div>
            <div><div style={{fontSize:10,color:"#6b7280"}}>Balance</div><div style={{fontWeight:700,color:balanceNow>0?"#9b1c1c":"#166534"}}>{rupee(balanceNow)}</div></div>
          </div>
          <div style={{display:"flex",gap:8,marginTop:8}}><Btn primary onClick={handleAdd}>Generate</Btn><Btn onClick={()=>setShowAdd(false)}>Cancel</Btn></div>
        </Modal>
      )}
    </div>
  );
}

function InventoryPage({ state, setState, toast, addAudit, currentUser }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name:"", cat:"PPE", unit:"Pcs", qty:"", reorder:"100" });
  const f = k => v => setForm(p=>({...p,[k]:v}));
  const isDoctor = currentUser?.role === 'Doctor';
  const isAdmin = currentUser?.role === "Admin";
  const canManageInventory = !currentUser || !['Patient','Doctor'].includes(currentUser.role);

  const handleAdd = () => {
    if(!form.name){toast("Item name required");return;}
    setState(s=>({...s,inventory:[...s.inventory,{name:form.name,cat:form.cat,unit:form.unit,qty:parseInt(form.qty)||0,reorder:parseInt(form.reorder)||100}]}));
    addAudit(`${form.name} added to inventory`,"success");
    setShowAdd(false); setForm({name:"",cat:"PPE",unit:"Pcs",qty:"",reorder:"100"});
    toast(" Item added!");
  };
  const handleDelete = i => {
    const item = state.inventory[i];
    setState(s => ({ ...s, inventory: s.inventory.filter((_, idx) => idx !== i) }));
    addAudit(`${item?.name || "Inventory item"} deleted`, "danger");
    toast(" Item deleted");
  };

  return (
    <div>
      {canManageInventory && (<div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}><Btn primary onClick={()=>setShowAdd(true)}>+ Add Item</Btn></div>)}
      <Card>
        <Table heads={["Name","Category","Quantity","Unit","Reorder Level","Status", ...(isDoctor ? [] : ["Action"])]}
          rows={state.inventory.map((item,i)=>{
            const st=item.qty<item.reorder?"Low":"OK";
            return [item.name,item.cat,<strong>{item.qty.toLocaleString()}</strong>,item.unit,item.reorder,<Badge s={st}/>,
              ...(isDoctor ? [] : [canManageInventory
                ? <div style={{display:"flex",gap:4}}>
                    <Btn small onClick={()=>toast(`Stock updated for ${item.name}`)}>Update</Btn>
                    {isAdmin && <Btn small danger onClick={()=>handleDelete(i)}>Delete</Btn>}
                  </div>
                : <span style={{color:'#9ca3af',fontSize:11}}></span>])];
          })} />
      </Card>
      {showAdd && (
        <Modal title="Add Inventory Item" onClose={()=>setShowAdd(false)}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div style={{gridColumn:"1/-1"}}><Input label="Item Name *" value={form.name} onChange={f("name")} /></div>
            <Sel label="Category" value={form.cat} onChange={f("cat")} options={["PPE","Consumable","Equipment"]} />
            <Sel label="Unit" value={form.unit} onChange={f("unit")} options={["Pcs","Pairs","Units","Cylinders","Boxes"]} />
            <Input label="Quantity" type="number" value={form.qty} onChange={f("qty")} />
            <Input label="Reorder Level" type="number" value={form.reorder} onChange={f("reorder")} />
          </div>
          <div style={{display:"flex",gap:8,marginTop:8}}><Btn primary onClick={handleAdd}>Add</Btn><Btn onClick={()=>setShowAdd(false)}>Cancel</Btn></div>
        </Modal>
      )}
    </div>
  );
}

function AmbulancePage({ state, setState, toast, addAudit, addNotif, currentUser }) {
  const [showDispatch, setShowDispatch] = useState(false);
  const [showAddFleet, setShowAddFleet] = useState(false);
  const [showTrack, setShowTrack] = useState(false);
  const [simId, setSimId] = useState(null);
  const simRef = useRef<number | null>(null);
  const [form, setForm] = useState({ ambId:"", patient:"", loc:"", etaMin:"", lat:"", lng:"" });
  const [fleetForm, setFleetForm] = useState({ type:"BLS", vehicleNo:"", driver:"", paramedic:"", phone:"", location:"Hospital Base", fuelPct:"80" });
  const [trackForm, setTrackForm] = useState({ id:"", status:"Available", patient:"", location:"", destination:"", etaMin:"", speed:"", fuelPct:"", lat:"", lng:"", phone:"", driver:"", paramedic:"" });
  const [patientLocation, setPatientLocation] = useState({ lat:"", lng:"" });
  const [geoError, setGeoError] = useState("");
  const f = k => v => setForm(p=>({...p,[k]:v}));
  const ff = k => v => setFleetForm(p=>({...p,[k]:v}));
  const tf = k => v => setTrackForm(p=>({...p,[k]:v}));
  const avail = state.ambulance.filter(a=>a.status==="Available");
  const isDoctor = currentUser?.role === 'Doctor';
  const isAdmin = currentUser?.role === "Admin";
  const isPatient = currentUser?.role === 'Patient';
  const canManageAmbulance = !currentUser || !['Patient','Doctor'].includes(currentUser.role);
  const selectedAmb = state.ambulance.find(a => a.id === form.ambId);
  const parseCoord = value => Number.parseFloat(String(value || ""));
  const patientLat = parseCoord(patientLocation.lat);
  const patientLng = parseCoord(patientLocation.lng);
  const hasPatientCoords = !Number.isNaN(patientLat) && !Number.isNaN(patientLng);
  const calculatePatientDistance = a => {
    if (!hasPatientCoords || !a?.lat || !a?.lng) return null;
    const lat = parseCoord(a.lat);
    const lng = parseCoord(a.lng);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
    return haversineDistance(patientLat, patientLng, lat, lng);
  };
  const calculatePatientEta = a => {
    const dist = calculatePatientDistance(a);
    if (dist === null) return null;
    const speed = Number(a.speed || 30);
    if (speed <= 0) return null;
    return Math.max(1, Math.round(dist / Math.max(speed, 1) * 60));
  };
  const nearestPatientAmb = state.ambulance
    .filter(a => a.lat && a.lng)
    .map(a => ({ a, dist: calculatePatientDistance(a), eta: calculatePatientEta(a) }))
    .filter(x => x.dist !== null)
    .sort((a, b) => a.dist - b.dist)[0] || null;
  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not available in this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        setPatientLocation({ lat: String(pos.coords.latitude), lng: String(pos.coords.longitude) });
        setGeoError("");
      },
      err => {
        setGeoError(err.message || "Unable to get your location.");
      }
    );
  };

  const handleDispatch = () => {
    if(!form.ambId||!form.loc){toast("Select ambulance and enter destination");return;}
    const eta = parseInt(form.etaMin)||15;
    const nowStr = new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});
    setState(s=>({...s,ambulance:s.ambulance.map(a=>a.id===form.ambId?{
      ...a,
      status:"Dispatched",
      patient: form.patient || a.patient || "-",
      location: a.location || "En Route",
      destination: form.loc,
      etaMin: eta,
      lat: form.lat || a.lat || "",
      lng: form.lng || a.lng || "",
      speed: Number(a.speed || 35),
      lastUpdate: nowStr,
    }:a)}));
    addAudit(`${form.ambId} dispatched to ${form.loc}`,"danger");
    addNotif(` ${form.ambId} dispatched to ${form.loc}`,"danger","Ambulance");
    setShowDispatch(false);
    setForm({ ambId:"", patient:"", loc:"", etaMin:"", lat:"", lng:"" });
    toast(` ${form.ambId} dispatched with tracking details`);
  };
  const handleDelete = id => {
    setState(s => ({ ...s, ambulance: s.ambulance.filter(a => a.id !== id) }));
    addAudit(`${id} removed from fleet`, "danger");
    toast(` ${id} deleted`);
  };
  const handleAddFleet = () => {
    if(!fleetForm.driver || !fleetForm.phone || !fleetForm.vehicleNo){toast("Vehicle No, driver and phone required");return;}
    const nums = state.ambulance.map(a=>parseInt(String(a.id).replace(/\D/g,""))).filter(n=>!isNaN(n));
    const id = "AMB-"+String(Math.max(0,...nums)+1).padStart(3,"0");
    setState(s => ({ ...s, ambulance: [...s.ambulance, {
      id,
      vehicleNo:fleetForm.vehicleNo,
      type:fleetForm.type,
      driver:fleetForm.driver,
      paramedic:fleetForm.paramedic || "-",
      phone:fleetForm.phone,
      patient:"-",
      location:fleetForm.location || "Hospital Base",
      destination:"-",
      etaMin:0,
      speed:0,
      fuelPct:parseInt(fleetForm.fuelPct)||80,
      lat:"",
      lng:"",
      lastUpdate:"Just now",
      status:"Available"
    }] }));
    addAudit(`${id} added to fleet`, "success");
    setShowAddFleet(false);
    setFleetForm({ type:"BLS", vehicleNo:"", driver:"", paramedic:"", phone:"", location:"Hospital Base", fuelPct:"80" });
    toast(` ${id} added`);
  };

  const openTrack = a => {
    setTrackForm(p => ({ ...p, id: a.id }));
    setShowTrack(true);
    if (!hasPatientCoords) {
      useMyLocation();
    }
  };

  const startSim = (id) => {
    if (simRef.current) clearInterval(simRef.current as any);
    setSimId(id);
    simRef.current = window.setInterval(() => {
      setState(s => ({ ...s, ambulance: s.ambulance.map(a => {
        if (a.id !== id) return a;
        const lat = parseFloat(a.lat) || 12.9352;
        const lng = parseFloat(a.lng) || 77.6245;
        const dLat = (Math.random() - 0.5) * 0.01;
        const dLng = (Math.random() - 0.5) * 0.01;
        const nLat = +(lat + dLat).toFixed(6);
        const nLng = +(lng + dLng).toFixed(6);
        const nowStr = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
        return { ...a, lat: String(nLat), lng: String(nLng), lastUpdate: nowStr, speed: Math.max(10, Math.round((Math.random()*60))) };
      }) }));
    }, 4000);
  };

  const stopSim = () => {
    if (simRef.current) { clearInterval(simRef.current as any); simRef.current = null; }
    setSimId(null);
  };

  const saveTrack = () => {
    if(!trackForm.id){toast("Invalid ambulance");return;}
    const nowStr = new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});
    setState(s => ({
      ...s,
      ambulance: s.ambulance.map(a => a.id===trackForm.id ? {
        ...a,
        status:trackForm.status,
        patient:trackForm.patient || "-",
        location:trackForm.location,
        destination:trackForm.destination || "-",
        etaMin:parseInt(trackForm.etaMin)||0,
        speed:parseInt(trackForm.speed)||0,
        fuelPct:parseInt(trackForm.fuelPct)||0,
        lat:trackForm.lat,
        lng:trackForm.lng,
        phone:trackForm.phone,
        driver:trackForm.driver,
        paramedic:trackForm.paramedic || "-",
        lastUpdate:nowStr,
      } : a)
    }));
    addAudit(`${trackForm.id} tracking details updated`, "info");
    setShowTrack(false);
    toast(" Tracking details updated");
  };

  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:12}}>
        <StatCard label="Total Fleet" value={state.ambulance.length} color="#1a63c8"/>
        <StatCard label="Available" value={avail.length} color="#166534"/>
        <StatCard label="Dispatched" value={state.ambulance.length-avail.length} color="#92400e"/>
      </div>
      {canManageAmbulance && (
        <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginBottom:12}}>
          {isAdmin && <Btn onClick={()=>setShowAddFleet(true)}>+ Add Ambulance</Btn>}
          <Btn primary onClick={()=>{setShowDispatch(true);setForm({ambId:avail[0]?.id||"",patient:"",loc:"",etaMin:"15",lat:"",lng:""})}}>+ Dispatch</Btn>
        </div>
      )}
      {isPatient && (
        <Card style={{background:'#eff6ff',border:'1px solid #dbeafe',marginBottom:12}}>
          <div style={{fontSize:14,fontWeight:700,marginBottom:10}}>Track ambulance from your location</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr auto',gap:10,alignItems:'end'}}>
            <Input label='Latitude' value={patientLocation.lat} onChange={v=>{setPatientLocation(p=>({...p,lat:v}));setGeoError('');}} placeholder='12.9716' />
            <Input label='Longitude' value={patientLocation.lng} onChange={v=>{setPatientLocation(p=>({...p,lng:v}));setGeoError('');}} placeholder='77.5946' />
            <Btn small primary onClick={useMyLocation}>Use my location</Btn>
          </div>
          {geoError && <div style={{color:'#b91c1c',fontSize:12,marginTop:10}}>{geoError}</div>}
          <div style={{marginTop:12,fontSize:13,color:'#334155'}}>
            {hasPatientCoords
              ? nearestPatientAmb
                ? `Nearest ambulance ${nearestPatientAmb.a.id} is ${nearestPatientAmb.dist.toFixed(1)} km away from your location and should reach in about ${nearestPatientAmb.eta} min.`
                : 'No ambulance currently has GPS coordinates to estimate distance from your location.'
              : 'Enter your latitude and longitude to see the distance from your current location to the nearest ambulance.'}
          </div>
        </Card>
      )}
      <Card>
        <Table heads={["ID","Vehicle No","Type","Driver / Paramedic","Patient","Current Location","Destination", ...(isPatient ? ["Distance","ETA to You"] : []), "ETA","Speed","Fuel","GPS","Last Update","Status", "Action"]}
          rows={state.ambulance.map(a=>{
            const patientDistance = calculatePatientDistance(a);
            const patientEta = calculatePatientEta(a);
            return [
              a.id,
              a.vehicleNo || "-",
              a.type,
              `${a.driver || "-"} / ${a.paramedic || "-"}`,
              a.patient || "-",
              a.location || "-",
              a.destination || "-",
              ...(isPatient ? [
                patientDistance !== null ? `${patientDistance.toFixed(1)} km` : "-",
                patientEta !== null ? `${patientEta} min` : "-",
              ] : []),
              (a.status==="Dispatched" ? `${a.etaMin || 0} min` : "-"),
              `${a.speed || 0} km/h`,
              `${a.fuelPct || 0}%`,
              (a.lat && a.lng) ? `${a.lat}, ${a.lng}` : "-",
              a.lastUpdate || "-",
              <Badge s={a.status}/>,
              <div style={{display:"flex",gap:6,alignItems:'center'}}>
                <Btn small onClick={()=>openTrack(a)}>Track</Btn>
                {a.status==="Available"
                  ? (canManageAmbulance ? <Btn small primary onClick={()=>{setShowDispatch(true);setForm({ambId:a.id,patient:'',loc:'',etaMin:"15",lat:a.lat||"",lng:a.lng||""})}}>Dispatch</Btn> : <span style={{color:'#166534',fontSize:11,fontWeight:600}}>Available</span>)
                  : <span style={{color:'#1a63c8',fontSize:11,fontWeight:600}}>On Route</span>}
                {isAdmin && <Btn small danger onClick={()=>handleDelete(a.id)}>Delete</Btn>}
                {canManageAmbulance && (simId === a.id ? <Btn small danger onClick={stopSim}>Stop Sim</Btn> : <Btn small onClick={()=>startSim(a.id)}>Start Sim</Btn>)}
              </div>
            ];
          })} />
      </Card>
      {showDispatch && (
        <Modal title="Dispatch Ambulance" onClose={()=>setShowDispatch(false)} wide={560}>
          <Sel label="Ambulance *" value={form.ambId} onChange={f("ambId")} options={avail.map(a=>a.id)} />
          {selectedAmb && (
            <div style={{fontSize:12,color:"#6b7280",marginBottom:10}}>
              {selectedAmb.vehicleNo || "-"} | {selectedAmb.type} | {selectedAmb.driver}
            </div>
          )}
          <Input label="Destination *" value={form.loc} onChange={f("loc")} placeholder="Pickup / incident location" />
          <Input label="Patient" value={form.patient} onChange={f("patient")} placeholder="Patient name" />
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
            <Input label="ETA (mins)" type="number" value={form.etaMin} onChange={f("etaMin")} />
            <Input label="Latitude" value={form.lat} onChange={f("lat")} />
            <Input label="Longitude" value={form.lng} onChange={f("lng")} />
          </div>
          <div style={{display:"flex",gap:8,marginTop:8}}><Btn primary onClick={handleDispatch}>Dispatch Now</Btn><Btn onClick={()=>setShowDispatch(false)}>Cancel</Btn></div>
        </Modal>
      )}
      {showAddFleet && (
        <Modal title="Add Ambulance" onClose={()=>setShowAddFleet(false)} wide={560}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <Input label="Vehicle Number *" value={fleetForm.vehicleNo} onChange={ff("vehicleNo")} />
            <Sel label="Type" value={fleetForm.type} onChange={ff("type")} options={["ALS","BLS","Neonatal","Cardiac"]} />
            <Input label="Driver *" value={fleetForm.driver} onChange={ff("driver")} />
            <Input label="Paramedic" value={fleetForm.paramedic} onChange={ff("paramedic")} />
            <Input label="Phone *" value={fleetForm.phone} onChange={ff("phone")} />
            <Input label="Base Location" value={fleetForm.location} onChange={ff("location")} />
            <Input label="Fuel %" type="number" value={fleetForm.fuelPct} onChange={ff("fuelPct")} />
          </div>
          <div style={{display:"flex",gap:8,marginTop:8}}><Btn primary onClick={handleAddFleet}>Add</Btn><Btn onClick={()=>setShowAddFleet(false)}>Cancel</Btn></div>
        </Modal>
      )}
      {showTrack && (
        <Modal title={`Track Ambulance  ${trackForm.id}`} onClose={()=>setShowTrack(false)} wide={720}>
          {(() => {
            const live = state.ambulance.find(x => x.id === trackForm.id) || trackForm;
            const lat = parseFloat(live.lat) || null;
            const lng = parseFloat(live.lng) || null;
            const distanceToYou = calculatePatientDistance(live);
            const etaToYou = calculatePatientEta(live);
            return (
              <div>
                <Card style={{background:'#eff6ff',border:'1px solid #dbeafe',marginBottom:12}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
                    <div>
                      <div style={{fontSize:13,fontWeight:800,marginBottom:4}}>From your current location</div>
                      <div style={{fontSize:11.5,color:'#607187'}}>
                        {hasPatientCoords
                          ? `Your GPS: ${patientLat.toFixed(5)}, ${patientLng.toFixed(5)}`
                          : 'Allow location access or enter latitude/longitude to calculate distance.'}
                      </div>
                    </div>
                    <Btn small primary onClick={useMyLocation}>Use my location</Btn>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginTop:12}}>
                    <div style={{background:'#fff',border:'1px solid #dbeafe',borderRadius:8,padding:10}}>
                      <div style={{fontSize:10,fontWeight:700,color:'#607187',textTransform:'uppercase',letterSpacing:'0.05em'}}>Distance</div>
                      <div style={{fontSize:22,fontWeight:800,color:'#1a63c8',marginTop:3}}>
                        {distanceToYou !== null ? `${distanceToYou.toFixed(1)} km` : '-'}
                      </div>
                    </div>
                    <div style={{background:'#fff',border:'1px solid #dbeafe',borderRadius:8,padding:10}}>
                      <div style={{fontSize:10,fontWeight:700,color:'#607187',textTransform:'uppercase',letterSpacing:'0.05em'}}>Time Required</div>
                      <div style={{fontSize:22,fontWeight:800,color:'#166534',marginTop:3}}>
                        {etaToYou !== null ? `${etaToYou} min` : '-'}
                      </div>
                    </div>
                    <div style={{background:'#fff',border:'1px solid #dbeafe',borderRadius:8,padding:10}}>
                      <div style={{fontSize:10,fontWeight:700,color:'#607187',textTransform:'uppercase',letterSpacing:'0.05em'}}>Ambulance Speed</div>
                      <div style={{fontSize:22,fontWeight:800,color:'#92400e',marginTop:3}}>
                        {live.speed ? `${live.speed}` : '0'} <span style={{fontSize:11,fontWeight:700}}>km/h</span>
                      </div>
                    </div>
                  </div>
                  {geoError && <div style={{color:'#b91c1c',fontSize:12,marginTop:10}}>{geoError}</div>}
                  {hasPatientCoords && (lat && lng) && distanceToYou !== null && (
                    <div style={{fontSize:12.5,color:'#334155',marginTop:10}}>
                      Ambulance {live.id} is {distanceToYou.toFixed(1)} km away and should reach your current location in about {etaToYou} min.
                    </div>
                  )}
                  {hasPatientCoords && (!lat || !lng) && (
                    <div style={{fontSize:12.5,color:'#92400e',marginTop:10}}>
                      This ambulance does not have GPS coordinates, so distance and arrival time cannot be calculated.
                    </div>
                  )}
                </Card>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div style={{fontSize:12,fontWeight:700}}>Vehicle</div>
                  <div style={{fontSize:12}}>{live.id || '-'}</div>
                  <div style={{fontSize:12,fontWeight:700}}>Driver</div>
                  <div style={{fontSize:12}}>{live.driver || '-'}</div>
                  <div style={{fontSize:12,fontWeight:700}}>Patient</div>
                  <div style={{fontSize:12}}>{live.patient || '-'}</div>
                  <div style={{fontSize:12,fontWeight:700}}>Status</div>
                  <div style={{fontSize:12}}>{live.status || '-'}</div>
                  <div style={{fontSize:12,fontWeight:700}}>Speed</div>
                  <div style={{fontSize:12}}>{live.speed ? `${live.speed} km/h` : '-'}</div>
                  <div style={{fontSize:12,fontWeight:700}}>Last Update</div>
                  <div style={{fontSize:12}}>{live.lastUpdate || '-'}</div>
                </div>
                {lat && lng ? (
                  <div style={{marginTop:12}}>
                    <div style={{fontSize:12,fontWeight:700,marginBottom:8}}>Live Map</div>
                    <div style={{height:380,borderRadius:8,overflow:'hidden',border:'1px solid #e5e7eb',position:'relative'}}>
                      <iframe
                        key={`${live.id}-${live.lat}-${live.lng}`}
                        title={`map-${live.id}`}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${(lng-0.01)}%2C${(lat-0.01)}%2C${(lng+0.01)}%2C${(lat+0.01)}&layer=mapnik&marker=${lat}%2C${lng}`}
                      />
                      <div style={{position:'absolute',right:10,top:10,background:'#fff',padding:'6px 10px',borderRadius:8,boxShadow:'0 6px 18px rgba(15,23,42,0.08)',fontSize:12}}>
                        <div><strong>{live.id}</strong></div>
                        <div style={{color:'#6b7280',fontSize:12}}>{live.driver || ''} • {live.patient || ''}</div>
                        <div style={{marginTop:6}}><span style={{fontWeight:700}}>{live.speed || '—'}</span> km/h • {live.lastUpdate || ''}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{marginTop:12,color:'#9ca3af'}}>No GPS coordinates available for this ambulance.</div>
                )}
                <div style={{display:'flex',gap:8,marginTop:12,justifyContent:'flex-end'}}>
                  <Btn primary onClick={saveTrack}>Save</Btn>
                  {canManageAmbulance && (simId === trackForm.id ? <Btn danger onClick={stopSim}>Stop Simulation</Btn> : <Btn onClick={()=>startSim(trackForm.id)}>Start Simulation</Btn>)}
                  <Btn onClick={()=>setShowTrack(false)}>Close</Btn>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}
    </div>
  );
}

function AdminPage({ state, setState, toast, addAudit, currentUser }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name:"", email:"", role:"Staff", dept:"General" });
  const f = k => v => setForm(p=>({...p,[k]:v}));
  const dotC = { success:"#22c55e", warning:"#f59e0b", danger:"#ef4444", info:"#1a63c8" };

  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:12}}>
        <StatCard label="Total Users" value={USERS.length} color="#1a63c8"/>
        <StatCard label="Active Sessions" value={1} color="#166534"/>
        <StatCard label="System Uptime" value="99.8%" color="#166534"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Card>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{fontWeight:700,fontSize:13}}>System Users</div>
            {(!currentUser||currentUser.role!=='Patient')&&<Btn small primary onClick={()=>setShowAdd(true)}>+ Add User</Btn>}
          </div>
          <Table heads={["Name","Role","Department"]}
            rows={USERS.map(u=>[u.name,<Badge s={u.role}/>,u.dept])} />
        </Card>
        <Card>
          <div style={{fontWeight:700,fontSize:13,marginBottom:10}}>Audit Log</div>
          {state.auditLog.slice(0,8).map((a,i)=>(
            <div key={i} style={{display:"flex",gap:10,padding:"7px 0",borderBottom:i<7?"1px solid #f3f4f6":"none"}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:dotC[a.color]||"#1a63c8",marginTop:4,flexShrink:0}}/>
              <div>
                <div style={{fontSize:12.5}}>{a.msg}</div>
                <div style={{fontSize:10.5,color:"#9ca3af"}}>{a.time}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

  

function ReportsPage({ state, setState, toast, addAudit, currentUser }) {
  const billing     = state.billing     || [];
  const doctors     = state.doctors     || [];
  const staff       = state.staff       || [];
  const pharmacy    = state.pharmacy    || [];
  const labReports  = state.labReports  || [];
  const surgeries   = state.surgeries   || [];
  const appointments= state.appointments|| [];
  const wards       = state.wards       || [];
  const bloodStock  = state.bloodStock  || {};
  const donors      = state.donors      || [];
  const patients    = state.patients   || [];

  const [preview, setPreview] = useState(null);

  const totBilled = billing.reduce((s,b) => s + billingTotal(b), 0);
  const paidAmt   = billing.reduce((s,b) => s + billingCovered(b), 0);
  const pendingAmt = billing.reduce((s,b) => s + billingBalance(b), 0);
  const paidCount = billing.filter(b => billingStatus(b) === 'Paid').length;
  const partialCount = billing.filter(b => billingStatus(b) === 'Partial').length;
  const unpaidCount = billing.filter(b => billingStatus(b) === 'Unpaid').length;
  const statGroups: Record<string, number> = {};
  patients.forEach(p => { statGroups[p.status] = (statGroups[p.status] || 0) + 1; });
  const deptCounts: Record<string, number> = {};
  patients.forEach(p => { deptCounts[p.dept] = (deptCounts[p.dept] || 0) + 1; });

  const CSS = '*{margin:0;padding:0;box-sizing:border-box}body{font-family:Segoe UI,Arial,sans-serif;font-size:13px;color:#1a1d24;background:#fff;padding:32px 40px}.hdr{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2.5px solid #1a63c8;padding-bottom:14px;margin-bottom:20px}.brand{font-size:19px;font-weight:700;color:#1a63c8}.sub{font-size:11px;color:#6b7280;margin-top:3px}.meta{text-align:right;font-size:11px;color:#6b7280;line-height:1.8}h2{font-size:15px;font-weight:700;margin-bottom:14px;color:#1a1d24}.sec{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#1a63c8;border-bottom:1px solid #dde2eb;padding-bottom:5px;margin:18px 0 10px}table{width:100%;border-collapse:collapse;font-size:12px;margin-bottom:14px}th{background:#1a63c8;color:#fff;text-align:left;padding:8px 10px;font-size:11px;font-weight:600}td{padding:7px 10px;border-bottom:1px solid #f0f2f7}tr:nth-child(even) td{background:#f8faff}.b{display:inline-block;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:600}.bs{background:#dcfce7;color:#166534}.bw{background:#fef3c7;color:#92400e}.bd{background:#fee2e2;color:#9b1c1c}.bi{background:#dbeafe;color:#1a63c8}.kpi{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px}.kb{border:1px solid #dde2eb;border-radius:8px;padding:12px;border-left:3px solid #1a63c8}.kv{font-size:22px;font-weight:800;color:#1a63c8;margin:4px 0}.kl{font-size:10px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:.05em}.ks{font-size:10.5px;color:#9ca3af;margin-top:2px}.ftr{margin-top:28px;padding-top:12px;border-top:1.5px solid #dde2eb;display:flex;justify-content:space-between;font-size:10px;color:#6b7280}.sig{width:160px;border-top:1px solid #1a1d24;margin-top:24px;padding-top:4px;text-align:center;font-size:10px;color:#6b7280}@media print{body{padding:20px}}';

  const genDate = new Date().toLocaleString('en-IN', { dateStyle:'long', timeStyle:'short' });

  const wrap = (title, body) =>
    '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>' + title + '</title><style>' + CSS + '</style></head><body>' +
    '<div class="hdr"><div><div class="brand">&#127973; MedCare Hospital, Bengaluru</div><div class="sub">123 Health Street, Koramangala</div><div class="sub">GST: 29AABCM1234A1Z5</div></div>' +
    '<div class="meta"><div style="font-weight:600;color:#1a1d24">' + title + '</div><div>Generated: ' + genDate + '</div></div></div>' +
    body +
    '<div class="ftr"><div>Computer-generated document &mdash; MedCare HMS &mdash; Confidential</div><div class="sig">Authorised Signatory</div></div></body></html>';

  const bstat = (s) => {
    const m = { Paid:'bs', Partial:'bw', Unpaid:'bd', Admitted:'bi', Discharged:'bs', OPD:'bi', Critical:'bd',
      Active:'bs', 'On Duty':'bs', 'On Leave':'bw', Ready:'bs', Processing:'bw', Pending:'bw',
      Scheduled:'bi', Completed:'bs', Available:'bs', Dispatched:'bi', Verified:'bs', Testing:'bw',
      'Low Stock':'bd', 'Out of Stock':'bd', Critical2:'bd' };
    return '<span class="b ' + (m[s] || 'bw') + '">' + s + '</span>';
  };

  const tbl = (heads, rows) => {
    const ths = heads.map(h => '<th>' + h + '</th>').join('');
    const trs = rows.map(r => '<tr>' + r.map(c => '<td>' + (c == null ? '&mdash;' : c) + '</td>').join('') + '</tr>').join('');
    return '<table><thead><tr>' + ths + '</tr></thead><tbody>' + trs + '</tbody></table>';
  };

  const kbox = (l, v, s) => '<div class="kb"><div class="kl">' + l + '</div><div class="kv">' + v + '</div><div class="ks">' + (s||'') + '</div></div>';
  const sec  = (t) => '<div class="sec">' + t + '</div>';
  const inr  = (n) => '&#8377;' + Number(n).toLocaleString('en-IN');
  const krow = (items) => '<div class="kpi">' + items.join('') + '</div>';

  const buildPatientSummary = () => {
    const ad = patients.filter(p => p.status === 'Admitted').length;
    const cr = patients.filter(p => p.status === 'Critical').length;
    const di = patients.filter(p => p.status === 'Discharged').length;
    const op = patients.filter(p => p.status === 'OPD').length;
    const pRows = patients.map(p => [p.id, p.fname+' '+p.lname, p.age, p.gender, p.dept, p.doctor, p.admitted, bstat(p.status)]);
    const dRows = Object.entries(deptCounts).sort((a,b)=>b[1]-a[1]).map(([d,c]) => [d, c, Math.round(c/Math.max(patients.length,1)*100)+'%']);
    return '<h2>Patient Summary Report</h2>' +
      krow([kbox('Total Patients',patients.length,ad+' admitted'),kbox('Critical',cr,'needs attention'),kbox('Discharged',di,'recovered'),kbox('OPD',op,'outpatient')]) +
      sec('Patient Registry') + tbl(['ID','Name','Age','Gender','Department','Doctor','Admitted','Status'],pRows) +
      sec('Department Distribution') + tbl(['Department','Count','% Share'],dRows);
  };

  const buildRevenue = () => {
    const part = billing.filter(b=>billingStatus(b)==='Partial').reduce((s,b)=>s+billingTotal(b),0);
    const rows = billing.map(b => [b.inv, b.patient, b.services, inr(billingTotal(b)), billingCovered(b)?inr(billingCovered(b)):'&mdash;', inr(billingBalance(b)), b.mode, bstat(billingStatus(b))]);
    return '<h2>Revenue Report</h2>' +
      krow([kbox('Total Billed',inr(totBilled),billing.length+' invoices'),kbox('Received',inr(paidAmt),paidCount+' paid'),kbox('Pending Dues',inr(pendingAmt),unpaidCount+' unpaid'),kbox('Partial',inr(part),partialCount+' invoices')]) +
      sec('Invoice Details') + tbl(['Invoice','Patient','Services','Total','Insurance','Balance','Mode','Status'],rows);
  };

  const buildPharmacy = () => {
    const low = pharmacy.filter(m=>m.stock>0&&m.stock<m.reorder).length;
    const out = pharmacy.filter(m=>m.stock<=0).length;
    const ok  = pharmacy.filter(m=>m.stock>=m.reorder).length;
    const rows = pharmacy.map(m => [m.name, m.cat, m.mfg, '<strong>'+m.stock+'</strong>', m.reorder, m.expiry, inr(m.price), m.stock<=0?bstat('Out of Stock'):m.stock<m.reorder?bstat('Low Stock'):bstat('Ready')]);
    return '<h2>Pharmacy Report</h2>' +
      krow([kbox('Total Medicines',pharmacy.length,'in formulary'),kbox('Adequate',ok,'well stocked'),kbox('Low Stock',low,'needs reorder'),kbox('Out of Stock',out,'urgent')]) +
      sec('Medicine Inventory') + tbl(['Medicine','Category','Manufacturer','Stock','Reorder','Expiry','Price','Status'],rows);
  };

  const buildStaffAttendance = () => {
    const ac = staff.filter(s=>s.status==='Active').length;
    const lv = staff.filter(s=>s.status==='On Leave').length;
    const off= staff.filter(s=>s.status==='Off Duty').length;
    const rows = staff.map(s => [s.id, s.name, s.role, s.dept, s.shift, s.phone, bstat(s.status),
      s.status==='Active'?'<span style="color:#166534;font-weight:600">&#10003; Present</span>':'<span style="color:#9b1c1c;font-weight:600">&#10007; Absent</span>']);
    const d = new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
    return '<h2>Staff Attendance &mdash; ' + d + '</h2>' +
      krow([kbox('Total Staff',staff.length,'on roster'),kbox('Present',ac,'active today'),kbox('On Leave',lv,'absent'),kbox('Off Duty',off,'not scheduled')]) +
      sec('Attendance Register') + tbl(['ID','Name','Role','Dept','Shift','Phone','Status','Attendance'],rows);
  };

  const buildSurgery = () => {
    const co = surgeries.filter(s=>s.status==='Completed').length;
    const sc = surgeries.filter(s=>s.status==='Scheduled').length;
    const pe = surgeries.filter(s=>s.status==='Pending').length;
    const rows = surgeries.map(s => [s.id, s.patient, s.procedure, s.surgeon, s.ot, s.datetime, bstat(s.status)]);
    return '<h2>Surgery / OT Report</h2>' +
      krow([kbox('Total',surgeries.length,'all time'),kbox('Completed',co,'successful'),kbox('Scheduled',sc,'upcoming'),kbox('Pending',pe,'awaiting')]) +
      sec('Surgery Register') + tbl(['ID','Patient','Procedure','Surgeon','OT','Date &amp; Time','Status'],rows);
  };

  const buildLab = () => {
    const re = labReports.filter(l=>l.status==='Ready').length;
    const pr = labReports.filter(l=>l.status==='Processing').length;
    const pe = labReports.filter(l=>l.status==='Pending').length;
    const rows = labReports.map(l => [l.id, l.patient, l.test, l.orderedBy, l.date, bstat(l.status)]);
    return '<h2>Laboratory Report Summary</h2>' +
      krow([kbox('Total Tests',labReports.length,'ordered'),kbox('Ready',re,'results available'),kbox('Processing',pr,'in progress'),kbox('Pending',pe,'awaiting start')]) +
      sec('Lab Test Register') + tbl(['Report ID','Patient','Test','Ordered By','Date','Status'],rows);
  };

  const buildBloodBank = () => {
    const bgs  = ['A+','B+','O+','AB+','A-','B-','O-','AB-'];
    const bRows= bgs.map(bg => { const u=bloodStock[bg]||0; return [bg,'<strong>'+u+'</strong>',u<6?bstat('Critical'):u<12?bstat('Pending'):bstat('Ready')]; });
    const dRows= donors.map(d => [d.name,d.phone||'&mdash;',d.bg,d.units,d.date,bstat(d.status)]);
    return '<h2>Blood Bank Report</h2>' +
      sec('Blood Group Stock') + tbl(['Blood Group','Units Available','Status'],bRows) +
      sec('Donor Records ('+donors.length+' donors)') + tbl(['Donor','Phone','Group','Units','Date','Status'],dRows);
  };

  const buildFull = () => {
    const ad = patients.filter(p=>p.status==='Admitted').length;
    const od = doctors.filter(d=>d.status==='On Duty').length;
    const ac = staff.filter(s=>s.status==='Active').length;
    const aRows = appointments.map(a => [a.token,a.patient,a.doctor,a.date,a.time,a.type,bstat(a.status)]);
    const wRows = wards.map(w => [w.name,w.type,w.beds,w.occupied,w.beds-w.occupied,inr(w.rate)]);
    const bRows = billing.map(b => [b.inv,b.patient,b.services,inr(b.total),bstat(b.status)]);
    return '<h2>Full Hospital Summary Report</h2>' +
      krow([kbox('Patients',patients.length,ad+' admitted'),kbox('Doctors',doctors.length,od+' on duty'),kbox('Staff',staff.length,ac+' active'),kbox('Revenue',inr(totBilled),billing.length+' invoices')]) +
      sec('Appointments ('+appointments.length+')') + tbl(['Token','Patient','Doctor','Date','Time','Type','Status'],aRows) +
      sec('Ward Occupancy') + tbl(['Ward','Type','Total Beds','Occupied','Free','Rate/Day'],wRows) +
      sec('Billing Summary') + tbl(['Invoice','Patient','Services','Total','Status'],bRows);
  };

  const builders = {
    'Patient Summary':     buildPatientSummary,
    'Revenue Report':      buildRevenue,
    'Pharmacy Report':     buildPharmacy,
    'Staff Attendance':    buildStaffAttendance,
    'Surgery Report':      buildSurgery,
    'Lab Report Summary':  buildLab,
    'Blood Bank Report':   buildBloodBank,
    'Full Hospital Report':buildFull,
  };

  const getHTML = (name) => wrap(name, (builders[name] || (() => '<p>No data.</p>'))());

  const viewReport = (name) => setPreview({ title: name, html: getHTML(name) });

  const downloadReport = (name, autoPrint=false) => {
    // Open full report in a new window; if autoPrint=true, trigger print dialog immediately
    const html = getHTML(name);
    const win  = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
      try {
        if (autoPrint) {
          // focus then print; user browser may still block
          win.focus();
          setTimeout(() => { try { win.print(); } catch(e){} }, 300);
        }
      } catch (e) {}
    } else {
      // If popup blocked, show inside modal
      setPreview({ title: name, html });
      if (autoPrint) {
        // inform user to click Open & Print to trigger save as PDF
        try { toast && toast('Popup blocked — preview opened. Click Open & Print to print/save as PDF.'); } catch(e){}
      }
    }
  };

  const downloadReportAsPdf = async (name) => {
    const html = getHTML(name);
    const wrapper = document.createElement('div');
    wrapper.style.position = 'fixed';
    wrapper.style.left = '-9999px';
    wrapper.style.top = '0';
    wrapper.innerHTML = html;
    document.body.appendChild(wrapper);
    try {
      const mod = await import('html2pdf.js');
      const html2pdf = (mod && (mod.default || mod)) as any;
      const filename = (name || 'report').replace(/[^a-z0-9_\-\.]/gi,'_') + '.pdf';
      const opt = {
        margin: 0.4,
        filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };
      await html2pdf().from(wrapper).set(opt).save();
    } catch (e) {
      try { toast && toast('Save PDF failed — opening in new tab.'); } catch(e){}
      downloadReport(name, false);
    } finally {
      try { document.body.removeChild(wrapper); } catch(e){}
    }
  };

  const REPORT_TYPES = [
    { name:'Patient Summary',     icon:'PT', desc:'All patients, status, departments' },
    { name:'Revenue Report',      icon:'RV', desc:'Billing, invoices, outstanding dues' },
    { name:'Pharmacy Report',     icon:'RX', desc:'Stock, low inventory, reorder alerts' },
    { name:'Staff Attendance',    icon:'ST', desc:'Staff roster, shifts, attendance register' },
    { name:'Surgery Report',      icon:'OT', desc:'OT schedule, surgeries, outcomes' },
    { name:'Lab Report Summary',  icon:'LB', desc:'All tests, pending and ready results' },
    { name:'Blood Bank Report',   icon:'BL', desc:'Blood stock, donors, critical groups' },
    { name:'Full Hospital Report',icon:'HL', desc:'Complete hospital summary, all modules' },
  ];

  return (
    <div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:14}}>
        <StatCard label='Total Patients' value={patients.length} color='#1a63c8' sub={patients.filter(p=>p.status==='Admitted'||p.status==='Critical').length+' admitted'}/>
        <StatCard label='Total Billed' value={rupee(totBilled)} color='#166534' sub={billing.length+' invoices'}/>
        <StatCard label='Received' value={rupee(paidAmt)} color='#1a63c8' sub={paidCount+' paid'}/>
        <StatCard label='Pending Dues' value={rupee(pendingAmt)} color='#9b1c1c' sub={unpaidCount+' unpaid'}/>
      </div>
      <Card>
        <div style={{fontWeight:700,fontSize:13,marginBottom:6}}>Export Reports</div>
        <div style={{background:'#f8fafc',border:'1px solid #e6eef9',padding:10,borderRadius:8,color:'#334155',fontSize:13,marginBottom:12,lineHeight:1.35}}>
          - Click <strong>View</strong> to preview the report inside the app.<br/>
          - In the preview modal click <strong>Open & Print</strong> to open the full report in a new tab; then use your browser's Print (Ctrl/Cmd+P) and choose "Save as PDF" to download a PDF.<br/>
          - Alternatively, use the report's <strong>View</strong> then the small print button inside the preview to open the browser print dialog directly.
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
          {REPORT_TYPES.map(r => (
            <div key={r.name} style={{border:'1px solid #e5e7eb',borderRadius:10,padding:14}}>
              <div style={{fontSize:22,marginBottom:6}}>{r.icon}</div>
              <div style={{fontSize:12.5,fontWeight:700,marginBottom:3,lineHeight:1.3}}>{r.name}</div>
              <div style={{fontSize:11,color:'#9ca3af',marginBottom:12,lineHeight:1.4}}>{r.desc}</div>
              <div style={{display:'flex',gap:6}}>
                <button onClick={() => viewReport(r.name)}
                  style={{flex:1,padding:'7px 0',borderRadius:6,border:'1px solid #dde2eb',background:'#fff',fontSize:11,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>
                   View
                </button>
                <button onClick={() => downloadReport(r.name, true)}
                  style={{flex:1,padding:'7px 0',borderRadius:6,border:'none',background:'#1a63c8',color:'#fff',fontSize:11,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>
                   Download PDF
                </button>
                <button onClick={() => downloadReportAsPdf(r.name)}
                  style={{flex:1,padding:'7px 0',borderRadius:6,border:'1px solid #e5e7eb',background:'#fff',fontSize:11,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>
                   Save PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        <Card>
          <div style={{fontWeight:700,fontSize:13,marginBottom:12}}>Patient Status Breakdown</div>
          {Object.entries(statGroups).map(([st,cnt]) => (
            <div key={st} style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
              <Badge s={st}/><strong style={{fontSize:13}}>{cnt}</strong>
            </div>
          ))}
        </Card>
        <Card>
          <div style={{fontWeight:700,fontSize:13,marginBottom:12}}>Billing Breakdown</div>
          {[['Paid',paidCount,'#166534'],
            ['Partial',partialCount,'#92400e'],
            ['Unpaid',unpaidCount,'#9b1c1c']
          ].map(([k,v,c]) => (
            <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid #f3f4f6'}}>
              <span style={{color:'#6b7280',fontSize:13}}>{k}</span>
              <strong style={{color:c,fontSize:13}}>{v}</strong>
            </div>
          ))}
          <div style={{display:'flex',justifyContent:'space-between',padding:'10px 0 0',fontWeight:700}}>
            <span>Total Invoices</span><span>{billing.length}</span>
          </div>
        </Card>
      </div>
      {preview && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center'}}
          onClick={() => setPreview(null)}>
          <div style={{background:'#fff',borderRadius:12,width:'92vw',maxWidth:980,height:'90vh',display:'flex',flexDirection:'column',boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}
            onClick={e => e.stopPropagation()}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 20px',borderBottom:'1px solid #e5e7eb',flexShrink:0}}>
              <div style={{fontWeight:700,fontSize:14}}>{preview.title}</div>
              <div style={{display:'flex',gap:8}}>
                <button onClick={() => downloadReport(preview.title, true)}
                  style={{padding:'6px 16px',borderRadius:7,border:'none',background:'#1a63c8',color:'#fff',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>
                   Open & Print
                </button>
                <button onClick={() => downloadReportAsPdf(preview.title)}
                  style={{padding:'6px 12px',borderRadius:7,border:'1px solid #e5e7eb',background:'#fff',fontSize:12,cursor:'pointer',fontWeight:700,color:'#1a1d24',fontFamily:'inherit'}}>
                  Save PDF
                </button>
                <button onClick={() => setPreview(null)}
                  style={{padding:'6px 12px',borderRadius:7,border:'1px solid #e5e7eb',background:'#fff',fontSize:12,cursor:'pointer',fontWeight:700,color:'#6b7280',fontFamily:'inherit'}}>
                  Close
                </button>
              </div>
            </div>
            <iframe srcDoc={preview.html} style={{flex:1,border:'none',borderRadius:'0 0 12px 12px'}} title={preview.title} sandbox="allow-same-origin" />
          </div>
        </div>
      )}
    </div>
  );
}

function NotificationsPage({ state, setState, toast }) {
  const markAll = () => { setState(s=>({...s,notifications:s.notifications.map(n=>({...n,read:true}))})); toast("All marked as read"); };
  const markOne = i => setState(s=>({...s,notifications:s.notifications.map((n,idx)=>idx===i?{...n,read:true}:n)}));
  const clearAll = () => { setState(s=>({...s,notifications:[]})); toast("Cleared"); };
  const unread = state.notifications.filter(n=>!n.read).length;
  const dotC = { success:"#22c55e", warning:"#f59e0b", danger:"#ef4444", info:"#1a63c8" };

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <div style={{fontSize:13,color:"#6b7280"}}>{unread} unread | {state.notifications.length} total</div>
        <div style={{display:"flex",gap:8}}>
          {unread>0&&<Btn primary small onClick={markAll}>Mark All Read</Btn>}
          {state.notifications.length>0&&<Btn small onClick={clearAll}>Clear All</Btn>}
        </div>
      </div>
      <Card>
        {state.notifications.length===0&&<div style={{textAlign:"center",color:"#9ca3af",padding:32,fontSize:13}}>No notifications</div>}
        {state.notifications.map((n,i)=>(
          <div key={i} style={{display:"flex",gap:12,padding:"12px 0",borderBottom:i<state.notifications.length-1?"1px solid #f3f4f6":"none",opacity:n.read?0.5:1}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:dotC[n.color]||"#1a63c8",marginTop:6,flexShrink:0}}/>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:n.read?400:600}}>{n.msg}</div>
              <div style={{fontSize:11,color:"#9ca3af",marginTop:3}}>{n.time} | {n.src}</div>
            </div>
            {!n.read&&<button onClick={()=>markOne(i)} style={{background:"none",border:"1px solid #dde2eb",borderRadius:6,padding:"3px 10px",cursor:"pointer",fontSize:11,fontWeight:600}}>Mark</button>}
          </div>
        ))}
      </Card>
    </div>
  );
}

//  LOGIN SCREEN 
function LoginScreen({ onLogin, onRegisterPatient }) {
  const [mode, setMode]         = useState('login');
  const [activeRole, setActive] = useState('Admin');
  const [email, setEmail]       = useState('');
  const [pass,  setPass]        = useState('');
  const [showPass, setShowPass] = useState(false);
  const [err,   setErr]         = useState('');
  const normalizeEmail = (email) => String(email || '').trim().toLowerCase();
  const [regUsers, setRegUsers] = useState(() => {
    try {
      const users = JSON.parse(localStorage.getItem('medcarePatientUsers') || '[]');
      if (!Array.isArray(users)) return [];
      return users.map(u => ({ ...u, email: normalizeEmail(u.email) }));
    } catch {
      return [];
    }
  });

  // Register  Patient only: Name, Email, Password (no phone, no extra fields)
  const [rName, setRName] = useState('');
  const [rEmail,setREmail]= useState('');
  const [rPass, setRPass] = useState('');
  const [rAge, setRAge] = useState('');
  const [rGender, setRGender] = useState('Male');
  const [showRP,setShowRP]= useState(false);
  const [rErr,  setRErr]  = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  const ROLES = [
    { role:'Admin',   icon:'💼', display:'admin' },
    { role:'Doctor',  icon:'🩺', display:'doctor' },
    { role:'Patient', icon:'🧑', display:'patient' },
    { role:'Staff',   icon:'🧑‍⚕️', display:'staff' },
  ];
  const hasRegisteredPatient = regUsers.length > 0;

  useEffect(() => {
    localStorage.setItem('medcarePatientUsers', JSON.stringify(regUsers));
  }, [regUsers]);

  // Switching role always clears fields  never auto-fills
  const pickRole = r => { setActive(r); setEmail(''); setPass(''); setErr(''); if(r !== 'Patient' || hasRegisteredPatient) setMode('login'); };

  const handleLogin = () => {
    setErr('');
    const em = normalizeEmail(email);
    const pw = pass.trim();
    if(!em||!pw){ setErr('Please enter your email and password.'); return; }
    if (!/^[a-z]/.test(email.trim())) {
      setErr('Email must start with a lowercase letter.');
      return;
    }

    if(activeRole === 'Patient') {
      const staffEmails = Object.values(ROLE_CREDS).filter(Boolean).map(c=>normalizeEmail(c.email));
      if(staffEmails.includes(em)){ setErr('This account is not a patient account. Please select the correct role.'); return; }
      const patientUser = regUsers.find(u=>normalizeEmail(u.email)===em);
      if(!patientUser){ setErr('Patient email is not registered. Please register first.'); return; }
      if(patientUser.pass!==pw){ setErr('Incorrect password for this patient account.'); return; }
      onLogin(patientUser);
      return;
    }

    // Admin / Doctor / Staff: only their own credentials work in their tab
    const allowed = ROLE_CREDS[activeRole];
    if(!allowed) return;
    if(em !== allowed.email){ setErr('This email is not valid for ' + activeRole.toLowerCase() + ' login.'); return; }
    if(pw !== allowed.pass){ setErr('Incorrect password for this account.'); return; }
    const user = USERS.find(u=>u.email===em);
    if(user) onLogin(user);
    else setErr('Login failed. Please try again.');
  };

  // Register  only Name, Email, Password (matches screenshot)
  const handleRegister = () => {
    setRErr('');
    if(!rName.trim()){ setRErr('Full name is required.'); return; }
    if(!rEmail.includes('@')){ setRErr('Enter a valid email address.'); return; }
    if (!/^[a-z]/.test(rEmail.trim())) {
      setRErr('Email must start with a lowercase letter.');
      return;
    }
    if(rPass.length<6){ setRErr('Password must be at least 6 characters.'); return; }
    if(!rAge || Number(rAge) <= 0){ setRErr('Please enter a valid age.'); return; }
    const ageValue = Math.max(0, parseInt(rAge, 10) || 0);
    if(!['Male','Female','Other'].includes(rGender)){ setRErr('Select a valid gender.'); return; }
    const staffEmails = Object.values(ROLE_CREDS).filter(Boolean).map(c=>normalizeEmail(c.email));
    const normalizedEmail = normalizeEmail(rEmail);
    if(staffEmails.includes(normalizedEmail)){ setRErr('This email is already registered. Please sign in with the correct role.'); return; }
    if(regUsers.find(u=>normalizeEmail(u.email)===normalizedEmail)){
      setMode('login');
      setActive('Patient');
      setEmail(normalizedEmail);
      setPass('');
      setErr('This patient email is already registered. Sign in with your password.');
      setRName(''); setREmail(''); setRPass('');
      return;
    }
    const newUser = { email:normalizedEmail, pass:rPass, role:'Patient', name:rName.trim(), age: ageValue, gender: rGender, dept:'-' };
    setRegUsers(prev=>[...prev, newUser]);
    if (typeof onRegisterPatient === 'function') {
      onRegisterPatient(newUser);
    }
    setRegSuccess(true);
    setTimeout(() => {
      setRegSuccess(false);
      // Automatically log in the new patient after registration
      onLogin(newUser);
      setRName(''); setREmail(''); setRPass('');
    }, 1500);
  };

  // No hints or previews shown in any field

  const inp = (val,set,type,ph,extra={}) => (
    <input value={val} onChange={e=>{set(e.target.value);setErr('');setRErr('');}} type={type||'text'} placeholder={ph} autoComplete='off'
      onKeyDown={e=>e.key==='Enter'&&(mode==='login'?handleLogin():handleRegister())}
      style={{ width:'100%', padding:'10px 12px', border:'1px solid #c9d2df', borderRadius:9, fontSize:13, color:'#4b5563', fontFamily:'inherit', boxSizing:'border-box', outline:'none', background:'#ffffff', ...extra }} />
  );

  const label = txt => (
    <div style={{ fontSize:10.5, fontWeight:700, color:'#607187', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6 }}>{txt}</div>
  );

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(100deg,#dce6f5 0%,#d9e4f2 48%,#d8efe1 100%)' }}>
      <div style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:'38px 42px', width:420, boxShadow:'0 18px 48px rgba(15, 23, 42, 0.10)' }}>

        {/* Brand */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:22 }}>
          <div style={{ width:44, height:44, background:'#e8f0ff', borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>🏥</div>
          <div>
            <div style={{ fontSize:18, fontWeight:800, color:'#0f172a', lineHeight:1.1 }}>MedCare HMS</div>
            <div style={{ fontSize:11, color:'#607187', marginTop:2 }}>Hospital Management System</div>
          </div>
        </div>

        <div style={{ fontSize:10.5, fontWeight:700, color:'#607187', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8 }}>Select Role</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:16 }}>
          {ROLES.map(r=>(
            <button key={r.role} onClick={()=>pickRole(r.role)}
              style={{ border:'1.5px solid '+(activeRole===r.role?'#2563eb':'#cdd7e3'), borderRadius:10, padding:'10px 4px', textAlign:'center', cursor:'pointer',
                background:activeRole===r.role?'#dbe8ff':'#fff', color:activeRole===r.role?'#2563eb':'#4b5563', fontSize:11.5, fontWeight:500, fontFamily:'inherit' }}>
              <span style={{ fontSize:20, display:'block', marginBottom:4 }}>{r.icon}</span>{r.display}
            </button>
          ))}
        </div>

        {/* Sign In / Register tabs  Register only shown for Patient */}
        <div style={{ display:'flex', background:'#e2e8f0', borderRadius:9, padding:3, marginBottom:18 }}>
          <button onClick={()=>{setMode('login');setErr('');setRErr('');}}
            style={{ flex:1, padding:'7px 0', borderRadius:7, border:'none', fontSize:13, fontWeight:700, cursor:'pointer',
              background:mode==='login'?'#f9fafb':'transparent', color:mode==='login'?'#111827':'#64748b',
              boxShadow:mode==='login'?'0 1px 2px rgba(15,23,42,0.12)':'none', fontFamily:'inherit' }}>
            Sign In
          </button>
          {activeRole === 'Patient' && !hasRegisteredPatient && (
            <button onClick={()=>{setMode('register');setErr('');setRErr('');}}
              style={{ flex:1, padding:'7px 0', borderRadius:7, border:'none', fontSize:13, fontWeight:700, cursor:'pointer',
                background:mode==='register'?'#f9fafb':'transparent', color:mode==='register'?'#111827':'#64748b',
                boxShadow:mode==='register'?'0 1px 2px rgba(15,23,42,0.12)':'none', fontFamily:'inherit' }}>
              Register
            </button>
          )}
        </div>

        {/*  SIGN IN  */}
        {mode === 'login' && (
          <>
            <div style={{ marginBottom:12 }}>
              {label('Email')}
              {inp(email, v=>{setEmail(v);setErr('');}, 'text', 'Enter your email')}
            </div>

            <div style={{ marginBottom:14 }}>
              {label('Password')}
              <div style={{ position:'relative' }}>
                {inp(pass, v=>{setPass(v);setErr('');}, showPass?'text':'password', 'Enter your password', { paddingRight:36 })}
                <button onClick={()=>setShowPass(p=>!p)} tabIndex={-1}
                  style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:14, color:'#64748b' }}>
                  {showPass?'🙈':'👁'}
                </button>
              </div>
            </div>

            {err && <div style={{ color:'#9b1c1c', fontSize:12, background:'#fef2f2', borderRadius:8, padding:'8px 12px', marginBottom:12, display:'flex', alignItems:'center', gap:6 }}>{err}</div>}

            <button onClick={handleLogin}
              style={{ width:'100%', padding:'11px 0', background:'#2663c6', color:'#fff', border:'none', borderRadius:9, fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
              Sign In →
            </button>

            {activeRole === 'Patient' && !hasRegisteredPatient && (
              <div style={{ textAlign:'center', marginTop:12, fontSize:12, color:'#607187' }}>
                {regUsers.some(u => normalizeEmail(u.email) === normalizeEmail(email))
                  ? 'Patient email already exists. Please sign in with your password.'
                  : (
                    <>New patient?{' '}
                      <button onClick={()=>setMode('register')} style={{ color:'#1a63c8', background:'none', border:'none', cursor:'pointer', fontWeight:600, textDecoration:'underline', fontSize:12, fontFamily:'inherit' }}>
                        Register here
                      </button>
                    </>
                  )}
              </div>
            )}
          </>
        )}

        {/*  REGISTER (Patient only  Name, Email, Password)  */}
        {mode === 'register' && (
          <>
            <div style={{ marginBottom:14 }}>
              {label('Full Name')}
              <input value={rName} onChange={e=>{setRName(e.target.value);setRErr('');}} type='text' placeholder='Enter your full name'
                style={{ width:'100%', padding:'10px 12px', border:'1px solid #c9d2df', borderRadius:9, fontSize:13, color:'#4b5563', fontFamily:'inherit', boxSizing:'border-box', outline:'none', background:'#ffffff' }} />
            </div>

            <div style={{ marginBottom:14 }}>
              {label('Email')}
              <input value={rEmail} onChange={e=>{setREmail(e.target.value);setRErr('');}} type='email' placeholder='Enter your email'
                style={{ width:'100%', padding:'10px 12px', border:'1px solid #c9d2df', borderRadius:9, fontSize:13, color:'#4b5563', fontFamily:'inherit', boxSizing:'border-box', outline:'none', background:'#ffffff' }} />
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
              <div>
                {label('Age')}
                <input value={rAge} onChange={e=>{setRAge(e.target.value);setRErr('');}} type='number' min='0' placeholder='Age'
                  style={{ width:'100%', padding:'10px 12px', border:'1px solid #c9d2df', borderRadius:9, fontSize:13, color:'#4b5563', fontFamily:'inherit', boxSizing:'border-box', outline:'none', background:'#ffffff' }} />
              </div>
              <div>
                {label('Gender')}
                <select value={rGender} onChange={e=>{setRGender(e.target.value);setRErr('');}}
                  style={{ width:'100%', padding:'10px 12px', border:'1px solid #c9d2df', borderRadius:9, fontSize:13, color:'#4b5563', fontFamily:'inherit', boxSizing:'border-box', outline:'none', background:'#ffffff' }}>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom:20 }}>
              {label('Password')}
              <div style={{ position:'relative' }}>
                <input value={rPass} onChange={e=>{setRPass(e.target.value);setRErr('');}} type={showRP?'text':'password'} placeholder='Enter your password'
                  style={{ width:'100%', padding:'10px 38px 10px 12px', border:'1px solid #c9d2df', borderRadius:9, fontSize:13, color:'#4b5563', fontFamily:'inherit', boxSizing:'border-box', outline:'none', background:'#ffffff' }} />
                <button onClick={()=>setShowRP(p=>!p)} tabIndex={-1}
                  style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', fontSize:14, color:'#64748b' }}>
                  {showRP?'🙈':'👁'}
                </button>
              </div>
            </div>

            {rErr && <div style={{ color:'#9b1c1c', fontSize:12, background:'#fef2f2', borderRadius:8, padding:'8px 12px', marginBottom:12, display:'flex', alignItems:'center', gap:6 }}>Warning: {rErr}</div>}

            {regSuccess && (
              <div style={{ color:'#166534', fontSize:13, background:'#dcfce7', border:'1px solid #bbf7d0', borderRadius:8, padding:'12px 14px', marginBottom:12, textAlign:'center', fontWeight:600 }}>
                Account created. Redirecting to Sign In...
              </div>
            )}

            <button onClick={handleRegister}
              style={{ width:'100%', padding:'11px 0', background:'#2663c6', color:'#fff', border:'none', borderRadius:9, fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
              Create Account
            </button>

            <div style={{ textAlign:'center', marginTop:12, fontSize:12, color:'#6b7280' }}>
              Already have an account?{' '}
              <button onClick={()=>setMode('login')} style={{ color:'#1a63c8', background:'none', border:'none', cursor:'pointer', fontWeight:600, textDecoration:'underline', fontFamily:'inherit' }}>
                Sign In
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}


//  MAIN APP 
const NAV = [
  { section:"Overview",        items:[{ label:"Dashboard",      icon:"📊", page:"dashboard"     }] },
  { section:"Patients & Care", items:[
    { label:"Patients",        icon:"👨", page:"patients"      },
    { label:"Doctors",         icon:"🩺", page:"doctors"       },
    { label:"Appointments",    icon:"🗓️", page:"appointments"  },
    { label:"Medical Records", icon:"📋", page:"records"       },
    { label:"Lab Reports",     icon:"🔬", page:"lab"           },
  ]},
  { section:"Clinical",        items:[
    { label:"Pharmacy",        icon:"💊", page:"pharmacy"      },
    { label:"Surgery / OT",    icon:"🪡", page:"surgery"       },
    { label:"Rooms & Wards",   icon:"🛏️", page:"rooms"         },
    { label:"Blood Bank",      icon:"🩸", page:"blood"         },
  ]},
  { section:"Operations",      items:[
    { label:"Staff",           icon:"👥", page:"staff"         },
    { label:"Billing",         icon:"💰", page:"billing"       },
    { label:"Inventory",       icon:"📦", page:"inventory"     },
    { label:"Ambulance",       icon:"🚑", page:"ambulance"     },
  ]},
  { section:"System",          items:[
    { label:"Admin Panel",     icon:"🔐", page:"admin"         },
    { label:"Reports",         icon:"📈", page:"reports"       },
    { label:"Notifications",   icon:"🔔", page:"notifications" },
  ]},
];

const PAGE_TITLES = { dashboard:"Dashboard",patients:"Patients",doctors:"Doctors",appointments:"Appointments",records:"Medical Records",lab:"Lab Reports",pharmacy:"Pharmacy",surgery:"Surgery / OT",rooms:"Rooms & Wards",blood:"Blood Bank",staff:"Staff",billing:"Billing",inventory:"Inventory",ambulance:"Ambulance",admin:"Admin Panel",reports:"Reports & Analytics",notifications:"Notifications" };
const APP_STATE_KEY = "medcareAppStateV1";
const DEFAULT_APP_STATE = {
  patients:INIT_PATIENTS, doctors:INIT_DOCTORS, appointments:INIT_APPTS,
  records:INIT_RECORDS, labReports:INIT_LAB, pharmacy:INIT_PHARMA,
  surgeries:INIT_SURGERY, wards:INIT_WARDS, bloodStock:INIT_BLOOD,
  donors:INIT_DONORS, staff:INIT_STAFF, billing:INIT_BILLING,
  inventory:INIT_INVENTORY, ambulance:INIT_AMBULANCE,
  notifications:INIT_NOTIFICATIONS, auditLog:INIT_AUDIT,
};

function loadAppState() {
  try {
    if (typeof window === "undefined") return DEFAULT_APP_STATE;
    const raw = localStorage.getItem(APP_STATE_KEY);
    if (!raw) return DEFAULT_APP_STATE;
    const saved = JSON.parse(raw);
    if (!saved || typeof saved !== "object") return DEFAULT_APP_STATE;
    return { ...DEFAULT_APP_STATE, ...saved };
  } catch {
    return DEFAULT_APP_STATE;
  }
}

function loadCurrentUser() {
  try {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem('medcareCurrentUser');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function App() {
  const [user,  setUser]  = useState(loadCurrentUser);
  const [page,  setPage]  = useState("dashboard");
  const [toast, setToast] = useState("");
  const [state, setState] = useState(loadAppState);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", content: "Hello! I'm MedCare AI. Ask me about live patient status, bills, beds, stock, appointments, doctors, lab reports, ambulances, or hospital operations." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const toastTimer = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(APP_STATE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('medcareCurrentUser', JSON.stringify(user));
      } else {
        localStorage.removeItem('medcareCurrentUser');
      }
    } catch {}
  }, [user]);

  // Keep registered patient users in sync with state.patients
  useEffect(() => {
    try {
      const regRaw = localStorage.getItem('medcarePatientUsers') || '[]';
      const reg = JSON.parse(regRaw);
      const patientEmails = (state.patients||[]).map(p => p.email).filter(Boolean);
      const filtered = reg.filter(u => patientEmails.includes(u.email));
      if (JSON.stringify(filtered) !== JSON.stringify(reg)) {
        localStorage.setItem('medcarePatientUsers', JSON.stringify(filtered));
      }
    } catch (e) {}
  }, [state.patients]);

  // Helper: update matching items across all array fields in state
  const updateAcrossState = (matcher, updater) => {
    setState(s => {
      const out = { ...s };
      Object.keys(s).forEach(k => {
        if (Array.isArray(s[k])) {
          out[k] = s[k].map(item => matcher(item) ? updater(item) : item);
        }
      });
      return out;
    });
  };

  // Helper: delete matching items across all array fields in state
  const deleteAcrossState = (matcher) => {
    setState(s => {
      const out = { ...s };
      Object.keys(s).forEach(k => {
        if (Array.isArray(s[k])) {
          out[k] = s[k].filter(item => !matcher(item));
        }
      });
      return out;
    });
    // Also purge from medcarePatientUsers if applicable
    try {
      const regRaw = localStorage.getItem('medcarePatientUsers') || '[]';
      const reg = JSON.parse(regRaw);
      const remained = reg.filter(u => !matcher(u));
      localStorage.setItem('medcarePatientUsers', JSON.stringify(remained));
    } catch (e) {}
  };

  const showToast = msg => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3000);
  };

  const addAudit = (msg, color="info") => {
    setState(s => ({...s, auditLog:[{msg,color,time:"Just now",ts:new Date().toISOString()},...s.auditLog].slice(0,50)}));
  };

  const addNotif = (msg, color, src) => {
    setState(s => ({...s, notifications:[{msg,color,src,time:"Just now",read:false},...s.notifications].slice(0,50)}));
  };

  const sendChatMessage = async () => {
    const text = chatInput.trim();
    if (!text || chatLoading) return;

    setChatInput("");
    setChatMessages(messages => [...messages, { role: "user", content: text }]);
    setChatLoading(true);

    const reply = await askAiAssistant(text, buildAssistantContext(state, user, page));
    setChatMessages(messages => [...messages, { role: "assistant", content: reply }]);
    setChatLoading(false);
  };

  if (!user) return <LoginScreen
    onLogin={u => { setUser(u); addAudit(`${u.name} logged in`, "success"); if(u.role==='Patient') setPage('appointments'); }}
    onRegisterPatient={newUser => {
      const parts = newUser.name.split(' ').filter(Boolean);
      const fname = parts.shift() || newUser.name;
      const lname = parts.join(' ') || '';
      const nextNum = Math.max(1000, ...state.patients.map(p => parseInt(p.id.replace(/\D/g, '')) || 1000)) + 1;
      const patientRecord = {
        id: `P-${nextNum}`,
        fname,
        lname,
        age: newUser.age || 0,
        gender: newUser.gender || 'Male',
        dept: 'General',
        doctor: 'Unassigned',
        admitted: today(),
        status: 'OPD',
        blood: 'Unknown',
        phone: ''
      };
      setState(s => ({ ...s, patients: [...s.patients, patientRecord] }));
      addAudit(`${newUser.name} registered`, 'success');
    }}
  />;

  const unread = state.notifications.filter(n=>!n.read).length;
  const initials = user.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  const PATIENT_NAV = [
    { section:"Overview",        items:[{ label:"Dashboard",      icon:"📊", page:"dashboard"    }] },
    { section:"Patients & Care", items:[
      { label:"Patients",        icon:"👨", page:"patients"     },
      { label:"Doctors",         icon:"🩺", page:"doctors"      },
      { label:"Appointments",    icon:"🗓️", page:"appointments" },
      { label:"Medical Records", icon:"📋", page:"records"      },
      { label:"Lab Reports",     icon:"🔬", page:"lab"          },
    ]},
    { section:"Clinical",        items:[
      { label:"Pharmacy",        icon:"💊", page:"pharmacy"     },
      { label:"Surgery / OT",    icon:"🪡", page:"surgery"      },
      { label:"Rooms & Wards",   icon:"🛏️", page:"rooms"        },
      { label:"Blood Bank",      icon:"🩸", page:"blood"        },
    ]},
    { section:"Operations",      items:[
      { label:"Staff",           icon:"👥", page:"staff"        },
      { label:"Inventory",       icon:"📦", page:"inventory"    },
      { label:"Ambulance",       icon:"🚑", page:"ambulance"    },
    ]},
  ];

  const navSections = user.role === "Patient"
    ? PATIENT_NAV
    : user.role === "Doctor"
    ? NAV.map(sec => sec.section === "System" ? { ...sec, items: sec.items.filter(i => i.page !== "admin") } : sec)
    : user.role === "Staff"
    ? [
        { section:"Patients & Care", items:[
          { label:"Patients",        icon:"👨", page:"patients"     },
          { label:"Doctors",         icon:"🩺", page:"doctors"      },
          { label:"Appointments",    icon:"🗓️", page:"appointments" },
          { label:"Medical Records", icon:"📋", page:"records"      },
          { label:"Lab Reports",     icon:"🔬", page:"lab"          },
        ]},
        { section:"Clinical",        items:[
          { label:"Pharmacy",        icon:"💊", page:"pharmacy"     },
          { label:"Surgery / OT",    icon:"🪡", page:"surgery"      },
          { label:"Rooms & Wards",   icon:"🛏️", page:"rooms"        },
          { label:"Blood Bank",      icon:"🩸", page:"blood"        },
        ]},
        { section:"Operations",      items:[
          { label:"Staff",           icon:"👥", page:"staff"        },
          { label:"Billing",         icon:"💰", page:"billing"      },
          { label:"Inventory",       icon:"📦", page:"inventory"    },
          { label:"Ambulance",       icon:"🚑", page:"ambulance"    },
        ]},
        { section:"System",          items:[
          { label:"Reports",         icon:"📈", page:"reports"      },
          { label:"Notifications",   icon:"🔔", page:"notifications"},
        ]},
      ]
    : NAV;

  const sharedProps = { state, setState, toast:showToast, addAudit, addNotif, currentUser:user,
    updateAcrossState, deleteAcrossState };

  const activePage = page;

  const pages = {
    dashboard:    <Dashboard    {...sharedProps} setPage={setPage} />,
    patients:     <PatientsPage {...sharedProps} />,
    doctors:      <DoctorsPage  {...sharedProps} />,
    appointments: <AppointmentsPage {...sharedProps} currentUser={user} />,
    records:      <RecordsPage  {...sharedProps} />,
    lab:          <LabPage      {...sharedProps} />,
    pharmacy:     <PharmacyPage {...sharedProps} />,
    surgery:      <SurgeryPage  {...sharedProps} />,
    rooms:        <WardsPage    {...sharedProps} />,
    blood:        <BloodBankPage {...sharedProps} />,
    staff:        <StaffPage    {...sharedProps} />,
    billing:      <BillingPage  {...sharedProps} />,
    inventory:    <InventoryPage {...sharedProps} />,
    ambulance:    <AmbulancePage {...sharedProps} />,
    admin:        <AdminPage    {...sharedProps} />,
    reports:      <ReportsPage  {...sharedProps} />,
    notifications:<NotificationsPage {...sharedProps} />,
  };

  return (
    <div style={{ display:"flex", height:"100vh", width:"100vw", overflow:"hidden", fontFamily:"'DM Sans',system-ui,sans-serif", fontSize:13.5, color:"#1a1d24", background:"#f0f4f9" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
        .animate-fade-in{animation:fadeIn 0.25s ease-out}
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-thumb{background:#d1d5db;border-radius:10px}
        ::-webkit-scrollbar-track{background:transparent}`}
      </style>

      {/* Sidebar */}
      <div style={{ width:230, minWidth:230, height:"100vh", background:"#fff", borderRight:"1px solid #e5e7eb", display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ padding:"12px 16px 10px", borderBottom:"1px solid #e5e7eb", display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
          <div style={{ width:32, height:32, background:"#e8f0ff", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>🏥</div>
          <div>
            <div style={{ fontSize:14, fontWeight:800, color:"#0f172a", lineHeight:1.1 }}>MedCare</div>
            <div style={{ fontSize:10, color:"#607187", marginTop:2 }}>{user.role} Panel</div>
          </div>
        </div>
        <nav style={{ flex:1, overflowY:"auto", padding:"6px 0" }}>
          {navSections.map(sec => (
            <div key={sec.section}>
              <div style={{ fontSize:9.5, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.08em", padding:"10px 16px 3px" }}>{sec.section}</div>
              {sec.items.map(item => (
                <div key={item.page} onClick={() => setPage(item.page)}
                  style={{ display:"flex", alignItems:"center", gap:9, padding:"7px 16px", cursor:"pointer", fontSize:13, color: activePage===item.page ? "#2563eb" : "#53637a",
                    borderLeft: `2.5px solid ${activePage===item.page?"#2563eb":"transparent"}`,
                    background: activePage===item.page ? "#eff6ff" : "transparent", fontWeight: activePage===item.page ? 600 : 400, whiteSpace:"nowrap", userSelect:"none" }}>
                  <span style={{ fontSize:14, width:17, textAlign:"center", flexShrink:0, lineHeight:1 }}>{item.icon}</span>
                  {item.label}
                  {item.page==="notifications"&&unread>0&&<span style={{ marginLeft:"auto", background:"#ef4444", color:"#fff", borderRadius:"50%", minWidth:18, height:18, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700 }}>{unread}</span>}
                </div>
              ))}
            </div>
          ))}
          <div onClick={() => { setUser(null); setPage('appointments'); }} style={{ display:"flex", alignItems:"center", gap:9, padding:"7px 16px", cursor:"pointer", fontSize:13, color:"#ef4444", borderLeft:"2.5px solid transparent", marginTop:8, userSelect:"none" }}>
            <span style={{ fontSize:11, width:17, textAlign:"center", fontWeight:700 }}>LO</span> Logout
          </div>
        </nav>
        <div style={{ padding:"12px 16px", borderTop:"1px solid #e5e7eb", flexShrink:0, display:"flex", alignItems:"center", gap:9 }}>
          <div style={{ width:30, height:30, borderRadius:"50%", background:"#dbeafe", color:"#1a63c8", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, flexShrink:0 }}>{initials}</div>
          <div style={{ minWidth:0 }}>
            <div style={{ fontSize:12, fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user.name}</div>
            <div style={{ fontSize:10, color:"#9ca3af", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user.email}</div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, height:"100vh", overflow:"hidden" }}>
        {/* Topbar */}
        <div style={{ height:52, background:"#fff", borderBottom:"1px solid #e5e7eb", display:"flex", alignItems:"center", padding:"0 20px", gap:12, flexShrink:0 }}>
          <div style={{ fontSize:15, fontWeight:700, flex:1 }}>{PAGE_TITLES[activePage]||activePage}</div>
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <span style={{ fontSize:11.5, color:"#6b7280", fontFamily:"monospace" }}>{new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</span>
            {user.role !== 'Patient' && <div style={{ position:"relative", cursor:"pointer", fontSize:14, fontWeight:700 }} onClick={()=>setPage('notifications')}>
              🔔
              {unread>0&&<span style={{ position:"absolute", top:-2, right:-6, background:"#ef4444", color:"#fff", borderRadius:"50%", fontSize:9, minWidth:16, height:16, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700 }}>{unread}</span>}
            </div>}
            <span style={{ fontSize:11.5, background:"#dbeafe", color:"#1a63c8", padding:"3px 10px", borderRadius:20, fontWeight:600 }}>{user.role}</span>
            <button onClick={() => { setUser(null); setPage('dashboard'); }} style={{ padding:"5px 12px", borderRadius:8, border:"1px solid #e5e7eb", background:"#fff", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>Logout</button>
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex:1, overflowY:"auto", padding:16 }}>
          {pages[activePage] || pages.appointments}
        </div>
      </div>

      {/* Chat button and modal */}
      <ChatButton onOpen={() => setChatOpen(true)} />
      {chatOpen && (
        <ChatModal
          messages={chatMessages}
          value={chatInput}
          onChange={setChatInput}
          onSend={sendChatMessage}
          onClose={() => setChatOpen(false)}
          loading={chatLoading}
        />
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", background:"#1a1d24", color:"#fff", padding:"10px 20px", borderRadius:10, fontSize:13, fontWeight:600, zIndex:99999, boxShadow:"0 4px 20px rgba(0,0,0,0.25)", animation:"fadeIn 0.2s" }}>
          {toast}
        </div>
      )}
    </div>
  );
}
