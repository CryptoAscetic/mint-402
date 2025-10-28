# X420Mint 项目分析报告

## 项目概述

这是一个用于在 Base 网络上铸造 X420 代币的 Python 脚本。该项目使用 EIP-712 签名标准来创建 USDC 转账授权，并通过 HTTP 请求发送到 pong.wtf 平台进行代币铸造。

## ⚠️ 重要警告

**请停止运行，项目已经超额，而且项目方一直不发币！**

本项目仅供学习和研究目的，使用前请充分了解相关风险。

## 功能特性

- 🔐 使用 EIP-712 标准签名确保安全性
- 🌐 支持 Base 网络（链ID: 8453）
- 💰 使用 USDC 进行代币铸造
- 🔄 支持多线程并发处理
- 🛡️ 内置重试机制和错误处理

## 技术架构

### 核心依赖
- **web3**: 用于与以太坊网络交互
- **eth-account**: 用于账户管理和签名
- **curl-cffi**: 用于发送 HTTP 请求
- **loguru**: 用于日志记录

### 网络配置
- **RPC URL**: `https://mainnet.base.org` (Base 主网)
- **链 ID**: 8453 (Base 链)
- **USDC 合约地址**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- **X420 代币地址**: `0x9b4dc4f56ec94e629252db7990f885a414a26083`

## 代码结构分析

### 1. 配置管理
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

### 2. EIP-712 签名结构
项目使用 EIP-712 标准来创建类型化数据签名，包含以下结构：
- **EIP712Domain**: 域名、版本、链ID、验证合约
- **TransferWithAuthorization**: 转账授权信息（发送方、接收方、金额、时间窗口、随机数）

### 3. 核心功能模块

#### 随机数生成
```python
def random_bytes32_hex() -> str:
    """生成 32 字节的 0x 前缀 hex 字符串"""
    return "0x" + os.urandom(32).hex()
```

#### 铸造函数 (`mint`)
主要流程：
1. 初始化账户和私钥
2. 计算 USDC 金额（6位小数精度）
3. 设置时间窗口（有效期）
4. 生成随机 nonce
5. 创建 EIP-712 消息
6. 签名消息
7. 组装支付数据并 Base64 编码
8. 发送到 pong.wtf 平台

#### 网络请求函数 (`send`)
- 目标 URL: `https://pong.wtf/pong10`
- 使用 Chrome 浏览器模拟
- 支持代理配置
- 包含重试机制（最多3次）
- 超时时间：360秒

## 安全特性

### 1. EIP-712 签名
- 使用标准化的类型化数据签名
- 防止重放攻击（通过 nonce 和时间窗口）
- 确保消息完整性和身份验证

### 2. 时间窗口控制
- `valid_after`: 当前时间 - 600秒（10分钟前）
- `valid_before`: 当前时间 + 3000秒（50分钟后）
- 防止过期签名被使用

### 3. 随机数机制
- 每次交易使用唯一的 32 字节随机数
- 防止重放攻击

## 安装和使用

### 安装依赖
```bash
# 使用 uv 安装依赖
uv sync

# 或使用 pip
pip install -r requirements.txt
```

### 配置要求
1. 在 `CONFIG["privateKey"]` 中填入你的私钥（0x 开头）
2. 确保账户有足够的 USDC 余额
3. 根据需要调整 `UsdcAmount`（默认10 USDC）

### 运行方式
```bash
# 运行脚本
python pong.py
```

### 多线程支持
- 默认线程数：30
- 总铸造次数：100,000
- 使用 `multiprocessing.dummy.Pool` 进行并发处理

## 技术细节

### USDC 精度处理
```python
usdc_amount_raw = Web3.to_wei(Decimal(CONFIG["UsdcAmount"]), "mwei")
```
使用 `mwei` 单位处理 USDC 的 6 位小数精度。

### 签名过程
1. 使用 `encode_typed_data` 编码类型化数据
2. 使用 `account.sign_message` 进行签名
3. 将签名转换为十六进制字符串

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

## 风险提示

- ⚠️ **资金风险**：需要真实 USDC 进行铸造
- ⚠️ **项目风险**：项目方可能不兑现承诺
- ⚠️ **技术风险**：私钥安全、网络连接等
- ⚠️ **法律风险**：请遵守当地法律法规

## 项目状态

根据代码中的警告信息，该项目目前存在以下问题：
- 项目已经超额
- 项目方一直不发币
- 建议停止使用

## 作者信息

- **作者**: 0xNaixi
- **Twitter**: [@0xNaiXi](https://x.com/0xNaiXi)
- **验证码平台**: [nocaptcha.io](https://www.nocaptcha.io/register?c=hLf08E)

## 免责声明

本项目仅供学习和研究目的。使用者需要自行承担所有风险，包括但不限于资金损失、技术风险和法律风险。作者不对使用本项目造成的任何损失负责。

## 许可证

本项目仅供学习和研究使用，请勿用于商业用途。

---

**再次提醒：请停止运行，项目已经超额，而且项目方一直不发币！**
# mint-402
