# syntax=docker/dockerfile:1

FROM node:24-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build && \
    mkdir -p /tmp/frontend-dist && \
    if [ -d dist/frontend/browser ]; then \
      cp -r dist/frontend/browser/* /tmp/frontend-dist/; \
    else \
      cp -r dist/frontend/* /tmp/frontend-dist/; \
    fi

FROM nginx:1.29-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /tmp/frontend-dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
