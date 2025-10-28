import { ethers } from 'ethers';

// BSC主网配置
const BSC_CONFIG = {
  chainId: 56,
  rpcUrl: 'https://bsc-dataseed.binance.org',
  relayer: '0xE1C2830d5DDd6B49E9c46EbE03a98Cb44CD8eA5a',
  facilitator: 'https://facilitator.b402.ai'
};

// 支持的代币配置
const TOKENS = {
  USDT: {
    address: '0x55d398326f99059fF775485246999027B3197955',
    symbol: 'USDT',
    decimals: 18
  },
  USD1: {
    address: '0x8d0d000ee44948fc98c9b98a4fa4921476f08b0d',
    symbol: 'USD1',
    decimals: 18
  },
  USDC: {
    address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    symbol: 'USDC',
    decimals: 18
  }
};

class B402PaymentClient {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.sellerUrl = 'http://localhost:3000';
  }

  // 连接钱包
  async connectWallet() {
    if (!window.ethereum) {
      throw new Error('请安装MetaMask钱包');
    }

    this.provider = new ethers.BrowserProvider(window.ethereum);
    this.signer = await this.provider.getSigner();
    
    // 切换到BSC主网
    await this.switchToBSC();
    
    const address = await this.signer.getAddress();
    console.log('钱包已连接:', address);
    return address;
  }

  // 切换到BSC主网
  async switchToBSC() {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x38' }], // BSC主网chainId
      });
    } catch (switchError) {
      // 如果BSC网络不存在，添加它
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x38',
            chainName: 'BNB Smart Chain',
            nativeCurrency: {
              name: 'BNB',
              symbol: 'BNB',
              decimals: 18
            },
            rpcUrls: [BSC_CONFIG.rpcUrl],
            blockExplorerUrls: ['https://bscscan.com']
          }]
        });
      } else {
        throw switchError;
      }
    }
  }

  // 获取支付要求
  async getPaymentRequirements() {
    const response = await fetch(`${this.sellerUrl}/payment-requirements`);
    return await response.json();
  }

  // 创建支付授权
  async createAuthorization(paymentRequirements) {
    const token = TOKENS.USDT; // 默认使用USDT
    
    const authorization = {
      from: await this.signer.getAddress(),
      to: paymentRequirements.recipient,
      value: paymentRequirements.amount,
      validAfter: Math.floor(Date.now() / 1000),
      validBefore: paymentRequirements.deadline,
      nonce: ethers.hexlify(ethers.randomBytes(32))
    };

    return authorization;
  }

  // 使用EIP-712签名
  async signAuthorization(authorization) {
    const domain = {
      name: 'B402',
      version: '1',
      chainId: BSC_CONFIG.chainId,
      verifyingContract: BSC_CONFIG.relayer
    };

    const types = {
      TransferWithAuthorization: [
        { name: 'from', type: 'address' },
        { name: 'to', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'validAfter', type: 'uint256' },
        { name: 'validBefore', type: 'uint256' },
        { name: 'nonce', type: 'bytes32' }
      ]
    };

    const signature = await this.signer.signTypedData(domain, types, authorization);
    return signature;
  }

  // 执行支付
  async makePayment() {
    try {
      console.log('开始支付流程...');

      // 1. 获取支付要求
      const paymentRequirements = await this.getPaymentRequirements();
      console.log('支付要求:', paymentRequirements);

      // 2. 创建授权
      const authorization = await this.createAuthorization(paymentRequirements);
      console.log('支付授权:', authorization);

      // 3. 签名授权
      const signature = await this.signAuthorization(authorization);
      console.log('签名:', signature);

      // 4. 发送支付请求
      const response = await fetch(`${this.sellerUrl}/accept-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorization, signature })
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('支付成功:', result);
        return result;
      } else {
        throw new Error(result.error || '支付失败');
      }

    } catch (error) {
      console.error('支付错误:', error);
      throw error;
    }
  }

  // 检查代币余额
  async checkTokenBalance(tokenSymbol = 'USDT') {
    const token = TOKENS[tokenSymbol];
    const tokenContract = new ethers.Contract(
      token.address,
      ['function balanceOf(address) view returns (uint256)', 'function decimals() view returns (uint8)'],
      this.provider
    );

    const address = await this.signer.getAddress();
    const balance = await tokenContract.balanceOf(address);
    const decimals = await tokenContract.decimals();
    
    return ethers.formatUnits(balance, decimals);
  }
}

// 使用示例
async function initPaymentDemo() {
  const paymentClient = new B402PaymentClient();
  
  try {
    // 连接钱包
    const address = await paymentClient.connectWallet();
    console.log('钱包地址:', address);

    // 检查USDT余额
    const balance = await paymentClient.checkTokenBalance('USDT');
    console.log('USDT余额:', balance);

    // 执行支付
    const result = await paymentClient.makePayment();
    console.log('支付结果:', result);

  } catch (error) {
    console.error('支付演示错误:', error);
    alert('支付失败: ' + error.message);
  }
}

// 导出供HTML使用
window.B402PaymentClient = B402PaymentClient;
window.initPaymentDemo = initPaymentDemo;
