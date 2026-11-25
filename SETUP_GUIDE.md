# HAVENLY — Full-Stack Setup & Student Walkthrough Guide
**Project:** HAVENLY — Student Housing, Simplified  
**Target Audience:** College Web Development Student, Reviewers & Instructors  
**Platform URL:** [http://localhost:5173/](http://localhost:5173/)  

---

## 1. Welcome to Havenly Full-Stack Architecture!

Congratulations! **Havenly** has been transformed from a frontend visual demonstration into a **production-quality, full-stack student housing platform** with three completely independent user experiences:

1. **Student Platform**: Discovery, campus proximity filtering, transparent cost breakdown, and booking requests.
2. **Property Owner Platform**: Property management, room bed availability counters, and tenant request approvals/declines.
3. **Administrator Platform**: Recharts visual analytics, dedicated property verification audit queue, user moderation (suspend/restore), and fraud report resolution.

All three portals communicate with the same unified database model through secure backend operations.

---

## 2. Understanding the Dual-Engine Architecture

As a college student learning web development, one of the biggest challenges is having to configure external database servers before you can even test or present your code.

To solve this, Havenly was built with a **Dual-Engine Architecture**:

```
                                  ┌───────────────────────────────┐
                                  │   Havenly React Application   │
                                  └───────────────┬───────────────┘
                                                  │
                                  ┌───────────────▼───────────────┐
                                  │   Unified Service Layer       │
                                  │ (propertyService, authService)│
                                  └───────────────┬───────────────┘
                                                  │
                   ┌──────────────────────────────┴──────────────────────────────┐
                   │                                                             │
        If .env has Supabase keys                                     If .env is empty (Default)
                   │                                                             │
     ┌─────────────▼──────────────┐                                ┌─────────────▼──────────────┐
     │   Live Supabase Cloud      │                                │  Simulated PostgreSQL DB   │
     │ - Real PostgreSQL Cloud    │                                │ - Instant 100% interactive │
     │ - Auth JWT Tokens          │                                │ - LocalStorage persistence │
     │ - Row Level Security (RLS) │                                │ - Zero setup required!     │
     └────────────────────────────┘                                └────────────────────────────┘
```

> **Why this matters for your project:**  
> You can test the Student, Owner, and Admin portals **immediately** in your browser right now without any database setup! When you're ready to connect to a live Supabase cloud database, you simply paste two keys into `.env` and run our pre-written SQL migration file.

---

## 3. How to Connect Real Supabase (Step-by-Step for Beginners)

When you are ready to connect to a real, live PostgreSQL cloud database on Supabase:

### Step 1: Create a Free Project on Supabase
1. Go to [https://supabase.com](https://supabase.com) and sign up for a free account.
2. Click **New Project**, name it `Havenly`, choose a database password, and select your nearest region.

### Step 2: Run the SQL Schema Migration
1. In your Supabase dashboard, click the **SQL Editor** icon in the left sidebar.
2. Open the file `supabase/migrations/20261125_havenly_schema.sql` from your Havenly folder.
3. Copy its entire content, paste it into the Supabase SQL Editor, and click **RUN**.
4. This will automatically create all **11 tables**, foreign keys, Row Level Security policies, and atomic room booking functions!

### Step 3: Configure Your Environment File
1. In your Havenly project folder, look at `.env.example`.
2. Create a file named `.env` in the root of `Havenly` (next to `package.json`).
3. In your Supabase dashboard, go to **Project Settings** (gear icon) -> **API**.
4. Copy your **Project URL** and your **anon / public key**:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
   ```
5. Save the file and restart Vite (`npm run dev`). Havenly will now automatically talk directly to your live Supabase database!

---

## 4. How to Test All Three User Platforms

To make testing and classroom demonstrations effortless, Havenly features a **Universal Role Switcher** right in the top navigation bar:

```
[ GUEST / STUDENT / OWNER / ADMIN PORTAL ▾ ]  -->  1-click switch between demo accounts!
```

### Test 1: The Student Scholar Journey
1. Open [http://localhost:5173/](http://localhost:5173/).
2. Click the top role pill and ensure you are in **Student Mode** (Logged in as *Alex Morgan*).
3. **Search & Filter**: Scroll to the search console. Filter by distance (`Within 1 km`), category (`Premium PG`), or type `Stanford`. Observe the instant matching results.
4. **Save a Property**: Click the bookmark icon on any property. Notice the **Saved (3)** badge update in the navigation bar.
5. **View Property Details**: Click **View Details** on *The Kensington Scholar Hall*. Explore the high-resolution architectural gallery, room specs, and amenities.
6. **Book Now**: Click the golden **BOOK NOW &bull; RESERVE BED** button.
   - **Step 1**: Choose your check-in date and room sharing preference (e.g. *Single Studio*).
   - **Step 2**: Review the transparent cost breakdown (1st month rent + deposit, $0 brokerage guarantee).
   - **Step 3**: Click **Submit Booking Request**. Observe your unique booking reference generated (e.g. `HVN-2026-XXXX`).
7. **Student Dashboard**: Click **Open Student Dashboard** in the navigation bar.
   - Check **Overview**: See your booking metrics update in real time.
   - Check **My Bookings**: See your newly submitted inquiry marked with an amber **PENDING** badge.
   - Check **Saved Sanctuaries**: View your bookmarked residences.
   - Check **Profile**: Update your phone number or university name and save.

### Test 2: The Property Owner Journey
1. Click the top role switcher in the navbar and select **Property Owner (Marcus Vance)**.
2. Click **Open Owner Hub**.
3. **Overview Statistics**: Review your portfolio metrics (total properties, available rooms, pending tenant inquiries).
4. **Approve / Decline Inquiries**: Go to **Booking Requests**.
   - You will see the booking request that Alex Morgan just submitted!
   - Click **Accept & Reserve Bed**.
   - Notice the booking instantly turns green (**CONFIRMED**) and the property's available beds automatically decrement in the database!
5. **Add a New Property**: Click **Add New Property**.
   - Fill in property name (e.g., *Cambridge Scholar Suites*), proximity to campus, rent, and photo URL.
   - Click **Submit Listing for Havenly Verification**.
   - Notice it is created with status **Pending Verification Review** (it will not appear on the public site until an administrator audits it!).

### Test 3: The Administrator Command Center
1. Click the top role switcher in the navbar and select **Admin (Elena Rostova)**.
2. Click **Open Admin Center**.
3. **Analytics Dashboard**: Review the interactive **Recharts graphs** showing monthly student enrollment trends and accommodation category distribution.
4. **Property Verification Workflow**:
   - Go to **Property Verification**.
   - You will see the property Marcus Vance just submitted waiting in the audit queue!
   - Inspect the photos, safety checklist, and rental specs.
   - Click **Approve & Publish**.
   - The property is now verified and instantly published to the public search catalog!
5. **User Governance**:
   - Click **Manage Students**: Search through enrolled students. Click **Suspend Account** on any student to test moderation, or **Restore Account**.
   - Click **Manage Owners**: Review verified property managers.
6. **Bookings Surveillance**: Inspect every transaction across the platform with full timestamps.
7. **Reported Listings**: Review student reports regarding inaccurate photos or hidden charges, and click **Resolve & Clear**.
8. **Security Audit Logs**: View the cryptographically sequenced immutable log of admin approvals and suspensions.

---

## 5. Security & Architectural Best Practices

As part of your college evaluation, here are key security decisions implemented in Havenly that you can highlight:

1. **Role-Based Access Control (RBAC)**:
   - Ordinary users registering via the public form are restricted to `student` or `owner`.
   - **Administrators cannot be created through public frontend requests**. Admin provisioning is strictly protected.
2. **Anti-Overbooking Concurrency Protection**:
   - In `supabase/migrations/20261125_havenly_schema.sql`, the PostgreSQL function `confirm_booking_and_update_rooms` uses `FOR UPDATE` row locking.
   - Even if two students attempt to reserve the final bed in a property at the exact same millisecond, the PostgreSQL database engine locks the row, executes sequentially, and rejects overbooking.
3. **Zero Secrets in Frontend Code**:
   - Never place database passwords or Supabase `service_role` keys in client-side code. Only the public `anon` key is exposed, while Row Level Security (RLS) protects data at the database level.
4. **Verified Listings Quality Gate**:
   - Only properties with `verification_status = 'approved'` and `is_active = TRUE` can be viewed or booked by public users. Host submissions stay safely in `pending` until administrative audit.

---

*Havenly — Student Housing, Simplified. Built with React, Vite, Tailwind CSS, PostgreSQL, and Supabase.*
