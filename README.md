# BillVault - Smart Bill & Warranty Management

AI-powered mobile application for digitizing bills and tracking warranties in Sri Lanka.

## Project Structure

```
bill-vault-app/
├── frontend/          # React Native mobile app
├── backend/           # Django REST API
└── README.md          # This file
```

## Technology Stack

### Frontend

- React Native
- Expo
- React Navigation
- Axios (API calls)
- AsyncStorage (local storage)

### Backend

- Django 4.2.7
- Django REST Framework
- SQLite (development) / PostgreSQL (production)
- JWT Authentication
- Firebase (Storage & Notifications)

## Getting Started

### Frontend Setup

```bash
cd frontend
npm install
npx expo start
```

See [frontend/README.md](frontend/README.md) for detailed instructions.

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

See [backend/README.md](backend/README.md) for detailed instructions.

## API Endpoints

Base URL: `http://localhost:8000/api`

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/health` - Health check

### Bills (Coming in Sprint 2)

- `POST /bills/upload` - Upload bill
- `GET /bills/` - List bills
- `GET /bills/:id` - Get bill details

## Environment Variables

### Backend (.env)

```
SECRET_KEY=your-secret-key
DEBUG=True
```

### Frontend (.env)

```
API_BASE_URL=http://192.168.1.5:8000/api
```

## Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes
3. Commit: `git commit -m "Description"`
4. Push: `git push origin feature/your-feature`
5. Create Pull Request

## License

This project is developed as part of the Software Development Group Project (5COSC021C) at University of Westminster.
