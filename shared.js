/* ═══════════════════════════════════════════════════
   shared.js — MIBO v4.0
   Injects uniform Nav + Footer on every public page.
   Also: cursor, scroll, reveal, testimonials, gallery,
   quick-enquiry, Supabase client, Razorpay verify flow.
═══════════════════════════════════════════════════ */

// ── CONFIG (set once here, used everywhere) ────────────────
const MIBO = {
  supabaseUrl:  'https://lfygfnsiignolmdnewhb.supabase.co',
  supabaseKey:  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmeWdmbnNpaWdub2xtZG5ld2hiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMjE0MDYsImV4cCI6MjA5MDc5NzQwNn0.sw7n3JezeS5FcyN-IAhcbFycScKQxQyoyZTsaNbitS8',
  razorpayKey:  'rzp_test_REPLACE_WITH_YOUR_KEY',   // ← swap for rzp_live_ in prod
  verifyEndpoint: '/api/verify-payment',             // your server endpoint
  formspree:    'https://formspree.io/f/xblyrwgw',
  adminEmail:   'aymanhaidry2022@gmail.com',
  pricing:      { local: 7000, remote: 12000 },
  localStates:  ['Bihar','Delhi','Haryana','Uttar Pradesh'],
  localCities:  ['Patna','Delhi','Noida','Gurgaon','Faridabad','Ghaziabad','Greater Noida'],
};

// ── SUPABASE CLIENT ────────────────────────────────────────
let _sb = null;
function getSB() {
  if (!_sb && window.supabase) _sb = window.supabase.createClient(MIBO.supabaseUrl, MIBO.supabaseKey);
  return _sb;
}

// ── NAV TEMPLATE ──────────────────────────────────────────
const NAV_HTML = `
<div class="cursor" id="cursor"></div>
<div class="cursor-trail" id="cursorTrail"></div>
<nav class="nav" id="mainNav">
  <a href="/index.html" class="nav-logo"><span class="logo-m">M</span><span class="logo-i">IBO</span></a>
  <div class="nav-links">
    <a href="/about.html"    data-page="about">About</a>
    <a href="/services.html" data-page="services">Services</a>
    <a href="/gallery.html"  data-page="gallery">Gallery</a>
    <a href="/process.html"  data-page="process">Process</a>
    <a href="/book.html"     data-page="book">Book Visit</a>
    <a href="/contact.html"  data-page="contact">Contact</a>
  </div>
  <div class="nav-right">
    <a href="/book.html" class="nav-cta">Book Free Consultation</a>
    <button class="nav-burger" id="burger" aria-label="Menu"><span></span><span></span></button>
  </div>
</nav>
<div class="mobile-nav" id="mobileNav">
  <a href="/about.html">About</a>
  <a href="/services.html">Services</a>
  <a href="/gallery.html">Gallery</a>
  <a href="/process.html">Process</a>
  <a href="/book.html">Book Visit</a>
  <a href="/contact.html">Contact</a>
  <a href="/book.html" class="mobile-cta-btn">Book Consultation</a>
</div>`;

