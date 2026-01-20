Mentora Admin Frontend
Admin dashboard for Mentora with Google authentication, protected routes, category management, user insights, and interactive activities.

Key Features
Google OAuth via NextAuth with allowlist enforcement (ALLOWED_EMAILS)
Protected layouts with middleware guards for dashboard/settings sections
Category management UI with create/update via backend API
User directory with search/filter backed by the FastAPI service
Toasted auth feedback and loading state handling
Supabase client and ImgBB uploader helper available for integrations

Tech Stack
Framework
Next.js 14 (App Router)
UI
Tailwind CSS
lucide-react
Auth
NextAuth (Google provider)
Data & Utilities
Mongoose helper
Supabase client
ImgBB uploader
Custom slug util
Notifications


Folder Structure (High Level)
app/
 ├─ layout.js        → Root layout
 ├─ page.js          → Login page
 ├─ loading.jsx      → Client loading overlay
 ├─ SessionProvider.jsx → NextAuth provider
 ├─ (page)/          → Protected dashboard area
 │   ├─ layout.js    → Wraps pages with Sidebar
 │   ├─ dashboard/page.jsx
 │   ├─ categories/page.jsx
 │   ├─ users/page.jsx
 │   ├─ activities/page.jsx

components/
 ├─ Sidebar
 ├─ Category UI components

api/auth/[...nextauth]/route.js
 → NextAuth configuration (Google provider, allowlist callbacks)

lib/
 ├─ config/imgbb.js        → ImgBB API helper
 ├─ database/mongoose.js  → MongoDB connection
 ├─ supabase.js           → Supabase client
 ├─ utils.js              → Slug generator & allowlist helper

middleware.js
 → Protects /page and /settings routes

Configs
 ├─ next.config.mjs
 ├─ postcss.config.mjs
 ├─ tailwind.config.js
 ├─ jsconfig.json

public/
 → Fonts, favicon, loading gif