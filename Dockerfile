FROM python:3.13-slim AS builder

RUN mkdir /code

WORKDIR /code

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1 

RUN pip install --upgrade pip 

COPY requirements.txt /code/

RUN pip install --no-cache-dir -r requirements.txt

FROM python:3.13-slim

RUN useradd -m -r appuser && \
   mkdir /code && \
   chown -R appuser /code

COPY --from=builder /usr/local/lib/python3.13/site-packages/ /usr/local/lib/python3.13/site-packages/
COPY --from=builder /usr/local/bin/ /usr/local/bin/

WORKDIR /code

COPY . .

COPY scripts/commands.sh /scripts/commands.sh

RUN chmod +x /scripts/commands.sh

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1 

EXPOSE 8000