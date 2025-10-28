#!/bin/bash

echo "🧪 B402支付系统测试脚本"
echo "========================"

# 测试服务器健康状态
echo "1. 测试服务器健康状态..."
HEALTH_RESPONSE=$(curl -s http://localhost:3000/health 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ 服务器健康检查通过"
    echo "   响应: $HEALTH_RESPONSE"
else
    echo "❌ 服务器健康检查失败"
    echo "   请确保服务器正在运行: npm start"
    exit 1
fi

echo ""

# 测试支付要求接口
echo "2. 测试支付要求接口..."
REQUIREMENTS_RESPONSE=$(curl -s http://localhost:3000/payment-requirements 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ 支付要求接口正常"
    echo "   响应: $REQUIREMENTS_RESPONSE"
else
    echo "❌ 支付要求接口失败"
    exit 1
fi

echo ""

# 测试Facilitator连接
echo "3. 测试B402 Facilitator连接..."
FACILITATOR_RESPONSE=$(curl -s -w "%{http_code}" https://facilitator.b402.ai -o /dev/null 2>/dev/null)
if [ "$FACILITATOR_RESPONSE" = "200" ] || [ "$FACILITATOR_RESPONSE" = "404" ]; then
    echo "✅ B402 Facilitator连接正常 (HTTP $FACILITATOR_RESPONSE)"
else
    echo "⚠️  B402 Facilitator连接异常 (HTTP $FACILITATOR_RESPONSE)"
fi

echo ""

# 检查BSC RPC连接
echo "4. 测试BSC RPC连接..."
BSC_RPC_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  https://bsc-dataseed.binance.org 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ BSC RPC连接正常"
    echo "   最新区块: $BSC_RPC_RESPONSE"
else
    echo "❌ BSC RPC连接失败"
fi

echo ""
echo "========================"
echo "🎉 测试完成!"
echo ""
echo "📋 下一步操作:"
echo "1. 在浏览器中打开 buyer-frontend/index.html"
echo "2. 连接MetaMask钱包"
echo "3. 切换到BSC主网"
echo "4. 执行支付测试"
echo ""
echo "💡 提示: 确保钱包中有足够的USDT余额进行测试"
