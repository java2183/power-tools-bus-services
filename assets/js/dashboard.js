document.addEventListener('DOMContentLoaded', () => {
  ensureDemoData();
  renderSidebar();
  renderHeader();
  updatePageMeta();
  bindMobileToggle();
  bindGlobalActions();

  const currentPage = document.body.dataset.page || 'dashboard';
  const protectedPages = ['dashboard', 'buses', 'routes', 'trips', 'bookings', 'passengers', 'payments', 'tickets', 'staff', 'drivers', 'reports', 'settings'];
  const isProtected = protectedPages.includes(currentPage);

  if (isProtected && !localStorage.getItem(STORAGE_KEYS.session)) {
    window.location.href = 'login.html';
    return;
  }

  switch (currentPage) {
    case 'dashboard':
      renderDashboard();
      break;
    case 'buses':
      renderBusPage();
      break;
    case 'routes':
      renderRoutePage();
      break;
    case 'trips':
      renderTripPage();
      break;
    case 'bookings':
      renderBookingPage();
      break;
    case 'passengers':
      renderPassengerPage();
      break;
    case 'payments':
      renderPaymentPage();
      break;
    case 'tickets':
      renderTicketPage();
      break;
    case 'staff':
      renderStaffPage();
      break;
    case 'drivers':
      renderDriverPage();
      break;
    case 'reports':
      renderReportPage();
      break;
    case 'settings':
      renderSettingsPage();
      break;
    case 'login':
      bindLoginForm();
      break;
    default:
      break;
  }
});

const renderSidebar = () => {
  const nav = document.getElementById('sidebar-nav');
  if (!nav) return;

  const pages = [
    ['Dashboard', 'dashboard.html', 'bi-speedometer2'],
    ['Buses', 'buses.html', 'bi-bus-front'],
    ['Routes', 'routes.html', 'bi-signpost-split'],
    ['Trips', 'trips.html', 'bi-calendar3'],
    ['Bookings', 'bookings.html', 'bi-journal-check'],
    ['Passengers', 'passengers.html', 'bi-people'],
    ['Payments', 'payments.html', 'bi-wallet2'],
    ['Tickets', 'tickets.html', 'bi-receipt'],
    ['Staff', 'staff.html', 'bi-person-badge'],
    ['Drivers', 'drivers.html', 'bi-person-wheelchair'],
    ['Reports', 'reports.html', 'bi-bar-chart'],
    ['Settings', 'settings.html', 'bi-gear']
  ];

  const current = document.body.dataset.page || 'dashboard';
  nav.innerHTML = pages.map(([label, href, icon]) => {
    const isActive = href === `${current}.html` || (current === 'dashboard' && href === 'dashboard.html');
    return `
      <li class="nav-item">
        <a class="nav-link ${isActive ? 'active' : ''}" href="${href}">
          <i class="bi ${icon}"></i>
          <span>${label}</span>
        </a>
      </li>
    `;
  }).join('');
};

const renderHeader = () => {
  const header = document.querySelector('[data-app-header]');
  if (!header) return;

  const user = getCurrentUser();
  const userString = user ? `${user.name} · ${user.role}` : 'Guest';

  header.innerHTML = `
    <div class="d-flex align-items-center justify-content-between w-100 gap-3 flex-wrap">
      <div>
        <small class="eyebrow text-uppercase">Operations</small>
        <h1 class="page-title mb-0">${window.__APP_CONFIG__.appName}</h1>
      </div>
      <div class="header-actions">
        <span class="badge status-active">${userString}</span>
        <button class="btn btn-outline-secondary btn-sm" type="button">
          <i class="bi bi-bell"></i>
        </button>
        <button class="btn btn-primary btn-sm" type="button" onclick="window.App.logout()">
          <i class="bi bi-box-arrow-right"></i> Logout
        </button>
      </div>
    </div>
  `;
};

const bindMobileToggle = () => {
  const button = document.getElementById('sidebarToggle');
  if (!button) return;
  button.addEventListener('click', () => {
    document.querySelector('.sidebar')?.classList.toggle('show');
  });
};

const updatePageMeta = () => {
  const title = document.body.dataset.pageTitle || 'Power Tools Bus Services';
  document.title = title;
};

const bindGlobalActions = () => {
  document.querySelectorAll('[data-action="logout"]').forEach((button) => {
    button.addEventListener('click', logout);
  });
};

