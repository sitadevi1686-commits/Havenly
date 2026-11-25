import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockDb } from './mockDatabase';

export const bookingService = {
  // Generate unique booking reference
  generateReference() {
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `HVN-${year}-${rand}`;
  },

  // Calculate transparent cost breakdown
  calculateCostBreakdown(monthlyRent, securityDeposit, utilityCharges = 0) {
    const rent = Number(monthlyRent) || 0;
    const deposit = Number(securityDeposit) || 0;
    const utilities = Number(utilityCharges) || 0;
    return {
      monthlyRent: rent,
      securityDeposit: deposit,
      utilityCharges: utilities,
      brokerageFee: 0, // Zero Brokerage Guarantee
      totalInitialAmount: rent + deposit + utilities
    };
  },

  // Student submits a booking request
  async createBookingRequest(bookingData, student) {
    const reference = this.generateReference();
    const cost = this.calculateCostBreakdown(
      bookingData.monthlyRent,
      bookingData.securityDeposit,
      bookingData.utilityCharges || 0
    );

    const newBooking = {
      id: `bk-${Date.now()}`,
      booking_reference: reference,
      property_id: bookingData.propertyId,
      property_name: bookingData.propertyName,
      property_image: bookingData.propertyImage,
      room_id: bookingData.roomId || null,
      student_id: student.id,
      student_name: student.full_name || student.name,
      student_email: student.email,
      student_phone: student.phone || '+1 (555) 000-0000',
      student_college: student.college || 'Enrolled Scholar',
      owner_id: bookingData.ownerId || 'usr-owner-1',
      check_in_date: bookingData.checkInDate,
      room_sharing_type: bookingData.roomSharingType || 'Single Studio',
      monthly_rent: cost.monthlyRent,
      security_deposit: cost.securityDeposit,
      utility_charges: cost.utilityCharges,
      total_initial_amount: cost.totalInitialAmount,
      status: 'pending', // Starts as pending owner approval
      notes: bookingData.notes || '',
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .insert([newBooking])
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase booking create error:', err.message);
      }
    }

    const all = mockDb.getBookings();
    mockDb.saveBookings([newBooking, ...all]);

    // Notify the property owner
    const notifs = mockDb.getNotifications();
    mockDb.saveNotifications([
      {
        id: `notif-${Date.now()}-own`,
        user_id: newBooking.owner_id,
        title: 'New Booking Request',
        message: `${newBooking.student_name} requested ${newBooking.room_sharing_type} at ${newBooking.property_name} (Ref: ${newBooking.booking_reference}).`,
        type: 'booking_request',
        read: false,
        created_at: new Date().toISOString()
      },
      {
        id: `notif-${Date.now()}-stu`,
        user_id: newBooking.student_id,
        title: 'Booking Request Submitted',
        message: `Your booking request for ${newBooking.property_name} has been sent to the property manager for review.`,
        type: 'booking_request',
        read: false,
        created_at: new Date().toISOString()
      },
      ...notifs
    ]);

    return newBooking;
  },

  // Get bookings for a student
  async getStudentBookings(studentId) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('student_id', studentId)
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase getStudentBookings error:', err.message);
      }
    }
    const all = mockDb.getBookings();
    return all.filter(b => b.student_id === studentId || !b.student_id);
  },

  // Get bookings for an owner
  async getOwnerBookings(ownerId) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('owner_id', ownerId)
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase getOwnerBookings error:', err.message);
      }
    }
    const all = mockDb.getBookings();
    return all.filter(b => b.owner_id === ownerId || !b.owner_id);
  },

  // Get all bookings (admin view)
  async getAllBookings() {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase getAllBookings error:', err.message);
      }
    }
    return mockDb.getBookings();
  },

  // Update booking status with room bed adjustment
  async updateBookingStatus(bookingId, newStatus, reason = '') {
    const all = mockDb.getBookings();
    let updatedBooking = null;

    const updated = all.map(b => {
      if (b.id === bookingId) {
        updatedBooking = {
          ...b,
          status: newStatus,
          rejection_reason: newStatus === 'rejected' ? reason : null,
          cancellation_reason: newStatus === 'cancelled' ? reason : null,
          updated_at: new Date().toISOString()
        };
        return updatedBooking;
      }
      return b;
    });

    mockDb.saveBookings(updated);

    // If confirmed: decrement available beds on property
    if (newStatus === 'confirmed' && updatedBooking?.property_id) {
      const props = mockDb.getProperties();
      const updatedProps = props.map(p => {
        if (p.id === updatedBooking.property_id && p.rooms) {
          const updatedRooms = p.rooms.map(rm => {
            if (rm.room_type === updatedBooking.room_sharing_type && rm.available_beds > 0) {
              return { ...rm, available_beds: rm.available_beds - 1 };
            }
            return rm;
          });
          return { ...p, rooms: updatedRooms };
        }
        return p;
      });
      mockDb.saveProperties(updatedProps);
    }

    // Notifications dispatch
    if (updatedBooking) {
      const notifs = mockDb.getNotifications();
      let title = 'Booking Status Updated';
      let message = `Your booking ${updatedBooking.booking_reference} is now ${newStatus}.`;

      if (newStatus === 'confirmed') {
        title = 'Booking Confirmed!';
        message = `Congratulations! Your stay at ${updatedBooking.property_name} (Ref: ${updatedBooking.booking_reference}) has been confirmed by the owner.`;
      } else if (newStatus === 'rejected') {
        title = 'Booking Request Declined';
        message = `Your request for ${updatedBooking.property_name} could not be accepted: ${reason || 'Dates unavailable'}.`;
      } else if (newStatus === 'cancelled') {
        title = 'Booking Cancelled';
        message = `Booking ${updatedBooking.booking_reference} was cancelled.`;
      }

      mockDb.saveNotifications([
        {
          id: `notif-${Date.now()}`,
          user_id: updatedBooking.student_id,
          title,
          message,
          type: `booking_${newStatus}`,
          read: false,
          created_at: new Date().toISOString()
        },
        ...notifs
      ]);
    }

    return updatedBooking;
  }
};
