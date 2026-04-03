/* ═══════════════════════════════════════════════════
   MIBO main.js v3.0
   Cursor · Nav · Reveals · Gallery · Booking Funnel
   Razorpay · Formspree · Lead scoring
═══════════════════════════════════════════════════ */

// ── CONFIG ──
const CFG = {
  email: 'aymanhaidry2022@gmail.com',
  formspree: 'https://formspree.io/f/xblyrwgw',
  // Razorpay test key – replace with live key in production
  razorpayKey: 'rzp_test_REPLACE_WITH_KEY',
  pricing: { local: 7000, remote: 12000 },
  localStates: ['Bihar', 'bihar'],
  localCities: ['Delhi', 'NCR', 'Noida', 'Gurgaon', 'Faridabad', 'Ghaziabad'],
  supabaseUrl: 'https://REPLACE.supabase.co',
  supabaseKey: 'REPLACE_ANON_KEY',
};

// ── CURSOR ──
const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursorTrail');
let mx = 0, my = 0, tx = 0, ty = 0;
if (cursor) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
  });
  (function animT() {
    tx += (mx - tx) * .13; ty += (my - ty) * .13;
    if (trail) { trail.style.left = tx + 'px'; trail.style.top = ty + 'px'; }
    requestAnimationFrame(animT);
  })();
  document.querySelectorAll('a,button,.svc-card,.chk-item,.filt-btn,.gal-item,.dot,.slot-btn,.price-card').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('hov'); trail?.classList.add('hov'); });
    el.addEventListener('mouseleave', () => { cursor.classList.remove('hov'); trail?.classList.remove('hov'); });
  });
}

// ── NAV SCROLL ──
const nav = document.getElementById('mainNav');
if (nav) window.addEventListener('scroll', () => nav.classList.toggle('solid', window.scrollY > 60), { passive: true });

// ── HAMBURGER ──
const burger = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');
if (burger && mobileNav) {
  burger.addEventListener('click', () => {
    const o = mobileNav.classList.toggle('open');
    burger.classList.toggle('open', o);
    document.body.style.overflow = o ? 'hidden' : '';
  });
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  }));
}

// ── REVEAL ON SCROLL ──
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' });
document.querySelectorAll('.rev,.rev-r,.rev-l,.gal-item').forEach(el => revObs.observe(el));

// ── HERO ON LOAD ──
window.addEventListener('load', () => {
  document.querySelectorAll('.hero .rev,.hero .rev-r').forEach(el => el.classList.add('in'));
  const hf = document.querySelector('.hero-float');
  if (hf) setTimeout(() => hf.classList.add('in'), 700);
});

// ── PARALLAX ORBS ──
window.addEventListener('mousemove', e => {
  const x = (e.clientX / innerWidth - .5) * 20;
  const y = (e.clientY / innerHeight - .5) * 20;
  document.querySelectorAll('.orb-1').forEach(o => o.style.transform = `translate(${x * .5}px,${y * .5}px)`);
  document.querySelectorAll('.orb-2').forEach(o => o.style.transform = `translate(${-x * .3}px,${-y * .3}px)`);
}, { passive: true });

// ── TESTIMONIAL SLIDER ──
const tDots = document.querySelectorAll('.dot');
let curSlide = 0;
function goSlide(i) {
  const tr = document.getElementById('testiTrack');
  if (tr && innerWidth < 768) {
    tr.querySelectorAll('.testi-card').forEach((c, j) => c.style.display = j === i ? 'block' : 'none');
  }
  tDots.forEach(d => d.classList.remove('active'));
  if (tDots[i]) tDots[i].classList.add('active');
  curSlide = i;
}
tDots.forEach(d => d.addEventListener('click', () => goSlide(+d.dataset.idx)));
setInterval(() => { if (innerWidth < 768) goSlide((curSlide + 1) % Math.max(tDots.length, 1)); }, 5000);

// ── GALLERY FILTER ──
document.querySelectorAll('.filt-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filt-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('.gal-item').forEach(item => {
      const show = f === 'all' || item.dataset.cat === f;
      if (show) {
        item.style.display = '';
        item.style.opacity = '0';
        requestAnimationFrame(() => { item.style.opacity = '1'; });
      } else {
        item.style.opacity = '0';
        setTimeout(() => { item.style.display = 'none'; }, 400);
      }
    });
  });
});

