@echo off

:: 检查是否以管理员权限运行
net session >nul 2>&1
if %errorLevel% == 0 (
    echo 正在以管理员权限运行...
) else (
    echo 请以管理员权限运行此脚本
    echo 正在请求管理员权限...
    powershell -Command "Start-Process '%~dpnx0' -Verb RunAs"
    exit /b
)

:: 执行部署脚本
call deploy.bat

:: 暂停以查看输出
pause