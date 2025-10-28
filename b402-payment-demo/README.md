# B402支付系统演示

这是一个基于B402协议的支付系统演示项目，支持BSC主网上的USDT、USD1、USDC代币支付。

## 项目结构

```
b402-payment-demo/
├── seller-backend/          # 卖家后端服务
│   └── server.js           # Express服务器
├── buyer-frontend/         # 买家前端
│   ├── index.html          # 测试页面
│   └── payment-client.js   # 支付客户端
├── config/                 # 配置文件
│   └── env.example         # 环境变量示例
├── package.json            # 依赖管理
└── README.md              # 说明文档
```

## 功能特性

- ✅ BSC主网支持
- ✅ MetaMask钱包集成
- ✅ EIP-712签名验证
- ✅ 多代币支持 (USDT/USD1/USDC)
- ✅ 实时支付处理
- ✅ 余额查询
- ✅ 支付状态跟踪

## 快速开始

### 1. 安装依赖

```bash
cd b402-payment-demo
npm install
```

### 2. 配置环境变量

```bash
cp config/env.example .env
# 编辑.env文件，设置您的卖家地址
```

### 3. 启动卖家服务器

```bash
npm start
# 或使用开发模式
npm run dev
```

服务器将在 http://localhost:3000 启动

### 4. 打开买家前端

在浏览器中打开 `buyer-frontend/index.html`

## 使用说明

### 卖家端

1. 启动Express服务器
2. 服务器会自动处理支付请求
3. 通过B402 Facilitator验证和结算支付

### 买家端

1. 连接MetaMask钱包
2. 确保钱包连接到BSC主网
3. 检查代币余额
4. 获取支付要求
5. 执行支付操作

## API接口

### GET /health
健康检查接口

### GET /payment-requirements
获取支付要求

### POST /accept-payment
接受支付请求
- Body: `{ authorization, signature }`

## 支持的代币

| 代币 | 合约地址 | 精度 |
|------|----------|------|
| USDT | 0x55d398326f99059fF775485246999027B3197955 | 18 |
| USD1 | 0x8d0d000ee44948fc98c9b98a4fa4921476f08b0d | 18 |
| USDC | 0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d | 18 |

## BSC主网配置

- **网络名称**: BNB Smart Chain
- **Chain ID**: 56
- **RPC URL**: https://bsc-dataseed.binance.org
- **Relayer**: 0xE1C2830d5DDd6B49E9c46EbE03a98Cb44CD8eA5a
- **Facilitator**: https://facilitator.b402.ai

## 注意事项

1. 确保MetaMask钱包已安装并连接到BSC主网
2. 确保钱包中有足够的代币余额
3. 支付授权有有效期限制（默认1小时）
4. 请使用测试环境进行开发，生产环境请谨慎操作

## 故障排除

### 常见问题

1. **钱包连接失败**
   - 检查MetaMask是否已安装
   - 确认浏览器支持Web3

2. **网络错误**
   - 确认钱包连接到BSC主网
   - 检查RPC节点是否正常

3. **支付失败**
   - 检查代币余额是否充足
   - 确认支付授权未过期
   - 检查Facilitator服务状态

## 开发说明

### 技术栈

- **后端**: Node.js + Express
- **前端**: HTML + JavaScript + ethers.js
- **区块链**: BSC主网
- **钱包**: MetaMask

### 安全考虑

- 生产环境请使用HTTPS
- 验证所有输入参数
- 使用环境变量管理敏感信息
- 定期更新依赖包

## 许可证

MIT License