// ── LIGHTBOX ──
let lbItems = [], lbIdx = 0;
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbTitle = document.getElementById('lbTitle');
const lbDesc = document.getElementById('lbDesc');
function openLb(items, i) { lbItems = items; setLb(i); lb?.classList.add('open'); document.body.style.overflow = 'hidden'; }
function setLb(i) {
  lbIdx = (i + lbItems.length) % lbItems.length;
  const it = lbItems[lbIdx];
  if (lbImg) lbImg.src = it.src;
  if (lbTitle) lbTitle.textContent = it.title || '';
  if (lbDesc) lbDesc.textContent = it.desc || '';
}
function closeLb() { lb?.classList.remove('open'); document.body.style.overflow = ''; }
document.getElementById('lbClose')?.addEventListener('click', closeLb);
document.getElementById('lbPrev')?.addEventListener('click', () => setLb(lbIdx - 1));
document.getElementById('lbNext')?.addEventListener('click', () => setLb(lbIdx + 1));
lb?.addEventListener('click', e => { if (e.target === lb) closeLb(); });
document.addEventListener('keydown', e => {
  if (!lb?.classList.contains('open')) return;
  if (e.key === 'Escape') closeLb();
  if (e.key === 'ArrowLeft') setLb(lbIdx - 1);
  if (e.key === 'ArrowRight') setLb(lbIdx + 1);
});
function initGalleryLightbox() {
  const items = Array.from(document.querySelectorAll('.gal-item[data-src]'));
  items.forEach((el, i) => {
    el.addEventListener('click', () => {
      const visible = items.filter(x => x.style.display !== 'none');
      const vi = visible.indexOf(el);
      openLb(visible.map(x => ({ src: x.dataset.src, title: x.dataset.title, desc: x.dataset.desc })), vi);
    });
  });
}
initGalleryLightbox();

// ── SERVICE CHECKBOXES ──
document.querySelectorAll('.chk-item').forEach(item => {
  item.addEventListener('click', () => item.classList.toggle('sel'));
});

// ── SLOT PICKER ──
document.querySelectorAll('.slot-btn:not(.taken)').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('picked'));
    btn.classList.add('picked');
    const inp = document.getElementById('selectedSlot');
    if (inp) inp.value = btn.dataset.slot || btn.textContent;
  });
});

// ── LOCATION + PRICING LOGIC ──
let detectedLocation = { state: '', city: '', category: 'remote', price: CFG.pricing.remote };
function classifyLocation(state, city) {
  const isLocal = CFG.localStates.some(s => state.toLowerCase().includes(s.toLowerCase()))
    || CFG.localCities.some(c => city.toLowerCase().includes(c.toLowerCase()));
  return isLocal ? 'local' : 'remote';
}
function updatePricingUI(category) {
  const amtEl = document.getElementById('payAmount');
  const locEl = document.getElementById('locDetect');
  const price = CFG.pricing[category];
  if (amtEl) amtEl.textContent = '₹' + price.toLocaleString('en-IN');
  if (locEl) {
    locEl.innerHTML = `📍 Detected: <strong>${detectedLocation.city || detectedLocation.state || 'Your area'}</strong> — 
    <strong>${category === 'local' ? 'Local' : 'Remote'}</strong> visit — ₹${price.toLocaleString('en-IN')}`;
  }
  const hid = document.getElementById('visitCharge');
  if (hid) hid.value = price;
  const catHid = document.getElementById('locationCategory');
  if (catHid) catHid.value = category;
}
function detectLocation() {
  const stateEl = document.getElementById('state');
  const cityEl = document.getElementById('city');
  if (!stateEl && !cityEl) return;
  const check = () => {
    const state = stateEl?.value || '';
    const city = cityEl?.value || '';
    if (state || city) {
      detectedLocation.state = state;
      detectedLocation.city = city;
      detectedLocation.category = classifyLocation(state, city);
      detectedLocation.price = CFG.pricing[detectedLocation.category];
      updatePricingUI(detectedLocation.category);
    }
  };
  stateEl?.addEventListener('input', check);
  cityEl?.addEventListener('input', check);
  stateEl?.addEventListener('change', check);
  cityEl?.addEventListener('change', check);
}
detectLocation();

