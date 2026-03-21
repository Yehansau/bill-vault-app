# BillVault Backend

Django REST API for BillVault mobile application.

## Setup

# 1. Create virtual environment

python -m venv venv

# 2. Activate it (Git Bash)

source venv/bin/activate # Mac/Linux
source venv/Scripts/activate # Windows

# You should see (venv) in your prompt now

# 3. Upgrade pip

python -m pip install --upgrade pip

# 4. Install requirements

pip install -r requirements.txt

# 5. Run migrations(to updates the commands u did to the backend)

python manage.py migrate

# 6. Start server

python manage.py runserver 0.0.0.0:8000

## Errors

1. ModuleNotFoundError: No module named 'dj_database_url'

# run this

pip install dj-database-url psycopg2-binary

2. ModuleNotFoundError: No module named 'pkg_resources'

# Install setuptools (provides pkg_resources)

pip install setuptools==68.2.2

# Upgrade djangorestframework-simplejwt to a compatible version

pip install --upgrade djangorestframework-simplejwt

# Now try migrate again

python manage.py migrate

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
