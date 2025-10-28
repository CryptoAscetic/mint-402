// B402支付客户端 - 小白友好版
// 这个文件包含了所有与BSC网络和B402协议交互的功能

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
    name: 'Tether USD',
    decimals: 18
  },
  USD1: {
    address: '0x8d0d000ee44948fc98c9b98a4fa4921476f08b0d',
    symbol: 'USD1',
    name: 'World Liberty Financial USD',
    decimals: 18
  },
  USDC: {
    address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 18
  }
};

class B402PaymentClient {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.sellerUrl = 'http://localhost:3000';
    this.isConnected = false;
  }

  // 连接钱包 - 这是第一步
  async connectWallet() {
    try {
      // 检查是否安装了MetaMask
      if (!window.ethereum) {
        throw new Error('请先安装MetaMask钱包插件。访问 https://metamask.io 下载安装。');
      }

      // 检查MetaMask是否已解锁
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length === 0) {
        throw new Error('请先解锁您的MetaMask钱包');
      }

      // 创建provider和signer
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      
      // 切换到BSC主网
      await this.switchToBSC();
      
      const address = await this.signer.getAddress();
      console.log('✅ 钱包连接成功:', address);
      
      this.isConnected = true;
      return address;
      
    } catch (error) {
      console.error('❌ 钱包连接失败:', error);
      throw new Error(this.getUserFriendlyError(error));
    }
  }

  // 切换到BSC主网
  async switchToBSC() {
    try {
      // 尝试切换到BSC网络
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x38' }], // BSC主网chainId (56的十六进制)
      });
      console.log('✅ 已切换到BSC主网');
      
    } catch (switchError) {
      // 如果BSC网络不存在，添加它
      if (switchError.code === 4902) {
        console.log('📝 正在添加BSC网络...');
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
        console.log('✅ BSC网络添加成功');
      } else {
        throw switchError;
      }
    }
  }

  // 获取支付要求
  async getPaymentRequirements() {
    try {
      console.log('📋 正在获取支付要求...');
      
      const response = await fetch(`${this.sellerUrl}/payment-requirements`);
      
      if (!response.ok) {
        throw new Error(`服务器响应错误: ${response.status}`);
      }
      
      const requirements = await response.json();
      console.log('✅ 支付要求获取成功:', requirements);
      
      return requirements;
      
    } catch (error) {
      console.error('❌ 获取支付要求失败:', error);
      throw new Error('无法连接到支付服务器，请检查服务器是否正在运行');
    }
  }

  // 创建支付授权
  async createAuthorization(paymentRequirements) {
    try {
      const token = TOKENS.USDT; // 默认使用USDT
      
      const authorization = {
        from: await this.signer.getAddress(),
        to: paymentRequirements.recipient,
        value: paymentRequirements.amount,
        validAfter: Math.floor(Date.now() / 1000),
        validBefore: paymentRequirements.deadline,
        nonce: ethers.hexlify(ethers.randomBytes(32))
      };

      console.log('📝 创建支付授权:', authorization);
      return authorization;
      
    } catch (error) {
      console.error('❌ 创建授权失败:', error);
      throw new Error('创建支付授权时出错');
    }
  }

  // 使用EIP-712签名
  async signAuthorization(authorization) {
    try {
      console.log('✍️ 正在签名授权...');
      
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
      console.log('✅ 签名完成');
      
      return signature;
      
    } catch (error) {
      console.error('❌ 签名失败:', error);
      if (error.code === 4001) {
        throw new Error('用户取消了签名操作');
      }
      throw new Error('签名过程中出错，请重试');
    }
  }

  // 执行支付
  async makePayment() {
    try {
      if (!this.isConnected) {
        throw new Error('请先连接钱包');
      }

      console.log('🚀 开始支付流程...');

      // 1. 获取支付要求
      const paymentRequirements = await this.getPaymentRequirements();
      console.log('📋 支付要求:', paymentRequirements);

      // 2. 创建授权
      const authorization = await this.createAuthorization(paymentRequirements);
      console.log('📝 支付授权:', authorization);

      // 3. 签名授权
      const signature = await this.signAuthorization(authorization);
      console.log('✍️ 签名:', signature);

      // 4. 发送支付请求
      console.log('📤 发送支付请求...');
      const response = await fetch(`${this.sellerUrl}/accept-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorization, signature })
      });

      if (!response.ok) {
        throw new Error(`支付请求失败: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        console.log('🎉 支付成功:', result);
        return result;
      } else {
        throw new Error(result.error || '支付处理失败');
      }

    } catch (error) {
      console.error('❌ 支付失败:', error);
      throw new Error(this.getUserFriendlyError(error));
    }
  }

  // 检查代币余额
  async checkTokenBalance(tokenSymbol = 'USDT') {
    try {
      if (!this.isConnected) {
        throw new Error('请先连接钱包');
      }

      const token = TOKENS[tokenSymbol];
      if (!token) {
        throw new Error(`不支持的代币: ${tokenSymbol}`);
      }

      console.log(`💰 检查 ${tokenSymbol} 余额...`);
      
      const tokenContract = new ethers.Contract(
        token.address,
        ['function balanceOf(address) view returns (uint256)', 'function decimals() view returns (uint8)'],
        this.provider
      );

      const address = await this.signer.getAddress();
      const balance = await tokenContract.balanceOf(address);
      const decimals = await tokenContract.decimals();
      
      const formattedBalance = ethers.formatUnits(balance, decimals);
      console.log(`✅ ${tokenSymbol} 余额:`, formattedBalance);
      
      return formattedBalance;
      
    } catch (error) {
      console.error(`❌ 检查 ${tokenSymbol} 余额失败:`, error);
      throw new Error(`检查${tokenSymbol}余额时出错: ${this.getUserFriendlyError(error)}`);
    }
  }

  // 获取用户友好的错误信息
  getUserFriendlyError(error) {
    const errorMessage = error.message || error.toString();
    
    // 常见错误的中文解释
    if (errorMessage.includes('User denied')) {
      return '您取消了操作';
    }
    if (errorMessage.includes('insufficient funds')) {
      return '余额不足，请检查您的代币余额';
    }
    if (errorMessage.includes('network')) {
      return '网络连接问题，请检查您的网络连接';
    }
    if (errorMessage.includes('timeout')) {
      return '请求超时，请重试';
    }
    if (errorMessage.includes('revert')) {
      return '交易被拒绝，可能是Gas费用不足或合约错误';
    }
    if (errorMessage.includes('nonce')) {
      return '交易序号错误，请刷新页面重试';
    }
    
    // 返回原始错误信息
    return errorMessage;
  }

  // 检查网络状态
  async checkNetworkStatus() {
    try {
      if (!this.provider) {
        return { connected: false, message: '未连接钱包' };
      }

      const network = await this.provider.getNetwork();
      const isBSC = network.chainId === BigInt(BSC_CONFIG.chainId);
      
      return {
        connected: true,
        isBSC: isBSC,
        chainId: network.chainId.toString(),
        message: isBSC ? '已连接到BSC主网' : '请切换到BSC主网'
      };
      
    } catch (error) {
      return { connected: false, message: '网络检查失败' };
    }
  }

  // 获取当前账户信息
  async getAccountInfo() {
    try {
      if (!this.signer) {
        throw new Error('请先连接钱包');
      }

      const address = await this.signer.getAddress();
      const balance = await this.provider.getBalance(address);
      
      return {
        address: address,
        ethBalance: ethers.formatEther(balance),
        networkStatus: await this.checkNetworkStatus()
      };
      
    } catch (error) {
      throw new Error('获取账户信息失败: ' + this.getUserFriendlyError(error));
    }
  }
}

// 导出供HTML使用
window.B402PaymentClient = B402PaymentClient;

// 添加一些全局工具函数
window.B402Utils = {
  // 格式化地址显示
  formatAddress: function(address) {
    if (!address) return '';
    return address.slice(0, 6) + '...' + address.slice(-4);
  },
  
  // 格式化代币数量
  formatTokenAmount: function(amount, decimals = 18) {
    try {
      return parseFloat(amount).toFixed(4);
    } catch (error) {
      return '0.0000';
    }
  },
  
  // 检查是否为有效地址
  isValidAddress: function(address) {
    try {
      return ethers.isAddress(address);
    } catch (error) {
      return false;
    }
  }
};