const bindLoginForm = () => {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('email')?.value.trim();
    const password = document.getElementById('password')?.value.trim();

    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }

    localStorage.setItem(STORAGE_KEYS.session, 'demo-session');
    setCurrentUser({
      name: email.includes('admin') ? 'Admin User' : 'Operations Staff',
      email,
      role: email.includes('admin') ? 'Administrator' : 'Ticketing Officer'
    });
    window.location.href = 'dashboard.html';
  });
};

const formatCurrency = (amount) => `ZMW ${Number(amount || 0).toLocaleString()}`;

const renderMetricCard = (id, value) => {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
};

const renderDashboard = () => {
  const data = getAppData();
  const busCount = data.buses.length;
  const activeBuses = data.buses.filter((bus) => bus.status === 'active').length;
  const tripCount = data.trips.length;
  const todayBookings = data.bookings.length;
  const passengerCount = data.passengers.length;
  const revenue = data.bookings.reduce((sum, booking) => sum + Number(booking.totalAmount || 0), 0);
  const pendingPayments = data.bookings.filter((booking) => booking.paymentStatus !== 'paid').reduce((sum, booking) => sum + Number(booking.totalAmount || 0), 0);

  renderMetricCard('metric-buses', busCount.toLocaleString());
  renderMetricCard('metric-active-buses', activeBuses.toLocaleString());
  renderMetricCard('metric-scheduled-trips', tripCount.toLocaleString());
  renderMetricCard('metric-bookings-today', todayBookings.toLocaleString());
  renderMetricCard('metric-passengers', passengerCount.toLocaleString());
  renderMetricCard('metric-revenue', formatCurrency(revenue));
  renderMetricCard('metric-pending-payments', formatCurrency(pendingPayments));

  renderRecentBookings();
  renderUpcomingDepartures();
  renderCharts();
};

const renderRecentBookings = () => {
  const body = document.querySelector('#recentBookingsBody');
  if (!body) return;

  const data = getAppData();
  body.innerHTML = data.bookings.slice(0, 3).map((booking) => {
    const passenger = data.passengers.find((p) => p.id === booking.passengerId);
    const route = data.routes.find((r) => r.id === booking.routeId);
    return `
      <tr>
        <td>${booking.bookingRef}</td>
        <td>${passenger ? passenger.fullName : 'Unknown passenger'}</td>
        <td>${route ? `${route.departureLocation} - ${route.destinationLocation}` : 'Unavailable'}</td>
        <td><span class="badge ${booking.bookingStatus === 'confirmed' ? 'status-active' : 'status-pending'}">${booking.bookingStatus}</span></td>
      </tr>
    `;
  }).join('');
};

const renderUpcomingDepartures = () => {
  const container = document.getElementById('upcomingDepartures');
  if (!container) return;

  const data = getAppData();
  const items = data.trips.slice(0, 3).map((trip) => {
    const route = data.routes.find((item) => item.id === trip.routeId);
    const bus = data.buses.find((item) => item.id === trip.busId);
    return `
      <div class="departure-item">
        <div>
          <strong>${new Date(trip.departureAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
          <small>${route ? `${route.departureLocation} -> ${route.destinationLocation}` : 'Route unavailable'}</small>
        </div>
        <span class="badge ${trip.status === 'ongoing' ? 'status-warning' : 'status-active'}">${bus ? bus.registrationNumber : 'Bus'}</span>
      </div>
    `;
  }).join('');

  container.innerHTML = items;
};

