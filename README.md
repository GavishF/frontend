# Frontend Repository

This is the frontend application built with React, Vite, and Tailwind CSS.

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the required environment variables:
   ```
   VITE_API_URL=http://localhost:5000
   ```

### Running the Application

**Development mode:**
```bash
npm run dev
```

**Build for production:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

## Project Structure

- `src/` - Source code
  - `components/` - Reusable React components
  - `pages/` - Page components
  - `services/` - API service calls
  - `utils/` - Utility functions
  - `assets/` - Static assets
- `public/` - Public static files
- `index.html` - Entry HTML file

## Environment Variables

- `VITE_API_URL` - Backend API URL

## Technologies Used

- React
- Vite
- Tailwind CSS
- PostCSS
- ESLint
