---
order: 7
---

# 开发者指南

欢迎查阅 PCL Community Edition (PCL CE) 开发者文档！

本文档面向希望参与 PCL CE 开发或为文档站点贡献内容的开发者。

## 快速导航

### 入门指南

| 文档 | 描述 |
|------|------|
| [贡献指南](./contributing.md) | 为文档站点贡献内容的指南 |
| [开发环境配置](./setup.md) | 从配置环境到提交 PR 的完整流程 |
| [技术规范](./guidelines.md) | 命名规范、代码风格、提交信息规范 |
| [GPG 签名配置](./gpg-signing.md) | Git 提交签名配置教程 |

### API 文档

| 文档 | 描述 | 命名空间 |
|------|------|----------|
| [生命周期管理](./api/lifecycle.md) | 程序执行流程控制机制 | `PCL.Core.App` |
| [事件总线](./api/eventbus.md) | 发布/订阅式事件总线 | `PCL.Core.App.EventBus` |
| [配置系统](./api/config.md) | 应用配置管理 | `PCL.Core.App.Config` |
| [任务系统](./api/tasks.md) | 响应式后台任务管理 | `PCL.Core.App.Tasks` |
| [RPC API](./api/rpc.md) | 命名管道通信接口 | - |
| [身份认证](./api/identity.md) | OAuth/OpenID 认证组件 | - |

### 其他文档

| 文档 | 描述 |
|------|------|
| [XAML 映射表](./xaml-to-doc-mapping.md) | XAML 文件到文档 URL 的映射关系 |

## 项目仓库

- [PCL-CE](https://github.com/PCL-Community/PCL-CE) - 启动器主仓库
- [PCL.Core](https://github.com/PCL-Community/PCL.Core) - 核心库仓库
- [docs.pclc.cc](https://github.com/PCL-Community/docs.pclc.cc) - 文档站点仓库

## 许可证

如无特别说明，本文档内容均按 Creative Commons Attribution-ShareAlike（CC BY-SA）4.0 许可协议进行分发。