const renderCharts = () => {
  const bookingTrendChart = document.getElementById('bookingTrendChart');
  const revenueTrendChart = document.getElementById('revenueTrendChart');
  const routesChart = document.getElementById('routesChart');
  const utilisationChart = document.getElementById('utilisationChart');

  if (!window.Chart) return;

  const data = getAppData();
  const bookingSeries = [18, 22, 26, 30, 34, 38, 42];
  const revenueSeries = data.bookings.map((booking) => Number(booking.totalAmount || 0));
  if (bookingTrendChart) {
    new Chart(bookingTrendChart, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
          label: 'Bookings',
          data: bookingSeries,
          borderColor: '#f4b942',
          tension: 0.35,
          fill: true,
          backgroundColor: 'rgba(244,185,66,0.12)'
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  if (revenueTrendChart) {
    new Chart(revenueTrendChart, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
          label: 'Revenue (ZMW)',
          data: revenueSeries.length ? revenueSeries.slice(0, 7) : [68000, 74200, 81200, 90000, 96000, 110000, 124000],
          backgroundColor: ['#0b3b6f', '#174d8b', '#1d5fa8', '#1f74d5', '#2d8cff', '#45a2ff', '#66bbff']
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  if (routesChart) {
    const routeData = data.routes.map((route) => route.ticketPriceZmw || 0);
    new Chart(routesChart, {
      type: 'doughnut',
      data: {
        labels: data.routes.map((route) => route.code),
        datasets: [{
          data: routeData.length ? routeData : [32, 24, 18, 16],
          backgroundColor: ['#0b3b6f', '#1d5fa8', '#f4b942', '#c5d7f4']
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }

  if (utilisationChart) {
    new Chart(utilisationChart, {
      type: 'radar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Utilisation %',
          data: [62, 74, 69, 81, 88, 90, 73],
          backgroundColor: 'rgba(11,59,111,0.35)',
          borderColor: '#0b3b6f'
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }
};

const renderBusPage = () => {
  const data = getAppData();
  const tbody = document.getElementById('busesTableBody');
  if (!tbody) return;

  tbody.innerHTML = data.buses.map((bus) => `
    <tr>
      <td>${bus.registrationNumber}</td>
      <td>${bus.model}</td>
      <td>${bus.capacity}</td>
      <td>${bus.type}</td>
      <td><span class="badge ${bus.status === 'active' ? 'status-active' : 'status-warning'}">${bus.status}</span></td>
      <td>
        <button class="btn btn-sm btn-outline-primary" type="button">Edit</button>
      </td>
    </tr>
  `).join('');
};

const renderRoutePage = () => {
  const data = getAppData();
  const tbody = document.getElementById('routesTableBody');
  if (!tbody) return;

  tbody.innerHTML = data.routes.map((route) => `
    <tr>
      <td>${route.code}</td>
      <td>${route.departureLocation}</td>
      <td>${route.destinationLocation}</td>
      <td>${formatCurrency(route.ticketPriceZmw)}</td>
      <td>${Math.round(route.estimatedDurationMinutes / 60)}h ${route.estimatedDurationMinutes % 60}m</td>
      <td><span class="badge ${route.isActive ? 'status-active' : 'status-warning'}">${route.isActive ? 'Active' : 'Inactive'}</span></td>
      <td><button class="btn btn-sm btn-outline-primary" type="button">Edit</button></td>
    </tr>
  `).join('');
};

const renderTripPage = () => {
  const data = getAppData();
  const tbody = document.getElementById('tripsTableBody');
  if (!tbody) return;

  tbody.innerHTML = data.trips.map((trip) => {
    const route = data.routes.find((item) => item.id === trip.routeId);
    const bus = data.buses.find((item) => item.id === trip.busId);
    return `
      <tr>
        <td>${trip.id}</td>
        <td>${route ? `${route.departureLocation} -> ${route.destinationLocation}` : 'Unknown route'}</td>
        <td>${trip.availableSeats}/${trip.totalSeats}</td>
        <td>${new Date(trip.departureAt).toLocaleDateString()}</td>
        <td>${new Date(trip.departureAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
        <td><span class="badge ${trip.status === 'scheduled' ? 'status-active' : 'status-warning'}">${trip.status}</span></td>
        <td><button class="btn btn-sm btn-outline-primary" type="button">Manage</button></td>
      </tr>
    `;
  }).join('');
};

const renderBookingPage = () => {
  const data = getAppData();
  const tbody = document.getElementById('bookingsTableBody');
  if (!tbody) return;

  tbody.innerHTML = data.bookings.map((booking) => {
    const passenger = data.passengers.find((item) => item.id === booking.passengerId);
    const route = data.routes.find((item) => item.id === booking.routeId);
    return `
      <tr>
        <td>${booking.bookingRef}</td>
        <td>${passenger ? passenger.fullName : 'Unknown'}</td>
        <td>${route ? `${route.departureLocation} -> ${route.destinationLocation}` : 'Unavailable'}</td>
        <td>Seat ${booking.bookingRef.split('-')[1] || 'N/A'}</td>
        <td>${formatCurrency(booking.totalAmount)}</td>
        <td><span class="badge ${booking.bookingStatus === 'confirmed' ? 'status-active' : 'status-pending'}">${booking.bookingStatus}</span></td>
      </tr>
    `;
  }).join('');
};

const renderPassengerPage = () => {
  const data = getAppData();
  const tbody = document.querySelector('#passengersTableBody');
  if (!tbody) return;

  tbody.innerHTML = data.passengers.map((passenger) => {
    const bookings = data.bookings.filter((b) => b.passengerId === passenger.id).length;
    return `
      <tr>
        <td>${passenger.fullName}</td>
        <td>${passenger.phone}</td>
        <td>${bookings}</td>
        <td>${bookings}</td>
        <td><button class="btn btn-sm btn-outline-primary" type="button">View</button></td>
      </tr>
    `;
  }).join('');
};

const renderPaymentPage = () => {
  const data = getAppData();
  const tbody = document.getElementById('paymentsTableBody');
  if (!tbody) return;

  tbody.innerHTML = data.payments.map((payment) => {
    const booking = data.bookings.find((item) => item.id === payment.bookingId);
    return `
      <tr>
        <td>${booking ? booking.bookingRef : payment.bookingId}</td>
        <td>${formatCurrency(payment.amount)}</td>
        <td>${payment.paymentMethod}</td>
        <td><span class="badge ${payment.status === 'paid' ? 'status-active' : 'status-pending'}">${payment.status}</span></td>
        <td>${new Date().toLocaleDateString()}</td>
      </tr>
    `;
  }).join('');
};

const renderTicketPage = () => {
  const data = getAppData();
  const booking = data.bookings[0];
  const passenger = data.passengers.find((p) => p.id === booking.passengerId);
  const route = data.routes.find((r) => r.id === booking.routeId);

  const info = document.getElementById('ticketInfo');
  if (!info) return;

  info.innerHTML = `
    <div class="ticket-brand">
      <strong>Power Tools Bus Services</strong>
      <span>Booking Confirmation</span>
    </div>
    <div class="row g-3">
      <div class="col-md-6">
        <p><strong>Passenger:</strong> ${passenger ? passenger.fullName : 'N/A'}</p>
        <p><strong>Route:</strong> ${route ? `${route.departureLocation} to ${route.destinationLocation}` : 'N/A'}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
      </div>
      <div class="col-md-6">
        <p><strong>Seat:</strong> 12</p>
        <p><strong>Amount:</strong> ${formatCurrency(booking.totalAmount)}</p>
        <p><strong>Ref:</strong> ${booking.bookingRef}</p>
      </div>
    </div>
    <div class="qr-box">QR</div>
  `;
};

const renderStaffPage = () => {
  const data = getAppData();
  const tbody = document.getElementById('staffTableBody');
  if (!tbody) return;

  tbody.innerHTML = data.staff.map((member) => `
    <tr>
      <td>${member.name}</td>
      <td>${member.role}</td>
      <td><span class="badge ${member.status === 'active' ? 'status-active' : 'status-warning'}">${member.status}</span></td>
      <td>${member.access}</td>
    </tr>
  `).join('');
};

const renderDriverPage = () => {
  const data = getAppData();
  const tbody = document.getElementById('driversTableBody');
  if (!tbody) return;

  tbody.innerHTML = data.drivers.map((driver) => `
    <tr>
      <td>${driver.fullName}</td>
      <td>${driver.licenseNumber}</td>
      <td>${driver.phone}</td>
      <td><span class="badge ${driver.status === 'active' ? 'status-active' : 'status-warning'}">${driver.status}</span></td>
    </tr>
  `).join('');
};

const renderReportPage = () => {
  const data = getAppData();
  const totalRevenue = data.bookings.reduce((sum, booking) => sum + Number(booking.totalAmount || 0), 0);
  const summary = document.getElementById('reportSummary');
  if (summary) {
    summary.innerHTML = `
      <div class="row g-4">
        <div class="col-md-6">
          <div class="panel-card">
            <h4>Daily booking report</h4>
            <p class="report-summary">${data.bookings.length} bookings processed</p>
          </div>
        </div>
        <div class="col-md-6">
          <div class="panel-card">
            <h4>Weekly revenue report</h4>
            <p class="report-summary">${formatCurrency(totalRevenue)}</p>
          </div>
        </div>
      </div>
    `;
  }
};

const renderSettingsPage = () => {
  const settings = getAppData().settings;
  const form = document.getElementById('settingsForm');
  if (!form) return;

  document.getElementById('companyName').value = settings.companyName;
  document.getElementById('contactEmail').value = settings.contactEmail;
  document.getElementById('whatsappNumber').value = settings.whatsappNumber;
  document.getElementById('currency').value = settings.currency;
  document.getElementById('address').value = settings.address;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const appData = getAppData();
    appData.settings = {
      companyName: document.getElementById('companyName').value.trim() || 'Power Tools Bus Services',
      contactEmail: document.getElementById('contactEmail').value.trim(),
      whatsappNumber: document.getElementById('whatsappNumber').value.trim(),
      currency: document.getElementById('currency').value.trim() || 'ZMW',
      address: document.getElementById('address').value.trim(),
      ticketBranding: 'Power Tools Bus Services'
    };
    saveAppData(appData);
    alert('Settings saved successfully.');
  });
};

window.logout = logout;
