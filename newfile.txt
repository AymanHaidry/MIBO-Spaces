// main.js - FULL PAYWALL + SUPABASE (Production Ready)
const SUPABASE_URL = "https://lfygfnsiignolmdnewhb.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmeWdmbnNpaWdub2xtZG5ld2hiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMjE0MDYsImV4cCI6MjA5MDc5NzQwNn0.sw7n3JezeS5FcyN-IAhcbFycScKQxQyoyZTsaNbitS8";

// Supabase client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let currentStep = 1;
let detectedLocation = { category: 'remote', price: 12000 };
let selectedServices = [];

// 1. LOCATION DETECTION (Bihar/NCR = ₹7K, Other = ₹12K)
function detectLocation(city, state) {
  const localAreas = ['Patna', 'Delhi', 'Noida', 'Gurgaon', 'Ghaziabad', 'Bihar', 'Haryana', 'Uttar Pradesh'];
  const isLocal = localAreas.some(area => 
    (city && city.toLowerCase().includes(area.toLowerCase())) || 
    ['Bihar', 'Delhi', 'Haryana', 'Uttar Pradesh'].includes(state)
  );
  
  detectedLocation = isLocal ? { category: 'local', price: 7000 } : { category: 'remote', price: 12000 };
  updateLocationDisplay();
}

// 2. UPDATE PRICE DISPLAY
function updateLocationDisplay() {
  const locDiv = document.getElementById('locDetect');
  const visitChargeInput = document.getElementById('visitCharge');
  const locCategoryInput = document.getElementById('locationCategory');
  
  locDiv.innerHTML = `
    📍 ${detectedLocation.category.toUpperCase()} VISIT<br>
    <strong style="color:var(--gold)">₹${detectedLocation.price.toLocaleString('en-IN')}</strong>
    ${detectedLocation.category === 'local' ? '(Bihar/NCR - Any day)' : '(Rest of India)'}
  `;
  
  visitChargeInput.value = detectedLocation.price;
  locCategoryInput.value = detectedLocation.category;
}

// 3. STEP NAVIGATION
function nextStep() {
  const currentStepEl = document.querySelector(`.form-step[data-step="${currentStep}"]`);
  const stepErr = currentStepEl.querySelector('.step-err');
  
  // Step 1 validation
  if (currentStep === 1) {
    const required = ['firstName', 'lastName', 'email', 'phone', 'city', 'state'];
    const missing = required.filter(id => !document.getElementById(id).value.trim());
    if (missing.length) {
      stepErr.style.display = 'block';
      return;
    }
    stepErr.style.display = 'none';
  }
  
  // Step 2 slot validation
  if (currentStep === 2) {
    if (!document.getElementById('selectedSlot').value) {
      currentStepEl.querySelector('.step-err').style.display = 'block';
      return;
    }
    currentStepEl.querySelector('.step-err').style.display = 'none';
  }
  
  // Move steps
  document.querySelectorAll('.form-step').forEach((step, i) => {
    step.classList.toggle('active', i + 1 === currentStep + 1);
  });
  document.querySelectorAll('.step-dot-p').forEach((dot, i) => {
    dot.classList.toggle('active', i + 1 <= currentStep + 1);
  });
  
  currentStep++;
  if (currentStep === 3) updateSummary();
}

function prevStep() {
  document.querySelectorAll('.form-step').forEach((step, i) => {
    step.classList.toggle('active', i + 1 === currentStep - 1);
  });
  document.querySelectorAll('.step-dot-p').forEach((dot, i) => {
    dot.classList.toggle('active', i + 1 <= currentStep - 1);
  });
  currentStep--;
}

// 4. SERVICE CHECKBOXES
document.addEventListener('click', function(e) {
  if (e.target.closest('.chk-item')) {
    e.target.closest('.chk-item').classList.toggle('sel');
  }
});

// 5. LOCATION AUTO-DETECT
document.getElementById('city').addEventListener('input', () => {
  setTimeout(() => detectLocation(document.getElementById('city').value, document.getElementById('state').value), 300);
});
document.getElementById('state').addEventListener('change', () => {
  detectLocation(document.getElementById('city').value, document.getElementById('state').value);
  loadSlots();
});

// 6. LOAD SLOTS FROM SUPABASE
async function loadSlots() {
  try {
    const { data: slots } = await supabase
      .from('slots')
      .select('*')
      .order('date')
      .gte('date', new Date().toISOString().split('T')[0]);
    
    const state = document.getElementById('state').value;
    const isLocal = ['Bihar', 'Delhi', 'Haryana', 'Uttar Pradesh'].includes(state);
    const slotType = isLocal ? 'Local' : 'Remote';
    
    const slotGrid = document.getElementById('slotGrid');
    const availableSlots = slots?.filter(s => 
      s.slot_type === slotType && 
      !s.is_blocked && 
      s.booked_count < s.total_capacity
    )?.slice(0, 12) || [];
    
    slotGrid.innerHTML = availableSlots.length ? 
      availableSlots.map(slot => `
        <div class="slot-item" onclick="selectSlot('${slot.id}', '${slot.date}', '${slot.slot_type}')">
          <div class="slot-date">${new Date(slot.date).toLocaleDateString('en-IN', {weekday:'short', day:'numeric', month:'short'})}</div>
          <div class="slot-type">${slot.slot_type}</div>
          <div class="slot-status">${slot.booked_count}/${slot.total_capacity} spots left</div>
        </div>
      `).join('') :
      '<div style="padding:20px;color:var(--dim)">No slots available for your location. Please contact us.</div>';
      
  } catch (error) {
    document.getElementById('slotGrid').innerHTML = '<div style="padding:20px;color:var(--dim)">Slots loading... (Check admin dashboard)</div>';
  }
}

