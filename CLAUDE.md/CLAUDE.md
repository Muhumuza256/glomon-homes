# CLAUDE.md — Glomon Homes Real Estate Website

## Project Overview

**Company:** Glomon Homes  
**Tagline:** *Find Your Place in Uganda*  
**Type:** Full-stack real estate listings and property development website  
**Market:** Uganda — primary focus on Kampala and surrounding areas (Wakiso, Mukono, Entebbe corridor)  
**Target Audience:**
- Local Ugandan buyers and renters
- Ugandan diaspora investing from abroad
- Expats relocating to Uganda
- Property investors seeking development opportunities

---

## Tech Stack

### Frontend
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS v3
- **Routing:** React Router v6
- **State Management:** React Context API (no Redux — keep it lean)
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Image Handling:** Cloudinary (free tier) for property images
- **Environment Variables:** `.env` using `VITE_` prefix

### Backend
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **ORM:** Prisma
- **Database:** PostgreSQL (hosted on Supabase)
- **Auth:** JSON Web Tokens (JWT) for admin authentication
- **File Uploads:** Multer + Cloudinary SDK
- **Validation:** Zod
- **Environment Variables:** dotenv

### Database
- **Provider:** Supabase (PostgreSQL)
- **ORM:** Prisma with migrations

### Deployment
- **Frontend:** Vercel
- **Backend:** Railway
- **Database:** Supabase (free tier)
- **Images:** Cloudinary (free tier)

---

## Folder Structure

```
glomon-homes/
├── CLAUDE.md
├── .gitignore
├── README.md
│
├── frontend/
│   ├── public/
│   │   └── favicon.ico
│   ├── src/
│   │   ├── assets/
│   │   │   └── logo.svg
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Footer.jsx
│   │   │   ├── properties/
│   │   │   │   ├── PropertyCard.jsx
│   │   │   │   ├── PropertyGrid.jsx
│   │   │   │   ├── PropertyFilters.jsx
│   │   │   │   └── PropertyImageGallery.jsx
│   │   │   ├── ui/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── Spinner.jsx
│   │   │   │   └── Modal.jsx
│   │   │   └── forms/
│   │   │       ├── EnquiryForm.jsx
│   │   │       └── ContactForm.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── ListingsPage.jsx
│   │   │   ├── PropertyDetailPage.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   ├── ContactPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── admin/
│   │   │   ├── AdminLoginPage.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminProperties.jsx
│   │   │   ├── AdminAddProperty.jsx
│   │   │   ├── AdminEditProperty.jsx
│   │   │   └── AdminEnquiries.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   ├── useProperties.js
│   │   │   └── useEnquiries.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   └── formatters.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── backend/
    ├── prisma/
    │   ├── schema.prisma
    │   └── seed.js
    ├── src/
    │   ├── routes/
    │   │   ├── properties.js
    │   │   ├── enquiries.js
    │   │   └── auth.js
    │   ├── controllers/
    │   │   ├── propertiesController.js
    │   │   ├── enquiriesController.js
    │   │   └── authController.js
    │   ├── middleware/
    │   │   ├── authMiddleware.js
    │   │   ├── validateRequest.js
    │   │   └── errorHandler.js
    │   ├── lib/
    │   │   └── prisma.js
    │   └── index.js
    ├── .env
    └── package.json
```

---

## Database Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Property {
  id            String      @id @default(cuid())
  title         String
  description   String
  price         Float
  priceType     PriceType   @default(SALE)
  currency      String      @default("UGX")
  propertyType  PropertyType
  status        ListingStatus @default(ACTIVE)
  bedrooms      Int?
  bathrooms     Int?
  area          Float?       // square meters
  location      String       // e.g. "Kololo, Kampala"
  district      String       // e.g. "Kampala"
  address       String?
  latitude      Float?
  longitude     Float?
  images        String[]     // Cloudinary URLs
  coverImage    String?      // Main display image URL
  featured      Boolean      @default(false)
  amenities     String[]     // e.g. ["Parking", "Security", "Swimming Pool"]
  enquiries     Enquiry[]
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
}

