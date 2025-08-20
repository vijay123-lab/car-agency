// ---- Fixed route prices (INR) ----
const ROUTE_PRICES = {
  "JPR-DEL": 5000,
  "JPR-KHT": 3500,
  "JPR-MUM": 6000,   // you can change as needed
  "JPR-AGR": 4500
};

// ---- Elements ----
const carGrid = document.getElementById('carGrid');
const selectedCar = document.getElementById('selectedCar');
const seater = document.getElementById('seater');
const members = document.getElementById('members');
const route = document.getElementById('route');
const priceEl = document.getElementById('price');
const summaryText = document.getElementById('summaryText');
const payBtn = document.getElementById('payBtn');
const bookingForm = document.getElementById('bookingForm');
const qrModal = document.getElementById('qrModal');
const qrCaption = document.getElementById('qrCaption');

// ---- Simple interactions ----
// Click a car card -> auto-fill car + seater
carGrid.addEventListener('click', (e) => {
  const card = e.target.closest('.car-card');
  if (!card) return;
  const name = card.dataset.name;
  const seats = card.dataset.seats;

  selectedCar.value = name;
  seater.value = seats;
  updateSummary();
  selectedCar.scrollIntoView({behavior:'smooth', block:'center'});
});

// When any input changes, update
[selectedCar, seater, members, route].forEach(el => {
  el.addEventListener('change', updateSummary);
});

function formatINR(num) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
}

function updateSummary(){
  const car = selectedCar.value || '—';
  const seats = seater.value || '—';
  const pax = members.value || '—';
  const r = route.value;
  const amount = r ? ROUTE_PRICES[r] : null;

  priceEl.textContent = amount ? formatINR(amount) : '—';
  summaryText.textContent = `${car} • ${seats}-seater • ${pax} pax • ${r || 'no route'}`;

  // Enable payment when everything is chosen
  payBtn.disabled = !(selectedCar.value && seater.value && members.value && route.value);
}

updateSummary();

// ---- Payment (demo UPI QR) ----
// Replace with your real UPI ID + name
const YOUR_UPI = "your-upi-id@bank";
const YOUR_NAME = "Your Agency Name";

payBtn.addEventListener('click', () => {
  if (payBtn.disabled) return;
  const amt = ROUTE_PRICES[route.value];
  const note = `${selectedCar.value} ${route.options[route.selectedIndex].text}`;
  // UPI deep link
  const upiString = `upi://pay?pa=${encodeURIComponent(YOUR_UPI)}&pn=${encodeURIComponent(YOUR_NAME)}&am=${encodeURIComponent(String(amt))}&cu=INR&tn=${encodeURIComponent(note)}`;

  // Show modal + build QR
  qrCaption.textContent = `${formatINR(amt)} • ${note}`;
  const qrWrap = document.getElementById('qrcode');
  qrWrap.innerHTML = "";
  const qr = new QRCode(qrWrap, { width: 180, height: 180 });
  qr.makeCode(upiString);

  qrModal.showModal();
});

// ---- Booking form submit (demo only) ----
bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();
  alert("Thanks! We received your request. We’ll confirm on WhatsApp/Email shortly.");
});
