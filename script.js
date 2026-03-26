// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initializeDates();
  initializeSearchForm();
});

// Date helper
function datePlus(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

// Initialize dates with defaults
function initializeDates() {
  const outDateInput = document.getElementById('outDate');
  const inDateInput = document.getElementById('inDate');

  // Set drop-off to tomorrow
  outDateInput.value = datePlus(1);

  // Set return to drop-off + 8 days
  inDateInput.value = datePlus(1 + 8);

  // Auto-recalculate return date when drop-off changes
  let manuallyChanged = false;

  inDateInput.addEventListener('change', () => {
    manuallyChanged = true;
  });

  outDateInput.addEventListener('change', () => {
    if (!manuallyChanged) {
      const out = new Date(outDateInput.value);
      out.setDate(out.getDate() + 8);
      inDateInput.value = out.toISOString().split('T')[0];
    }
  });
}

// Search form submission
function initializeSearchForm() {
  const form = document.getElementById('searchForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const airport = document.getElementById('airport').value;
    const outDate = document.getElementById('outDate').value;
    const outTime = document.getElementById('outTime').value;
    const inDate = document.getElementById('inDate').value;
    const inTime = document.getElementById('inTime').value;
    const promotionCode = document.getElementById('promotionCode').value;

    if (!outDate || !inDate) {
      alert('Please complete all date fields');
      return;
    }

    // Build search URL
    const searchUrl = buildSearchUrl(airport, outDate, outTime, inDate, inTime, promotionCode);

    // Redirect to search
    window.location.href = searchUrl;
  });
}

// Build search URL with meet & greet filter enabled
function buildSearchUrl(airport, outDate, outTime, inDate, inTime, promotionCode) {
  // Format times for URL
  const outTimeEncoded = outTime.replace(':', '%3A');
  const inTimeEncoded = inTime.replace(':', '%3A');

  // Get URL params
  const urlParams = new URLSearchParams(window.location.search);
  const agent = urlParams.get('agent') || 'WY992';
  const adcode = urlParams.get('adcode') || '';

  // HX domain resolution
  const host = window.location.host;
  const isLocal = host.startsWith('127') || host.includes('github.io');
  const basedomain = isLocal ? 'www.holidayextras.com' : host;

  // Build URL with meet & greet filter enabled
  const searchUrl = `https://${basedomain}/static/?selectProduct=cp&#/categories?agent=${agent}&ppts=&customer_ref=&lang=en&adults=2&depart=${airport}&terminal=&arrive=&flight=default&in=${inDate}&out=${outDate}&park_from=${outTimeEncoded}&park_to=${inTimeEncoded}&filter_meetandgreet=yes&filter_parkandride=&children=0&infants=0&redirectReferal=carpark&from_categories=true&adcode=${adcode}&promotionCode=${promotionCode}`;

  return searchUrl;
}
