FROM node:slim

WORKDIR /app

COPY package.json package-lock.json ./

COPY src/ ./src/
COPY public/ ./public/
COPY index.html vite.config.js ./

RUN npm install --ignore-scripts
RUN groupadd -r appuser && useradd -r -g appuser appuser
RUN chown -R appuser:appuser /app

USER appuser

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]