// ── FOOTER TEMPLATE ────────────────────────────────────────
const FOOTER_HTML = `
<div class="comm-banner">
  <div class="comm-inner">
    <div>
      <div class="comm-tag">Primary focus: Residential Homes</div>
      <div class="comm-text"><p><strong>MIBO specialises exclusively in homes.</strong> For commercial, office or hospitality projects, visit our sister site.</p></div>
    </div>
    <a href="#" class="btn btn-ghost btn-sm" style="white-space:nowrap">MIBO Commercial →</a>
  </div>
</div>
<footer class="footer">
  <div class="footer-top">
    <div class="footer-brand">
      <div class="footer-logo"><span class="logo-m">M</span><span class="logo-i">IBO</span></div>
      <p>Mesmerizing Interiors,<br>Bold Outcomes.<br><em>Exclusively for homes.</em></p>
      <div class="footer-soc">
        <a href="https://www.instagram.com/_mibospaces/" target="_blank" rel="noopener" aria-label="Instagram">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>
        </a>
        <a href="https://www.linkedin.com/in/mibo-mesmerizing-interiors-bold-outcomes-a41750319/" target="_blank" rel="noopener" aria-label="LinkedIn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="3"/><path d="M7 10v7M7 7v.01M12 17v-4c0-1.105.895-2 2-2s2 .895 2 2v4M12 10v7"/></svg>
        </a>
        <a href="https://x.com/MiboSpaces" target="_blank" rel="noopener" aria-label="X/Twitter">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </a>
      </div>
    </div>
    <div class="footer-links">
      <div class="footer-col">
        <h4>Services</h4>
        <a href="/services.html">Turnkey Interiors</a>
        <a href="/services.html#ceilings">False Ceilings</a>
        <a href="/services.html#furniture">Furniture</a>
        <a href="/services.html#tiles">Tiles</a>
        <a href="/services.html#paints">Paints</a>
        <a href="/services.html#drywall">Drywall</a>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <a href="/about.html">About MIBO</a>
        <a href="/gallery.html">Gallery</a>
        <a href="/process.html">Process</a>
        <a href="/book.html">Book Consultation</a>
        <a href="/contact.html">Contact</a>
        <a href="http://bit.ly/mibotchat" target="_blank" rel="noopener">MIBO AI Chat</a>
        <div class="footer-commercial-note">
          Need commercial/office interiors?<br>
          <a href="#">Visit MIBO Commercial →</a> (coming soon)
        </div>
      </div>
      <div class="footer-col">
        <h4>Legal</h4>
        <a href="/privacy.html">Privacy Policy</a>
        <a href="/terms.html">Terms of Service</a>
        <a href="/refund.html">Refund Policy</a>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© 2026 MIBO — Mesmerizing Interiors, Bold Outcomes. All rights reserved. Exclusively residential.</p>
    <p>Payments secured by <strong style="color:var(--gold)">Razorpay</strong></p>
  </div>
</footer>`;

// ── INJECT NAV + FOOTER ────────────────────────────────────
function injectShell() {
  // Nav: prepend to body
  const navWrap = document.createElement('div');
  navWrap.innerHTML = NAV_HTML;
  document.body.insertBefore(navWrap, document.body.firstChild);

  // Footer: append before </body>
  const footerWrap = document.createElement('div');
  footerWrap.innerHTML = FOOTER_HTML;
  document.body.appendChild(footerWrap);

  // Mark active nav link
  const page = document.body.dataset.page || '';
  document.querySelectorAll('.nav-links a[data-page]').forEach(a => {
    if (a.dataset.page === page) a.classList.add('active');
  });

  initCore();
}

// ── CORE INTERACTIONS ──────────────────────────────────────
function initCore() {
  // Cursor
  const cur = document.getElementById('cursor');
  const trail = document.getElementById('cursorTrail');
  if (cur && window.matchMedia('(pointer:fine)').matches) {
    let mx=0,my=0,tx=0,ty=0;
    document.addEventListener('mousemove', e => {
      mx=e.clientX; my=e.clientY;
      cur.style.left=mx+'px'; cur.style.top=my+'px';
    });
    (function animT(){ tx+=(mx-tx)*.13; ty+=(my-ty)*.13; trail.style.left=tx+'px'; trail.style.top=ty+'px'; requestAnimationFrame(animT); })();
    document.querySelectorAll('a,button,.svc-card,.svc-photo-card,.chk-item,.filt-btn,.gal-item,.dot,.slot-btn,.price-card,.slot-item').forEach(el=>{
      el.addEventListener('mouseenter',()=>{cur.classList.add('hov');trail.classList.add('hov');});
      el.addEventListener('mouseleave',()=>{cur.classList.remove('hov');trail.classList.remove('hov');});
    });
  }

  // Nav scroll
  const nav = document.getElementById('mainNav');
  if (nav) window.addEventListener('scroll',()=>nav.classList.toggle('solid',scrollY>60),{passive:true});

  // Hamburger
  const burger = document.getElementById('burger');
  const mNav = document.getElementById('mobileNav');
  if (burger && mNav) {
    burger.addEventListener('click',()=>{
      const o=mNav.classList.toggle('open');
      burger.classList.toggle('open',o);
      document.body.style.overflow=o?'hidden':'';
    });
    mNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
      mNav.classList.remove('open'); burger.classList.remove('open'); document.body.style.overflow='';
    }));
  }

  // Reveal on scroll
  const ro = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in'); });
  },{threshold:0.08,rootMargin:'0px 0px -36px 0px'});
  document.querySelectorAll('.rev,.rev-r,.rev-l,.gal-item').forEach(el=>ro.observe(el));

  // Hero on load
  window.addEventListener('load',()=>{
    document.querySelectorAll('.hero .rev,.hero .rev-r').forEach(el=>el.classList.add('in'));
    const hf=document.querySelector('.hero-float');
    if(hf) setTimeout(()=>hf.classList.add('in'),700);
  });

  // Parallax orbs
  window.addEventListener('mousemove',e=>{
    const x=(e.clientX/innerWidth-.5)*20, y=(e.clientY/innerHeight-.5)*20;
    document.querySelectorAll('.orb-1').forEach(o=>o.style.transform=`translate(${x*.5}px,${y*.5}px)`);
    document.querySelectorAll('.orb-2').forEach(o=>o.style.transform=`translate(${-x*.3}px,${-y*.3}px)`);
  },{passive:true});

  // Testimonial dots
  const dots=document.querySelectorAll('.dot');
  let curSlide=0;
  function goSlide(i){
    const tr=document.getElementById('testiTrack');
    if(tr && innerWidth<768) tr.querySelectorAll('.testi-card').forEach((c,j)=>c.style.display=j===i?'block':'none');
    dots.forEach(d=>d.classList.remove('active'));
    if(dots[i]) dots[i].classList.add('active');
    curSlide=i;
  }
  dots.forEach(d=>d.addEventListener('click',()=>goSlide(+d.dataset.idx)));
  setInterval(()=>{if(innerWidth<768)goSlide((curSlide+1)%Math.max(dots.length,1));},5000);

  // Gallery filter + lightbox
  initGallery();

  // Quick enquiry form
  initQuickEnquiry();
}

