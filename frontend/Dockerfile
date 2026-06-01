# Stage 1: Build React Assets using Node
FROM node:20-alpine AS builder

WORKDIR /workspace

# Copy dependency mappings
COPY package.json ./

# Install packages with legacy peer deps bypassed
RUN npm install --legacy-peer-deps

# Copy source code files
COPY . .

# Compile optimized static production build
RUN npm run build

# Stage 2: Serve compiled assets using Nginx
FROM nginx:1.25-alpine

# Copy static assets from build stage
COPY --from=builder /workspace/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose Nginx port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