model Enquiry {
  id          String    @id @default(cuid())
  name        String
  email       String
  phone       String?
  message     String
  propertyId  String?
  property    Property? @relation(fields: [propertyId], references: [id])
  status      EnquiryStatus @default(NEW)
  createdAt   DateTime  @default(now())
}

model AdminUser {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // bcrypt hashed
  createdAt DateTime @default(now())
}

enum PropertyType {
  APARTMENT
  HOUSE
  VILLA
  COMMERCIAL
  LAND
  OFFICE
}

enum PriceType {
  SALE
  RENT
}

enum ListingStatus {
  ACTIVE
  INACTIVE
  SOLD
  RENTED
}

enum EnquiryStatus {
  NEW
  READ
  REPLIED
}
```

---

## API Endpoints

### Public Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/properties` | Get all active properties (with filters) |
| GET | `/api/properties/featured` | Get featured properties (for homepage) |
| GET | `/api/properties/:id` | Get single property detail |
| POST | `/api/enquiries` | Submit a property enquiry |
| POST | `/api/enquiries/general` | Submit a general contact message |
| POST | `/api/auth/login` | Admin login — returns JWT |

### Admin Endpoints (JWT required)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/admin/properties` | Get all properties including inactive |
| POST | `/api/admin/properties` | Create a new property |
| PUT | `/api/admin/properties/:id` | Update a property |
| DELETE | `/api/admin/properties/:id` | Delete a property |
| PATCH | `/api/admin/properties/:id/status` | Toggle active/inactive/sold |
| GET | `/api/admin/enquiries` | Get all enquiries |
| PATCH | `/api/admin/enquiries/:id/status` | Update enquiry status |

### Query Parameters for GET /api/properties

```
?type=APARTMENT|HOUSE|VILLA|LAND|COMMERCIAL
?priceType=SALE|RENT
?district=Kampala|Wakiso|Mukono|Entebbe
?minPrice=50000000
?maxPrice=500000000
?bedrooms=2
?featured=true
?page=1
?limit=12
```

---

## Pages & Features

### 1. Home Page (`/`)

**Sections:**
- **Hero** — Full-width banner with tagline *"Find Your Place in Uganda"*, a prominent search bar (location + type + price range), and a CTA button "Browse Properties"
- **Featured Listings** — Grid of 6 featured property cards pulled from the API
- **Why Glomon Homes** — 3-column trust section: "Verified Listings", "Local Expertise", "Transparent Pricing"
- **Property Types** — Icon grid: Apartments, Houses, Land, Commercial — each links to filtered listings
- **Locations We Cover** — Kampala, Wakiso, Entebbe, Mukono, Jinja — with property counts
- **Testimonials** — 3 static testimonial cards (hardcoded, not from DB)
- **CTA Banner** — "List Your Property With Us" — links to contact page
- **Footer** — Logo, links, socials, contact info

---

### 2. Listings Page (`/listings`)

**Features:**
- Sidebar filters: Property Type, Price Type (Sale/Rent), District, Bedrooms, Price Range
- Results grid — 12 per page with pagination
- Sort options: Newest, Price Low-High, Price High-Low
- Results count displayed ("34 properties found")
- Each card shows: cover image, title, price, location, bed/bath/area icons, a "View Details" button
- Empty state with friendly message if no results match filters
- Loading skeleton cards while fetching

---

### 3. Property Detail Page (`/listings/:id`)

**Sections:**
- **Image Gallery** — Main image + thumbnail strip, click to expand (lightbox)
- **Property Header** — Title, price, badge (For Sale / For Rent), status badge
- **Key Stats Row** — Bedrooms | Bathrooms | Area (sqm) | Property Type
- **Description** — Full property description text
- **Amenities** — Icon list of all amenities
- **Location** — District + address text (no map required for MVP, add later)
- **Enquiry Form** — Sidebar form: Name, Email, Phone, Message — POST to `/api/enquiries`
- **Related Properties** — 3 similar properties in the same district

---

### 4. About Page (`/about`)

**Content (static):**
- Company story — Glomon Homes is a Ugandan property development and real estate listings company founded with a mission to make quality housing accessible and transparent for Ugandans at home and abroad.
- Mission & Vision statements
- Team section (placeholder cards — 3 members)
- Stats row: "200+ Listings", "5 Districts", "Trusted by Buyers Across Uganda"

---