// ── GALLERY ────────────────────────────────────────────────
function initGallery() {
  document.querySelectorAll('.filt-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.filt-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const f=btn.dataset.filter;
      document.querySelectorAll('.gal-item').forEach(item=>{
        const show=f==='all'||item.dataset.cat===f;
        if(show){item.style.display='';requestAnimationFrame(()=>{item.style.opacity='1';});}
        else{item.style.opacity='0';setTimeout(()=>item.style.display='none',400);}
      });
    });
  });

  // Lightbox
  const lb=document.getElementById('lightbox');
  const lbImg=document.getElementById('lbImg');
  const lbTitle=document.getElementById('lbTitle');
  const lbDesc=document.getElementById('lbDesc');
  let lbItems=[],lbIdx=0;
  function setLb(i){
    lbIdx=(i+lbItems.length)%lbItems.length;
    const it=lbItems[lbIdx];
    if(lbImg) lbImg.src=it.src;
    if(lbTitle) lbTitle.textContent=it.title||'';
    if(lbDesc) lbDesc.textContent=it.desc||'';
  }
  function openLb(items,i){lbItems=items;setLb(i);lb?.classList.add('open');document.body.style.overflow='hidden';}
  function closeLb(){lb?.classList.remove('open');document.body.style.overflow='';}
  document.getElementById('lbClose')?.addEventListener('click',closeLb);
  document.getElementById('lbPrev')?.addEventListener('click',()=>setLb(lbIdx-1));
  document.getElementById('lbNext')?.addEventListener('click',()=>setLb(lbIdx+1));
  lb?.addEventListener('click',e=>{if(e.target===lb)closeLb();});
  document.addEventListener('keydown',e=>{
    if(!lb?.classList.contains('open'))return;
    if(e.key==='Escape')closeLb();
    if(e.key==='ArrowLeft')setLb(lbIdx-1);
    if(e.key==='ArrowRight')setLb(lbIdx+1);
  });
  const galItems=Array.from(document.querySelectorAll('.gal-item[data-src]'));
  galItems.forEach((el,i)=>{
    el.addEventListener('click',()=>{
      const visible=galItems.filter(x=>x.style.display!=='none');
      const vi=visible.indexOf(el);
      openLb(visible.map(x=>({src:x.dataset.src,title:x.dataset.title,desc:x.dataset.desc})),vi);
    });
  });
}

