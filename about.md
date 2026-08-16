# Hotel Rajhans International - Full System Architecture & Features Documentation

Welcome to the comprehensive documentation for **Hotel Rajhans International Management System (HMS) & Guest Booking Portal**. This document provides an exhaustive overview of the system architecture, features, database models, interactive UI controls, API specs, security framework, and deployment workflows.

---

## Table of Contents
1. [Executive Summary & Project Overview](#1-executive-summary--project-overview)
2. [Technology Stack](#2-technology-stack)
3. [System Architecture](#3-system-architecture)
   - [High-Level Component Interaction](#high-level-component-interaction)
   - [Database Entity-Relationship Diagram](#database-entity-relationship-diagram)
   - [Booking & Dual Payment Gateway Sequence Flow](#booking--dual-payment-gateway-sequence-flow)
4. [Key Features & Functionalities](#4-key-features--functionalities)
   - [Guest Web Portal & Tourist Experience](#guest-web-portal--tourist-experience)
   - [Admin Management Portal](#admin-management-portal)
5. [Interactive Controls & UI Button Workflow (How Everything Works)](#5-interactive-controls--ui-button-workflow-how-everything-works)
   - [Guest Portal Controls](#guest-portal-controls)
   - [Admin Panel Controls](#admin-panel-controls)
6. [Database Schema Reference](#6-database-schema-reference)
7. [API Route Specifications](#7-api-route-specifications)
8. [Security & Authentication Architecture](#8-security--authentication-architecture)
9. [Deployment & Environment Setup](#9-deployment--environment-setup)
10. [Project Directory Structure](#10-project-directory-structure)

---

## 1. Executive Summary & Project Overview

**Hotel Rajhans International** is a premier hospitality property located on MG Road, Kachari Chowk, Bhagalpur, Bihar. The **Rajhans HMS & Web Portal** is a modern, full-stack web application designed to serve two primary audiences:

1. **Hotel Guests & Online Visitors**: A luxury digital storefront allowing guests to view room suites, check real-time availability, calculate dynamic tariffs with GST taxation, explore regional tourist attractions (Vikramshila University, Gangetic Dolphin Sanctuary, Mandar Hill, Ajgaivinath Temple), initiate instant WhatsApp inquiries, complete online payments via Razorpay and Cashfree Payment Gateways (UPI, Cards, Netbanking), and generate automated tax invoices.
2. **Hotel Management & Operations Staff**: A secure, role-based administrative control panel allowing management to monitor key performance indicators (Revenue, Occupancy, Check-ins), control room inventories & pricing with intelligent tariff anomaly protection, manage reservations, track guest CRM profiles, manage CMS policies, and export financial analytics (XLSX, CSV, PDF).

---

## 2. Technology Stack

The application is built on a modern, high-performance web development architecture:

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16 (App Router)** | Full-stack React framework utilizing Server & Client Components with `basePath` routing |
| **UI Library** | **React 19** | Component-driven user interface architecture |
| **Styling & Design** | **Tailwind CSS v4** | Utility-first CSS framework with curated gold, brown, and cream luxury tokens |
| **Animations** | **Framer Motion** | Declarative smooth UI animations, modal transitions, and live indicator pulses |
| **Icons** | **Lucide React** | Clean, accessible vector icon library |
| **Database & ORM** | **Prisma ORM (v6.4)** | Type-safe database client and migration tool |
| **Database Engine** | **SQLite / PostgreSQL** | Relational data persistence engine |
| **Authentication** | **JOSE (JWT) + Bcrypt** | Stateless JWT authentication with HTTP-only cookies |
| **Payment Gateways**| **Razorpay & Cashfree SDKs** | Dual payment gateway integration for UPI, Cards & Netbanking with webhook handling |
| **Exports & Reports**| **jsPDF, html2canvas, xlsx, json2csv** | Invoice generation and multi-format reporting exports |
| **Email Service** | **Nodemailer** | SMTP transaction email service for booking receipts |

---

## 3. System Architecture

### High-Level Component Interaction

The application follows a decoupled Next.js App Router architecture where client components interact with Next.js API Route handlers, which communicate with Prisma ORM and external integrations (Razorpay, Cashfree, SMTP).

```mermaid
graph TD
    subgraph Client Layer
        A[Guest Web Portal - /] -->|Book Room / View Tariffs| B[Booking Modal & API Fetch]
        A -->|Explore Attractions| C[Attractions & Map Component]
        D[Admin Portal - /admin/*] -->|Manage Operations| E[Admin Dashboard & Controls]
    end

    subgraph Middleware & Security
        F[Next.js Middleware - middleware.ts] -->|Verify JWT Cookie| G{Authenticated?}
        G -->|Yes| D
        G -->|No| H[Redirect /admin/login]
    end

    subgraph Application API Layer
        B -->|POST /api/bookings| I[Booking API Handler]
        B -->|POST /api/payments/*| J[Payment API Handler - Razorpay / Cashfree]
        E -->|GET /api/reports| K[Reports Aggregator API]
        E -->|PUT /api/rooms| L[Room Tariff Control API]
        E -->|GET /api/customers| M[Customer CRM API]
    end

    subgraph Integrations & Storage
        I -->|Check Availability & Create| N[(Prisma Database)]
        J -->|Order Creation & Verification| O[Razorpay / Cashfree Gateway APIs]
        J -->|Send Booking Invoice Email| P[SMTP Email Server]
        K & L & M -->|Query & Persist| N
    end
```

---

### Database Entity-Relationship Diagram

The core database design centers around **Rooms**, **Bookings**, **Customers**, **Payments**, and **Users**.

```mermaid
erDiagram
    User ||--o{ AuditLog : creates
    Customer ||--o{ Booking : places
    Room ||--o{ Booking : reserved_in
    Room ||--o{ RoomImage : has
    Room ||--o{ RoomAmenity : offers
    Room ||--o{ Availability : tracks
    Booking ||--o{ Payment : contains

    User {
        string id PK
        string email UK
        string passwordHash
        string name
        enum role
        boolean isActive
    }

    Room {
        string id PK
        string name
        string slug UK
        enum type
        float basePriceSingle
        float basePriceDouble
        float taxPercentage
        enum status
    }

    Customer {
        string id PK
        string name
        string phone UK
        string email
        boolean vipStatus
        int visitCount
        float totalSpent
    }

    Booking {
        string id PK
        string referenceId UK
        string customerId FK
        string roomId FK
        datetime checkIn
        datetime checkOut
        float netAmount
        enum status
    }

    Payment {
        string id PK
        string bookingId FK
        string razorpayOrderId
        string razorpayPaymentId
        float amount
        enum status
    }
```

---

### Booking & Dual Payment Gateway Sequence Flow

When a guest books a room online, the system executes a multi-step verification and transaction workflow:

```mermaid
sequenceDiagram
    autonumber
    actor Guest
    participant Modal as BookingModal
    participant API as /api/bookings
    participant DB as Prisma Database
    participant GW as Razorpay / Cashfree API
    participant Mail as SMTP Mailer

    Guest->>Modal: Select Dates, Room & Enter Guest Info
    Modal->>API: POST /api/bookings (checkIn, checkOut, roomId, guestInfo)
    API->>DB: Query Overlapping Bookings & Room Status
    alt Room Available
        API->>DB: Create/Update Customer Record
        API->>DB: Create Booking Record (Status: PENDING)
        API-->>Modal: Return Booking Object & ID
    else Room Overlapped
        API-->>Modal: Return 409 Conflict Error
    end

    Modal->>API: POST /api/payments/razorpay/create-order or cashfree/create-order
    API->>GW: Create Order (amount, currency, receipt)
    GW-->>API: Return Order ID & Session Credentials
    API-->>Modal: Return Gateway Credentials

    Modal->>Guest: Open Payment SDK Modal (UPI / Card / Netbanking)
    Guest->>Modal: Authorize Payment
    Modal->>API: POST /api/payments/verify-signature or Webhook Trigger
    API->>API: Verify Cryptographic Signature / Webhook Payload
    API->>DB: Record Payment (Status: SUCCESS)
    API->>DB: Update Booking (Status: CONFIRMED, paidAmount)
    API->>Mail: Send Email Invoice & Directions to Guest
    API-->>Modal: Return Success & Booking Reference (HRJ-XXXX)
    Modal-->>Guest: Render Confirmation Screen & Download Invoice
```

---

## 4. Key Features & Functionalities

### Guest Web Portal & Tourist Experience

1. **Luxury Showcase & Room Tariffs Catalog**:
   - Filterable suite cards showcasing Executive Rooms, Deluxe Rooms, Royal Suites, and Group Dormitories.
   - Transparent tariff structure (Single occupancy, double occupancy, weekend rates, extra bed charges, and GST calculation).
2. **Interactive Booking Experience**:
   - Live date picker with instant date range validation and night counter calculations.
   - Guest information form with automatic customer profile mapping.
3. **Regional Tourist Attractions Showcase**:
   - **Vikramshila Ancient University Ruins**: 8th Century Pala Empire Buddhist monastery & learning center (`44 km / ~55 mins drive`).
   - **Vikramshila Gangetic Dolphin Sanctuary**: India's only protected freshwater river dolphin reserve (`15 km / ~20 mins drive`).
   - **Historic Mandar Hill (Mandar Parvat)**: Samudra Manthan mythological site with cable car ropeway & sacred Jain shrine (`48 km / ~1 hr 10 mins drive`).
   - **Sacred Ajgaivinath Temple, Sultanganj**: Ancient island Shiva temple on the Ganges (`28 km / ~40 mins drive`).
4. **Instant WhatsApp & Direct Contact Tools**:
   - Floating WhatsApp action button (`fixed bottom-6 right-6 z-50`) with live pulse animation linking to `https://wa.me/919308189201`.
   - Direct telephone link triggers (`tel:+919308189201`) in header and contact section.
5. **Google Maps Navigation Integration**:
   - Direct Google Maps short link integration (`https://maps.app.goo.gl/77AAPZ7hRje8Nrmk9`) with embedded map badge overlay.
6. **Automated Digital Tax Invoice**:
   - Generates print-ready HTML & PDF tax invoices featuring GSTIN numbers, itemized tariff breakdowns, tax computations, and QR verification.

---

### Admin Management Portal

1. **Operational Dashboard & Executive Analytics**:
   - Real-time KPIs: Total Revenue, Occupancy Rate %, Today's Check-ins, Today's Check-outs, and Available Rooms.
   - Monthly Revenue Trends chart powered by Recharts.
2. **Rooms & Dynamic Pricing Control**:
   - Update room availability statuses (`AVAILABLE`, `OCCUPIED`, `MAINTENANCE`, `DEACTIVATED`).
   - Edit base single prices, base double prices, weekend tariffs, holiday pricing, extra bed fees, and GST percentages.
   - **Tariff Anomaly Protection**: Automatic validation check displaying a warning banner if single price exceeds double price with a one-click auto-correct button (`Reset to ₹3,090`).
3. **Reservation & Reception Desk Management**:
   - Filter reservations by status (`PENDING`, `CONFIRMED`, `CHECKED_IN`, `CHECKED_OUT`, `CANCELLED`).
   - Real-time search across guest names, phone numbers, and booking reference IDs.
   - Quick status transition controls (Confirm, Check-In, Check-Out, Cancel).
4. **Customer CRM & VIP Tracking**:
   - Centralized database of all hotel guests with automatic visit count and total spend aggregations.
   - Toggle VIP status badges, record internal staff notes, and maintain government ID proof numbers.
5. **Content Management System (CMS) & Dynamic Settings**:
   - Manage property settings: GSTIN registration numbers, standard Check-In/Check-Out times, contact information, and Google Maps embed links.
6. **Financial Reports & Multi-Format Data Exports**:
   - Generate custom range revenue, check-in, and occupancy reports.
   - Export report tables to **Excel (.xlsx)**, **CSV (.csv)**, and **PDF (.pdf)** formats.

---

## 5. Interactive Controls & UI Button Workflow (How Everything Works)

This section explains the exact operational mechanics of every interactive button, modal, and control element in the application.

### Guest Portal Controls

```
+-----------------------------------------------------------------------------------+
|  [Book Stay] --------> Opens Booking Modal (Date Range, Room, Tariff, Payment)    |
|  [WhatsApp Us] ------> Opens WhatsApp Direct Chat (wa.me/919308189201)           |
|  [Phone Icon / Call]-> Triggers Phone Dialler (tel:+919308189201)                 |
|  [Get Directions] ---> Opens Google Maps Navigation (maps.app.goo.gl/77AAPZ7hRje8)|
+-----------------------------------------------------------------------------------+
```

1. **`Book Stay` Button** (Header, Room Cards, Mobile Menu):
   - **Trigger**: Clicking `Book Stay` opens the central `<BookingModal />` component.
   - **Workflow**:
     1. Pre-selects room category if clicked from a room card (e.g. Executive, Deluxe, Royal Suite).
     2. Guest picks Check-In and Check-Out dates. The modal computes total nights and verifies room availability via `/api/bookings/check-availability`.
     3. Calculates itemized pricing: Base Room Rate × Nights + Extra Bed Charges + GST (12% or 18%).
     4. Guest fills in Name, Phone, Email, and Guest count.
     5. Clicking **`Proceed to Payment`** creates a pending booking record (`HRJ-XXXX`) and launches Razorpay/Cashfree checkout.
     6. Upon successful payment verification, renders confirmation screen with option to **Download Tax Invoice PDF**.

2. **`WhatsApp Us` Floating Action Button** (Bottom Right Corner):
   - **Trigger**: Fixed floating badge (`fixed bottom-6 right-6 z-50`) with green brand color (`#25D366`) and live pulsing white dot.
   - **Workflow**: Launches WhatsApp Web or WhatsApp mobile app directly pre-filled with:
     `https://wa.me/919308189201?text=Hello%20Hotel%20Rajhans%20International%2C%20I%20would%20like%20to%20inquire%20about%20room%20availability.`

3. **`Phone Icon / Call` Buttons** (Header Bar, Mobile Navigation, Footer):
   - **Trigger**: `href="tel:+919308189201"`.
   - **Workflow**: Instantly triggers the device's native phone dialler with the hotel front desk primary contact number `+91 93081 89201`.

4. **`Get Directions` & `Open in Google Maps` Buttons** (Location Section, Map Overlay, Attractions Grid, Footer):
   - **Trigger**: External navigation link opening in new tab (`target="_blank"`).
   - **Workflow**: Redirects directly to `https://maps.app.goo.gl/77AAPZ7hRje8Nrmk9` (Lat `25.2505° N`, Lng `86.9887° E`) showing Hotel Rajhans International on Google Maps.

5. **Attraction Card Directions Buttons** (Explore Bhagalpur Section):
   - **Trigger**: `Get Directions on Google Maps` link under each tourist spot card.
   - **Workflow**: Opens exact Google Maps search & routing from Hotel Rajhans International to:
     - Vikramshila Ancient University Ruins (Kahalgaon)
     - Vikramshila Gangetic Dolphin Sanctuary
     - Mandar Hill (Banka)
     - Ajgaivinath Temple (Sultanganj)

6. **`Send message` Form Button** (Contact Section):
   - **Trigger**: Submits contact enquiry form.
   - **Workflow**: Sends `POST` request to `/api/contact`, creates a `ContactMessage` record in database (Status: `UNREAD`), and displays a success notification to guest.

---

### Admin Panel Controls

```
+-----------------------------------------------------------------------------------+
|  [Save Prices & Details] -> Updates Room Pricing DB & Validates Tariff Anomalies   |
|  [Confirm / Check-In] --> Updates Booking Status (PENDING -> CONFIRMED -> CHECKED)|
|  [Export XLSX / CSV] ----> Generates & Downloads Financial Analytics Files        |
|  [Save Settings] --------> Updates Global CMS Parameters in Setting Table         |
+-----------------------------------------------------------------------------------+
```

1. **`Save Prices & Details` Button** (`/admin/rooms`):
   - **Trigger**: Submits room configuration edit modal.
   - **Workflow**: Sends `PUT /api/rooms/[id]` request updating `basePriceSingle`, `basePriceDouble`, `weekendPrice`, `taxPercentage`, and `status`.
   - **Auto-Validation**: If `basePriceSingle > basePriceDouble`, modal displays warning banner with **`Reset to ₹3,090`** button to auto-correct typos before saving.

2. **Booking Status Action Buttons** (`/admin/bookings`):
   - **`Confirm` Button**: Changes reservation status from `PENDING` to `CONFIRMED`.
   - **`Check-In` Button**: Updates reservation status to `CHECKED_IN` and logs timestamp.
   - **`Check-Out` Button**: Updates status to `CHECKED_OUT` and frees up room capacity for new guests.
   - **`Cancel` Button**: Marks reservation as `CANCELLED` and logs audit entry.

3. **`Export XLSX` / `Export CSV` / `Download PDF` Buttons** (`/admin/reports`):
   - **`Export XLSX`**: Uses `xlsx` library to serialize financial metrics and reservation lists into an Excel workbook file (`Hotel_Rajhans_Report.xlsx`).
   - **`Export CSV`**: Uses `json2csv` to generate a downloadable spreadsheet file (`Hotel_Rajhans_Report.csv`).
   - **`Download PDF`**: Uses `jsPDF` and `html2canvas` to render styled executive printouts.

4. **`Save CMS Settings` Button** (`/admin/cms`):
   - **Trigger**: Submits property CMS update form.
   - **Workflow**: Updates key-value parameters (`hotel_name`, `phone_primary`, `address_full`, `gstin`, `check_in_time`) in `Setting` database table.

5. **`Refresh` Button** (`/admin/dashboard`):
   - **Trigger**: Re-fetches operational metrics.
   - **Workflow**: Invokes `fetch("/api/reports")` to pull latest live revenue totals, check-ins, check-outs, and room occupancy rates.

---

## 6. Database Schema Reference

The system relies on Prisma ORM configured with 14 relational models:

| Model Name | Primary Key | Description | Key Fields |
| :--- | :--- | :--- | :--- |
| `User` | `id` (UUID) | Admin users & hotel operational staff | `email`, `passwordHash`, `name`, `role`, `isActive` |
| `Room` | `id` (UUID) | Hotel room inventory & tariffs | `name`, `slug`, `type`, `basePriceSingle`, `basePriceDouble`, `status` |
| `RoomImage` | `id` (UUID) | High-resolution suite imagery | `roomId`, `url`, `alt`, `isPrimary`, `displayOrder` |
| `RoomAmenity` | `id` (UUID) | Room amenities (AC, Smart TV, WiFi) | `roomId`, `amenityName` |
| `Availability`| `id` (UUID) | Date-specific blockages/overrides | `roomId`, `date`, `status`, `reason` |
| `Customer` | `id` (UUID) | Guest CRM records | `name`, `phone`, `email`, `vipStatus`, `visitCount`, `totalSpent` |
| `Booking` | `id` (UUID) | Master reservation entries | `referenceId`, `customerId`, `roomId`, `checkIn`, `checkOut`, `netAmount`, `status` |
| `Payment` | `id` (UUID) | Payment transactions & gateway logs | `bookingId`, `razorpayOrderId`, `razorpayPaymentId`, `amount`, `status` |
| `GalleryImage`| `id` (UUID) | Hotel photo gallery media | `url`, `alt`, `category`, `size`, `displayOrder` |
| `ContactMessage`|`id` (UUID)| Contact form submissions | `name`, `email`, `phone`, `message`, `status`, `replyText` |
| `Review` | `id` (UUID) | Customer testimonials | `authorName`, `rating`, `reviewText`, `source`, `status` |
| `FAQ` | `id` (UUID) | Frequently asked questions | `question`, `answer`, `displayOrder`, `isActive` |
| `Setting` | `id` (UUID) | Global system key-value parameters | `key`, `value`, `category`, `description` |
| `AuditLog` | `id` (UUID) | Staff activity audit trail | `userId`, `userName`, `action`, `entity`, `entityId`, `details` |

---

## 7. API Route Specifications

| HTTP Method | Route Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/auth/login` | No | Authenticates admin credentials & sets HTTP-only JWT cookie |
| `POST` | `/api/auth/logout` | Yes | Clears session token cookie |
| `GET` | `/api/auth/me` | Yes | Returns current authenticated user session |
| `GET` | `/api/rooms` | No | Fetches all active rooms with amenities and image galleries |
| `POST` | `/api/rooms` | Admin | Creates a new room entry |
| `PUT` | `/api/rooms/[id]` | Admin | Updates room pricing, details, or maintenance status |
| `GET` | `/api/bookings` | Admin | Lists reservations with status filter & search query |
| `POST` | `/api/bookings` | No | Checks date availability & creates a pending booking |
| `POST` | `/api/bookings/check-availability` | No | Calculates dynamic night tariffs, taxes, and checks room overlap |
| `PUT` | `/api/bookings/[id]` | Admin | Updates booking status (Check-In, Check-Out, Cancel) |
| `POST` | `/api/payments/razorpay/create-order` | No | Generates Razorpay payment order for a booking |
| `POST` | `/api/payments/razorpay/verify-signature` | No | Verifies Razorpay HMAC signature & confirms reservation |
| `POST` | `/api/payments/cashfree/create-order` | No | Generates Cashfree payment session order |
| `POST` | `/api/payments/cashfree/verify-payment` | No | Verifies Cashfree payment status & confirms reservation |
| `POST` | `/api/payments/cashfree/webhook` | Webhook | Asynchronous webhook verification handler |
| `GET` | `/api/customers` | Admin | Searches & lists guest CRM records |
| `PUT` | `/api/customers` | Admin | Updates VIP status, notes, or address details |
| `GET` | `/api/reports` | Admin | Aggregates revenue, occupancy, and monthly financial metrics |
| `GET` | `/api/location/distance` | No | Computes real-time distance and travel time from Bhagalpur Junction |
| `GET` | `/api/cms` | No | Fetches public settings, FAQs, and approved reviews |
| `PUT` | `/api/cms` | Super Admin | Updates global system settings & policies |
| `GET` | `/api/invoice/[id]` | Auth / Public | Renders HTML tax invoice for a given booking reference |

---

## 8. Security & Authentication Architecture

1. **JSON Web Tokens (JWT) & State Management**:
   - Stateless JWT tokens generated using `jose` library signed with `HS256`.
   - Admin session tokens stored in secure, `httpOnly`, `sameSite: lax` cookies preventing XSS token theft.
2. **Password Security**:
   - Staff passwords hashed using `bcryptjs` with a cost factor of 10 rounds.
3. **Audit Logging**:
   - Critical administrative write actions (Creating rooms, changing room tariffs, status overrides, CMS setting modifications) automatically record entries in the `AuditLog` table with user ID and timestamp.
4. **Input Sanitization & Parameter Safety**:
   - Query filters and search strings sanitized prior to Prisma ORM parameter binding to prevent SQL injection vulnerabilities.

---

## 9. Deployment & Environment Setup

### Environment Variables (.env)

Ensure the following variables are configured:

```env
# Database Connection
DATABASE_URL="file:./dev.db" # Or postgresql://user:pass@host:5432/rajhans

# JWT Authentication Secret
JWT_SECRET="your-super-secure-production-jwt-secret-key-32-chars-min"

# Razorpay Payment Gateway Credentials
RAZORPAY_KEY_ID="rzp_live_xxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="xxxxxxxxxxxxxxxxxxxxxxxx"

# Cashfree Payment Gateway Credentials
CASHFREE_APP_ID="your_cashfree_app_id"
CASHFREE_SECRET_KEY="your_cashfree_secret_key"
CASHFREE_ENVIRONMENT="TEST" # Or "PRODUCTION"

# SMTP Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="info@hotelrajhansinternational.com"
SMTP_PASS="your-app-password"
SMTP_FROM="Hotel Rajhans International <info@hotelrajhansinternational.com>"
```

### Local Development Commands

```bash
# 1. Install project dependencies
npm install

# 2. Push database schema & seed baseline data
npx prisma db push
npx tsx prisma/seed.ts

# 3. Start Next.js development server
npm run dev

# 4. Run production build check
npm run build
```

---

## 10. Project Directory Structure

```
Rajhans/
├── prisma/
│   ├── schema.prisma       # Prisma Database Schema Definitions
│   ├── seed.ts             # Database Seeding Script (Admin user & default rooms)
│   └── dev.db              # SQLite Local Development Database
├── public/
│   ├── images/
│   │   ├── attractions/    # High-resolution Tourist Spot Images (Vikramshila, Dolphin Sanctuary, Mandar Hill, Ajgaivinath)
│   │   ├── deluxe/         # Deluxe Room Images
│   │   ├── executive/      # Executive Room Images
│   │   ├── suite/          # Royal Suite Images
│   │   ├── reception/      # Hotel Lobby & Reception Images
│   │   └── restaurant/     # Takshshila Restaurant & Ice-Cream Parlour Images
├── src/
│   ├── app/
│   │   ├── admin/          # Admin Portal Pages (Dashboard, Rooms, Bookings, Customers, CMS, Settings)
│   │   ├── api/            # Next.js Serverless API Route Handlers
│   │   ├── globals.css     # Tailwind CSS Design System & Utility Classes
│   │   ├── layout.tsx      # Root HTML Layout & Font Providers
│   │   └── page.tsx        # Guest Web Portal Home Page
│   ├── components/         # Reusable React UI Components
│   │   ├── AttractionsSection.tsx  # Tourist Attractions & Excursions Showcase Component
│   │   ├── BookingModal.tsx        # Guest Booking & Tariff Calculator Modal
│   │   ├── ImageGallery.tsx        # Interactive Media Lightbox
│   │   └── LocationSection.tsx     # Google Maps & Connectivity Component
│   ├── lib/                # Core Helper Modules (prisma.ts, auth.ts, razorpay.ts, cashfree.ts, mailer.ts, invoice.ts, location.ts)
│   ├── middleware.ts       # Route Authentication Guard Middleware
│   └── types/              # TypeScript Ambient Declarations & Custom Interfaces
├── next.config.ts          # Next.js Application Configuration (basePath, images)
├── package.json            # Project Dependencies & NPM Scripts
└── about.md                # Full System Architecture & Features Manual (This Document)
```

---
*Documented for Hotel Rajhans International — August 2026*