// ── MULTI-STEP FORM ──
let currentStep = 1;
const totalSteps = 3;
function showStep(n) {
  document.querySelectorAll('.form-step').forEach((s, i) => {
    s.classList.toggle('active', i + 1 === n);
  });
  document.querySelectorAll('.step-dot-p').forEach((d, i) => {
    d.classList.toggle('active', i + 1 === n);
    d.classList.toggle('done', i + 1 < n);
  });
  document.querySelectorAll('.step-line').forEach((l, i) => {
    l.classList.toggle('done', i + 1 < n);
  });
  currentStep = n;
}
function nextStep() {
  if (!validateStep(currentStep)) return;
  if (currentStep < totalSteps) showStep(currentStep + 1);
  else submitForm();
}
function prevStep() { if (currentStep > 1) showStep(currentStep - 1); }
window.nextStep = nextStep;
window.prevStep = prevStep;

function validateStep(n) {
  let ok = true;
  const step = document.querySelector(`.form-step[data-step="${n}"]`);
  if (!step) return true;
  step.querySelectorAll('[required]').forEach(el => {
    if (!el.value.trim()) {
      el.style.borderColor = '#e05050';
      el.focus();
      ok = false;
    } else el.style.borderColor = '';
  });
  if (!ok) {
    const msg = step.querySelector('.step-err');
    if (msg) { msg.style.display = 'block'; setTimeout(() => msg.style.display = 'none', 3000); }
  }
  return ok;
}

// ── LEAD SCORING ──
function scoreLead(data) {
  let score = 0;
  if (data.budget === '₹30,000+' || data.budget === '₹60,000+') score += 30;
  else if (data.budget !== 'Not sure') score += 10;
  if (data.services?.length > 2) score += 20;
  if (data.phone) score += 20;
  if (data.homeType === 'Villa' || data.homeType === 'Penthouse') score += 20;
  if (data.timeline === 'Within 1 month') score += 10;
  return score >= 60 ? 'hot' : score >= 30 ? 'warm' : 'basic';
}

// ── RAZORPAY PAYMENT ──
function initRazorpay(bookingData) {
  const price = detectedLocation.price || CFG.pricing.remote;
  const options = {
    key: CFG.razorpayKey,
    amount: price * 100, // paise
    currency: 'INR',
    name: 'MIBO Interiors',
    description: `Site Visit Consultation — ${detectedLocation.category === 'local' ? 'Local' : 'Remote'}`,
    image: '', // add logo URL
    prefill: {
      name: bookingData.name,
      email: bookingData.email,
      contact: bookingData.phone,
    },
    notes: {
      city: detectedLocation.city,
      state: detectedLocation.state,
      services: bookingData.services,
    },
    theme: { color: '#c9a96e' },
    handler: async function(response) {
      await onPaymentSuccess(response, bookingData);
    },
    modal: {
      ondismiss: function() {
        const btn = document.getElementById('razorpay-btn');
        if (btn) { btn.textContent = 'Pay & Confirm Booking →'; btn.disabled = false; }
      }
    }
  };
  if (typeof Razorpay !== 'undefined') {
    const rzp = new Razorpay(options);
    rzp.open();
  } else {
    // Razorpay not loaded – fallback: submit form directly
    console.warn('Razorpay SDK not loaded. Falling back to direct submission.');
    onPaymentSuccess({ razorpay_payment_id: 'OFFLINE_' + Date.now() }, bookingData);
  }
}

