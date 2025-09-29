FROM node:20-alpine AS builder

WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build-only

FROM nginx:alpine AS runner

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

COPY config.sh /config.sh
CMD ["sh", "/config.sh"]
