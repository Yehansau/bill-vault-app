# BillVault Frontend

React Native mobile application for BillVault.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Update API URL in `src/services/api.js`:

```javascript
const API_BASE_URL = "http://YOUR_IP:8000/api";
```

3. Start development server:

```bash
npx expo start
```

4. Scan QR code with Expo Go app

## Folder Structure

```
frontend/
├── App.js                 # Entry point
├── src/
│   ├── screens/          # All app screens
│   │   ├── auth/        # Authentication screens
│   │   ├── bills/       # Bill management screens
│   │   ├── analytics/   # Analytics screens
│   │   └── profile/     # Profile screens
│   ├── components/       # Reusable components
│   ├── services/         # API calls
│   ├── navigation/       # Navigation setup
│   └── utils/           # Helper functions
├── assets/              # Images, icons
└── package.json         # Dependencies
```

## Available Scripts

- `npx expo start` - Start development server
- `npm test` - Run tests
- `npm run lint` - Check code quality
  xyv-ypvk-nox

## Environment Setup

1. Copy `.env.example` to `.env`:

```bash
   cp .env.example .env
```

2. Fill in the actual values in `.env`

3. **NEVER commit `.env`** - it's gitignored for security
