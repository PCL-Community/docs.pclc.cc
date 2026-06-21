---
order: 2
---

# 开发环境配置

本文介绍 PCL 社区版从配置本地开发环境到提交 Pull Request 的基本流程。完成本文中的配置后，你应当能够在本地克隆仓库、构建项目、进行开发，并将修改提交到 GitHub。

如果你已经熟悉 Git、.NET 桌面开发和 GitHub Pull Request 流程，可以重点阅读“基本环境需求”“初始化解决方案”和“发起 Pull Request”部分。

::: warning 系统要求
PCL CE 面向 .NET 8 Desktop，运行和调试环境要求 Windows 10 1607 或以上版本。本文默认你使用较新的 Windows 系统进行开发。

如果你使用 Linux、macOS 或较旧版本的 Windows，请自行配置 Windows 虚拟机调试环境，或升级到受支持的系统版本。

.NET 支持跨平台交叉编译，因此 Linux / macOS 用户可以使用 Rider 开发，并通过 Windows 虚拟机进行调试。
:::

::: tip 网络环境
开发本项目需要访问 GitHub 和 NuGet Gallery。在中国内地访问这些服务可能不稳定，建议配置稳定的网络环境，以减少克隆仓库、恢复 NuGet 包或推送代码时遇到的问题。

