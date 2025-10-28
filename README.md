# mint-402

这是一个包含多个区块链和Web3项目的综合仓库，主要专注于B402支付系统和相关技术演示。

## 📁 项目结构

```
mint-402/
├── b402-payment-demo/          # B402支付系统演示
│   ├── seller-backend/         # 卖家后端服务
│   ├── buyer-frontend/        # 买家前端界面
│   ├── config/                # 配置文件
│   ├── package.json           # Node.js依赖管理
│   ├── README.md              # B402项目详细说明
│   ├── start.sh               # 启动脚本
│   └── test.sh                # 测试脚本
├── pong/                      # Pong游戏项目
│   ├── pong.py                # 游戏主文件
│   ├── pyproject.toml         # Python项目配置
│   ├── README.md              # Pong项目说明
│   ├── uv.lock                # 依赖锁定文件
│   └── 使用说明.md            # 中文使用说明
├── venv/                      # Python虚拟环境
└── README.md                  # 本文件
```

## 🚀 项目概览

### 1. B402支付系统演示 (`b402-payment-demo/`)

一个完整的B402协议支付系统演示，支持BSC主网上的USDT、USD1、USDC代币支付。

**主要特性：**
- ✅ BSC主网支持
- ✅ MetaMask钱包集成
- ✅ EIP-712签名验证
- ✅ 多代币支持 (USDT/USD1/USDC)
- ✅ 实时支付处理
- ✅ 余额查询功能

**技术栈：**
- 后端：Node.js + Express
- 前端：HTML + JavaScript + ethers.js
- 区块链：BSC主网
- 钱包：MetaMask

**快速开始：**
```bash
cd b402-payment-demo
./start.sh
```

### 2. Pong游戏项目 (`pong/`)

一个基于Python的经典Pong游戏实现。

**主要特性：**
- 🎮 经典Pong游戏玩法
- 🐍 Python实现
- 📦 使用uv进行依赖管理
- 📖 完整的中文说明文档

**技术栈：**
- 语言：Python
- 依赖管理：uv
- 游戏引擎：自定义实现

**快速开始：**
```bash
cd pong
uv run pong.py
```

## 🛠️ 环境要求

### B402支付系统
- Node.js >= 16.0.0
- npm 或 yarn
- MetaMask钱包
- BSC主网访问

### Pong游戏
- Python >= 3.8
- uv (Python包管理器)

## 📋 安装说明

### 1. 克隆仓库
```bash
git clone git@github.com:CryptoAscetic/mint-402.git
cd mint-402
```

### 2. 安装B402支付系统依赖
```bash
cd b402-payment-demo
npm install
```

### 3. 安装Pong游戏依赖
```bash
cd pong
uv sync
```

## 🎯 使用指南

### B402支付系统演示

1. **启动卖家服务器**
   ```bash
   cd b402-payment-demo
   ./start.sh
   ```

2. **打开买家前端**
   - 在浏览器中打开 `buyer-frontend/index.html`
   - 连接MetaMask钱包
   - 切换到BSC主网
   - 执行支付测试

3. **运行测试**
   ```bash
   ./test.sh
   ```

### Pong游戏

1. **运行游戏**
   ```bash
   cd pong
   uv run pong.py
   ```

2. **查看详细说明**
   ```bash
   cat 使用说明.md
   ```

## 🔧 配置说明

### BSC主网配置
- **网络名称**: BNB Smart Chain
- **Chain ID**: 56
- **RPC URL**: https://bsc-dataseed.binance.org
- **Relayer**: 0xE1C2830d5DDd6B49E9c46EbE03a98Cb44CD8eA5a
- **Facilitator**: https://facilitator.b402.ai

### 支持的代币
| 代币 | 合约地址 | 精度 |
|------|----------|------|
| USDT | 0x55d398326f99059fF775485246999027B3197955 | 18 |
| USD1 | 0x8d0d000ee44948fc98c9b98a4fa4921476f08b0d | 18 |
| USDC | 0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d | 18 |

## 📚 文档

- [B402支付系统详细说明](b402-payment-demo/README.md)
- [Pong游戏说明](pong/README.md)
- [Pong游戏中文使用说明](pong/使用说明.md)

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这些项目！

## 📄 许可证

MIT License

## 🔗 相关链接

- [B402协议文档](https://facilitator.b402.ai)
- [BSC主网](https://bscscan.com)
- [MetaMask钱包](https://metamask.io)
- [uv包管理器](https://github.com/astral-sh/uv)

---

**注意**: 请确保在测试环境中使用这些项目，生产环境请谨慎操作。