### 5. Contact Page (`/contact`)

**Features:**
- General contact form: Name, Email, Phone, Subject, Message
- POST to `/api/enquiries/general`
- Company contact info: email, phone, physical address (Kampala)
- Success message on submission

---

### 6. Admin Portal (`/admin`)

**Protected by JWT — redirect to `/admin/login` if not authenticated.**

**Admin Login (`/admin/login`):**
- Email + Password form
- On success → store JWT in localStorage → redirect to dashboard

**Admin Dashboard (`/admin/dashboard`):**
- Summary cards: Total Properties, Active Listings, Total Enquiries, New (Unread) Enquiries
- Quick links to manage properties and view enquiries

**Admin — Properties (`/admin/properties`):**
- Table of all properties with columns: Image, Title, Type, Price, District, Status, Actions
- Actions: Edit, Toggle Status (Active/Inactive/Sold), Delete
- "Add New Property" button → goes to add form

**Admin — Add/Edit Property (`/admin/properties/new` and `/admin/properties/:id/edit`):**
- Form fields: Title, Description, Property Type, Price, Price Type, Currency, Bedrooms, Bathrooms, Area, Location, District, Address, Amenities (checkboxes), Featured toggle, Status
- Image upload (multiple) via Cloudinary
- Cover image selector from uploaded images
- Save / Cancel buttons

**Admin — Enquiries (`/admin/enquiries`):**
- Table: Name, Email, Phone, Property (linked), Message preview, Date, Status
- Click row to expand full message
- Mark as Read / Replied actions

---

## Design Direction

### Brand Identity
- **Name:** Glomon Homes
- **Tagline:** *Find Your Place in Uganda*
- **Tone:** Professional, warm, trustworthy — not corporate and cold
- **Feel:** Modern African real estate — clean but with warmth and local character

### Color Palette
```css
--color-primary: #1B4332;      /* Deep forest green — main brand color */
--color-primary-light: #2D6A4F; /* Lighter green for hover states */
--color-accent: #D4A017;        /* Gold/amber — for CTAs, highlights */
--color-accent-hover: #B8860B;  /* Darker gold for hover */
--color-bg: #F9F6F0;            /* Warm off-white background */
--color-surface: #FFFFFF;       /* Card surfaces */
--color-text: #1A1A1A;          /* Primary text */
--color-text-muted: #6B7280;    /* Secondary/muted text */
--color-border: #E5E0D8;        /* Subtle borders */
```

### Typography
- **Display / Headings:** `Playfair Display` (Google Fonts) — elegant, authoritative
- **Body:** `DM Sans` (Google Fonts) — clean, readable, modern

### UI Principles
- Generous white space — never crowded
- Rounded corners: `border-radius: 12px` on cards, `8px` on buttons and inputs
- Subtle shadows on cards: `box-shadow: 0 2px 16px rgba(0,0,0,0.06)`
- Green primary buttons with gold accent buttons for secondary CTAs
- Property cards show a hover lift effect (`transform: translateY(-4px)`)
- Use badges (pill style) for "For Sale", "For Rent", "Featured"

---

## Seed Data

When running `npx prisma db seed`, populate the database with these sample properties:

1. **3-Bedroom Apartment in Kololo** — For Sale — UGX 450,000,000 — Kampala — 3 bed / 2 bath / 145 sqm — Amenities: Security, Parking, Generator, Water Tank
2. **2-Bedroom Flat in Ntinda** — For Rent — UGX 1,800,000/month — Kampala — 2 bed / 1 bath / 90 sqm — Amenities: Security, Parking
3. **Executive 4-Bedroom House in Muyenga** — For Sale — UGX 850,000,000 — Kampala — 4 bed / 3 bath / 280 sqm — Amenities: Swimming Pool, Security, Parking, Garden, Generator — Featured: true
4. **Commercial Plot in Namanve** — For Sale — UGX 320,000,000 — Mukono — Land — 0.5 acres
5. **Modern 2-Bedroom Apartment in Entebbe** — For Sale — UGX 290,000,000 — Wakiso — 2 bed / 2 bath / 110 sqm — Amenities: Security, Parking, Lake View — Featured: true
6. **Studio Apartment in Bukoto** — For Rent — UGX 900,000/month — Kampala — 1 bed / 1 bath / 45 sqm — Amenities: Security, WiFi Ready

