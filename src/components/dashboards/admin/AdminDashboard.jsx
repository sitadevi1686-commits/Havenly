import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Users, Building, Calendar, AlertTriangle,
  BarChart3, LogOut, ArrowLeft, Check, X, ShieldAlert
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { useAuth } from '../../../context/AuthContext';
import { adminService } from '../../../services/adminService';
import { propertyService } from '../../../services/propertyService';
import { bookingService } from '../../../services/bookingService';
import { mockDb } from '../../../services/mockDatabase';
import {
  MICRO_SPRING,
  tabContentVariants,
  createStaggerContainer,
  fadeUpCardVariants,
  cardHoverLift,
  buttonHoverScale,
  buttonTapScale
} from '../../../lib/motion';

const kpiStagger = createStaggerContainer(0.05, 0.03);
const listStagger = createStaggerContainer(0.06, 0.04);

export default function AdminDashboard({ onReturnHome, onOpenPropertyDetails }) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [properties, setProperties] = useState([]);
  const [students, setStudents] = useState([]);
  const [owners, setOwners] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reports, setReports] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    loadAllAdminData();
  }, [user]);

  const loadAllAdminData = async () => {
    const s = adminService.getPlatformStats();
    setStats(s);

    const props = mockDb.getProperties();
    setProperties(props);

    const stds = adminService.getAllStudents();
    setStudents(stds);

    const owns = adminService.getAllOwners();
    setOwners(owns);

    const bks = await bookingService.getAllBookings();
    setBookings(bks);

    const reps = adminService.getReports();
    setReports(reps);

    const logs = adminService.getAuditLogs();
    setAuditLogs(logs);
  };

  const handleVerifyProperty = async (propertyId, decision) => {
    let reason = '';
    if (decision === 'rejected') {
      reason = prompt("Specify verification failure reason (e.g., missing fire safety certificate, incorrect rent):") || 'Does not meet architectural quality standard';
    }
    await propertyService.verifyProperty(propertyId, decision, reason, user?.full_name);
    loadAllAdminData();
  };

  const handleToggleUserSuspension = (userId, currentStatus) => {
    const action = currentStatus ? "restore" : "suspend";
    if (window.confirm(`Are you sure you wish to ${action} this account?`)) {
      adminService.toggleUserSuspension(userId, currentStatus, user?.full_name);
      loadAllAdminData();
    }
  };

  const handleResolveReport = (reportId, status) => {
    const notes = prompt("Enter resolution notes for this report:") || 'Audit conducted and resolved.';
    adminService.resolveReport(reportId, status, notes, user?.full_name);
    loadAllAdminData();
  };

  const pendingProperties = properties.filter(p => p.verification_status === 'pending');
  const pendingReports = reports.filter(r => r.status === 'pending');

  const CHART_COLORS = ['#C6A36A', '#9C8052', '#E8D5B5', '#8C7449'];

  return (
    <div className="min-h-screen bg-[#101313] text-[#A6AAA4] flex flex-col lg:flex-row">
      
      {/* Admin Sidebar Navigation */}
      <aside className="w-full lg:w-72 bg-[#191D1C] border-r border-[#C6A36A]/20 flex flex-col justify-between p-6 shrink-0">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-sm bg-[#101313] border border-[#C6A36A] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-[#C6A36A]" />
              </div>
              <div>
                <span className="font-serif text-xl text-white font-medium block">HAVENLY</span>
                <span className="text-[9px] uppercase tracking-widest text-[#C6A36A] font-semibold -mt-1 block">
                  Admin Command
                </span>
              </div>
            </div>

            <motion.button
              whileHover={buttonHoverScale}
              whileTap={buttonTapScale}
              onClick={onReturnHome}
              className="p-1.5 rounded bg-[#101313] border border-white/10 hover:border-[#C6A36A] text-white transition-colors"
              title="Return to Public Website"
            >
              <ArrowLeft className="w-4 h-4 text-[#C6A36A]" />
            </motion.button>
          </div>

          {/* Admin Identity */}
          <div className="py-5 flex items-center gap-3 border-b border-white/5">
            <div className="w-10 h-10 rounded-full bg-[#101313] border border-[#C6A36A] overflow-hidden flex items-center justify-center shrink-0">
              <span className="font-serif font-bold text-sm text-[#C6A36A]">AD</span>
            </div>
            <div className="truncate">
              <span className="text-xs text-white font-medium block truncate">{user?.full_name || 'System Administrator'}</span>
              <span className="text-[10px] text-[#C6A36A] uppercase tracking-wider block">Principal Officer</span>
            </div>
          </div>

          {/* Nav Items with Shared Active Pill */}
          <nav className="mt-6 space-y-1.5">
            {[
              { id: 'overview', label: 'Platform Overview', icon: BarChart3 },
              { id: 'verification', label: 'Property Verification', icon: ShieldCheck, badge: pendingProperties.length ? `${pendingProperties.length} pending` : null },
              { id: 'properties', label: 'All Properties', icon: Building, badge: properties.length },
              { id: 'students', label: 'Manage Students', icon: Users, badge: students.length },
              { id: 'owners', label: 'Manage Owners', icon: Building, badge: owners.length },
              { id: 'bookings', label: 'Bookings Surveillance', icon: Calendar, badge: bookings.length },
              { id: 'reports', label: 'Reported Listings', icon: AlertTriangle, badge: pendingReports.length || null },
              { id: 'audit', label: 'Security Audit Logs', icon: ShieldAlert },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <motion.button
                  key={item.id}
                  whileTap={buttonTapScale}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative w-full flex items-center justify-between px-3.5 py-2.5 rounded-sm text-xs font-medium transition-colors ${
                    isActive
                      ? 'text-[#101313] font-semibold'
                      : 'text-[#A6AAA4] hover:text-white hover:bg-[#101313]'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="adminSidebarPill"
                      transition={MICRO_SPRING}
                      className="absolute inset-0 bg-[#C6A36A] rounded-sm shadow-gold-subtle z-0"
                    />
                  )}
                  <div className="relative z-10 flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`relative z-10 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-[#101313] text-[#C6A36A]' : 'bg-[#C6A36A] text-[#101313]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-white/10 space-y-2">
          <motion.button
            whileHover={buttonHoverScale}
            whileTap={buttonTapScale}
            onClick={onReturnHome}
            className="w-full py-2 text-xs text-[#A6AAA4] hover:text-white flex items-center justify-center gap-2 border border-white/5 rounded-sm transition-colors"
          >
            <span>Public Site View</span>
          </motion.button>
          
          <motion.button
            whileTap={buttonTapScale}
            onClick={() => { logout(); onReturnHome(); }}
            className="w-full py-2 text-xs text-red-400 hover:text-red-300 flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </motion.button>
        </div>
      </aside>

      {/* Main Command Workspace */}
      <main className="flex-1 p-6 sm:p-8 lg:p-12 overflow-y-auto max-w-7xl">
        <AnimatePresence mode="wait">
          {/* OVERVIEW & RECHARTS ANALYTICS TAB */}
          {activeTab === 'overview' && stats && (
            <motion.div
              key="admin-overview"
              variants={tabContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-8"
            >
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#C6A36A]">
                  ADMINISTRATIVE SURVEILLANCE
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl text-white font-normal mt-1">
                  Havenly Core Operations
                </h1>
                <p className="text-xs text-[#A6AAA4] mt-1">
                  Real-time aggregated PostgreSQL database metrics, verification queue, and student housing volume.
                </p>
              </div>

              {/* 8 Database Metrics Cards */}
              <motion.div variants={kpiStagger} initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div variants={fadeUpCardVariants} whileHover={cardHoverLift} className="p-5 rounded-xl bg-[#191D1C] border border-white/10">
                  <span className="text-[10px] uppercase text-[#A6AAA4] block">Registered Students</span>
                  <span className="font-serif text-3xl text-white font-medium mt-1 block">{stats.totalStudents}</span>
                  <span className="text-[10px] text-emerald-400 mt-1 block">Active scholars</span>
                </motion.div>
                <motion.div variants={fadeUpCardVariants} whileHover={cardHoverLift} className="p-5 rounded-xl bg-[#191D1C] border border-white/10">
                  <span className="text-[10px] uppercase text-[#A6AAA4] block">Property Owners</span>
                  <span className="font-serif text-3xl text-white font-medium mt-1 block">{stats.totalOwners}</span>
                  <span className="text-[10px] text-[#C6A36A] mt-1 block">Verified partners</span>
                </motion.div>
                <motion.div variants={fadeUpCardVariants} whileHover={cardHoverLift} className="p-5 rounded-xl bg-[#191D1C] border border-white/10">
                  <span className="text-[10px] uppercase text-[#A6AAA4] block">Verified Properties</span>
                  <span className="font-serif text-3xl text-emerald-400 font-medium mt-1 block">{stats.approvedProperties}</span>
                  <span className="text-[10px] text-[#A6AAA4] mt-1 block">Published on public site</span>
                </motion.div>
                <motion.div variants={fadeUpCardVariants} whileHover={cardHoverLift} className="p-5 rounded-xl bg-[#191D1C] border border-white/10">
                  <span className="text-[10px] uppercase text-[#A6AAA4] block">Pending Verification</span>
                  <span className="font-serif text-3xl text-amber-400 font-medium mt-1 block">{stats.pendingProperties}</span>
                  <span className="text-[10px] text-amber-300 mt-1 block">Action required</span>
                </motion.div>
                <motion.div variants={fadeUpCardVariants} whileHover={cardHoverLift} className="p-5 rounded-xl bg-[#191D1C] border border-white/10">
                  <span className="text-[10px] uppercase text-[#A6AAA4] block">Total Bookings</span>
                  <span className="font-serif text-3xl text-white font-medium mt-1 block">{stats.totalBookings}</span>
                  <span className="text-[10px] text-[#A6AAA4] mt-1 block">All-time transactions</span>
                </motion.div>
                <motion.div variants={fadeUpCardVariants} whileHover={cardHoverLift} className="p-5 rounded-xl bg-[#191D1C] border border-white/10">
                  <span className="text-[10px] uppercase text-[#A6AAA4] block">Confirmed Leases</span>
                  <span className="font-serif text-3xl text-emerald-400 font-medium mt-1 block">{stats.confirmedBookings}</span>
                  <span className="text-[10px] text-emerald-400 mt-1 block">Secured student housing</span>
                </motion.div>
                <motion.div variants={fadeUpCardVariants} whileHover={cardHoverLift} className="p-5 rounded-xl bg-[#191D1C] border border-white/10">
                  <span className="text-[10px] uppercase text-[#A6AAA4] block">Pending Approvals</span>
                  <span className="font-serif text-3xl text-amber-300 font-medium mt-1 block">{stats.pendingBookings}</span>
                  <span className="text-[10px] text-[#A6AAA4] mt-1 block">With property owners</span>
                </motion.div>
                <motion.div variants={fadeUpCardVariants} whileHover={cardHoverLift} className="p-5 rounded-xl bg-[#191D1C] border border-white/10">
                  <span className="text-[10px] uppercase text-[#A6AAA4] block">Reported Listings</span>
                  <span className="font-serif text-3xl text-red-400 font-medium mt-1 block">{reports.length}</span>
                  <span className="text-[10px] text-red-300 mt-1 block">Integrity flags</span>
                </motion.div>
              </motion.div>

              {/* Recharts Analytics Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Monthly Growth Trends (8 cols) */}
                <motion.div variants={fadeUpCardVariants} initial="hidden" animate="visible" className="lg:col-span-8 p-6 rounded-xl bg-[#191D1C] border border-white/10">
                  <h3 className="font-serif text-xl text-white mb-1">Student Growth & Booking Trajectory</h3>
                  <p className="text-xs text-[#A6AAA4] mb-6">Historical growth metrics across campus regions.</p>
                  
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats.monthlyTrends}>
                        <defs>
                          <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#C6A36A" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#C6A36A" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="month" stroke="#A6AAA4" fontSize={11} />
                        <YAxis stroke="#A6AAA4" fontSize={11} />
                        <Tooltip contentStyle={{ backgroundColor: '#101313', borderColor: '#C6A36A', fontSize: 12 }} />
                        <Area type="monotone" dataKey="students" stroke="#C6A36A" fillOpacity={1} fill="url(#goldGradient)" name="Registered Scholars" />
                        <Area type="monotone" dataKey="bookings" stroke="#E8D5B5" fillOpacity={0.2} fill="#E8D5B5" name="Monthly Bookings" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                {/* Property Distribution by Category (4 cols) */}
                <motion.div variants={fadeUpCardVariants} initial="hidden" animate="visible" className="lg:col-span-4 p-6 rounded-xl bg-[#191D1C] border border-white/10 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-xl text-white mb-1">Category Distribution</h3>
                    <p className="text-xs text-[#A6AAA4] mb-4">Breakdown by accommodation classification.</p>
                    
                    <div className="h-48 w-full flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={stats.categoryDistribution}
                            innerRadius={45}
                            outerRadius={70}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {stats.categoryDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#101313', borderColor: '#C6A36A', fontSize: 11 }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-4 border-t border-white/5">
                    {stats.categoryDistribution.map((cat, i) => (
                      <div key={cat.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}></span>
                          <span>{cat.name}</span>
                        </div>
                        <span className="text-white font-medium">{cat.value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

              </div>
            </motion.div>
          )}

          {/* PROPERTY VERIFICATION WORKFLOW TAB */}
          {activeTab === 'verification' && (
            <motion.div
              key="admin-verification"
              variants={tabContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#C6A36A]">
                  SAFETY & COMPLIANCE
                </span>
                <h2 className="font-serif text-3xl text-white font-normal mt-1">Property Verification Queue</h2>
                <p className="text-xs text-[#A6AAA4]">
                  Review host property submissions against Havenly's 42-point safety, fire certification, and lease transparency audit.
                </p>
              </div>

              {pendingProperties.length === 0 ? (
                <div className="p-12 text-center rounded-xl bg-[#191D1C] border border-white/10">
                  <Check className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                  <h3 className="font-serif text-2xl text-white">Verification Queue Clear</h3>
                  <p className="text-xs text-[#A6AAA4] mt-1">All submitted host properties have been audited and verified.</p>
                </div>
              ) : (
                <motion.div variants={listStagger} initial="hidden" animate="visible" className="space-y-4">
                  {pendingProperties.map((p) => (
                    <motion.div
                      key={p.id}
                      variants={fadeUpCardVariants}
                      whileHover={cardHoverLift}
                      className="p-6 rounded-xl bg-[#191D1C] border border-amber-500/40 space-y-4 shadow-luxury"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex items-start gap-4">
                          <img src={p.image} alt={p.name} className="w-28 h-24 rounded-lg object-cover" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-serif text-2xl text-white">{p.name}</span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-950/80 text-amber-300 border border-amber-500/40">
                                Pending Verification
                              </span>
                            </div>

                            <span className="text-xs text-[#A6AAA4] block mt-1">
                              {p.address}, {p.city} &bull; Proximity: {p.distanceDisplay || `${p.distanceKm} km to ${p.college_name || p.college}`}
                            </span>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-white font-medium mt-2">
                              <span>Rent: ${p.monthlyRent}/mo</span>
                              <span>&bull;</span>
                              <span>Deposit: ${p.deposit || p.security_deposit}</span>
                              <span>&bull;</span>
                              <span>Category: {p.category}</span>
                              <span>&bull;</span>
                              <span>Curfew: {p.curfewCategory || p.curfew_policy}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end lg:self-center">
                          <motion.button
                            whileHover={buttonHoverScale}
                            whileTap={buttonTapScale}
                            onClick={() => handleVerifyProperty(p.id, 'approved')}
                            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-xs uppercase tracking-wider rounded flex items-center gap-1.5"
                          >
                            <Check className="w-4 h-4" />
                            <span>Approve & Publish</span>
                          </motion.button>

                          <motion.button
                            whileTap={buttonTapScale}
                            onClick={() => handleVerifyProperty(p.id, 'rejected')}
                            className="px-4 py-2.5 border border-red-500/40 text-red-400 hover:text-red-300 text-xs uppercase tracking-wider rounded flex items-center gap-1.5"
                          >
                            <X className="w-4 h-4" />
                            <span>Reject Listing</span>
                          </motion.button>
                        </div>
                      </div>

                      <div className="p-3 bg-[#101313] rounded border border-white/5 text-xs text-[#A6AAA4]">
                        <strong className="text-white">Audit Checklist:</strong> Physical inspection completed &bull; Fire extinguisher valid &bull; Digital lease certified &bull; Optical fiber verified &bull; Direct landlord ownership confirmed.
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ALL PROPERTIES TAB */}
          {activeTab === 'properties' && (
            <motion.div
              key="admin-properties"
              variants={tabContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#C6A36A]">
                    INVENTORY DIRECTORY
                  </span>
                  <h2 className="font-serif text-3xl text-white font-normal mt-1">All Platform Listings</h2>
                </div>
                <span className="text-xs text-[#A6AAA4]">Total Listings: {properties.length}</span>
              </div>

              <motion.div variants={listStagger} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {properties.map((p) => (
                  <motion.div
                    key={p.id}
                    variants={fadeUpCardVariants}
                    whileHover={cardHoverLift}
                    onClick={() => onOpenPropertyDetails && onOpenPropertyDetails(p)}
                    className="p-4 rounded-xl bg-[#191D1C] border border-white/10 hover:border-[#C6A36A]/40 flex items-center justify-between gap-4 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <img src={p.image} alt={p.name} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                      <div className="truncate">
                        <span className="font-serif text-lg text-white block truncate">{p.name}</span>
                        <span className="text-[11px] text-[#A6AAA4] block truncate">{p.category} &bull; ${p.monthlyRent}/mo</span>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded text-[10px] font-semibold uppercase shrink-0 ${
                      p.verification_status === 'approved' ? 'bg-emerald-950/80 text-emerald-300' :
                      p.verification_status === 'pending' ? 'bg-amber-950/80 text-amber-300' : 'bg-red-950/80 text-red-300'
                    }`}>
                      {p.verification_status || 'approved'}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* MANAGE STUDENTS TAB */}
          {activeTab === 'students' && (
            <motion.div
              key="admin-students"
              variants={tabContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#C6A36A]">
                    USER GOVERNANCE
                  </span>
                  <h2 className="font-serif text-3xl text-white font-normal mt-1">Manage Enrolled Students</h2>
                </div>
                <span className="text-xs text-[#A6AAA4]">Total Scholars: {students.length}</span>
              </div>

              <div className="rounded-xl overflow-hidden bg-[#191D1C] border border-white/10">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#101313] text-[#C6A36A] uppercase tracking-wider text-[10px] border-b border-white/10">
                    <tr>
                      <th className="p-4">Student</th>
                      <th className="p-4">University</th>
                      <th className="p-4">Phone</th>
                      <th className="p-4">Account Status</th>
                      <th className="p-4 text-right">Moderation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {students.map((s) => (
                      <tr key={s.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={s.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'} alt="" className="w-8 h-8 rounded-full object-cover" />
                            <div>
                              <span className="text-white font-medium block">{s.full_name}</span>
                              <span className="text-[#A6AAA4] text-[11px]">{s.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-[#A6AAA4]">{s.college || 'Stanford University'}</td>
                        <td className="p-4 text-[#A6AAA4]">{s.phone || '+1 (555) 019-2938'}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            s.is_suspended ? 'bg-red-950/80 text-red-300' : 'bg-emerald-950/80 text-emerald-300'
                          }`}>
                            {s.is_suspended ? 'Suspended' : 'Active'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <motion.button
                            whileTap={buttonTapScale}
                            onClick={() => handleToggleUserSuspension(s.id, s.is_suspended)}
                            className={`px-3 py-1 text-[11px] rounded transition-colors ${
                              s.is_suspended
                                ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                                : 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                            }`}
                          >
                            {s.is_suspended ? 'Restore Account' : 'Suspend Account'}
                          </motion.button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* MANAGE OWNERS TAB */}
          {activeTab === 'owners' && (
            <motion.div
              key="admin-owners"
              variants={tabContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#C6A36A]">
                    PARTNER GOVERNANCE
                  </span>
                  <h2 className="font-serif text-3xl text-white font-normal mt-1">Manage Property Owners</h2>
                </div>
                <span className="text-xs text-[#A6AAA4]">Total Hosts: {owners.length}</span>
              </div>

              <div className="rounded-xl overflow-hidden bg-[#191D1C] border border-white/10">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#101313] text-[#C6A36A] uppercase tracking-wider text-[10px] border-b border-white/10">
                    <tr>
                      <th className="p-4">Property Owner</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Phone</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Moderation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {owners.map((o) => (
                      <tr key={o.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={o.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'} alt="" className="w-8 h-8 rounded-full object-cover" />
                            <div>
                              <span className="text-white font-medium block">{o.full_name}</span>
                              <span className="text-[#A6AAA4] text-[11px]">{o.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-[#A6AAA4] uppercase">{o.owner_type || 'individual'}</td>
                        <td className="p-4 text-[#A6AAA4]">{o.phone || '+1 (555) 492-1184'}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            o.is_suspended ? 'bg-red-950/80 text-red-300' : 'bg-emerald-950/80 text-emerald-300'
                          }`}>
                            {o.is_suspended ? 'Suspended' : 'Verified'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <motion.button
                            whileTap={buttonTapScale}
                            onClick={() => handleToggleUserSuspension(o.id, o.is_suspended)}
                            className={`px-3 py-1 text-[11px] rounded transition-colors ${
                              o.is_suspended
                                ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                                : 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                            }`}
                          >
                            {o.is_suspended ? 'Restore Partner' : 'Suspend Partner'}
                          </motion.button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* BOOKINGS SURVEILLANCE TAB */}
          {activeTab === 'bookings' && (
            <motion.div
              key="admin-bookings"
              variants={tabContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#C6A36A]">
                    PLATFORM ACTIVITY
                  </span>
                  <h2 className="font-serif text-3xl text-white font-normal mt-1">Bookings Surveillance</h2>
                </div>
                <span className="text-xs text-[#A6AAA4]">Total Transactions: {bookings.length}</span>
              </div>

              <div className="rounded-xl overflow-hidden bg-[#191D1C] border border-white/10">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#101313] text-[#C6A36A] uppercase tracking-wider text-[10px] border-b border-white/10">
                    <tr>
                      <th className="p-4">Reference</th>
                      <th className="p-4">Property</th>
                      <th className="p-4">Tenant</th>
                      <th className="p-4">Check-In</th>
                      <th className="p-4">Rent</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-mono text-[#C6A36A]">{b.booking_reference}</td>
                        <td className="p-4 text-white font-medium">{b.property_name}</td>
                        <td className="p-4 text-[#A6AAA4]">{b.student_name}</td>
                        <td className="p-4 text-[#A6AAA4]">{b.check_in_date}</td>
                        <td className="p-4 text-white font-serif">${b.monthly_rent}/mo</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            b.status === 'confirmed' ? 'bg-emerald-950/80 text-emerald-300' :
                            b.status === 'pending' ? 'bg-amber-950/80 text-amber-300' : 'bg-red-950/80 text-red-300'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* REPORTED LISTINGS TAB */}
          {activeTab === 'reports' && (
            <motion.div
              key="admin-reports"
              variants={tabContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#C6A36A]">
                  INTEGRITY & FRAUD PROTECTION
                </span>
                <h2 className="font-serif text-3xl text-white font-normal mt-1">Student Reported Listings</h2>
                <p className="text-xs text-[#A6AAA4]">Investigate reported discrepancies in rent, photographs, or landlord communication.</p>
              </div>

              <motion.div variants={listStagger} initial="hidden" animate="visible" className="space-y-4">
                {reports.map((r) => (
                  <motion.div
                    key={r.id}
                    variants={fadeUpCardVariants}
                    whileHover={cardHoverLift}
                    className="p-6 rounded-xl bg-[#191D1C] border border-red-500/30 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-bold text-red-400">{r.category}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        r.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {r.status}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl text-white">{r.property_name}</h3>
                    <p className="text-xs text-[#A6AAA4] bg-[#101313] p-3 rounded border border-white/5">
                      "{r.description}"
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[11px] text-[#A6AAA4]">Filed by: {r.reporter_name} &bull; {new Date(r.created_at).toLocaleDateString()}</span>
                      {r.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={buttonHoverScale}
                            whileTap={buttonTapScale}
                            onClick={() => handleResolveReport(r.id, 'resolved')}
                            className="px-3.5 py-1.5 bg-emerald-500 text-black text-xs font-semibold uppercase tracking-wider rounded"
                          >
                            Resolve & Clear
                          </motion.button>
                          <motion.button
                            whileTap={buttonTapScale}
                            onClick={() => handleResolveReport(r.id, 'dismissed')}
                            className="px-3.5 py-1.5 border border-white/10 text-[#A6AAA4] hover:text-white text-xs uppercase tracking-wider rounded"
                          >
                            Dismiss
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* SECURITY AUDIT LOGS TAB */}
          {activeTab === 'audit' && (
            <motion.div
              key="admin-audit"
              variants={tabContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-6"
            >
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#C6A36A]">
                  IMMUTABLE AUDIT TRAIL
                </span>
                <h2 className="font-serif text-3xl text-white font-normal mt-1">Administrative Audit Logs</h2>
                <p className="text-xs text-[#A6AAA4]">Cryptographically sequenced record of all platform governance actions.</p>
              </div>

              <div className="rounded-xl overflow-hidden bg-[#191D1C] border border-white/10">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#101313] text-[#C6A36A] uppercase tracking-wider text-[10px] border-b border-white/10">
                    <tr>
                      <th className="p-4">Timestamp</th>
                      <th className="p-4">Administrator</th>
                      <th className="p-4">Action</th>
                      <th className="p-4">Target Resource</th>
                      <th className="p-4">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-white/5">
                        <td className="p-4 text-[#A6AAA4] font-mono text-[11px]">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="p-4 text-white font-medium">{log.admin_name}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#C6A36A]/20 text-[#C6A36A]">
                            {log.action}
                          </span>
                        </td>
                        <td className="p-4 text-white">{log.target}</td>
                        <td className="p-4 text-[#A6AAA4]">{log.details || 'System audit verified'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
