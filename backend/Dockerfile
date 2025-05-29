FROM python:3.13-slim

WORKDIR /code

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1 

RUN pip install --upgrade pip

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY ./project/ ./project/
COPY ./core/ ./core/
COPY ./scripts/ ./scripts/
COPY ./manage.py ./

RUN chmod +x scripts/commands.sh

# Create media directory and set proper permissions before switching users
RUN mkdir -p media/route_images
RUN chmod 755 media/route_images

# Copy images to media directory
COPY ./images/* ./media/route_images/

RUN useradd -m appuser
RUN chown -R appuser:appuser media

USER appuser

EXPOSE 8000

CMD ["/bin/bash", "/code/scripts/commands.sh"]