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

For PostgreSQL in Docker or production, set `DATABASE_URL` in `backend/.env` (see [dj-database-url](https://github.com/jazzband/dj-database-url) format). If unset, the backend uses SQLite for local development.

## GitHub Actions: backend deploy (Docker Swarm)

Workflow file: [`.github/workflows/deploy-backend-swarm.yml`](.github/workflows/deploy-backend-swarm.yml).

It builds the Django API image from [`backend/`](backend/), pushes it to **Google Artifact Registry**, copies [`deploy/docker-stack.yml`](deploy/docker-stack.yml) to your VM, and runs **`docker stack deploy`**. The stack includes **PostgreSQL 16** (internal only; hostname `db`) plus the API; `DATABASE_URL` is assembled on the VM from **`POSTGRES_USER`**, **`POSTGRES_DB`** (variables), and **`POSTGRES_PASSWORD`** (secret).

**Triggers:** **Run workflow** manually in GitHub Actions (`workflow_dispatch`) until you enable auto-deploy. To run on every relevant push to `main`, uncomment the `push:` block at the top of [`.github/workflows/deploy-backend-swarm.yml`](.github/workflows/deploy-backend-swarm.yml).

Configure everything under **GitHub → Repository → Settings → Secrets and variables → Actions**.

### Secrets (sensitive)

| Name | Description | How to get it |
|------|-------------|----------------|
| `GCP_SA_KEY` | Full JSON body of a GCP **service account key** | [Google Cloud Console](https://console.cloud.google.com/) → **IAM & Admin** → **Service accounts** → your account → **Keys** → **Add key** → JSON. Or Cloud Shell: `gcloud iam service-accounts keys create key.json --iam-account=SA_EMAIL`. Paste the entire file into the secret. The account needs **Artifact Registry Writer** (or Reader+Writer) on the project. |
| `VM_SSH_PRIVATE_KEY` | Private SSH key used to reach the VM | On your machine: `ssh-keygen -t ed25519 -f ~/.ssh/billvault_deploy -N ""` — put the **private** key file contents here. Put the matching **`.pub`** line in `~/.ssh/authorized_keys` on the VM for `GCP_VM_USER`. |
| `DJANGO_SECRET_KEY` | Django [`SECRET_KEY`](https://docs.djangoproject.com/en/4.2/ref/settings/#secret-key) | Generate a long random string (e.g. `python -c "from secrets import token_urlsafe; print(token_urlsafe(50))"`). Never reuse a leaked key. |
| `POSTGRES_PASSWORD` | Password for the **in-stack** Postgres service (`db`) | Choose a strong password; store only in this secret. Avoid `@`, `:`, `/`, `?`, `#`, `&` in the password (URL safety), or the deploy script’s URL builder may break. |
| `FIREBASE_CREDENTIALS_B64` *(optional)* | Base64-encoded Firebase **service account** JSON (one line, no newlines in the secret) | `base64 -w0 service-account.json` (Linux) or `base64 -i service-account.json` (macOS). Omit if Firebase is not used in production. |

### Variables (non-secret)

| Name | Example | Description | How to find it |
|------|---------|-------------|----------------|
| `GCP_PROJECT_ID` | `docker-swarm-278805` | GCP **project ID** | Console top bar (project picker) or **IAM & Admin** → **Settings**. Cloud Shell: `gcloud config get-value project`. |
| `GCP_REGION` | `us-central1` | **Region** where the **Artifact Registry** Docker repo was created | **Artifact Registry** → open your repository → **Location** shows the region. **`gcloud artifacts repositories describe REPO_NAME --location=REGION`**. Use a **region** (e.g. `us-central1`), **not** a zone (e.g. not `us-central1-f`). |
| `GCP_AR_REPOSITORY` | `billvault-docker` | Artifact Registry **repository name** (Docker format) | **Artifact Registry** → repository list → **Name** column. Same name used in `gcloud artifacts repositories create NAME ...`. |
| `GCP_VM_HOST` | `34.60.104.80` | VM **external IP** or DNS name | **Compute Engine** → **VM instances** → your instance → **External IP**. |
| `GCP_VM_USER` | `yehansau` | Linux user for SSH on the VM | The account whose `~/.ssh/authorized_keys` contains the deploy public key. |
| `POSTGRES_USER` *(optional)* | `billvault_user` | Postgres role created in the stack | If unset, the workflow uses `billvault_user`. |
| `POSTGRES_DB` *(optional)* | `billvault_db` | Database name in the stack | If unset, the workflow uses `billvault_db`. |
| `ALLOWED_HOSTS` *(optional)* | `api.example.com,34.60.104.80` | Comma-separated Django `ALLOWED_HOSTS` | Your API hostname and/or IP clients use. If unset, the workflow defaults to `*`. |
| `CORS_ALLOW_ALL_ORIGINS` *(optional)* | `true` or `false` | Passed into the stack for CORS | If unset, defaults to `true` for easier mobile testing; set `false` and use `CORS_ALLOWED_ORIGINS` via app settings when hardened. |
| `FIREBASE_STORAGE_BUCKET` *(optional)* | `your-app.appspot.com` | Firebase Storage bucket | Firebase console → Project settings / Storage. |

### Image URL shape

The workflow pushes to:

`{GCP_REGION}-docker.pkg.dev/{GCP_PROJECT_ID}/{GCP_AR_REPOSITORY}/billvault-api:{git-sha}`

and `:latest`.

### VM prerequisites

- Docker installed, and **`docker swarm init`** (the workflow initializes Swarm if needed).
- Firewall allows **SSH (22)** from **GitHub Actions** (ephemeral IPs) or use **IAP / bastion**; allow **8000** (or your reverse proxy ports) for the API. **Postgres is not exposed** on the host; only services on the Swarm overlay can reach `db:5432`.
- Same `GCP_SA_KEY` is used on the VM for `docker login` to Artifact Registry; the service account must be able to **pull** images.
- Postgres data lives in the **`billvault-postgres`** named volume on the VM; back it up if you care about durability beyond the disk.

### External Postgres instead

The default stack runs Postgres in Swarm. To use **Supabase / Cloud SQL** instead, you would remove or replace the `db` service in [`deploy/docker-stack.yml`](deploy/docker-stack.yml) and supply `DATABASE_URL` yourself (today’s workflow expects in-stack DB; adjust the workflow if you need a hosted URL only).

## Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes
3. Commit: `git commit -m "Description"`
4. Push: `git push origin feature/your-feature`
5. Create Pull Request

## License

This project is developed as part of the Software Development Group Project (5COSC021C) at University of Westminster.