// 7. SELECT SLOT
function selectSlot(slotId, date, type) {
  document.querySelectorAll('.slot-item').forEach(item => item.classList.remove('selected'));
  event.currentTarget.classList.add('selected');
  document.getElementById('selectedSlot').value = `${type} Slot - ${date}`;
}

// 8. UPDATE SUMMARY (Step 3)
function updateSummary() {
  const city = document.getElementById('city')?.value || '';
  const state = document.getElementById('state')?.value || '';
  const slot = document.getElementById('selectedSlot')?.value || 'Not selected';
  const services = Array.from(document.querySelectorAll('.chk-item.sel')).map(el => el.dataset.service).join(', ') || 'Not specified';
  
  document.getElementById('summaryType').textContent = detectedLocation.category === 'local' ? 'Local' : 'Remote';
  document.getElementById('summaryLoc').textContent = [city, state].filter(Boolean).join(', ');
  document.getElementById('summarySlot').textContent = slot;
  document.getElementById('summaryServices').textContent = services;
  document.getElementById('payAmount').textContent = `₹${detectedLocation.price.toLocaleString('en-IN')}`;
}

// 9. RAZORPAY PAYMENT + SUPABASE SAVE
document.getElementById('razorpay-btn').addEventListener('click', async function() {
  const btn = this;
  const formData = new FormData(document.getElementById('bookingForm'));
  
  // Final validation
  if (!formData.get('Slot')) {
    alert('Please select a date slot first.');
    return;
  }
  
  // Show loading
  btn.innerHTML = 'Processing Payment...';
  btn.disabled = true;
  
  try {
    // RAZORPAY OPTIONS (Replace with YOUR Razorpay test key)
    const options = {
      key: 'rzp_test_YourKeyHere', // ← GET FROM Razorpay Dashboard
      amount: detectedLocation.price * 100, // paise
      currency: 'INR',
      name: 'MIBO Home Interiors',
      description: `${detectedLocation.category} Site Visit - ${formData.get('Slot')}`,
      prefill: {
        name: `${formData.get('First Name')} ${formData.get('Last Name')}`,
        email: formData.get('Email'),
        contact: formData.get('Phone')
      },
      theme: { color: '#c9a96e' },
      handler: async function(response) {
        await saveToSupabase(formData, response);
      }
    };
    
    const razorpay = new Razorpay(options);
    razorpay.open();
    
  } catch (error) {
    alert('Payment failed. Please try again.');
    btn.innerHTML = 'Pay & Confirm Booking →';
    btn.disabled = false;
  }
});

// 10. SAVE TO SUPABASE (After Payment Success)
async function saveToSupabase(formData, razorpayResponse) {
  try {
    const fullName = `${formData.get('First Name')} ${formData.get('Last Name')}`;
    const services = Array.from(document.querySelectorAll('.chk-item.sel')).map(el => el.dataset.service).join(', ');
    
    const { data, error } = await supabase.from('leads').insert([{
      full_name: fullName,
      email: formData.get('Email'),
      phone: formData.get('Phone'),
      city: formData.get('City'),
      state: formData.get('State'),
      home_type: formData.get('Home Type'),
      service_type: services,
      budget_range: formData.get('Budget'),
      message: formData.get('Message') || '',
      source: 'Booking Form',
      is_paid: true,
      slot_date: formData.get('Slot').split(' - ')[1] || null,
      slot_time: formData.get('Preferred Time'),
      payment_id: razorpayResponse.razorpay_payment_id,
      amount_paid: parseFloat(formData.get('Visit Charge')),
      status: 'Confirmed',
      lead_score: 'Hot' // Paid = Hot lead
    }]).select().single();
    
    if (error) throw error;
    
    // SUCCESS SCREEN
    document.getElementById('formInner').style.display = 'none';
    document.getElementById('formSuccess').style.display = 'block';
    document.getElementById('refId').textContent = `MIBO-${data.id.slice(-6).toUpperCase()}`;
    
    console.log('✅ Booking saved! Check admin dashboard.');
    
  } catch (error) {
    console.error('Supabase error:', error);
    alert('Payment successful but booking save failed. Contact support with payment ID: ' + razorpayResponse.razorpay_payment_id);
  }
}

// INIT
document.addEventListener('DOMContentLoaded', () => {
  updateLocationDisplay();
});