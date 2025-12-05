# Attendance Dashboard

A Nuxt.js-based attendance tracking application with calendar integration.

## Features

- ✅ Check-in/Check-out functionality
- 📅 Calendar view with attendance tracking
- 📱 Mobile-responsive design
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

- **Nuxt 4** - Vue.js framework
- **Tailwind CSS v4** - Styling
- **FullCalendar** - Calendar component
- **TypeScript** - Type safety

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
attendance_dash/
├── assets/
│   └── css/
│       └── main.css          # Global styles and Tailwind imports
├── components/
│   ├── AttendanceCard.vue    # Main attendance card component
│   ├── CalendarSection.vue    # Calendar display component
│   ├── CheckoutModal.vue     # Checkout confirmation modal
│   └── HamburgerMenu.vue     # Navigation menu
├── layouts/
│   └── default.vue           # Default layout with header
├── pages/
│   ├── index.vue             # Home/attendance page
│   └── participant-checkin.vue # Participant check-in page
├── app.vue                   # Root component
└── nuxt.config.ts            # Nuxt configuration
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run generate` - Generate static site
- `npm run preview` - Preview production build

