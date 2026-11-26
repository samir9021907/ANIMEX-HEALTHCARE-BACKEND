# ANIMEX ANIMAL HEALTH CARE - BACKEND API

Node.js + Express REST API engine for Animex Animal Health Care.

## Features
- Complete Products & Veterinary catalogue API
- Disease solutions clinical mapping
- Dealer and Stockist management with state/district filters
- Inquiry and lead generation endpoints
- Blog articles & Certificates API
- PostgreSQL and Mock data fallback engine

## Setup & Run Locally
```bash
# Install dependencies
npm install

# Run backend development server
npm run dev

# Or start in production mode
npm start
```

## Database Initialization (Optional - PostgreSQL)
```bash
npm run db:init
```

## Deployment on Render
1. Create a **Web Service** on Render.
2. Connect this repository.
3. Environment: `Node`
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Add Environment Variables:
   - `PORT`: `5000` (or Render will assign automatically)
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: (Your PostgreSQL database connection string, if using DB)