Use placeholder images from `https://placehold.co/800x600/1B4332/white?text=Glomon+Homes` for all seed properties.

---

## Environment Variables

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:5000
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

### Backend (`backend/.env`)
```
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
ADMIN_EMAIL=admin@glomonhomes.com
ADMIN_PASSWORD=GlomonAdmin2025!
```

> The `ADMIN_EMAIL` and `ADMIN_PASSWORD` are used by the seed script to create the first admin user.

---

## .gitignore

```
node_modules/
.env
.env.local
dist/
.DS_Store
*.log
```

---

## Key Rules for Claude Code

1. **Never hardcode credentials** — always use environment variables
2. **Always validate inputs** on both frontend (basic) and backend (Zod schemas)
3. **Handle loading and error states** on every API call in the frontend
4. **All admin routes must check JWT** via the `authMiddleware` before processing
5. **Use Prisma client singleton** from `src/lib/prisma.js` — never instantiate it twice
6. **Price formatting:** Always display prices in UGX with comma separators (e.g. UGX 450,000,000). Use a `formatPrice()` utility in `utils/formatters.js`
7. **Images:** If no cover image is available, show the placeholder from placehold.co
8. **Pagination:** Default page size is 12. Always return `{ data, total, page, totalPages }` from paginated endpoints
9. **CORS:** Configure Express to allow requests from `http://localhost:5173` in development and the Vercel domain in production
10. **Error responses:** Always return `{ error: "message" }` format from the API — never expose stack traces in production

---

## SEO Implementation (applied 2026-04-01)

### Package
- `react-helmet-async` installed in `frontend/` — wraps `<App />` with `<HelmetProvider>` in `main.jsx`

### SEO Component
- `frontend/src/components/SEO.jsx` — reusable component using `react-helmet-async`
- Sets `<title>`, meta description, canonical URL, Open Graph tags, and Twitter Card tags
- Auto-computes canonical from `useLocation()` against `https://glomonhomes.com`
- Appends `| Glomon Homes` to titles that don't already contain the brand name
- Accepts: `title`, `description`, `image`, `type`, `noindex` props

### Per-page SEO
| Page | Title | Notes |
|------|-------|-------|
| HomePage | Glomon Homes \| Buy, Rent & Invest in Uganda Real Estate | + Organization JSON-LD schema (RealEstateAgent) |
| ListingsPage | Property Listings in Uganda \| Houses, Apartments & Land | H1 updated to "Properties for Sale & Rent in Uganda" |
| PropertyDetailPage | `{title} in {location}` (dynamic) | + RealEstateListing JSON-LD schema; rendered after property loads |
| AboutPage | About Glomon Homes \| Uganda's Trusted Real Estate Company | — |
| ContactPage | Contact Glomon Homes \| Real Estate Enquiries in Uganda | — |

### Structured Data (JSON-LD)
- **HomePage:** `RealEstateAgent` schema with address, phone, sameAs social links
- **PropertyDetailPage:** `RealEstateListing` schema with offer price, address, image

### index.html changes
- Updated `<title>` and meta description
- Added `<meta name="robots" content="index, follow">`
- Added `<meta property="og:site_name" content="Glomon Homes">`
- `preconnect` links for Google Fonts already present (kept)

### Semantic HTML
- `PropertyCard.jsx`: descriptive `aria-label` on `<Link>`, descriptive `alt` text on `<img>`
- `HomePage` hero `<section>`: `aria-label="Hero — Find property in Uganda"`
- Featured section heading updated to "Featured Properties in Uganda"
- Locations section heading updated to "Properties Across Uganda"

### robots.txt
- `frontend/public/robots.txt` — allows all, disallows `/admin`, references sitemap

### Sitemap
- `GET /sitemap.xml` endpoint in `backend/src/index.js`
- Queries all `ACTIVE` properties from the database
- Returns valid XML sitemap with static pages + per-property URLs
- Property `lastmod` derived from `updatedAt`

### Vite build optimisation
- `frontend/vite.config.js` updated with `manualChunks` splitting `vendor` (react, react-dom, react-router-dom) and `ui` (lucide-react, axios)