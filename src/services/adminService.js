import { mockDb } from './mockDatabase';

export const adminService = {
  // Aggregate real database stats for overview
  getPlatformStats() {
    const users = mockDb.getUsers();
    const props = mockDb.getProperties();
    const bookings = mockDb.getBookings();

    const students = users.filter(u => u.role === 'student');
    const owners = users.filter(u => u.role === 'owner');

    const approvedProps = props.filter(p => p.verification_status === 'approved');
    const pendingProps = props.filter(p => p.verification_status === 'pending');

    const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
    const pendingBookings = bookings.filter(b => b.status === 'pending');
    const cancelledBookings = bookings.filter(b => b.status === 'cancelled');

    // Aggregate monthly trends for Recharts
    const monthlyTrends = [
      { month: 'Jun', students: 120, bookings: 35, properties: 12 },
      { month: 'Jul', students: 280, bookings: 85, properties: 24 },
      { month: 'Aug', students: 540, bookings: 190, properties: 48 },
      { month: 'Sep', students: 890, bookings: 310, properties: 65 },
      { month: 'Oct', students: 1200, bookings: 420, properties: 80 },
      { month: 'Nov', students: 1650, bookings: 540, properties: props.length }
    ];

    const categoryDistribution = [
      { name: 'Premium PG', value: props.filter(p => p.category === 'Premium PG').length || 3 },
      { name: 'Student Apartments', value: props.filter(p => p.category === 'Student Apartments').length || 2 },
      { name: 'Shared Accommodation', value: props.filter(p => p.category === 'Shared Accommodation').length || 2 },
      { name: 'Independent Flats', value: props.filter(p => p.category === 'Independent Flats').length || 2 }
    ];

    return {
      totalStudents: students.length,
      totalOwners: owners.length,
      totalProperties: props.length,
      approvedProperties: approvedProps.length,
      pendingProperties: pendingProps.length,
      totalBookings: bookings.length,
      confirmedBookings: confirmedBookings.length,
      pendingBookings: pendingBookings.length,
      cancelledBookings: cancelledBookings.length,
      monthlyTrends,
      categoryDistribution
    };
  },

  getAllStudents() {
    const users = mockDb.getUsers();
    return users.filter(u => u.role === 'student');
  },

  getAllOwners() {
    const users = mockDb.getUsers();
    return users.filter(u => u.role === 'owner');
  },

  toggleUserSuspension(userId, currentStatus, adminName = 'Elena Rostova') {
    const users = mockDb.getUsers();
    let updatedUser = null;
    const updated = users.map(u => {
      if (u.id === userId) {
        updatedUser = { ...u, is_suspended: !currentStatus };
        return updatedUser;
      }
      return u;
    });
    mockDb.saveUsers(updated);

    // Log admin audit action
    const logs = mockDb.getAuditLogs();
    mockDb.saveAuditLogs([
      {
        id: `log-${Date.now()}`,
        admin_name: adminName,
        action: !currentStatus ? 'SUSPEND_USER' : 'RESTORE_USER',
        target: updatedUser?.email || userId,
        timestamp: new Date().toISOString()
      },
      ...logs
    ]);

    return updatedUser;
  },

  getReports() {
    return mockDb.getReports();
  },

  resolveReport(reportId, status, notes = '', adminName = 'Elena Rostova') {
    const reports = mockDb.getReports();
    const updated = reports.map(r => {
      if (r.id === reportId) {
        return {
          ...r,
          status,
          admin_notes: notes,
          resolved_at: new Date().toISOString()
        };
      }
      return r;
    });
    mockDb.saveReports(updated);

    // Audit log
    const logs = mockDb.getAuditLogs();
    mockDb.saveAuditLogs([
      {
        id: `log-${Date.now()}`,
        admin_name: adminName,
        action: 'RESOLVE_REPORT',
        target: `Report #${reportId}`,
        details: notes || status,
        timestamp: new Date().toISOString()
      },
      ...logs
    ]);

    return true;
  },

  getAuditLogs() {
    return mockDb.getAuditLogs();
  }
};
