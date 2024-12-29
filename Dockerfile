# Build stage
FROM node:18.0-alpine3.14 AS builder

WORKDIR /app

# 设置 npm 镜像源
RUN npm config set registry https://registry.npmmirror.com

COPY package*.json ./

# Install dependencies including dev dependencies
RUN npm ci

COPY . .

# Build the application
RUN npm run build:prod

# Production stage
FROM node:18.0-alpine3.14 AS production

WORKDIR /app

# 设置 npm 镜像源
RUN npm config set registry https://registry.npmmirror.com

COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy necessary files
COPY .env.production ./

# Set NODE_ENV
ENV NODE_ENV=production

# Expose port
EXPOSE 8080

# Start the application
CMD ["node", "dist/main"]