#!/bin/bash

# App Environment Variables
export APP_PORT=8080
export APP_JWT_SECRET=jiacheng-todo-list

# Mysql Environment Variables
export DB_HOST=mysql
export DB_PORT=3306
export DB_USER=root
export DB_PASSWORD=123456
export DB_DATABASE=todo-list

# Redis Environment Variables
export REDIS_HOST=redis
export REDIS_PORT=6379
export REDIS_PASSWORD=123456
export REDIS_DB=0

# 切换到 docker-compose.yml 所在目录并启动 Docker Compose
cd ..
docker-compose up -d