// ── QUICK ENQUIRY ──────────────────────────────────────────
function initQuickEnquiry() {
  const qf=document.getElementById('quickEnquiryForm');
  if(!qf) return;
  qf.addEventListener('submit',async function(e){
    e.preventDefault();
    const btn=this.querySelector('button[type=submit]');
    btn.textContent='Sending…'; btn.disabled=true;
    const fd=new FormData(this);
    fd.append('_subject','Quick Enquiry — MIBO Website');
    // Save to Supabase
    const sb=getSB();
    if(sb){
      await sb.from('leads').insert([{
        full_name: fd.get('Name')||'',
        email:     fd.get('Email')||'',
        phone:     fd.get('Phone')||'',
        service_type: fd.get('Service Interest')||'',
        source:    'Homepage Quick Enquiry',
        is_paid:   false,
        status:    'New',
        lead_score:'basic',
      }]).catch(()=>{});
    }
    // Formspree fallback email
    try{
      const r=await fetch(MIBO.formspree,{method:'POST',body:fd,headers:{'Accept':'application/json'}});
      if(r.ok){
        qf.innerHTML='<p style="color:var(--gold);font-family:var(--display);font-size:1.2rem;font-style:italic;text-align:center;padding:20px 0">Thank you! We\'ll be in touch within 24 hours. ✦</p>';
      } else { btn.textContent='Try Again'; btn.disabled=false; }
    }catch{ btn.textContent='Try Again'; btn.disabled=false; }
  });
}

// ── LOCATION DETECT ────────────────────────────────────────
window.detectedLocation = { category:'remote', price: MIBO.pricing.remote };
function detectLocation(city='', state='') {
  const isLocal = MIBO.localStates.some(s=>s===state) ||
                  MIBO.localCities.some(c=>city.toLowerCase().includes(c.toLowerCase()));
  window.detectedLocation = isLocal
    ? { category:'local',  price: MIBO.pricing.local  }
    : { category:'remote', price: MIBO.pricing.remote };
  updateLocUI();
}
function updateLocUI(){
  const d=window.detectedLocation;
  const el=document.getElementById('locDetect');
  if(el) el.innerHTML=`📍 <strong style="color:var(--gold)">${d.category==='local'?'LOCAL':'REMOTE'} VISIT</strong> — ₹${d.price.toLocaleString('en-IN')} ${d.category==='local'?'(Bihar/NCR — any day)':'(Rest of India — Fri/Sat only)'}`;
  const vc=document.getElementById('visitCharge');
  const lc=document.getElementById('locationCategory');
  if(vc) vc.value=d.price;
  if(lc) lc.value=d.category;
  generateSlots();
}

// ── SLOT GENERATOR ─────────────────────────────────────────
async function generateSlots(){
  const grid=document.getElementById('slotGrid');
  if(!grid) return;
  const cat=window.detectedLocation.category;
  const sb=getSB();
  let slots=[];

  if(sb){
    const{data}=await sb.from('slots').select('*').gte('date',new Date().toISOString().split('T')[0]).eq('slot_type',cat==='local'?'Local':'Remote').eq('is_blocked',false).order('date').limit(12).catch(()=>({data:null}));
    if(data?.length) slots=data.filter(s=>s.booked_count<s.total_capacity);
  }

  // Client-side fallback
  if(!slots.length){
    const now=new Date();
    for(let i=0;i<28&&slots.length<6;i++){
      const d=new Date(now); d.setDate(now.getDate()+i+1);
      const day=d.getDay();
      if(cat==='remote'&&(day!==5&&day!==6)) continue;
      if(cat==='remote'&&i<4) continue;
      slots.push({id:'local-'+i,date:d.toISOString().split('T')[0],slot_type:cat==='local'?'Local':'Remote',booked_count:0,total_capacity:3});
    }
  }

  grid.innerHTML=slots.length
    ? slots.map(s=>`
        <div class="slot-item" data-slot-id="${s.id}" data-date="${s.date}" onclick="pickSlot(this,'${s.id}','${s.date}','${s.slot_type}')">
          <div class="slot-date">${new Date(s.date+'T00:00:00').toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'})}</div>
          <div class="slot-type-lbl">${s.slot_type}</div>
          <div class="slot-avail">${s.total_capacity-s.booked_count} spot${s.total_capacity-s.booked_count!==1?'s':''} left</div>
        </div>`).join('')
    : '<div style="padding:16px;color:var(--dim);grid-column:1/-1">No slots available. <a href="/contact.html" style="color:var(--gold)">Contact us directly →</a></div>';
}

