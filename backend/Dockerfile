# BillVault Django API — production image
FROM python:3.12-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=billvault.settings

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    libpq5 \
    curl \
  && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# collectstatic needs SECRET_KEY at build; overridden at runtime
ARG BUILD_SECRET_KEY=build-only-not-for-production
ENV SECRET_KEY=${BUILD_SECRET_KEY}
RUN DEBUG=False python manage.py collectstatic --noinput

RUN chmod +x docker-entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["./docker-entrypoint.sh"]
