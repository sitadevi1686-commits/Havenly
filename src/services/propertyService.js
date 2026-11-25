import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockDb } from './mockDatabase';

export const propertyService = {
  // Fetch public approved properties
  async getPublicProperties() {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select(`
            *,
            property_images (*),
            rooms (*)
          `)
          .eq('verification_status', 'approved')
          .eq('is_active', true);
        if (error) throw error;
        if (data && data.length > 0) return data;
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local database:', err.message);
      }
    }
    // Fallback: return approved properties from mockDb
    const all = mockDb.getProperties();
    return all.filter(p => p.verification_status === 'approved' && p.is_active !== false);
  },

  // Fetch single property by ID
  async getPropertyById(id) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select(`
            *,
            property_images (*),
            rooms (*),
            profiles:owner_id (full_name, email, phone)
          `)
          .eq('id', id)
          .single();
        if (error) throw error;
        if (data) return data;
      } catch (err) {
        console.warn('Supabase property by ID error:', err.message);
      }
    }
    const all = mockDb.getProperties();
    return all.find(p => p.id === id) || null;
  },

  // Fetch properties owned by a specific owner
  async getOwnerProperties(ownerId) {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('owner_id', ownerId);
        if (error) throw error;
        if (data) return data;
      } catch (err) {
        console.warn('Supabase owner properties error:', err.message);
      }
    }
    const all = mockDb.getProperties();
    return all.filter(p => p.owner_id === ownerId || !p.owner_id);
  },

  // Create new property submission
  async createProperty(propertyData, ownerId) {
    const newProperty = {
      id: `prop-${Date.now()}`,
      owner_id: ownerId || 'usr-owner-1',
      name: propertyData.propertyName || propertyData.name,
      category: propertyData.category || 'Premium PG',
      tagline: propertyData.tagline || 'Newly listed architectural student residence',
      description: propertyData.description || 'Spacious, peaceful accommodation close to campus.',
      address: propertyData.address || 'University District',
      city: propertyData.city || 'Campus Town',
      state: propertyData.state || 'State',
      postal_code: propertyData.postal_code || '94305',
      college_name: propertyData.collegeNearby || propertyData.college_name || 'Stanford University',
      college: propertyData.collegeNearby || propertyData.college || 'Stanford University',
      distance_km: Number(propertyData.distanceKm || 0.8),
      distanceKm: Number(propertyData.distanceKm || 0.8),
      distanceDisplay: `${Number(propertyData.distanceKm || 0.8)} km from campus`,
      monthlyRent: Number(propertyData.monthlyRent || 950),
      deposit: Number(propertyData.deposit || 950),
      security_deposit: Number(propertyData.deposit || 950),
      room_sharing_types: propertyData.room_sharing_types || ['Single', 'Double'],
      sharingOptions: propertyData.room_sharing_types || ['Single', 'Double'],
      roomType: propertyData.roomType || 'Single Studio',
      curfew_policy: propertyData.curfew || 'Flexible',
      curfew: propertyData.curfew || 'Flexible 24/7 Access',
      curfewCategory: propertyData.curfew?.includes('11') ? '11 PM' : propertyData.curfew?.includes('10') ? '10 PM' : 'Flexible',
      amenities: propertyData.amenities || ['Gigabit Fiber WiFi', 'Study Desk', 'Daily Cleaning', '24/7 Security'],
      image: propertyData.image || 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1000&q=80',
      gallery: [
        propertyData.image || 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80'
      ],
      specs: {
        sqft: 320,
        bathrooms: 1,
        furnishing: 'Fully Furnished Luxury',
        availableFrom: 'Immediate',
        floor: '2nd Floor'
      },
      rooms: [
        { id: `rm-${Date.now()}-1`, room_type: 'Single Studio', total_beds: 4, available_beds: 3, rent: Number(propertyData.monthlyRent || 950) }
      ],
      verification_status: 'pending', // IMPORTANT: Owner properties start as pending verification!
      is_active: true,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('properties')
          .insert([newProperty])
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase property insert error:', err.message);
      }
    }

    const all = mockDb.getProperties();
    mockDb.saveProperties([newProperty, ...all]);

    // Add notification for admin
    const notifs = mockDb.getNotifications();
    mockDb.saveNotifications([
      {
        id: `notif-${Date.now()}`,
        user_id: 'usr-admin-1',
        title: 'New Property Verification Needed',
        message: `${newProperty.name} was submitted by host and is awaiting review.`,
        type: 'property_submitted',
        read: false,
        created_at: new Date().toISOString()
      },
      ...notifs
    ]);

    return newProperty;
  },

  // Admin Verification action
  async verifyProperty(propertyId, status, rejectionReason = '', adminName = 'Elena Rostova') {
    const all = mockDb.getProperties();
    let updatedProp = null;
    const updated = all.map(p => {
      if (p.id === propertyId) {
        updatedProp = {
          ...p,
          verification_status: status,
          rejection_reason: status === 'rejected' ? rejectionReason : null,
          updated_at: new Date().toISOString()
        };
        return updatedProp;
      }
      return p;
    });

    mockDb.saveProperties(updated);

    // Audit log
    const logs = mockDb.getAuditLogs();
    mockDb.saveAuditLogs([
      {
        id: `log-${Date.now()}`,
        admin_name: adminName,
        action: status === 'approved' ? 'APPROVE_PROPERTY' : 'REJECT_PROPERTY',
        target: updatedProp?.name || propertyId,
        details: rejectionReason || 'Property verified against 42-point safety criteria',
        timestamp: new Date().toISOString()
      },
      ...logs
    ]);

    // Notify owner
    if (updatedProp) {
      const notifs = mockDb.getNotifications();
      mockDb.saveNotifications([
        {
          id: `notif-${Date.now()}`,
          user_id: updatedProp.owner_id || 'usr-owner-1',
          title: status === 'approved' ? 'Property Approved!' : 'Property Needs Revision',
          message: status === 'approved' 
            ? `Your property "${updatedProp.name}" is now approved and live on Havenly.`
            : `Your listing "${updatedProp.name}" was rejected: ${rejectionReason}`,
          type: status === 'approved' ? 'property_approved' : 'property_rejected',
          read: false,
          created_at: new Date().toISOString()
        },
        ...notifs
      ]);
    }

    return updatedProp;
  }
};
