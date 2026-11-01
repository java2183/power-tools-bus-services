const renderSidebar = () => {
  const currentPage = document.body.dataset.page || 'dashboard';
  const navItems = [
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

  const nav = document.getElementById('sidebar-nav');
  if (!nav) return;

  nav.innerHTML = navItems.map(([label, href, icon]) => {
    const activeClass = href === `${currentPage}.html` || (currentPage === 'home' && href === 'dashboard.html') ? 'active' : '';
    return `
      <li class="nav-item">
        <a class="nav-link ${activeClass}" href="${href}">
          <i class="bi ${icon}"></i>
          <span>${label}</span>
        </a>
      </li>
    `;
  }).join('');
};

const updateUserInfo = () => {
  const user = JSON.parse(localStorage.getItem('pts_user') || 'null');
  const userBadge = document.getElementById('current-user');
  if (userBadge) {
    userBadge.textContent = user ? `${user.name} · ${user.role || 'Staff'}` : 'Guest';
  }
};

const renderHeader = () => {
  const header = document.querySelector('[data-app-header]');
  if (!header) return;

  const appName = window.__APP_CONFIG__?.appName || 'Power Tools Bus Services';
  header.innerHTML = `
    <div class="d-flex align-items-center justify-content-between w-100">
      <div>
        <small class="eyebrow text-uppercase">Operations</small>
        <h1 class="page-title mb-0">${appName}</h1>
      </div>
      <div class="header-actions">
        <button class="btn btn-outline-secondary btn-sm">
          <i class="bi bi-bell"></i>
        </button>
        <button class="btn btn-primary btn-sm">
          <i class="bi bi-plus-lg"></i> New Booking
        </button>
      </div>
    </div>
  `;
};

const updatePageMeta = () => {
  const pageTitle = document.body.dataset.pageTitle || 'Power Tools Bus Services';
  document.title = pageTitle;
};

const toggleMobileSidebar = () => {
  document.querySelector('.sidebar')?.classList.toggle('show');
};

const bindMobileToggle = () => {
  const toggle = document.getElementById('sidebarToggle');
  if (toggle) toggle.addEventListener('click', toggleMobileSidebar);
};

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar();
  renderHeader();
  updateUserInfo();
  updatePageMeta();
  bindMobileToggle();

  const token = localStorage.getItem('pts_session');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const protectedPages = ['dashboard.html', 'buses.html', 'routes.html', 'trips.html', 'bookings.html', 'passengers.html', 'payments.html', 'tickets.html', 'staff.html', 'drivers.html', 'reports.html', 'settings.html'];

  if (!token && protectedPages.includes(currentPath)) {
    window.location.href = 'login.html';
  }
});
