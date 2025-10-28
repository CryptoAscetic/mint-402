#!/bin/bash

echo "🚀 B402支付系统演示启动脚本"
echo "================================"

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到Node.js，请先安装Node.js"
    exit 1
fi

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未找到npm，请先安装npm"
    exit 1
fi

echo "✅ Node.js版本: $(node --version)"
echo "✅ npm版本: $(npm --version)"

# 进入项目目录
cd "$(dirname "$0")"

# 检查package.json是否存在
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 未找到package.json文件"
    exit 1
fi

# 安装依赖
echo "📦 正在安装依赖..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

echo "✅ 依赖安装完成"

# 检查环境变量文件
if [ ! -f ".env" ]; then
    echo "⚠️  警告: 未找到.env文件，使用默认配置"
    echo "💡 提示: 可以复制config/env.example到.env并修改配置"
fi

# 启动服务器
echo "🌐 正在启动卖家服务器..."
echo "📍 服务器地址: http://localhost:3000"
echo "📍 健康检查: http://localhost:3000/health"
echo "📍 支付要求: http://localhost:3000/payment-requirements"
echo ""
echo "📱 买家前端: 在浏览器中打开 buyer-frontend/index.html"
echo ""
echo "按 Ctrl+C 停止服务器"
echo "================================"

npm start
