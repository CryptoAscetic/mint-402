# Mint 402 协议项目

这是一个基于Mint 402协议的代币铸造项目，支持在Base网络上使用USDC进行X420代币铸造。

## 🚀 项目概述

Mint 402是一个创新的代币铸造协议，允许用户通过EIP-712签名标准在Base网络上铸造X420代币。该项目使用现代Python技术栈，支持多线程并发处理和高安全性。

## ⚠️ 重要警告

**请停止运行，项目已经超额，而且项目方一直不发币！**

本项目仅供学习和研究目的，使用前请充分了解相关风险。

## ✨ 主要特性

- 🔐 **EIP-712签名** - 使用标准化的类型化数据签名确保安全性
- 🌐 **Base网络支持** - 支持Base主网（链ID: 8453）
- 💰 **USDC支付** - 使用USDC进行代币铸造
- 🔄 **多线程处理** - 支持并发铸造提高效率
- 🛡️ **安全机制** - 内置重试机制和错误处理
- 📊 **实时监控** - 详细的日志记录和状态跟踪

## 🛠️ 技术架构

### 核心依赖
- **web3**: 用于与以太坊网络交互
- **eth-account**: 用于账户管理和签名
- **curl-cffi**: 用于发送HTTP请求
- **loguru**: 用于日志记录
- **uv**: 现代Python包管理器

### 网络配置
- **RPC URL**: `https://mainnet.base.org` (Base主网)
- **链ID**: 8453 (Base链)
- **USDC合约地址**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- **X420代币地址**: `0x9b4dc4f56ec94e629252db7990f885a414a26083`

## 📁 项目结构

```
pong/
├── pong.py                # 主铸造脚本
├── pyproject.toml         # Python项目配置
├── uv.lock                # 依赖锁定文件
├── README.md              # 项目说明（本文件）
└── 使用说明.md            # 详细中文使用说明
```

## 🔧 配置说明

### 基本配置
```python
CONFIG = {
    "rpcUrl": "https://mainnet.base.org",
    "privateKey": "你的私钥 0x 开头",
    "x420TokenAddress": "0x9b4dc4f56ec94e629252db7990f885a414a26083",
    "UsdcAmount": "10",
    "threadCount": 30,
    "totalMintCount": 100000,
    "proxy": None
}
```

### 配置参数说明
- **rpcUrl**: Base网络RPC节点地址
- **privateKey**: 你的钱包私钥（0x开头）
- **x420TokenAddress**: X420代币合约地址
- **UsdcAmount**: 每次铸造使用的USDC数量
- **threadCount**: 并发线程数
- **totalMintCount**: 总铸造次数
- **proxy**: 代理设置（可选）

## 🚀 快速开始

### 1. 安装依赖

```bash
# 使用uv安装依赖（推荐）
uv sync

# 或使用pip
pip install -r requirements.txt
```

### 2. 配置私钥

在`pong.py`文件中修改配置：
```python
CONFIG = {
    "privateKey": "0x你的私钥",
    # 其他配置...
}
```

### 3. 运行铸造

```bash
# 使用uv运行
uv run pong.py

# 或直接运行
python pong.py
```

## 🔐 安全特性

### 1. EIP-712签名
- 使用标准化的类型化数据签名
- 防止重放攻击（通过nonce和时间窗口）
- 确保消息完整性和身份验证

### 2. 时间窗口控制
- `valid_after`: 当前时间 - 600秒（10分钟前）
- `valid_before`: 当前时间 + 3000秒（50分钟后）
- 防止过期签名被使用

### 3. 随机数机制
- 每次交易使用唯一的32字节随机数
- 防止重放攻击

## 📊 铸造流程

### 1. 初始化阶段
- 加载私钥和账户信息
- 连接到Base网络
- 验证USDC余额

### 2. 签名阶段
- 计算USDC金额（6位小数精度）
- 设置时间窗口
- 生成随机nonce
- 创建EIP-712消息
- 进行签名

### 3. 发送阶段
- 组装支付数据
- Base64编码
- 发送到pong.wtf平台
- 处理响应和错误

## 🎯 使用指南

### 多线程支持
- 默认线程数：30
- 总铸造次数：100,000
- 使用`multiprocessing.dummy.Pool`进行并发处理

### 监控和日志
- 详细的日志记录
- 实时状态更新
- 错误处理和重试机制

## ⚠️ 风险提示

- ⚠️ **资金风险**：需要真实USDC进行铸造
- ⚠️ **项目风险**：项目方可能不兑现承诺
- ⚠️ **技术风险**：私钥安全、网络连接等
- ⚠️ **法律风险**：请遵守当地法律法规

## 📚 技术细节

### USDC精度处理
```python
usdc_amount_raw = Web3.to_wei(Decimal(CONFIG["UsdcAmount"]), "mwei")
```
使用`mwei`单位处理USDC的6位小数精度。

### 支付数据格式
```json
{
    "x402Version": 1,
    "scheme": "exact",
    "network": "base",
    "payload": {
        "signature": "0x...",
        "authorization": {
            "from": "0x...",
            "to": "0x...",
            "value": "...",
            "validAfter": "...",
            "validBefore": "...",
            "nonce": "0x..."
        }
    }
}
```

## 🔗 相关链接

- [Base网络](https://base.org)
- [EIP-712标准](https://eips.ethereum.org/EIPS/eip-712)
- [USDC合约](https://basescan.org/token/0x833589fcd6edb6e08f4c7c32d4f71b54bda02913)
- [uv包管理器](https://github.com/astral-sh/uv)

## 📄 许可证

本项目仅供学习和研究使用，请勿用于商业用途。

## 🙏 免责声明

本项目仅供学习和研究目的。使用者需要自行承担所有风险，包括但不限于资金损失、技术风险和法律风险。作者不对使用本项目造成的任何损失负责。

---

**再次提醒：请停止运行，项目已经超额，而且项目方一直不发币！**