function pickSlot(el,id,date,type){
  document.querySelectorAll('.slot-item').forEach(i=>i.classList.remove('selected'));
  el.classList.add('selected');
  const inp=document.getElementById('selectedSlot');
  if(inp) inp.value=`${type} Slot - ${date}`;
}
window.pickSlot=pickSlot;

// ── MULTI-STEP FORM ────────────────────────────────────────
let currentStep=1;
function showStep(n){
  document.querySelectorAll('.form-step').forEach((s,i)=>s.classList.toggle('active',i+1===n));
  document.querySelectorAll('.step-dot-p').forEach((d,i)=>{
    d.classList.toggle('active',i+1===n);
    d.classList.toggle('done',i+1<n);
  });
  document.querySelectorAll('.step-line').forEach((l,i)=>l.classList.toggle('done',i+1<n));
  currentStep=n;
}
function validateStep(n){
  const step=document.querySelector(`.form-step[data-step="${n}"]`);
  if(!step) return true;
  let ok=true;
  step.querySelectorAll('[required]').forEach(el=>{
    const v=el.value.trim();
    el.style.borderColor=v?'':'#e05050';
    if(!v) ok=false;
  });
  const err=step.querySelector('.step-err');
  if(err) err.style.display=ok?'none':'block';
  return ok;
}
function nextStep(){
  if(!validateStep(currentStep)) return;
  if(currentStep===2&&!document.getElementById('selectedSlot')?.value){
    const err=document.querySelector('.form-step[data-step="2"] .step-err');
    if(err){err.textContent='Please pick a date slot.';err.style.display='block';}
    return;
  }
  if(currentStep<3) showStep(currentStep+1);
  if(currentStep===3) buildSummary();
}
function prevStep(){ if(currentStep>1) showStep(currentStep-1); }
window.nextStep=nextStep; window.prevStep=prevStep;

function buildSummary(){
  const city=document.getElementById('city')?.value||'';
  const state=document.getElementById('state')?.value||'';
  const slot=document.getElementById('selectedSlot')?.value||'Not selected';
  const svcs=Array.from(document.querySelectorAll('.chk-item.sel')).map(e=>e.dataset.service).join(', ')||'Not specified';
  const d=window.detectedLocation;
  const el=id=>document.getElementById(id);
  if(el('summaryType')) el('summaryType').textContent=d.category==='local'?'Local':'Remote';
  if(el('summaryLoc'))  el('summaryLoc').textContent=[city,state].filter(Boolean).join(', ')||'—';
  if(el('summarySlot')) el('summarySlot').textContent=slot;
  if(el('summaryServices')) el('summaryServices').textContent=svcs;
  if(el('payAmount')) el('payAmount').textContent='₹'+d.price.toLocaleString('en-IN');
}

// ── RAZORPAY + SERVER-SIDE VERIFY ─────────────────────────
// Payment flow:
//  1. Client opens Razorpay modal
//  2. On success, Razorpay returns {razorpay_payment_id, razorpay_order_id, razorpay_signature}
//  3. Client POSTs all three to /api/verify-payment (your Node/Edge server)
//  4. Server verifies HMAC-SHA256 signature using Razorpay Key Secret — NOT stored in frontend
//  5. Server saves to Supabase and returns {ok:true, bookingId}
//  6. Client shows success screen

