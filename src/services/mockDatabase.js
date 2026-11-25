import { PROPERTIES } from '../data/propertiesData';

const STORAGE_KEYS = {
  USERS: 'havenly_db_users',
  PROPERTIES: 'havenly_db_properties',
  BOOKINGS: 'havenly_db_bookings',
  FAVOURITES: 'havenly_db_favourites',
  NOTIFICATIONS: 'havenly_db_notifications',
  REPORTS: 'havenly_db_reports',
  AUDIT_LOGS: 'havenly_db_audit_logs'
};

// Default seed users
const SEED_USERS = [
  {
    id: 'usr-student-1',
    full_name: 'Alex Morgan',
    email: 'student@havenly.edu',
    phone: '+1 (555) 234-8901',
    role: 'student',
    college: 'Stanford University & Tech Campus',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    is_suspended: false,
    created_at: '2026-09-01T10:00:00Z'
  },
  {
    id: 'usr-owner-1',
    full_name: 'Marcus Vance',
    email: 'owner@havenly.com',
    phone: '+1 (555) 492-1184',
    role: 'owner',
    owner_type: 'individual',
    college: 'Stanford University Corridor',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    is_suspended: false,
    created_at: '2026-08-15T08:30:00Z'
  },
  {
    id: 'usr-admin-1',
    full_name: 'Elena Rostova',
    email: 'admin@havenly.org',
    phone: '+1 (800) 428-3659',
    role: 'admin',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    is_suspended: false,
    created_at: '2026-01-10T09:00:00Z'
  }
];

// Seed initial properties
const SEED_PROPERTIES = PROPERTIES.map((p, idx) => ({
  ...p,
  owner_id: 'usr-owner-1',
  verification_status: idx === 0 ? 'approved' : idx === 1 ? 'approved' : idx === 2 ? 'approved' : idx === 3 ? 'approved' : idx === 4 ? 'pending' : 'approved',
  is_active: true,
  rooms: [
    { id: `rm-${p.id}-1`, room_type: 'Single Studio', total_beds: 4, available_beds: 2, rent: p.monthlyRent },
    { id: `rm-${p.id}-2`, room_type: 'Double Sharing', total_beds: 8, available_beds: 5, rent: Math.round(p.monthlyRent * 0.75) }
  ]
}));

// Seed initial bookings
const SEED_BOOKINGS = [
  {
    id: 'bk-101',
    booking_reference: 'HVN-2026-8491',
    property_id: 'prop-1',
    property_name: 'The Kensington Scholar Hall',
    property_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    student_id: 'usr-student-1',
    student_name: 'Alex Morgan',
    student_email: 'student@havenly.edu',
    owner_id: 'usr-owner-1',
    check_in_date: '2026-12-01',
    room_sharing_type: 'Single Studio',
    monthly_rent: 1250,
    security_deposit: 1250,
    utility_charges: 0,
    total_initial_amount: 2500,
    status: 'confirmed',
    created_at: '2026-11-20T14:30:00Z'
  },
  {
    id: 'bk-102',
    booking_reference: 'HVN-2026-9214',
    property_id: 'prop-2',
    property_name: 'Aurora Academic Lofts',
    property_image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80',
    student_id: 'usr-student-1',
    student_name: 'Alex Morgan',
    student_email: 'student@havenly.edu',
    owner_id: 'usr-owner-1',
    check_in_date: '2027-01-15',
    room_sharing_type: 'Double Sharing',
    monthly_rent: 890,
    security_deposit: 890,
    utility_charges: 0,
    total_initial_amount: 1780,
    status: 'pending',
    created_at: '2026-11-24T09:15:00Z'
  }
];

// Seed notifications
const SEED_NOTIFICATIONS = [
  {
    id: 'notif-1',
    user_id: 'usr-student-1',
    title: 'Booking Confirmed!',
    message: 'Marcus Vance confirmed your reservation for The Kensington Scholar Hall (Ref: HVN-2026-8491).',
    type: 'booking_confirmed',
    read: false,
    created_at: '2026-11-20T16:00:00Z'
  },
  {
    id: 'notif-2',
    user_id: 'usr-owner-1',
    title: 'New Booking Request',
    message: 'Alex Morgan requested a Double Sharing suite at Aurora Academic Lofts.',
    type: 'booking_request',
    read: false,
    created_at: '2026-11-24T09:15:00Z'
  },
  {
    id: 'notif-3',
    user_id: 'usr-admin-1',
    title: 'New Property Under Review',
    message: 'The Pavilion Graduate Suites was submitted and is pending verification audit.',
    type: 'property_submitted',
    read: false,
    created_at: '2026-11-22T11:20:00Z'
  }
];

// Seed Reports
const SEED_REPORTS = [
  {
    id: 'rep-1',
    property_id: 'prop-3',
    property_name: 'Edgewood Courtyard Villa',
    reporter_id: 'usr-student-1',
    reporter_name: 'Alex Morgan',
    category: 'Incorrect rental information',
    description: 'The listing mentioned private bathrooms for triple sharing, but the host noted they are shared across the hallway.',
    status: 'pending',
    created_at: '2026-11-23T15:40:00Z'
  }
];

function getStored(key, defaultVal) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setStored(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn("Storage failed", e);
  }
}

export const mockDb = {
  getUsers: () => getStored(STORAGE_KEYS.USERS, SEED_USERS),
  saveUsers: (users) => setStored(STORAGE_KEYS.USERS, users),

  getProperties: () => getStored(STORAGE_KEYS.PROPERTIES, SEED_PROPERTIES),
  saveProperties: (props) => setStored(STORAGE_KEYS.PROPERTIES, props),

  getBookings: () => getStored(STORAGE_KEYS.BOOKINGS, SEED_BOOKINGS),
  saveBookings: (bks) => setStored(STORAGE_KEYS.BOOKINGS, bks),

  getFavourites: (studentId) => {
    const all = getStored(STORAGE_KEYS.FAVOURITES, ['prop-1', 'prop-4']);
    return all;
  },
  saveFavourites: (favs) => setStored(STORAGE_KEYS.FAVOURITES, favs),

  getNotifications: (userId) => {
    const all = getStored(STORAGE_KEYS.NOTIFICATIONS, SEED_NOTIFICATIONS);
    return all.filter(n => !userId || n.user_id === userId);
  },
  saveNotifications: (notifs) => setStored(STORAGE_KEYS.NOTIFICATIONS, notifs),

  getReports: () => getStored(STORAGE_KEYS.REPORTS, SEED_REPORTS),
  saveReports: (reps) => setStored(STORAGE_KEYS.REPORTS, reps),

  getAuditLogs: () => getStored(STORAGE_KEYS.AUDIT_LOGS, [
    {
      id: 'log-1',
      admin_name: 'Elena Rostova',
      action: 'APPROVE_PROPERTY',
      target: 'The Kensington Scholar Hall',
      timestamp: '2026-11-15T12:00:00Z'
    }
  ]),
  saveAuditLogs: (logs) => setStored(STORAGE_KEYS.AUDIT_LOGS, logs)
};
