#!/bin/sh
set -e

if [ -n "${FIREBASE_CREDENTIALS_B64:-}" ]; then
  printf '%s' "$FIREBASE_CREDENTIALS_B64" | base64 -d > /tmp/firebase-credentials.json
  export FIREBASE_CREDENTIALS_JSON=/tmp/firebase-credentials.json
fi

# Wait for Postgres (Swarm service name `db` on overlay network)
python3 - <<'PY'
import os, socket, time
host = os.environ.get("DB_HOST", "db")
port = int(os.environ.get("DB_PORT", "5432"))
for _ in range(90):
    try:
        with socket.create_connection((host, port), timeout=2):
            break
    except OSError:
        time.sleep(1)
else:
    raise SystemExit(f"Postgres not reachable at {host}:{port}")
PY

python manage.py migrate --noinput
python manage.py collectstatic --noinput

exec gunicorn billvault.wsgi:application \
  --bind 0.0.0.0:8000 \
  --workers "${GUNICORN_WORKERS:-3}" \
  --threads "${GUNICORN_THREADS:-1}" \
  --timeout 120 \
  --access-logfile - \
  --error-logfile -
