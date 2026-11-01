const STORAGE_KEYS = {
  user: 'pts_user',
  session: 'pts_session',
  appData: 'pts_app_data'
};

const demoData = {
  settings: {
    companyName: 'Power Tools Bus Services',
    contactEmail: 'info@powertoolsbus.com',
    whatsappNumber: '+260977123456',
    address: 'Lusaka, Zambia',
    currency: 'ZMW',
    ticketBranding: 'Power Tools Bus Services'
  },
  buses: [
    { id: 'BUS-001', registrationNumber: 'PT-101', model: 'Yutong', type: 'Coach', capacity: 45, status: 'active', photoUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80' },
    { id: 'BUS-002', registrationNumber: 'PT-205', model: 'Mercedes Sprinter', type: 'Mini Coach', capacity: 18, status: 'active', photoUrl: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=800&q=80' },
    { id: 'BUS-003', registrationNumber: 'PT-318', model: 'Scania', type: 'Intercity', capacity: 52, status: 'maintenance', photoUrl: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?auto=format&fit=crop&w=800&q=80' }
  ],
  routes: [
    { id: 'RTE-001', code: 'LT-01', departureLocation: 'Lusaka', destinationLocation: 'Ndola', ticketPriceZmw: 350, estimatedDurationMinutes: 450, isActive: true },
    { id: 'RTE-002', code: 'LT-02', departureLocation: 'Lusaka', destinationLocation: 'Livingstone', ticketPriceZmw: 520, estimatedDurationMinutes: 660, isActive: true },
    { id: 'RTE-003', code: 'KT-05', departureLocation: 'Kitwe', destinationLocation: 'Kabwe', ticketPriceZmw: 290, estimatedDurationMinutes: 390, isActive: true }
  ],
  drivers: [
    { id: 'DRV-001', fullName: 'James Banda', phone: '+260966771144', licenseNumber: 'DL-2045', status: 'active' },
    { id: 'DRV-002', fullName: 'Moses Mweemba', phone: '+260977452110', licenseNumber: 'DL-3098', status: 'active' }
  ],
  passengers: [
    { id: 'PAX-001', fullName: 'Joseph Phiri', phone: '+260977123456' },
    { id: 'PAX-002', fullName: 'Mary Chanda', phone: '+260955331122' },
    { id: 'PAX-003', fullName: 'Peter Mwape', phone: '+260976778899' }
  ],
  trips: [
    { id: 'TRIP-1001', routeId: 'RTE-001', busId: 'BUS-001', driverId: 'DRV-001', departureAt: '2026-11-03T06:30:00', arrivalAt: '2026-11-03T14:00:00', status: 'scheduled', availableSeats: 38, totalSeats: 45 },
    { id: 'TRIP-1002', routeId: 'RTE-002', busId: 'BUS-002', driverId: 'DRV-002', departureAt: '2026-11-04T09:15:00', arrivalAt: '2026-11-04T20:15:00', status: 'scheduled', availableSeats: 12, totalSeats: 18 },
    { id: 'TRIP-1003', routeId: 'RTE-003', busId: 'BUS-001', driverId: 'DRV-001', departureAt: '2026-11-05T12:45:00', arrivalAt: '2026-11-05T19:45:00', status: 'ongoing', availableSeats: 22, totalSeats: 45 }
  ],
  bookings: [
    { id: 'BK-1001', passengerId: 'PAX-001', tripId: 'TRIP-1001', routeId: 'RTE-001', bookingRef: 'PTB-1001', bookingStatus: 'confirmed', totalAmount: 350, paymentStatus: 'paid' },
    { id: 'BK-1002', passengerId: 'PAX-002', tripId: 'TRIP-1002', routeId: 'RTE-002', bookingRef: 'PTB-1002', bookingStatus: 'pending', totalAmount: 520, paymentStatus: 'partial' },
    { id: 'BK-1003', passengerId: 'PAX-003', tripId: 'TRIP-1003', routeId: 'RTE-003', bookingRef: 'PTB-1003', bookingStatus: 'confirmed', totalAmount: 290, paymentStatus: 'paid' }
  ],
  bookingSeats: [
    { id: 'SEAT-1001', bookingId: 'BK-1001', tripId: 'TRIP-1001', seatNumber: '12', status: 'confirmed' },
    { id: 'SEAT-1002', bookingId: 'BK-1002', tripId: 'TRIP-1002', seatNumber: '08', status: 'confirmed' },
    { id: 'SEAT-1003', bookingId: 'BK-1003', tripId: 'TRIP-1003', seatNumber: '05', status: 'confirmed' }
  ],
  payments: [
    { id: 'PAY-1001', bookingId: 'BK-1001', amount: 350, paymentMethod: 'mobile_money', paymentReference: 'MM-3017', status: 'paid' },
    { id: 'PAY-1002', bookingId: 'BK-1002', amount: 260, paymentMethod: 'cash', paymentReference: 'CASH-112', status: 'partial' },
    { id: 'PAY-1003', bookingId: 'BK-1003', amount: 290, paymentMethod: 'bank', paymentReference: 'BANK-2241', status: 'paid' }
  ],
  tickets: [
    { id: 'TICKET-1001', bookingId: 'BK-1001', ticketCode: 'PTB-1001', qrCode: 'PTB-1001', status: 'issued' },
    { id: 'TICKET-1002', bookingId: 'BK-1002', ticketCode: 'PTB-1002', qrCode: 'PTB-1002', status: 'issued' }
  ],
  staff: [
    { id: 'STAFF-001', name: 'Jane Mumba', role: 'Administrator', status: 'active', access: 'Full' },
    { id: 'STAFF-002', name: 'Chileshe Kunda', role: 'Ticketing Officer', status: 'active', access: 'Bookings' },
    { id: 'STAFF-003', name: 'Daniel Simukoko', role: 'Manager', status: 'inactive', access: 'Operations' }
  ]
};

const ensureDemoData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.appData)) {
    localStorage.setItem(STORAGE_KEYS.appData, JSON.stringify(demoData));
  }
};

const getAppData = () => {
  ensureDemoData();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.appData));
  } catch (error) {
    return demoData;
  }
};

const saveAppData = (nextData) => {
  localStorage.setItem(STORAGE_KEYS.appData, JSON.stringify(nextData));
};

const getCurrentUser = () => {
  const raw = localStorage.getItem(STORAGE_KEYS.user);
  return raw ? JSON.parse(raw) : null;
};

const setCurrentUser = (userObject) => {
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(userObject));
};

const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.session);
  localStorage.removeItem(STORAGE_KEYS.user);
  window.location.href = 'login.html';
};

window.App = window.App || {};
window.App.getAppData = getAppData;
window.App.saveAppData = saveAppData;
window.App.getCurrentUser = getCurrentUser;
window.App.setCurrentUser = setCurrentUser;
window.App.logout = logout;