async function onPaymentSuccess(payResponse, bookingData) {
  const refId = 'MIBO-' + Date.now().toString(36).toUpperCase();
  // Show success
  document.getElementById('formInner')?.style && (document.getElementById('formInner').style.display = 'none');
  const suc = document.getElementById('formSuccess');
  if (suc) {
    suc.classList.add('show');
    const refEl = document.getElementById('refId');
    if (refEl) refEl.textContent = refId;
  }
  // Send confirmation email via Formspree
  const fd = new FormData();
  fd.append('_subject', `New MIBO Booking Confirmed — ${bookingData.name}`);
  fd.append('Name', bookingData.name);
  fd.append('Email', bookingData.email);
  fd.append('Phone', bookingData.phone);
  fd.append('Home Type', bookingData.homeType || '');
  fd.append('City', bookingData.city || '');
  fd.append('State', bookingData.state || '');
  fd.append('Services', bookingData.services || '');
  fd.append('Budget', bookingData.budget || '');
  fd.append('Slot', bookingData.slot || '');
  fd.append('Visit Charge', '₹' + detectedLocation.price);
  fd.append('Location Category', detectedLocation.category);
  fd.append('Payment ID', payResponse.razorpay_payment_id || '');
  fd.append('Reference ID', refId);
  fd.append('Lead Score', scoreLead(bookingData));
  fd.append('Message', bookingData.message || '');
  try {
    await fetch(CFG.formspree, { method: 'POST', body: fd, headers: { 'Accept': 'application/json' } });
  } catch (e) { console.error(e); }
}

// ── MAIN BOOKING FORM SUBMIT ──
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
  document.getElementById('razorpay-btn')?.addEventListener('click', async function() {
    if (!validateStep(3)) return;
    this.textContent = 'Opening Payment…';
    this.disabled = true;
    const services = Array.from(document.querySelectorAll('.chk-item.sel')).map(el => el.dataset.service).join(', ');
    const data = {
      name: (document.getElementById('firstName')?.value || '') + ' ' + (document.getElementById('lastName')?.value || ''),
      email: document.getElementById('email')?.value || '',
      phone: document.getElementById('phone')?.value || '',
      homeType: document.getElementById('homeType')?.value || '',
      city: document.getElementById('city')?.value || '',
      state: document.getElementById('state')?.value || '',
      services,
      budget: document.getElementById('budget')?.value || '',
      slot: document.getElementById('selectedSlot')?.value || '',
      message: document.getElementById('message')?.value || '',
    };
    initRazorpay(data);
  });
}

// ── QUICK ENQUIRY FORM ──
const quickForm = document.getElementById('quickEnquiryForm');
if (quickForm) {
  quickForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = this.querySelector('button[type=submit]');
    btn.textContent = 'Sending…'; btn.disabled = true;
    const fd = new FormData(this);
    fd.append('_subject', 'Quick Enquiry — MIBO Website');
    fd.append('Form Source', 'Homepage');
    try {
      const r = await fetch(CFG.formspree, { method: 'POST', body: fd, headers: { 'Accept': 'application/json' } });
      if (r.ok) {
        this.innerHTML = '<p style="color:var(--gold);font-family:var(--display);font-size:1.2rem;font-style:italic;text-align:center;padding:20px 0;">Thank you! We\'ll be in touch within 24 hours. ✦</p>';
      } else { btn.textContent = 'Try Again'; btn.disabled = false; }
    } catch { btn.textContent = 'Try Again'; btn.disabled = false; }
  });
}

// ── SLOT DATE GENERATOR (simple – replace with real API) ──
function generateSlots() {
  const grid = document.getElementById('slotGrid');
  if (!grid) return;
  const slots = [];
  const now = new Date();
  const cat = detectedLocation.category;
  for (let i = 0; i < 28; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i + 1);
    const day = d.getDay();
    // Remote: only Fri(5)/Sat(6) + min 5 days gap
    if (cat === 'remote' && (day !== 5 && day !== 6)) continue;
    if (cat === 'remote' && i < 4) continue;
    const label = d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
    slots.push({ label, val: d.toISOString().split('T')[0] });
    if (slots.length >= 6) break;
  }
  grid.innerHTML = slots.map(s =>
    `<button type="button" class="slot-btn" data-slot="${s.val}">${s.label}</button>`
  ).join('');
  // re-bind slot events
  grid.querySelectorAll('.slot-btn:not(.taken)').forEach(btn => {
    btn.addEventListener('click', () => {
      grid.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('picked'));
      btn.classList.add('picked');
      const inp = document.getElementById('selectedSlot');
      if (inp) inp.value = btn.dataset.slot;
    });
  });
}
// Re-generate slots when location changes
['state','city'].forEach(id => {
  document.getElementById(id)?.addEventListener('change', () => {
    setTimeout(generateSlots, 200);
  });
});
generateSlots();

// ── INIT ──
showStep(1);
