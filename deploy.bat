@echo off

REM App Environment Variables
NODE_ENV=production
set APP_PORT=8080
set APP_JWT_SECRET=jiacheng-todo-list

REM Mysql Environment Variables
set DB_HOST=mysql
set DB_PORT=3306
set DB_USER=root
set DB_PASSWORD=123456
set DB_DATABASE=todo-list

REM Redis Environment Variables
set REDIS_HOST=redis
set REDIS_PORT=6379
set REDIS_PASSWORD=123456
set REDIS_DB=0

REM 启动 Docker Compose
docker-compose up -d

REM 暂停以查看输出
pause