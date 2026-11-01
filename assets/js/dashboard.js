document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;

  if (page === 'dashboard') {
    const metrics = {
      buses: 42,
      activeBuses: 31,
      scheduledTrips: 87,
      bookingsToday: 214,
      passengers: 11234,
      revenue: 789456,
      pendingPayments: 145600,
      upcomingDepartures: 12
    };

    const setValue = (id, value) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
      }
    };

    setValue('metric-buses', metrics.buses.toLocaleString());
    setValue('metric-active-buses', metrics.activeBuses.toLocaleString());
    setValue('metric-scheduled-trips', metrics.scheduledTrips.toLocaleString());
    setValue('metric-bookings-today', metrics.bookingsToday.toLocaleString());
    setValue('metric-passengers', metrics.passengers.toLocaleString());
    setValue('metric-revenue', `ZMW ${metrics.revenue.toLocaleString()}`);
    setValue('metric-pending-payments', `ZMW ${metrics.pendingPayments.toLocaleString()}`);

    const bookingTrend = document.getElementById('bookingTrendChart');
    const revenueTrend = document.getElementById('revenueTrendChart');
    const routesChart = document.getElementById('routesChart');
    const utilisationChart = document.getElementById('utilisationChart');

    if (window.Chart) {
      new Chart(bookingTrend, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          datasets: [{
            label: 'Bookings',
            data: [120, 145, 160, 175, 210, 232, 260],
            borderColor: '#f4b942',
            backgroundColor: 'rgba(244,185,66,0.12)',
            fill: true,
            tension: 0.4
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });

      new Chart(revenueTrend, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          datasets: [{
            label: 'Revenue (ZMW)',
            data: [68000, 74200, 81200, 90000, 96000, 110000, 124000],
            backgroundColor: ['#0b3b6f', '#174d8b', '#1d5fa8', '#1f74d5', '#2d8cff', '#45a2ff', '#66bbff']
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });

      new Chart(routesChart, {
        type: 'doughnut',
        data: {
          labels: ['Lusaka–Ndola', 'Lusaka–Livingstone', 'Kitwe–Kabwe', 'Lusaka–Chipata'],
          datasets: [{
            data: [32, 24, 18, 16],
            backgroundColor: ['#0b3b6f', '#1d5fa8', '#f4b942', '#c5d7f4']
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });

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
  }

  if (page === 'routes') {
    const routeTable = document.getElementById('routesTableBody');
    if (routeTable) {
      routeTable.innerHTML = `
        <tr>
          <td>LT-01</td>
          <td>Lusaka</td>
          <td>Ndola</td>
          <td>ZMW 350</td>
          <td>7h 30m</td>
          <td><span class="badge status-active">Active</span></td>
          <td><button class="btn btn-sm btn-outline-primary">Edit</button></td>
        </tr>
        <tr>
          <td>LT-02</td>
          <td>Lusaka</td>
          <td>Livingstone</td>
          <td>ZMW 520</td>
          <td>11h 00m</td>
          <td><span class="badge status-active">Active</span></td>
          <td><button class="btn btn-sm btn-outline-primary">Edit</button></td>
        </tr>
      `;
    }
  }

  if (page === 'trips') {
    const tripTable = document.getElementById('tripsTableBody');
    if (tripTable) {
      tripTable.innerHTML = `
        <tr>
          <td>TRP-101</td>
          <td>Lusaka -> Ndola</td>
          <td>795</td>
          <td>12 Mar 2026</td>
          <td>06:30</td>
          <td><span class="badge status-active">Scheduled</span></td>
          <td><button class="btn btn-sm btn-outline-primary">Manage</button></td>
        </tr>
      `;
    }
  }

  if (page === 'buses') {
    const busTable = document.getElementById('busesTableBody');
    if (busTable) {
      busTable.innerHTML = `
        <tr>
          <td>PT-101</td>
          <td>Coaster</td>
          <td>45</td>
          <td>Yutong</td>
          <td><span class="badge status-active">Active</span></td>
          <td><button class="btn btn-sm btn-outline-primary">Edit</button></td>
        </tr>
      `;
    }
  }

  if (page === 'bookings') {
    const bookingTable = document.getElementById('bookingsTableBody');
    if (bookingTable) {
      bookingTable.innerHTML = `
        <tr>
          <td>PTB-2026-001</td>
          <td>Joseph Phiri</td>
          <td>Lusaka -> Livingstone</td>
          <td>Seat 12</td>
          <td>ZMW 520</td>
          <td><span class="badge status-active">Confirmed</span></td>
        </tr>
      `;
    }
  }

  if (page === 'settings') {
    const form = document.getElementById('settingsForm');
    if (form) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        alert('Settings saved successfully.');
      });
    }
  }

  if (page === 'login') {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!email || !password) {
          alert('Please enter both email and password.');
          return;
        }

        localStorage.setItem('pts_session', 'demo-session');
        localStorage.setItem('pts_user', JSON.stringify({
          name: 'Admin User',
          email,
          role: 'Administrator'
        }));

        window.location.href = 'dashboard.html';
      });
    }
  }
});
