FROM python:3.13-slim

WORKDIR /code

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1 

RUN pip install --upgrade pip

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN chmod +x scripts/commands.sh

RUN useradd -m appuser
USER appuser

EXPOSE 8000

CMD ["/bin/bash", "/code/scripts/commands.sh"]