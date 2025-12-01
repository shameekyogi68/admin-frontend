# Admin Dashboard

A professional full-stack admin dashboard application built with React, Vite, Express, and MongoDB.

## Quick Start

### Development

```bash
# Terminal 1: Backend
cd backend
npm install
npm start

# Terminal 2: Frontend
npm install
npm run dev
```

### Production Build

```bash
npm run build
```

## Architecture

- **Frontend**: React + Vite + Tailwind CSS with Radix UI components
- **Backend**: Express.js + MongoDB with JWT authentication
- **API**: RESTful with `/api/*` prefix on port 3001
- **Frontend**: Runs on port 5173 (development)

## Documentation

- `FRONTEND_BACKEND_SEPARATION.md` - Complete architecture overview
- `SEPARATION_QUICK_REFERENCE.md` - Quick setup and reference guide
- `SEPARATION_CHECKLIST.md` - Detailed checklist of implementation

## Features

- ✅ Admin authentication with JWT
- ✅ Role-based access control (Super Admin, Admin)
- ✅ Customer management
- ✅ Vendor management
- ✅ Booking management
- ✅ Plan management
- ✅ Dashboard with statistics
- ✅ Responsive UI with Tailwind CSS
- ✅ Clean separation of concerns

## Environment Variables

See `.env.local` (development) and `.env.production` files for configuration.

## License

ISC
# admin-frontend
