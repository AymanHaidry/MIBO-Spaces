# MIBO Website — Deployment & Setup Guide v4.0

## What's in this package

| File | Purpose |
|------|---------|
| `index.html` | Public homepage with funnel, enquiry, testimonials |
| `about.html` | About page — story, team, timeline, values |
| `services.html` | Full services breakdown (6 residential services) |
| `gallery.html` | Photo gallery with filters + lightbox |
| `book.html` | 3-step booking form → Razorpay payment |
| `process.html` | How it works — step-by-step |
| `contact.html` | Contact form → Supabase + Formspree |
| `styles.css` | Unified design system (liquid glass, mobile-first) |
| `shared.js` | Shared nav + footer + all core JS (cursor, reveals, realtime) |
| `crm.html` | **Hidden** team CRM — full Supabase realtime, no localStorage |
| `admin/index.html` | **Hidden** admin panel — leads, bookings, payments, slots |
| `migration.sql` | Run once in Supabase SQL Editor |

---

## 1. Supabase Setup (15 minutes)

### 1a. Run the migration
1. Go to [supabase.com](https://supabase.com) → your project → **SQL Editor**
2. Click **New Query**
3. Paste the entire contents of `migration.sql`
4. Click **Run**

### 1b. Create the storage bucket
1. Supabase Dashboard → **Storage** → **New Bucket**
2. Name: `mibo-documents`
3. Public: **OFF** (private — authenticated only)
4. Click **Create**

The SQL migration already sets storage policies. If you get errors, set them manually:
- Storage → Policies → Add for `mibo-documents`:
  - SELECT: `auth.role() = 'authenticated'`
  - INSERT: `auth.role() = 'authenticated'`
  - DELETE: `auth.role() = 'authenticated'`

### 1c. Enable Realtime
1. Supabase Dashboard → **Database** → **Replication**
2. Under **Supabase Realtime**, toggle ON for:
   - `leads`, `interactions`, `followups`, `calls`, `attendance`, `documents`

### 1d. Create admin user
1. Supabase Dashboard → **Auth** → **Users** → **Invite User**
2. Enter: `aymanhaidry2022@gmail.com`
3. They'll receive an invite email — click to set password
4. Run in SQL Editor:
   ```sql
   UPDATE public.profiles SET role = 'admin' WHERE email = 'aymanhaidry2022@gmail.com';
   ```

---

## 2. Razorpay Setup (10 minutes)

### 2a. Get your keys
1. [dashboard.razorpay.com](https://dashboard.razorpay.com) → Settings → API Keys
2. Generate Key ID + Key Secret
3. **Test mode** first, switch to **Live** when ready

### 2b. Update shared.js
Open `shared.js` and replace:
```js
razorpayKey: 'rzp_test_REPLACE_WITH_YOUR_KEY',
```
with your actual Razorpay Key ID (starts with `rzp_test_` or `rzp_live_`).

### 2c. Server-side payment verification
The Key **Secret** must NEVER go in frontend code. Set up a serverless function:

**Option A — Vercel Edge Function** (`/api/verify-payment.js`):
```js
import crypto from 'crypto';
export default async function handler(req) {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, bookingData } = await req.json();
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body).digest('hex');
  if (expected !== razorpay_signature) {
    return new Response(JSON.stringify({ ok: false }), { status: 400 });
  }
  // Save to Supabase via service role key
  const { createClient } = await import('@supabase/supabase-js');
  const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  const { data } = await sb.from('leads').insert([{
    full_name: bookingData.name, email: bookingData.email, phone: bookingData.phone,
    city: bookingData.city, state: bookingData.state, service_type: bookingData.services,
    budget_range: bookingData.budget, message: bookingData.message,
    is_paid: true, payment_id: razorpay_payment_id,
    amount_paid: bookingData.visitCharge, location_category: bookingData.locationCategory,
    status: 'Confirmed', lead_score: 'Hot', source: 'Booking Form',
  }]).select().single();
  return new Response(JSON.stringify({ ok: true, bookingId: 'MIBO-' + data.id.slice(-6).toUpperCase() }));
}
```

Set environment variables in Vercel:
```
RAZORPAY_KEY_SECRET=your_secret_here
SUPABASE_URL=https://lfygfnsiignolmdnewhb.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
```

**Option B — No server (dev/testing only)**:
`shared.js` automatically falls back to saving directly to Supabase if the `/api/verify-payment` endpoint doesn't exist. Use this for testing only — in production, always use server-side verification.

---

## 3. Formspree Setup (5 minutes)

1. Go to [formspree.io](https://formspree.io) → Create account
2. New Form → Name it "MIBO Leads"
3. Set notification email: `aymanhaidry2022@gmail.com`
4. Copy your form endpoint (looks like `https://formspree.io/f/xblyrwgw`)
5. In `shared.js`, update:
   ```js
   formspree: 'https://formspree.io/f/YOUR_FORM_ID',
   ```

---

## 4. Deploy to Netlify (5 minutes — recommended)

1. Drag and drop the entire folder to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Your site is live instantly
3. Add custom domain: Site Settings → Domain Management → Add custom domain

**Or via GitHub:**
```bash
git init && git add . && git commit -m "MIBO v4.0"
gh repo create mibo-website --private
git push origin main
# Connect repo in Netlify → continuous deploy on every push
```

---

## 5. CRM Access

The CRM (`crm.html`) is not linked from the public site. Access it directly:
- `yourdomain.com/crm.html`
- Login with Supabase Auth credentials (set up in step 1d)

**Realtime features:**
- Any lead added/deleted/updated reflects instantly for all logged-in users
- No page refresh needed
- Realtime indicator (green dot) shows live connection status

**Document storage:**
- Upload any file type (PDF, images, Excel, etc.)
- All team members can see and download shared documents
- Files stored in Supabase Storage bucket `mibo-documents`
- Delete works instantly and removes from storage

---

## 6. Environment Variables Reference

| Variable | Where Used | Where to Set |
|----------|-----------|-------------|
| `RAZORPAY_KEY_ID` | `shared.js` (frontend, safe) | Hardcode in shared.js |
| `RAZORPAY_KEY_SECRET` | Server only | Vercel/Netlify env vars |
| `SUPABASE_URL` | `shared.js` | Hardcode in shared.js |
| `SUPABASE_ANON_KEY` | `shared.js` | Hardcode in shared.js |
| `SUPABASE_SERVICE_KEY` | Server only | Vercel/Netlify env vars |

---

## 7. Pricing Configuration

In `shared.js`:
```js
pricing: { local: 7000, remote: 12000 },
localStates:  ['Bihar','Delhi','Haryana','Uttar Pradesh'],
localCities:  ['Patna','Delhi','Noida','Gurgaon','Faridabad','Ghaziabad','Greater Noida'],
```
Change these values to update pricing and location classification across the entire site instantly.

---

## 8. Commercial Site Note

The footer includes a placeholder link "MIBO Commercial →" pointing to `#`. When you create the commercial sister site, update this link in `shared.js` (the `FOOTER_HTML` constant) — it will update across all pages automatically.

---

## 9. Security Checklist

- [ ] Razorpay Key Secret is NEVER in frontend code
- [ ] Supabase Service Role key is NEVER in frontend code
- [ ] RLS is enabled on all Supabase tables (migration.sql handles this)
- [ ] `crm.html` and `admin/index.html` are not linked from public pages
- [ ] Supabase Auth is the only way to access CRM (no hardcoded passwords)
- [ ] Storage bucket `mibo-documents` is private (not public)
- [ ] Payment verification uses HMAC-SHA256 on server side

---

## 10. Slot Management

Slots are managed in the Admin panel (`admin/index.html`):
- **Generate slots**: Creates 14 days of Local + Remote slots
- **Block a slot**: Prevents new bookings for that date
- **Unblock**: Reopens the slot
- Local slots: Any day, max 3 bookings
- Remote slots: Fri + Sat only, min 5 days advance, max 5 bookings

Add initial slots after deploying:
```sql
-- Insert 30 days of slots
INSERT INTO public.slots (date, slot_type, total_capacity, booked_count, is_blocked)
SELECT 
  generate_series::date,
  unnest(ARRAY['Local','Remote']),
  CASE WHEN unnest(ARRAY['Local','Remote']) = 'Local' THEN 3 ELSE 5 END,
  0,
  false
FROM generate_series(CURRENT_DATE + 1, CURRENT_DATE + 30, '1 day');
```

---

## 11. Troubleshooting

| Problem | Solution |
|---------|---------|
| Realtime not working | Enable tables in Supabase Dashboard → Database → Replication |
| Storage upload fails | Check bucket exists and RLS policies are set |
| Login fails in CRM | User must exist in Supabase Auth, not just profiles table |
| Razorpay modal doesn't open | Replace `rzp_test_REPLACE_WITH_YOUR_KEY` with your actual key |
| Delete doesn't work | Check RLS policy allows DELETE for authenticated users |
| Nav/footer not appearing | Ensure `shared.js` is loaded and `data-page` attribute is set on `<body>` |

---

*© 2026 MIBO — Mesmerizing Interiors, Bold Outcomes*
