const express = require('express');
const app = express();
app.use(express.json());

const FACILITATOR_URL = 'https://facilitator.b402.ai';

// 支付要求配置
const paymentRequirements = {
  token: '0x55d398326f99059fF775485246999027B3197955', // USDT
  amount: '1000000000000000000', // 1 USDT (18 decimals)
  recipient: '0xYourSellerAddress', // 替换为您的卖家地址
  deadline: Math.floor(Date.now() / 1000) + 3600 // 1小时后过期
};

app.post('/accept-payment', async (req, res) => {
  try {
    const { authorization, signature } = req.body;

    console.log('收到支付请求:', { authorization, signature });

    // 验证支付授权
    const verifyRes = await fetch(`${FACILITATOR_URL}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        authorization, 
        paymentRequirements,
        signature 
      })
    });

    if (!verifyRes.ok) {
      throw new Error('验证失败');
    }

    const verifyResult = await verifyRes.json();
    console.log('验证结果:', verifyResult);

    // 在链上结算
    const settleRes = await fetch(`${FACILITATOR_URL}/settle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        authorization, 
        paymentRequirements,
        signature 
      })
    });

    if (!settleRes.ok) {
      throw new Error('结算失败');
    }

    const result = await settleRes.json();
    console.log('结算结果:', result);

    res.json({ 
      success: true, 
      transaction: result.transaction,
      message: '支付成功处理'
    });

  } catch (error) {
    console.error('支付处理错误:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// 获取支付要求
app.get('/payment-requirements', (req, res) => {
  res.json(paymentRequirements);
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`卖家服务器运行在端口 ${PORT}`);
  console.log(`健康检查: http://localhost:${PORT}/health`);
  console.log(`支付要求: http://localhost:${PORT}/payment-requirements`);
});
