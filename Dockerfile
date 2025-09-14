FROM node:20-alpine AS builder

RUN apk add --no-cache git

WORKDIR /app
COPY package*.json ./
COPY ./vendors ./vendors
RUN npm ci
COPY . .
RUN npm i --global vite
RUN npm run build-only

FROM nginx:alpine AS runner

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
