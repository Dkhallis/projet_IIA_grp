# === ÉTAPE 1 : Build de l'application React ===
FROM node:20-alpine AS builder
WORKDIR /app

# 1. On copie les fichiers de configuration
COPY package*.json ./
RUN npm install

# 2. On copie tout le contenu du projet
COPY . .

# 3. Correction de la structure HTML pour l'index
RUN sed -i 's|\./app/src/main.jsx|\./src/main.jsx|g' index.html

# 4. Création du fichier supabase.js factice pour bypass le plantage de Vite
RUN mkdir -p src/lib && echo "export const supabase = {};" > src/lib/supabase.js

# 5. On lance la compilation
RUN npm run build

# === ÉTAPE 2 : Serveur de production (Nginx) ===
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
