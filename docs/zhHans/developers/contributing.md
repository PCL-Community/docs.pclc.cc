# 开发者贡献指南

本文档面向希望为 PCL CE 文档站点贡献内容的开发者。

## 快速开始

### 1. 环境准备

确保你已安装以下工具：

- [Node.js](https://nodejs.org/) (推荐 LTS 版本，由于 pnpm 版本限制，需要 22.x 或更高版本)
- [pnpm](https://pnpm.io/) (需要 v11 或更高版本)
- [Git](https://git-scm.com/)

### 2. 克隆仓库

::: warning 提示
请确保你已配置好 SSH 密钥对，才能成功克隆仓库。\
请参阅 GitHub 文档为你的账户配置 SSH 凭证：[将新的 SSH 密钥添加到 GitHub 帐户](https://docs.github.com/zh/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)
:::

```bash
git clone git@github.com:PCL-Community/docs.pclc.cc.git
cd docs.pclc.cc
```

### 3. 安装依赖

```bash
pnpm install
```

### 4. 启动开发服务器

```bash
nr dev
```

## 文档结构

```
docs/
├── zhHans/                         # 中文文档目录
│   ├── ce/                         #   PCL CE 用户文档
│   │   ├── getting-started/        #   开始使用
│   │   ├── new-user/               #   新手上路
│   │   ├── gameplay/               #   游戏玩法
│   │   ├── advanced/               #   进阶功能
│   │   ├── troubleshooting/        #   故障排除
│   │   ├── customization/          #   个性化
│   │   ├── external-resources/     #   外部资源
│   │   └── contributing/           #   参与贡献
│   │
│   └── developers/                 #   开发者文档
│       ├── index.md                #   开发者文档索引
│       ├── contributing.md         #     本文件
│       └── xaml-to-doc-mapping.md  #     XAML 映射文档
│
├──  en/                            # 英文文档目录
│   └── ...
│
└── ...                             # 其他语言
```

## 贡献类型

### 1. 内容贡献

- **修正错误**: 修复文档中的错误、过时信息
- **补充内容**: 添加缺失的说明、截图
- **翻译**: 将文档翻译成其他语言
- **新建文档**: 创建新的帮助页面

### 2. 功能贡献

- **主题改进**: 改进文档站点的样式和布局
- **组件开发**: 开发新的 Vue/VitePress 组件
- **自动化工具**: 开发文档生成、检查工具

### 3. 维护贡献

- **Issue 处理**: 回复和分类 Issues
- **PR 审查**: 审查其他贡献者的 Pull Request
- **文档整理**: 维护文档结构和导航

## 文档编写规范

### 文件格式

- 使用 Markdown 格式 (`.md`)
- 文件名使用小写字母，单词间用连字符分隔
- 文件编码使用 UTF-8

### 前置元数据

每篇文档应包含前置元数据：

```yaml
---
order: 1 # 排序序号
title: 文档标题 # 可选，覆盖默认标题
---
```

### 内容规范

1. **标题层级**: 使用 `#` 表示主标题，`##` 表示二级标题，以此类推
2. **代码块**: 使用围栏代码块并指定语言
3. **图片**: 存放在 `public/contents/` 目录，引用时使用 `/contents/xxx.png`
4. **链接**: 使用相对路径链接到其他文档

### 示例

```markdown
---
order: 1
---

# 文档标题

> **作者**: 你的名字

简介段落...

## 第一部分

内容...

### 子章节

更多内容...

## 参考

- [相关链接](./other-doc.md)
```

## XAML 到 Markdown 迁移

如果你需要将 PCL 内置帮助的 XAML 内容迁移到文档站点，请参考 [XAML 到文档映射表](./xaml-to-doc-mapping.md)。

### 迁移步骤

1. 在映射表中找到对应的 XAML 文件
2. 查看目标 Markdown 文件是否已存在
3. 将 XAML 内容转换为 Markdown 格式
4. 更新映射表中的状态

### 内容转换对照

| XAML 元素                                     | Markdown 等价物     |
| --------------------------------------------- | ------------------- |
| `<local:MyCard Title="...">`                  | `## 标题`           |
| `<local:MyHint Text="...">`                   | `> **提示**: ...`   |
| `<local:MyButton Text="..." EventData="url">` | `[按钮文本](url)`   |
| `<local:MyImage Source="...">`                | `![描述](图片路径)` |
| `<TextBlock Text="...">`                      | 普通段落            |

## 提交规范

### Commit Message 格式

```
<type>(<scope>): <subject>

<body>
```

**类型 (type)**:

- `docs`: 文档内容修改
- `feat`: 新功能
- `fix`: 修复问题
- `style`: 格式调整（不影响代码含义）
- `refactor`: 重构
- `chore`: 构建过程或辅助工具的变动

**示例**:

```
docs(gameplay): 更新安装 Mod 文档

- 添加 NeoForge 安装说明
- 更新截图
```

### Pull Request 流程

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/your-feature`)
3. 提交更改 (`git commit -am 'Add some feature'`)
4. 推送到分支 (`git push origin feature/your-feature`)
5. 创建 Pull Request

## 开发工具推荐

- **编辑器**: VSCode (推荐), IntelliJ IDEA
- **Markdown 预览**: VSCode 内置预览
- **Git 客户端**: GitHub Desktop, SourceTree, 或命令行

## 常见问题

### Q: 如何添加图片？

A: 将图片放入 `public/contents/` 目录，然后在 Markdown 中引用：

```markdown
![图片描述](/contents/image-name.png)
```

### Q: 文档中的链接如何写？

A: 使用相对路径：

```markdown
[链接文本](./relative-path.md)
```

### Q: 如何设置文档排序？

A: 在前置元数据中使用 `order` 字段，数字越小排序越靠前。

## 获取帮助

- 在 [GitHub Issues](https://github.com/PCL-Community/docs.pclc.cc/issues) 提问
- 查看 [PCL CE 用户文档](../ce/contributing/) 了解用户侧贡献指南

---

感谢你的贡献！
