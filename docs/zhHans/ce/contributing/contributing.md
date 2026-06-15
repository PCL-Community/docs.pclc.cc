# 如何为 PCL CE 文档站点贡献内容？

本文档面向希望为 PCL CE 文档站点贡献内容的开发者和文档维护者。无论你只是想修正一个错别字、补充一张截图，还是准备新增一篇完整教程，都可以按照本文的流程完成贡献。

如果你是第一次参与贡献，建议从较小的修改开始，例如修正文档中的错误、补充缺失说明，或更新已经过期的截图。熟悉流程后，再尝试新增页面、迁移 XAML 帮助内容，或改进文档站点本身。

## 一、开始之前：确认你要贡献什么

::: warning ✋ 在此之前
请先完整阅读并了解[编写规范](./writing-guidelines.md)，不符合规范的贡献可能会被拒绝！
:::

在动手修改前，建议先明确这次贡献的目标。PCL CE 文档站点接受多种类型的贡献，不同贡献需要关注的内容也略有不同。

如果你主要修改文档内容，例如修复错误、补充说明、添加截图、翻译页面或新建帮助文档，那么大多数情况下只需要了解 Markdown 写法和文档目录结构。

如果你希望改进站点功能，例如调整主题样式、编写 Vue 或 VitePress 组件、添加自动化检查工具，则需要额外了解项目使用的前端技术栈。

如果你参与维护工作，例如整理 Issue、协助审查 Pull Request、调整导航结构，也可以通过 GitHub 完成，不一定需要编写代码。

## 二、准备本地环境

在开始贡献前，请先安装以下工具：

