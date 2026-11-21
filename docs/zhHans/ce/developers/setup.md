---
order: 2
---

# 开发环境配置

本文介绍 PCL 社区版从配置本地开发环境到提交 Pull Request 的基本流程。完成本文中的配置后，你应当能够在本地克隆仓库、构建项目、进行开发，并将修改提交到 GitHub。

如果你已经熟悉 Git、.NET 开发和 GitHub Pull Request 流程，可以重点阅读“基本环境需求”“初始化解决方案”和“发起 Pull Request”部分。

::: warning 系统要求
PCL CE 以 .NET 10 为目标框架，使用 Avalonia 构建用户界面，支持 Windows、Linux 和 macOS。不同平台的系统版本和桌面环境要求不同：

* **Windows：** Windows 10 版本 1809（内部版本 17763）或更高版本，或 Windows 11。.NET 10 对 Windows 10 1809 的官方支持仅限 Enterprise 或 ESU 版本；
* **Linux：** 常见的 glibc 桌面发行版，默认使用 X11，Wayland 支持仍处于实验阶段；
* **macOS：** macOS 12 或更高版本。

各平台支持的架构、发行版和支持级别，请参阅 [PCL-CE 仓库 README](https://github.com/PCL-Community/PCL-CE) 中的“支持平台”说明。
:::

本文中的命令应在对应平台的终端中执行。Windows 可使用 PowerShell 或 Git Bash；Linux 和 macOS 使用系统终端。

::: tip 网络环境
开发本项目需要访问 GitHub 和 NuGet Gallery。在中国内地访问这些服务可能不稳定，建议配置稳定的网络环境，以减少克隆仓库、恢复 NuGet 包或推送代码时遇到的问题。

NuGet Gallery 也可以使用华为云提供的 [NuGet 镜像](https://mirrors.huaweicloud.com/mirrorDetail/5ebf85de07b41baf6d0882ab?mirrorName=nuget&catalog=language)。如果依赖恢复失败，请优先排查网络环境。
:::

## 一、开始之前

在配置环境前，建议先确认自己要进行的修改类型。

如果你只是修正文档、调整配置或修改少量文本，通常只需要了解基本的 Git 提交流程。

如果你准备修改业务逻辑、界面行为、核心库功能或源生成器，则需要完成本地构建，并在提交前进行基本测试。

开发过程中请遵循 [技术规范](./guidelines) 与 [生成式人工智能使用方针](./ai-policy)。技术规范涵盖命名规范、代码风格和提交信息规范；AI 工具的使用要求以方针为准，本文不再重复展开。

## 二、基本环境需求

本节列出项目开发所需的基础工具。若你不熟悉这些工具，可以继续阅读后续小节中的配置说明。

| 类型                | 要求                                                                    |
|---------------------|-------------------------------------------------------------------------|
| 版本控制工具        | `Git`，以及用于提交签名的 `GPG` 或 `SSH`                                |
| SDK 工具链          | `.NET SDK 11.0` 或更高版本                                              |
| 运行时              | `.NET 10 Runtime`                                                       |
| 集成开发环境（IDE） | `JetBrains Rider 2026.3` 或更高版本，或 `Visual Studio 2026` 或更高版本 |

::: info 提示
SDK 与 Runtime 用途不同：构建项目需要 .NET SDK 11.0 或更高版本，运行 PCL CE 则需要 .NET 10 Runtime。如当前环境未包含所需 Runtime，请另行安装。
:::

::: tip IDE 推荐
推荐使用 Rider 进行开发。如果你使用 Visual Studio，请在提交前检查 diff，避免提交 IDE 自动产生的无关更改。
:::

## 三、安装并配置 Git

Git 在各平台的安装方式不同。请根据当前系统选择对应的小节，完成安装后继续阅读“配置用户名与邮箱”。

### Windows

访问 [Git 官网](https://git-scm.com/)，选择 **Download for Windows** 下载安装包并运行。

如果不清楚安装器中的选项含义，保持默认选项即可。也可以使用以下命令通过 winget 安装：

```powershell
winget install git
```

根据包的配置，通过 winget 安装的 Git 可能不包含 Git 凭据管理器。如果需要该组件，请使用 Git 官网提供的安装包。

### Linux

可以使用发行版包管理器安装 Git。以下是常见发行版的示例命令：

```bash
# Debian / Ubuntu
sudo apt install git openssh-client

# Fedora
sudo dnf install git openssh-clients

# Arch Linux
sudo pacman -S git openssh
```

如果发行版的软件源版本较旧，也可以参考 [Git 官方下载页面](https://git-scm.com/downloads) 使用源码或其他安装方式。

### macOS

可以通过 Xcode Command Line Tools 或 Homebrew 安装 Git。

安装 Xcode Command Line Tools：

```bash
xcode-select --install
```

如果已经安装 Homebrew，也可以运行：

```bash
brew install git
```

### 配置用户名与邮箱

安装完成后，配置 Git 的用户名和邮箱：

```bash
git config --global user.email 你的邮箱
git config --global user.name 你的名字
```

::: info 邮箱配置
`user.name` 建议尽量与 GitHub 用户名保持一致，方便维护者识别提交来源。

`user.email` 应使用 GitHub 账户中已验证的邮箱，否则 GitHub 可能无法将提交关联到你的账户。邮箱验证与 SSH/GPG 提交签名是两项独立要求。
:::

::: tip 推送被拒绝？
如果 GitHub 因提交暴露邮箱地址而拒绝推送，可以将 `user.email` 设置为 GitHub 提供的 noreply 邮箱地址，该地址可在 [GitHub 邮箱设置页面](https://github.com/settings/emails) 中查看。如果确实需要允许推送暴露邮箱的提交，也可在该页面修改 **Block command line pushes that expose my email** 设置。

不建议使用 GitHub Web Editor 提交代码。若确实需要在线编辑，可以使用 [GitHub 提供的 VS Code 网页版](https://github.dev/PCL-Community/PCL-CE)，并将链接中的 `PCL-Community` 替换为你自己的用户名。
:::

## 四、安装 SDK 和开发环境

PCL CE 以 .NET 10 为目标框架，开发环境需要 .NET SDK 11.0 或更高版本。Windows 可以通过 Visual Studio Installer 安装；Linux 与 macOS 可以直接安装 .NET SDK。

### Windows

最简单的方式是通过 Visual Studio Installer 安装对应组件。

点击以下链接下载 Visual Studio 安装工具：

[下载 Visual Studio 安装工具](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=Community&channel=Stable&version=VS18)

如果你不打算安装 Visual Studio IDE，也可以下载不包含 IDE 的 Build Tools：

[下载 Visual Studio Build Tools](https://aka.ms/vs/stable/vs_BuildTools.exe)

下载完成后运行安装包。安装器会先配置 Visual Studio Installer，完成后会自动打开负载选择页面。

在负载列表中选择 **.NET 桌面开发**，然后点击右下角的 **安装**。安装完成后，系统应具备构建和运行 PCL CE 所需的基础工具链。

### Linux

可以通过 .NET 官方安装脚本或发行版包管理器安装 .NET SDK 11.0 或更高版本。具体命令以 [.NET 官方安装文档](https://learn.microsoft.com/dotnet/core/install/linux) 为准。

安装完成后，可以在终端运行以下命令确认 SDK 版本：

```bash
dotnet --version
```

如果启动 Avalonia 界面时提示缺少 X11、字体或其他桌面运行库，请安装发行版对应的桌面依赖。PCL CE 默认使用 X11。如需尝试原生 Wayland，请设置 `PCL_USE_WAYLAND=1`，并安装 `libwayland-client` 与 `libxkbcommon`。如果 Wayland 初始化失败，程序会自动回退到 X11。

### macOS

可以从 [.NET 官方下载页面](https://dotnet.microsoft.com/download) 安装 .NET SDK 11.0 或更高版本，也可以使用 Homebrew：

```bash
brew install --cask dotnet-sdk
```

### 选择 IDE

推荐使用 Rider 进行开发。Rider 支持 Windows、Linux 与 macOS，可以直接打开仓库根目录的解决方案文件。

如果你使用 Visual Studio，请在提交前检查 diff，避免提交 IDE 自动产生的无关更改。Visual Studio 仅支持 Windows。

## 五、配置 Git 提交签名

::: info 签名要求
PCL CE 仓库要求 PR 中的所有提交都附带已验证的签名。因此，你需要在本地配置提交签名，并将对应公钥添加到 GitHub 账户中。

本文介绍配置相对简单的 SSH 签名。若你希望使用 GPG 签名，请参考 [GPG 签名配置指南](./gpg-signing)。
:::

### 生成或确认 SSH 密钥

如果用户目录中已有 `.ssh` 目录，且其中包含可用的密钥对（例如 `id_ed25519` 和 `id_ed25519.pub`），可以直接复用。

如果没有可用密钥，可以运行以下命令生成新的 SSH 密钥对：

```bash
ssh-keygen -t ed25519 -C "你的邮箱"
```

命令会依次提示输入保存位置、密码和重复密码。若不需要自定义，直接按 Enter 使用默认值即可。

如果你为密钥设置了密码，输入时终端通常不会显示任何字符，这是正常现象。

### 配置 Git 使用 SSH 签名

运行以下命令，让 Git 使用 SSH 作为签名格式：

```bash
git config --global gpg.format ssh
git config --global user.signingkey "公钥文件位置"
git config --global commit.gpgsign true
```

其中，`user.signingkey` 应填写公钥文件的路径。不同平台的常见路径如下：

| 平台    | 公钥路径示例                          |
|---------|---------------------------------------|
| Windows | `C:\Users\用户名\.ssh\id_ed25519.pub` |
| Linux   | `/home/用户名/.ssh/id_ed25519.pub`    |
| macOS   | `/Users/用户名/.ssh/id_ed25519.pub`   |

各平台均建议使用绝对路径。如果不希望 Git 自动为每次提交签名，可以跳过第三行命令。此后提交时，需要手动添加 `-S` 参数，或在 Git 客户端中单独启用签名。

::: tip 快速获取路径
Windows 可以在 `.ssh` 目录中按住 Shift 右击公钥文件，然后选择“复制文件路径”快速获得绝对路径。

Linux 与 macOS 可以在终端中进入 `.ssh` 目录后运行 `pwd`，再将文件名拼接到路径末尾。
:::

::: warning 注意
请务必使用扩展名为 `.pub` 的公钥文件，而不是没有扩展名的私钥文件。

同时请再次确认 Git 中配置的邮箱，与 GitHub 账户中已验证的任意邮箱一致。否则提交可能显示为 `Unverified`。
:::

### 将签名公钥添加到 GitHub

打开 [GitHub SSH and GPG keys](https://github.com/settings/keys) 设置页面，点击右上角的 **New SSH key**。

填写时请注意：

| 字段       | 填写内容                              |
|------------|---------------------------------------|
| `Title`    | 自定义名称，例如 `PCL CE Signing Key` |
| `Key type` | 选择 `Signing Key`                    |
| `Key`      | 填入刚才生成的公钥文件内容            |

公钥文件可以使用文本编辑器打开，然后复制其中的完整内容。

填写完成后，点击 **Add SSH key** 添加到 GitHub 账户。

## 六、准备本地仓库

::: tip 仓库选择
如果你是社区成员，可以直接 Clone 社区仓库。

如果你是外部开发者，请先 Fork 本仓库到自己的个人或组织账户中，再 Clone 自己账户下的 Fork 仓库。这样后续才能方便地提交 PR。
:::

建议先创建一个专门存放项目代码的目录。例如在 Windows 上可以使用：

```text
C:\Projects
```

在 Linux 或 macOS 上可以使用：

```text
~/Projects
```

然后在该目录中克隆仓库。

如果你是社区成员，可以直接克隆主仓库：

```bash
git clone https://github.com/PCL-Community/PCL-CE
```

如果你是外部开发者，请将地址替换为自己的 Fork 仓库地址：

```bash
git clone https://github.com/你的用户名/PCL-CE
```

克隆完成后进入仓库目录：

```bash
cd PCL-CE
```

## 七、初始化解决方案

::: info IDE 语言
推荐将 IDE 界面语言设置为英文。这样在查阅资料、沟通问题或对照本文中的菜单名称时会更方便。

本文中涉及 IDE 选项时，会优先使用英文名称。如果你使用中文界面，请自行对照翻译。
:::

在仓库根目录中执行以下命令：

```bash
dotnet build
```

该命令用于测试开发环境是否可用，并初始化项目文件结构和源生成器。

如果构建没有报错，说明开发环境已经基本可用，可以开始开发。建议同时运行一次测试：

```bash
dotnet test PCL.Core.Test/PCL.Core.Test.csproj -c CI -p:Platform=AnyCPU
```

如果构建失败，请先仔细阅读报错信息，确认是否存在以下问题：

* .NET SDK 或 Runtime 版本不符合要求
* Windows 上缺少 Visual Studio / Build Tools 组件
* NuGet 包恢复失败
* 网络环境无法访问 GitHub 或 NuGet Gallery
* 本地仓库代码不完整或分支状态异常

如果检查后仍无法构建，请核对当前分支的最新修改。向社区开发者群求助时，请附上完整错误信息、分支名称和当前 commit hash，以便定位问题。

## 八、项目基本结构

PCL 社区版使用仓库根目录中的解决方案文件（`PCL Community Edition.slnx`）构建。该解决方案包含以下项目：

| 项目                        | 说明                                                                                |
|-----------------------------|-------------------------------------------------------------------------------------|
| `PCL.Launcher`              | Avalonia 界面层与应用入口，负责组装依赖并启动应用，包含页面、ViewModel 和启动流程。 |
| `PCL.Launcher.Core`         | 启动器业务逻辑，包括启动链、加载系统和 Minecraft 相关流程。                         |
| `PCL.Core`                  | 核心库，包含配置、生命周期管理、事件总线、本地化、平台抽象和通用工具。              |
| `PCL.Core.UI`               | Avalonia UI 适配层，提供线程调度、剪贴板、对话框、主题和本地化集成等 UI 服务。      |
| `PCL.Core.SourceGenerators` | 源生成器项目，负责配置项、生命周期服务、本地化属性等编译期代码生成。                |
| `PCL.Core.Test`             | 测试项目，包含核心库及相关模块的自动化测试。                                        |
| `PCL.Platform`              | Windows、Linux 和 macOS 的平台特定服务实现。                                        |
| `PCL.Localization`          | 语言资源与独立于 UI 框架的本地化目录。                                              |

项目引用关系如下：

* `PCL.Launcher` 引用 `PCL.Core.UI`、`PCL.Launcher.Core` 和 `PCL.Platform`；
* `PCL.Launcher.Core`、`PCL.Core.UI` 和 `PCL.Platform` 均引用 `PCL.Core`；
* `PCL.Core` 和 `PCL.Launcher` 均将 `PCL.Core.SourceGenerators` 作为分析器使用；
* `PCL.Core` 不依赖 Avalonia 或启动器项目；
* `PCL.Core` 和 `PCL.Launcher.Core` 不引用 `PCL.Platform` 中的平台特定实现。

核心库按用途划分为不同目录和命名空间。添加代码时，应优先放入现有分类；仅在无法归入现有分类时，再考虑新建目录。

## 九、开始开发

完成本地构建后，就可以根据需要修改代码。

开发过程中请注意以下事项：

* 开始开发前，建议从最新代码创建新分支；
* 每个分支尽量只处理一个问题或一类修改；
* 修改已有文件时，尽量减少与本次修改无关的 diff；
* 与业务逻辑有关的代码，应在本地完成基本测试后再提交；
* 涉及平台行为的修改，应至少在目标平台上完成构建与基本功能验证；
* 代码风格、命名和提交信息请参考 [技术规范](./guidelines)，AI 工具使用要求请参考 [生成式人工智能使用方针](./ai-policy)

如果你需要新增测试，可以在 `PCL.Core.Test` 中查找类似测试作为参考。

## 十、提交前检查

提交前建议至少检查以下内容：

1. 项目能否正常构建。
2. 修改过的功能是否能基本运行。
3. 是否存在与本次修改无关的文件变更。
4. 是否误提交了临时文件、构建产物或本地配置。
5. 所有提交是否都带有已验证签名。
6. 涉及核心库的修改是否已运行测试项目。

可以使用以下命令查看当前变更：

```bash
git status
git diff
```

如果使用 IDE 或图形化 Git 工具，也应在提交前逐个文件检查 diff。

## 十一、提交和推送

具体提交和推送代码的方式因 Git 工具不同而有所差异，可以使用命令行、Rider、Visual Studio、GitHub Desktop 或其他 Git 客户端。

如果你没有配置自动签名，提交时需要添加 `-S` 参数：

```bash
git commit -S -m "fix(scope): 修复某功能异常"
```

如果已经配置了自动签名，可以正常提交：

```bash
git commit -m "fix(scope): 修复某功能异常"
```

提交信息格式请参考 [技术规范](./guidelines) 中的提交信息规范。

::: tip 分支建议
建议在新分支中提交修改，不要直接在默认的 `dev` 分支上开发。

例如：

```bash
git checkout -b fix/some-problem
```

这样可以减少同步上游和发起 PR 时的冲突。
:::

提交完成后，将分支推送到 GitHub：

```bash
git push origin fix/some-problem
```

## 十二、发起 Pull Request

将提交推送到远程仓库后，打开 [Pull Requests](https://github.com/PCL-Community/PCL-CE/pulls)，点击 **New pull request** 创建 PR。

目标分支通常选择 `dev`，来源分支选择包含本次修改的分支。PR 标题应符合项目的提交信息规范，且 PR 中的所有提交都必须经过签名。

创建 PR 时，GitHub 会自动加载仓库的 [PR 模板](https://github.com/PCL-Community/PCL-CE/blob/dev/.github/PULL_REQUEST_TEMPLATE.md)。请根据实际修改填写各栏目：

| 模板栏目    | 填写说明                                                                                                                                                                   |
|-------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 变更说明    | 概述本次修改的目的、实现方式及影响范围。                                                                                                                                   |
| 关联        | 使用 `Closes #1234` 等关闭关键词关联相关 Issue。没有关联的 Issue 时可留空。                                                                                                |
| 验证方式    | 列出已执行的构建、测试或手动验证，并说明覆盖的场景。例如 `dotnet build`、`dotnet test PCL.Core.Test/PCL.Core.Test.csproj -c CI -p:Platform=AnyCPU`，或具体的手动验证步骤。 |
| AI 使用情况 | 如实填写 AI 使用情况。未使用 AI 时填写“未使用”；使用 AI 时，须在 PR 标题末尾注明所用模型的标识。                                                                         |
| 提交前检查  | 确认各项要求均已满足后，再逐项勾选。                                                                                                                                       |

PR 描述应由提交者根据实际修改撰写，并确保内容准确。不要直接粘贴未经核实的 AI 生成内容。

::: warning 同步上游更改
在 PR 合并前，如需将上游更改同步到当前分支，请使用普通 merge，不要使用 rebase 或 squash merge，以保留原有提交历史和签名状态。
:::

如需社区开发者协助审查，可以向 `PCL-Community/CE-Dev` 请求 Review。

## 十三、等待审核并修改

提交 PR 后，需要等待社区开发者，也就是 `PCL-Community/CE-Dev Team` 审核。

审核过程中，维护者可能会提出修改建议。请根据建议继续在同一分支中提交修改，PR 会自动更新。

::: warning 关于 Resolve 按钮
解决审核意见后，请不要随意点击 Resolve 按钮，除非你非常确信该问题已经完全解决。

过早 Resolve 可能会影响维护者后续审核。若有解释、疑问或补充说明，请直接在对应评论下回复。
:::

PR 通过审核并满足合并条件后，维护者会将其合并到目标分支。

感谢你为 PCL CE 做出的贡献！
