# Pong游戏项目

一个基于Python的经典Pong游戏实现，使用现代Python技术栈开发。

## 🎮 游戏简介

Pong是1972年由Atari公司发布的经典电子游戏，被认为是电子游戏史上的里程碑。这个项目是对经典Pong游戏的现代Python实现。

## ✨ 主要特性

- 🎮 **经典游戏玩法** - 忠实还原原始Pong游戏体验
- 🐍 **Python实现** - 使用现代Python技术栈
- 📦 **uv依赖管理** - 使用uv进行快速依赖管理
- 🎨 **简洁界面** - 清晰的游戏界面设计
- 📖 **完整文档** - 详细的中文使用说明

## 🛠️ 技术栈

- **语言**: Python 3.8+
- **依赖管理**: uv
- **游戏引擎**: 自定义实现
- **图形库**: 标准库实现

## 📋 环境要求

- Python >= 3.8
- uv (Python包管理器)

## 🚀 快速开始

### 1. 安装依赖

```bash
# 使用uv安装依赖
uv sync

# 或使用pip
pip install -r requirements.txt
```

### 2. 运行游戏

```bash
# 使用uv运行
uv run pong.py

# 或直接运行
python pong.py
```

## 🎯 游戏操作

- **左玩家**: 使用W/S键控制球拍上下移动
- **右玩家**: 使用↑/↓键控制球拍上下移动
- **ESC键**: 退出游戏
- **空格键**: 暂停/继续游戏

## 📁 项目结构

```
pong/
├── pong.py                # 游戏主文件
├── pyproject.toml         # Python项目配置
├── uv.lock                # 依赖锁定文件
├── README.md              # 项目说明（本文件）
└── 使用说明.md            # 详细中文使用说明
```

## 🔧 配置说明

游戏配置可以通过修改`pong.py`文件中的常量来调整：

- **游戏窗口大小**: 默认800x600像素
- **球拍大小**: 可调整宽度和高度
- **球的速度**: 可调整移动速度
- **得分目标**: 默认先得5分者获胜

## 🎨 游戏截图

游戏界面简洁明了，包含：
- 游戏区域
- 左右两个球拍
- 移动的球
- 得分显示
- 游戏状态提示

## 📚 详细说明

查看 [使用说明.md](使用说明.md) 获取更详细的使用指南和游戏规则说明。

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个游戏！

### 贡献指南

1. Fork本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开Pull Request

## 🐛 问题反馈

如果您遇到任何问题或有改进建议，请：

1. 查看 [Issues](https://github.com/CryptoAscetic/mint-402/issues) 页面
2. 创建新的Issue描述问题
3. 提供详细的错误信息和复现步骤

## 📄 许可证

本项目采用MIT许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- 感谢Atari公司创造了经典的Pong游戏
- 感谢Python社区提供的优秀工具和库
- 感谢所有贡献者的支持

## 🔗 相关链接

- [uv包管理器](https://github.com/astral-sh/uv)
- [Python官方文档](https://docs.python.org/)
- [Pong游戏历史](https://en.wikipedia.org/wiki/Pong)

---

**享受游戏！** 🎮