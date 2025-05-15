#!/bin/sh

set -e

echo "✅ Postgres Database Started Successfully ($POSTGRES_HOST:$POSTGRES_PORT)"

echo "🛠️ Aplicando migrações do banco de dados..."
python manage.py makemigrations --noinput
python manage.py migrate --noinput

if [ "$DJANGO_SUPERUSER_USERNAME" ] && [ "$DJANGO_SUPERUSER_EMAIL" ] && [ "$DJANGO_SUPERUSER_PASSWORD" ]; then
  echo "👤 Criando superusuário (se necessário)..."
  python manage.py shell <<EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username="$DJANGO_SUPERUSER_USERNAME").exists():
    User.objects.create_superuser(
        username="$DJANGO_SUPERUSER_USERNAME",
        email="$DJANGO_SUPERUSER_EMAIL",
        password="$DJANGO_SUPERUSER_PASSWORD"
    )
EOF
else
  echo "Variáveis de superusuário não definidas. Pulando criação."
fi


python manage.py runserver 0.0.0.0:8000