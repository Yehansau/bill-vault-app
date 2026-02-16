# BillVault Backend

Django REST API for BillVault mobile application.

## Setup

1. Create virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Create `.env` file:

```env
SECRET_KEY=your-secret-key
DEBUG=True
```

4. Run migrations:

```bash
python manage.py migrate
```

5. Create superuser:

```bash
python manage.py createsuperuser
```

6. Start server:

```bash
python manage.py runserver
```

Server runs at: `http://127.0.0.1:8000/`

## Folder Structure

```
backend/
├── billvault/           # Project settings
├── authentication/      # Auth endpoints
├── bills/              # Bill management endpoints
├── media/              # Uploaded files
├── venv/               # Virtual environment
├── manage.py           # Django CLI
└── requirements.txt    # Python dependencies
```

## API Documentation

### Health Check

```bash
GET /api/auth/health
```

### Register

```bash
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "account_type": "individual",
  "full_name": "John Doe"
}
```

### Login

```bash
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```