async function startPayment(){
  const btn=document.getElementById('razorpay-btn');
  if(!btn) return;
  if(!validateStep(3)) return;

  const services=Array.from(document.querySelectorAll('.chk-item.sel')).map(e=>e.dataset.service).join(', ');
  const fd=new FormData(document.getElementById('bookingForm'));
  const name=`${fd.get('First Name')||''} ${fd.get('Last Name')||''}`.trim();
  const payload={
    name, email:fd.get('Email'), phone:fd.get('Phone'),
    city:fd.get('City'), state:fd.get('State'),
    homeType:fd.get('Home Type'), homeSize:fd.get('Home Size'),
    services, budget:fd.get('Budget'), timeline:fd.get('Timeline'),
    slot:fd.get('Slot'), prefTime:fd.get('Preferred Time'),
    message:fd.get('Message')||'',
    visitCharge:window.detectedLocation.price,
    locationCategory:window.detectedLocation.category,
    source:'Booking Form',
  };

  btn.textContent='Opening Payment…'; btn.disabled=true;

  const options={
    key: MIBO.razorpayKey,
    amount: window.detectedLocation.price*100,
    currency:'INR',
    name:'MIBO Home Interiors',
    description:`${payload.locationCategory==='local'?'Local':'Remote'} Site Visit — ${payload.slot}`,
    image:'',
    prefill:{ name:payload.name, email:payload.email, contact:payload.phone },
    notes:{ city:payload.city, state:payload.state, services:payload.services },
    theme:{ color:'#c9a96e' },
    handler: async function(resp){
      // resp = { razorpay_payment_id, razorpay_order_id, razorpay_signature }
      btn.textContent='Verifying Payment…';
      try{
        const vRes=await fetch(MIBO.verifyEndpoint,{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({
            razorpay_payment_id:  resp.razorpay_payment_id,
            razorpay_order_id:    resp.razorpay_order_id,
            razorpay_signature:   resp.razorpay_signature,
            bookingData: payload,
          }),
        });
        const json=await vRes.json();
        if(json.ok){
          showBookingSuccess(json.bookingId||resp.razorpay_payment_id);
        } else {
          alert('Payment received but verification failed. Please contact us with Payment ID: '+resp.razorpay_payment_id);
          btn.textContent='Pay & Confirm Booking →'; btn.disabled=false;
        }
      }catch(err){
        console.error('Verify error',err);
        // Fallback: save directly if server unreachable (dev mode)
        await fallbackSave(resp,payload);
      }
    },
    modal:{ ondismiss(){ btn.textContent='Pay & Confirm Booking →'; btn.disabled=false; } },
  };

  if(typeof Razorpay!=='undefined'){
    new Razorpay(options).open();
  } else {
    alert('Razorpay SDK not loaded. Please check internet connection.');
    btn.textContent='Pay & Confirm Booking →'; btn.disabled=false;
  }
}
window.startPayment=startPayment;

// Fallback (dev/offline): save directly to Supabase without server verify
async function fallbackSave(resp,payload){
  const sb=getSB();
  const refId='MIBO-'+Date.now().toString(36).toUpperCase();
  if(sb){
    await sb.from('leads').insert([{
      full_name: payload.name,
      email:     payload.email,
      phone:     payload.phone,
      city:      payload.city,
      state:     payload.state,
      home_type: payload.homeType,
      service_type: payload.services,
      budget_range: payload.budget,
      message:   payload.message,
      source:    payload.source,
      is_paid:   true,
      slot_date: payload.slot?.split(' - ')[1]||null,
      slot_time: payload.prefTime,
      payment_id:resp.razorpay_payment_id,
      amount_paid: payload.visitCharge,
      location_category: payload.locationCategory,
      status:    'Confirmed',
      lead_score:'Hot',
      reference_id: refId,
    }]).catch(e=>console.error('Supabase fallback error',e));
  }
  // Also email via Formspree
  const fd2=new FormData();
  Object.entries({...payload, payment_id:resp.razorpay_payment_id, ref_id:refId})
    .forEach(([k,v])=>fd2.append(k,v||''));
  fd2.append('_subject',`MIBO Booking Confirmed — ${payload.name}`);
  await fetch(MIBO.formspree,{method:'POST',body:fd2,headers:{'Accept':'application/json'}}).catch(()=>{});
  showBookingSuccess(refId);
}

function showBookingSuccess(refId){
  const fi=document.getElementById('formInner');
  const fs=document.getElementById('formSuccess');
  if(fi) fi.style.display='none';
  if(fs){ fs.classList.add('show'); const ri=document.getElementById('refId'); if(ri) ri.textContent=refId; }
}

// ── LOCATION LISTENERS (book.html) ────────────────────────
document.addEventListener('DOMContentLoaded',()=>{
  showStep(1);
  updateLocUI();
  ['city','state'].forEach(id=>{
    const el=document.getElementById(id);
    if(el){
      el.addEventListener('input',()=>detectLocation(document.getElementById('city')?.value,document.getElementById('state')?.value));
      el.addEventListener('change',()=>detectLocation(document.getElementById('city')?.value,document.getElementById('state')?.value));
    }
  });
  document.querySelectorAll('.chk-item').forEach(item=>item.addEventListener('click',()=>item.classList.toggle('sel')));
  const rzBtn=document.getElementById('razorpay-btn');
  if(rzBtn) rzBtn.addEventListener('click',startPayment);

  injectShell();
});
