#!/bin/bash

# App Environment Variables
export NODE_ENV=production
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

docker-compose up -d
