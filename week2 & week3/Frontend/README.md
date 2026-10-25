# Lantern Row Books - Frontend

React 19 single-page app built with Vite and Tailwind CSS v4.

## Prerequisites

- Node.js 20 or newer
- The backend running on `http://localhost:3000` (see the backend README)

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file with the API base URL:

   ```bash
   echo "VITE_API_URL=http://localhost:3000/api/v1" > .env
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

   The app is served at `http://localhost:5173`.

## Scripts

- `npm run dev` - start the Vite dev server
- `npm run build` - build for production into `dist/`
- `npm run preview` - preview the production build locally
- `npm run lint` - run ESLint
