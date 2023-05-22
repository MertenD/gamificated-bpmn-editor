# Basisbild
FROM node:14 AS build-stage

# Verzeichnis in Container erstellen
WORKDIR /usr/src/app

# Abhängigkeiten kopieren
COPY package*.json ./

# Abhängigkeiten installieren
RUN npm install

# Rest der App kopieren
COPY . .

# App bauen
RUN npm run build

# Nginx Server
FROM nginx:1.19-alpine

# Build-Ordner in nginx kopieren
COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html

# Nginx Konfigurationsdatei kopieren
COPY --from=build-stage /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]