NuGet Gallery 也可以使用华为云提供的 [NuGet 镜像](https://mirrors.huaweicloud.com/mirrorDetail/5ebf85de07b41baf6d0882ab?mirrorName=nuget&catalog=language)。如果依赖恢复失败，请优先排查网络环境。
:::

## 一、开始之前

在配置环境前，建议先确认自己要进行的修改类型。

如果你只是修正文档、调整配置或修改少量文本，通常只需要了解基本的 Git 提交流程。

如果你准备修改业务逻辑、界面行为、核心库功能或源生成器，则需要完成本地构建，并在提交前进行基本测试。

开发过程中请遵循 [技术规范](./guidelines)。其中包含命名规范、代码风格、提交信息规范、AI 使用要求等内容，本文不再重复展开。

## 二、基本环境需求

本节列出项目开发所需的基础工具。若你不熟悉这些工具，可以继续阅读后续小节中的配置说明。

| 类型          | 要求                                                            |
|-------------|---------------------------------------------------------------|
| 版本控制工具      | `Git`，以及用于提交签名的 `GPG` 或 `SSH`                                 |
| SDK 工具链     | `.NET SDK 10.0` 或更高版本                                         |
| 运行时         | `.NET Desktop Runtime 8.0`                                    |
| 集成开发环境（IDE） | `JetBrains Rider 2025.3.2` 或更高版本，或 `Visual Studio 2026` 或更高版本 |

::: info 提示
SDK 版本应等于或高于表中给出的版本。

Runtime 版本为项目依赖的固定版本，应使用表中指定的版本。更高或更低版本都可能无法满足项目运行要求。
:::

::: tip IDE 推荐
推荐使用 Rider 进行开发。如果你使用 Visual Studio，请在提交前检查 diff，避免提交 IDE 自动产生的无关更改。
:::

## 三、安装并配置 Git

访问 [Git 官网](https://git-scm.com/)，选择 **Download for Windows** 下载安装包并运行。

如果不清楚安装器中的选项含义，保持默认选项即可。也可以使用以下命令通过 winget 安装：

```cmd
winget install git
```

不过，winget 可能会直接使用默认配置，且不一定安装 Git 凭据管理器。若无特殊需求，建议优先使用官网安装包。

安装完成后，配置 Git 的用户名和邮箱：

```cmd
git config --global user.email 你的邮箱
git config --global user.name 你的名字
```

::: info 邮箱配置
`user.name` 建议尽量与 GitHub 用户名保持一致，方便维护者识别提交来源。

`user.email` 必须使用 GitHub 账户中已验证的邮箱，否则提交签名或身份验证可能无法正常通过。
:::

::: tip 提交被拒绝？
如果 GitHub 拒绝了你的命令行提交，请检查 [GitHub 邮箱设置页面](https://github.com/settings/emails) 底部的 **Block command line pushes that expose my email** 是否已取消勾选。

不建议使用 GitHub Web Editor 提交代码。若确实需要在线编辑，可以使用 [GitHub 提供的 VS Code 网页版](https://github.dev/PCL-Community/PCL-CE)，并将链接中的 `PCL-Community` 替换为你自己的用户名。
:::

## 四、安装 SDK 和开发环境

PCL CE 依赖 .NET 桌面开发工具链。最简单的方式是通过 Visual Studio Installer 安装对应组件。

点击以下链接下载 Visual Studio 安装工具：

[下载 Visual Studio 安装工具](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=Community&channel=Stable&version=VS18)

如果你不打算安装 Visual Studio IDE，也可以下载不包含 IDE 的 Build Tools：

[下载 Visual Studio Build Tools](https://aka.ms/vs/stable/vs_BuildTools.exe)

下载完成后运行安装包。安装器会先配置 Visual Studio Installer，完成后会自动打开负载选择页面。

在负载列表中选择 **.NET 桌面开发**，然后点击右下角的 **安装**。安装完成后，系统应具备构建和运行 PCL CE 所需的基础工具链。

## 五、配置 Git 提交签名

::: info 签名要求
PCL CE 仓库要求 PR 中的所有提交都附带已验证的签名。因此，你需要在本地配置提交签名，并将对应公钥添加到 GitHub 账户中。

本文介绍配置相对简单的 SSH 签名。若你希望使用 GPG 签名，请参考 [GPG 签名配置指南](./gpg-signing)。
:::

### 生成或确认 SSH 密钥

如果你的用户目录中已经存在 `.ssh` 目录，并且其中包含 `id_rsa`、`id_ed25519` 等类似文件，可以直接使用已有密钥。

如果没有可用密钥，可以运行以下命令生成新的 SSH 密钥对：

```cmd
ssh-keygen -t ed25519 -C "你的邮箱"
```

命令会依次提示输入保存位置、密码和重复密码。若不需要自定义，直接按 Enter 使用默认值即可。

如果你为密钥设置了密码，输入时终端通常不会显示任何字符，这是正常现象。

### 配置 Git 使用 SSH 签名

运行以下命令，让 Git 使用 SSH 作为签名格式：

```cmd
git config --global gpg.format ssh
git config --global user.signingkey "公钥文件位置"
git config --global commit.gpgsign true
```

其中，`user.signingkey` 应填写公钥文件的路径。Windows 上建议使用绝对路径，例如：

```text
C:\Users\用户名\.ssh\id_ed25519.pub
```

如果你不希望 Git 自动为每次提交签名，可以跳过第三行命令。但之后提交时需要手动添加 `-S` 参数，或在你使用的 Git 工具中单独启用签名。

::: tip 快速获取路径
可以在 `.ssh` 目录中按住 Shift 右击公钥文件，然后选择“复制文件路径”，快速获得公钥文件的绝对路径。
:::

::: warning 注意
请务必使用扩展名为 `.pub` 的公钥文件，而不是没有扩展名的私钥文件。

同时请再次确认 Git 中配置的邮箱，与 GitHub 账户中已验证的任意邮箱一致。否则提交可能显示为 `Unverified`。
:::

### 将签名公钥添加到 GitHub

打开 [GitHub SSH and GPG keys](https://github.com/settings/keys) 设置页面，点击右上角的 **New SSH key**。

填写时请注意：

| 字段         | 填写内容                          |
|------------|-------------------------------|
| `Title`    | 自定义名称，例如 `PCL CE Signing Key` |
| `Key type` | 选择 `Signing Key`              |
| `Key`      | 填入刚才生成的公钥文件内容                 |

公钥文件可以右键选择“编辑”打开，然后复制其中的完整内容。

填写完成后，点击 **Add SSH key** 添加到 GitHub 账户。

## 六、准备本地仓库

::: tip 仓库选择
如果你是社区成员，可以直接 Clone 社区仓库。

如果你是外部开发者，请先 Fork 本仓库到自己的个人或组织账户中，再 Clone 自己账户下的 Fork 仓库。这样后续才能方便地提交 PR。
:::

建议先创建一个专门存放项目代码的目录，例如：

```text
C:\Projects
```

然后在该目录中克隆仓库。

如果你是社区成员，可以直接克隆主仓库：

```cmd
git clone https://github.com/PCL-Community/PCL-CE
```

如果你是外部开发者，请将地址替换为自己的 Fork 仓库地址：

```cmd
git clone https://github.com/你的用户名/PCL-CE
```

克隆完成后进入仓库目录：

```cmd
cd PCL-CE
```

## 七、初始化解决方案

::: info IDE 语言
推荐将 IDE 界面语言设置为英文。这样在查阅资料、沟通问题或对照本文中的菜单名称时会更方便。

本文中涉及 IDE 选项时，会优先使用英文名称。如果你使用中文界面，请自行对照翻译。
:::

在仓库根目录中执行以下命令：

```cmd
dotnet build
```

该命令用于测试开发环境是否可用，并初始化项目文件结构和源生成器。

如果构建没有报错，说明开发环境已经基本可用，可以开始开发。

如果构建失败，请先仔细阅读报错信息，确认是否存在以下问题：

* .NET SDK 或 Runtime 版本不符合要求；
* Visual Studio / Build Tools 组件缺失；
* NuGet 包恢复失败；
* 网络环境无法访问 GitHub 或 NuGet Gallery；
* 本地仓库代码不完整或分支状态异常。

如果确认本地环境没有问题，但仍然无法构建，可能是近期提交引入了 Breaking Change。此时可以等待上游更新，或到社区开发者 QQ 群中交流问题。

## 八、项目基本结构

PCL 社区版基于 Visual Studio 解决方案（`.slnx`）构建。整个仓库对应一个解决方案，其中包含多个项目。

### Plain Craft Launcher 2

启动器本体项目，包含大多数程序逻辑。

该项目目前包含但不限于以下内容：

* 用户界面；
* Minecraft 相关管理工具；
* 账户认证；
* 启动器主流程；
* 其他用户可感知的功能。

### PCL.Core

社区版核心库，包含 PCL CE 新增逻辑和核心功能实现。

项目引用是单向的：启动器本体项目可以引用核心库，但核心库不能反向引用启动器本体项目。

核心库目前按用途划分为不同目录和命名空间。新增内容时，请优先放入已有分类中。若新增内容完全不属于任何已有分类，再考虑创建新的目录结构。

### PCL.Core.SourceGenerators

核心库使用的源生成器项目。

如果你需要修改配置项生成、工具代码生成或其他编译期生成逻辑，通常需要查看该项目。

### PCL.Core.Test

核心库测试项目，用于检查核心库中部分实现是否正确。

如果你新增了核心库工具、算法或较独立的逻辑，建议在该项目中添加对应测试。

## 九、开始开发

完成本地构建后，就可以根据需要修改代码。

开发过程中请注意以下事项：

* 开始开发前，建议从最新代码创建新分支；
* 每个分支尽量只处理一个问题或一类修改；
* 修改已有文件时，尽量减少与本次修改无关的 diff；
* 与业务逻辑有关的代码，应在本地完成基本测试后再提交；
* 代码风格、命名、提交信息和 AI 使用要求请参考 [技术规范](guidelines.md)。

如果你需要新增测试，可以在 `PCL.Core.Test` 中查找类似测试作为参考。

## 十、提交前检查

提交前建议至少检查以下内容：

1. 项目能否正常构建。
2. 修改过的功能是否能基本运行。
3. 是否存在与本次修改无关的文件变更。
4. 是否误提交了临时文件、构建产物或本地配置。
5. 所有提交是否都带有已验证签名。

可以使用以下命令查看当前变更：

```cmd
git status
git diff
```

如果使用 IDE 或图形化 Git 工具，也应在提交前逐个文件检查 diff。

## 十一、提交和推送

具体提交和推送代码的方式因 Git 工具不同而有所差异，可以使用命令行、Rider、Visual Studio、GitHub Desktop 或其他 Git 客户端。

如果你没有配置自动签名，提交时需要添加 `-S` 参数：

```cmd
git commit -S -m "fix(scope): 修复某功能异常"
```

如果已经配置了自动签名，可以正常提交：

```cmd
git commit -m "fix(scope): 修复某功能异常"
```

提交信息格式请参考 [技术规范](./guidelines) 中的提交信息规范。

::: tip 分支建议
建议在新分支中提交修改，不要直接在默认的 `dev` 分支上开发。

例如：

```cmd
git checkout -b fix/some-problem
```

这样可以减少同步上游和发起 PR 时的冲突。
:::

提交完成后，将分支推送到 GitHub：

```cmd
git push origin fix/some-problem
```

## 十二、发起 Pull Request

当你的提交已经推送到 GitHub 仓库中的某个分支后，可以打开 [Pull Requests](https://github.com/PCL-Community/PCL-CE/pulls) 页面，点击 **New pull request** 发起 PR。

创建 PR 时，请确认：

* 左侧目标分支通常选择 `dev`；
* 右侧来源分支选择你提交修改的分支；
* PR 标题符合提交信息规范；
* PR 描述清楚说明本次修改内容。

PR 描述建议包含以下内容：

```markdown
## 修改内容

- 修复……
- 调整……
- 补充……

## 测试情况

- 已运行 `dotnet build`
- 已在本地验证……

## 其他说明

- 可能影响……
- 需要等待……
```

如果该 PR 可以解决某个 Issue，请在 PR 描述中使用 GitHub 处理语句关联该 Issue，例如：

```text
Close #270
```

GitHub 会在 PR 合并后自动关闭对应 Issue。

::: warning 同步上游更改
在 PR 合并前，如果需要同步上游更改，请不要使用 rebase 或 squash merge。

请使用普通 merge 同步，以避免改写提交历史或影响签名状态。
:::

如果希望社区开发者更快看到你的 PR，可以向 `PCL-Community/CE-Dev` 请求 Review。

## 十三、等待审核并修改

提交 PR 后，需要等待社区开发者，也就是 `PCL-Community/CE-Dev Team` 审核。

审核过程中，维护者可能会提出修改建议。请根据建议继续在同一分支中提交修改，PR 会自动更新。

::: warning 关于 Resolve 按钮
解决审核意见后，请不要随意点击 Resolve 按钮，除非你非常确信该问题已经完全解决。

过早 Resolve 可能会影响维护者后续审核。若有解释、疑问或补充说明，请直接在对应评论下回复。
:::

PR 通过审核并满足合并条件后，维护者会将其合并到目标分支。

感谢你为 PCL CE 做出的贡献！