* [Node.js](https://nodejs.org/)：推荐使用 LTS 版本。由于 pnpm 版本限制，需要 `22.x` 或更高版本。
* [pnpm](https://pnpm.io/)：需要 `v11` 或更高版本。
* [Git](https://git-scm.com/)：用于克隆仓库、提交修改和推送分支。

此外，建议准备一个适合编辑 Markdown 和前端项目的编辑器或 IDE。推荐使用 [VS Code](https://code.visualstudio.com/)，因为它启动较快，Markdown 预览、Git 操作和终端集成都比较方便。如果你更习惯 JetBrains 系列工具，也可以使用 [WebStorm](https://www.jetbrains.com/webstorm/) 或 [IntelliJ IDEA](https://www.jetbrains.com/idea/)。

安装完成后，可以在终端中运行以下命令确认版本：

```bash
node -v
pnpm -v
git -v
```

如果这些命令都能正常输出版本号，说明基础环境已经准备完成。

## 三、配置 GitHub 与 SSH

项目托管在 GitHub 上。为了能够克隆仓库、推送分支和提交 Pull Request，你需要先准备好 GitHub 账号，并配置 SSH 密钥。

如果你尚未配置 SSH，可以参考 GitHub 官方文档：

[将新的 SSH 密钥添加到 GitHub 帐户](https://docs.github.com/zh/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)

配置完成后，可以使用以下命令测试 SSH 是否可用：

```bash
ssh -T git@github.com
```

首次连接时，终端可能会询问是否信任 GitHub 主机。确认后，如果看到类似成功认证的信息，就可以继续下一步。

## 四、Fork 并克隆仓库

参与贡献时，推荐先 Fork 项目仓库，再在自己的 Fork 中创建分支并提交修改。

打开项目仓库页面后，点击右上角的 **Fork**，将仓库复制到自己的 GitHub 账号下。

Fork 完成后，在本地克隆你的 Fork 仓库：

```bash
git clone git@github.com:你的用户名/docs.pclc.cc.git
cd docs.pclc.cc
```

为了方便之后同步上游仓库，建议添加原仓库作为 `upstream`：

```bash
git remote add upstream git@github.com:PCL-Community/docs.pclc.cc.git
```

可以通过以下命令检查远程仓库配置：

```bash
git remote -v
```

正常情况下，你应该能看到 `origin` 指向自己的 Fork，`upstream` 指向 PCL Community 的原仓库。

克隆完成后，可以使用你习惯的编辑器或 IDE 打开项目目录。之后的安装依赖、启动开发服务器、编辑文档等操作，都可以在 IDE 内置终端中完成。

## 五、安装依赖并启动本地预览

进入项目目录后，先安装依赖：

```bash
pnpm install
```

依赖安装完成后，启动本地开发服务器：

```bash
nr dev
```

启动成功后，终端会显示本地预览地址。打开该地址后，你就可以在浏览器中查看文档站点。

修改文档时，开发服务器通常会自动刷新页面。建议一边编辑，一边在浏览器中检查最终显示效果。

## 六、创建一个新的工作分支

不要直接在主分支上修改内容。每次贡献前，都应该创建一个新的工作分支。

分支名称建议简短描述本次修改内容，例如：

```bash
git checkout -b docs/update-littleskin-guide
```

也可以根据贡献类型命名：

```bash
git checkout -b docs/fix-typos
git checkout -b docs/add-mod-install-guide
git checkout -b feat/add-doc-component
```

一个分支最好只处理一类修改。这样后续审查和合并会更清晰。

## 七、撰写或修改文档

文档使用 Markdown 编写，文件后缀为 `.md`。新增文件时，文件名应使用小写字母，并用连字符分隔单词，例如：

```text
install-mods.md
external-login.md
troubleshooting-launch-failed.md
```

每篇文档建议包含前置元数据，用于控制排序和标题：

```yaml
---
order: 1
title: 文档标题
---
```

其中，`order` 用于控制文档排序，数字越小越靠前。`title` 可用于覆盖默认显示标题。

正文可以按照下面的结构编写：

```markdown
---
order: 1
---

# 文档标题

这里写一段简短介绍，说明这篇文档解决什么问题，适合谁阅读。

## 一、准备工作

说明开始前需要准备什么。

## 二、操作步骤

按照实际操作顺序说明。

## 三、常见问题

补充容易出错的地方。
```

撰写教程时，建议尽量使用完整句子说明操作原因和结果，不要只堆叠命令、列表或截图。读者应该能理解“为什么要这样做”，而不仅是“下一步点哪里”。

## 八、添加图片和链接

文档图片应放在 `public/contents/` 目录下。

引用图片时，使用以 `/contents/` 开头的路径：

```markdown
![图片描述](/contents/image-name.png)
```

图片描述应尽量说明图片内容，而不是只写“图片”。例如：

```markdown
![LittleSkin 角色管理页面](/contents/littleskin-role-page.png)
```

文档之间的链接建议使用相对路径：

```markdown
[相关文档](./other-doc.md)
```

引用站点外部页面时，可以直接使用完整链接：

```markdown
[GitHub Issues](https://github.com/PCL-Community/docs.pclc.cc/issues)
```

## 九、本地检查修改效果

完成修改后，回到浏览器中的本地预览页面，检查以下内容：

1. 页面是否能正常打开。
2. 标题层级是否正确。
3. 图片是否正常显示。
4. 链接是否可以打开。
5. 代码块、提示块、表格等格式是否正常。
6. 内容是否符合教程阅读顺序。

如果你新增了文档，也要确认它是否出现在正确的导航位置中。若没有出现，可能需要检查文档的目录位置、前置元数据或站点导航配置。

## 十、提交修改

确认修改无误后，可以查看当前变更：

```bash
git status
```

也可以查看具体修改内容：

```bash
git diff
```

确认无误后，将修改加入暂存区：

```bash
git add .
```

然后提交修改：

```bash
git commit -m "docs: 更新 LittleSkin 外置登录教程"
```

::: warning 注意 提交信息应该遵守[技术规范-提交信息规范-简单格式](/ce/developers/guidelines#%E7%AE%80%E5%8D%95%E6%A0%BC%E5%BC%8F)内规定的格式。
:::

## 十一、推送分支并创建 Pull Request

提交完成后，将分支推送到你的 Fork 仓库：

```bash
git push origin docs/update-littleskin-guide
```

推送成功后，打开 GitHub。通常页面会提示你创建 Pull Request。

创建 Pull Request 时，请说明本次修改的内容。可以简单写明：

```markdown
## 修改内容

- 优化 LittleSkin 外置登录教程结构
- 将截图移动到对应步骤附近
- 补充常见问题说明

## 检查情况

- 已在本地启动开发服务器预览
- 已检查图片与链接显示
```

提交 Pull Request 后，维护者可能会提出修改建议。根据建议继续修改并提交到同一分支即可，Pull Request 会自动更新。

## 十二、同步上游仓库

如果你的 Fork 落后于原仓库，可以同步上游更新。

先拉取上游仓库信息：

```bash
git fetch upstream
```

切换到主分支：

```bash
git checkout main
```

合并上游主分支：

```bash
git merge upstream/main
```

再将更新推送到自己的 Fork：

```bash
git push origin main
```

之后再创建新的工作分支，可以减少冲突。

## 十三、常见问题

### 如何添加图片？

将图片放入 `public/contents/` 目录，然后在 Markdown 中引用：

```markdown
![图片描述](/contents/image-name.png)
```

### 文档中的链接应该怎么写？

链接到站内其他文档时，使用相对路径：

```markdown
[链接文本](./relative-path.md)
```

链接到外部网站时，使用完整链接：

```markdown
[链接文本](https://example.com)
```

### 如何设置文档排序？

在文档开头的前置元数据中设置 `order` 字段：

```yaml
---
order: 1
---
```

数字越小，排序越靠前。

### Pull Request 提交后还可以继续修改吗？

可以。只要继续在同一个分支上提交并推送，Pull Request 会自动更新。

## 十四、获取帮助

遇到问题时，可以通过以下方式获取帮助：

* 在 [GitHub Issues](https://github.com/PCL-Community/docs.pclc.cc/issues) 提问。
* 在 Pull Request 中说明遇到的问题，等待维护者协助。

感谢你为 PCL CE 文档站点做出的贡献！
