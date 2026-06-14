---
order: 4
---

# GPG 签名配置指南

GPG（GNU Privacy Guard）可以为 Git 提交添加数字签名。将 GPG 公钥添加到 GitHub 后，GitHub 就可以验证提交是否确实来自对应账户。验证通过的提交会显示 **Verified** 徽章。

本文将带你从安装 GPG 开始，完成密钥生成、GitHub 配置、Git 签名设置，并提交一次带签名的 commit 进行验证。

开始前，请先确保已经安装 Git。

## 一、安装 GPG 工具

不同系统安装 GPG 的方式不同。安装完成后，可以通过 `gpg --version` 检查是否安装成功。

### Windows

访问 [GnuPG 下载页面](https://gnupg.org/download/index.html)，在 `GnuPG binary releases` 栏中选择 Windows 版本下载。

你可以选择：

* **Gpg4win**：功能完整，包含图形化工具；
* **GnuPG**：更轻量，只包含基础命令行工具。

如果你不确定该选哪个，建议安装 Gpg4win。

### macOS

推荐使用 [Homebrew](https://brew.sh/) 安装：

```bash
brew install gnupg
```

安装完成后检查版本：

```bash
gpg --version
```

### Linux

Debian / Ubuntu 通常已经预装 GPG。可以先运行：

```bash
gpg --version
```

如果提示未找到命令，再执行：

```bash
sudo apt-get update
sudo apt-get install gnupg
```

## 二、生成 GPG 密钥对

安装完成后，打开终端。

Windows 用户可以使用 Git Bash、PowerShell 或 Windows Terminal；macOS 和 Linux 用户可以使用系统自带终端。

运行以下命令开始生成密钥：

```bash
gpg --full-generate-key
```

接下来 GPG 会询问你一系列问题。可以按照下面的建议填写。

### 1. 选择密钥类型

当出现密钥类型选择时，输入：

```text
10
```

表示选择：

```text
(10) ECC (set your own capabilities)
```

然后回车。

### 2. 选择密钥用途

密钥用途保持默认即可。

默认通常包含：

```text
S
E
```

其中：

* `S` 表示可以用于签名；
* `E` 表示可以用于加密。

直接回车继续。

### 3. 选择椭圆曲线

当询问椭圆曲线时，输入：

```text
1
```

表示选择：

```text
(1) Curve 25519
```

然后回车。

Curve 25519 是目前常用的现代椭圆曲线，安全性和性能都比较适合作为日常 Git 提交签名使用。

### 4. 设置有效期

建议输入：

```text
1y
```

表示密钥有效期为 1 年。

也可以直接回车选择永不过期，但不推荐。设置有效期可以降低密钥长期泄露带来的风险。

确认有效期后，输入：

```text
y
```

然后回车。

## 三、填写身份信息

接下来需要填写密钥对应的身份信息。

### Real name

填写你的姓名、昵称或常用开发者名称。

例如：

```text
Wang Xiaoming
```

### Email address

这里必须填写 GitHub 已验证的邮箱地址。

该邮箱需要同时满足以下条件：

* 已添加到 GitHub 账户；
* 已在 GitHub 完成验证；
* 与本地 Git 的 `user.email` 保持一致。

可以用下面的命令查看当前 Git 邮箱：

```bash
git config --global user.email
```

如果需要修改，可以执行：

```bash
git config --global user.email "your_email@example.com"
```

### Comment

Comment 是可选项，可以直接回车跳过。

确认信息无误后，输入：

```text
O
```

然后回车。

## 四、设置私钥密码

GPG 会要求你为私钥设置 Passphrase，也就是私钥密码。

建议设置一个足够安全、但自己能够记住的密码。

之后每次进行签名提交时，系统可能会要求输入这个密码。`gpg-agent` 会在一段时间内缓存密码，因此短时间内连续提交通常不需要重复输入。

## 五、查看 Key ID

密钥生成完成后，运行以下命令查看本机已有的私钥：

```bash
gpg --list-secret-keys --keyid-format=long
```

你会看到类似输出：

```text
sec   ed25519/3AA5C34371567BD2 2025-08-28 [SC] [expires: 2026-08-28]
      B2A8C24C270A9448C01B34253AA5C34371567BD2
uid                 [ultimate] Wang Xiaoming <your_email@example.com>
```

其中，`sec` 行中斜杠 `/` 后面的内容就是 Key ID：

```text
3AA5C34371567BD2
```

后续命令中的 `YOUR_KEY_ID` 都需要替换成这个值。

## 六、将 GPG 公钥添加到 GitHub

本地生成密钥后，还需要把公钥添加到 GitHub。GitHub 只有拿到你的公钥，才能验证你提交中的签名。

先导出公钥：

```bash
gpg --armor --export YOUR_KEY_ID
```

请将 `YOUR_KEY_ID` 替换为上一节中查看到的 Key ID。

命令执行后，会输出一段以如下内容开头和结尾的文本：

```text
-----BEGIN PGP PUBLIC KEY BLOCK-----
...
-----END PGP PUBLIC KEY BLOCK-----
```

完整复制这一整段内容。

然后打开 GitHub：

1. 进入 **Settings**。
2. 打开 **SSH and GPG keys**。
3. 点击 **New GPG key**。
4. 将刚才复制的公钥粘贴到 **Key** 文本框中。
5. 点击 **Add GPG key**。

添加完成后，GitHub 就可以识别使用该私钥签名的 Git 提交。

## 七、配置 Git 使用 GPG 签名

接下来需要告诉 Git 使用哪一个 GPG 密钥进行签名。

执行：

```bash
git config --global user.signingkey YOUR_KEY_ID
```

同样需要将 `YOUR_KEY_ID` 替换为实际 Key ID。

然后启用自动签名：

```bash
git config --global commit.gpgsign true
```

启用后，每次执行 `git commit` 时，Git 都会自动为提交添加 GPG 签名，不需要再手动添加 `-S` 参数。

如果只想对某一次提交签名，也可以不启用全局自动签名，而是在提交时手动使用：

```bash
git commit -S -m "feat: signed commit"
```

## 八、提交一次签名 commit

进入任意 Git 仓库，修改或新建一个文件。

然后执行：

```bash
git add .
git commit -m "feat: first signed commit"
```

提交时，系统可能会弹出 GPG 密码输入窗口，或在终端中要求你输入 Passphrase。

输入正确后，commit 会被成功创建。

接着推送到 GitHub：

```bash
git push
```

打开 GitHub 仓库的提交记录。如果配置正确，刚才的提交旁边会显示 **Verified** 徽章。

## 九、检查当前配置

如果提交没有显示 **Verified**，可以先检查 Git 当前配置。

查看签名密钥：

```bash
git config --global user.signingkey
```

查看是否启用自动签名：

```bash
git config --global commit.gpgsign
```

查看 Git 邮箱：

```bash
git config --global user.email
```

查看 GPG 私钥：

```bash
gpg --list-secret-keys --keyid-format=long
```

确认以下几项是否一致：

* GPG Key 中的邮箱；
* Git 的 `user.email`；
* GitHub 账户中已验证的邮箱；
* GitHub 中添加的 GPG 公钥。

## 十、常见问题

### `gpg failed to sign the data`

这个错误通常表示 Git 调用 GPG 签名失败。

可以先检查是否能正常列出私钥：

```bash
gpg --list-secret-keys --keyid-format=long
```

如果能看到密钥，再检查 Git 是否配置了正确的 Key ID：

```bash
git config --global user.signingkey
```

如果 Key ID 不正确，重新设置：

```bash
git config --global user.signingkey YOUR_KEY_ID
```

### `Inappropriate ioctl for device`

这个错误通常是因为 GPG 没有正确识别当前终端。

在 shell 配置文件中添加：

```bash
export GPG_TTY=$(tty)
```

常见配置文件包括：

* Bash：`~/.bashrc`
* Zsh：`~/.zshrc`

添加后重启终端，或执行：

```bash
source ~/.bashrc
```

如果你使用的是 Zsh，则执行：

```bash
source ~/.zshrc
```

### `gpg: command not found`

这个错误表示系统找不到 GPG 命令。

请先确认 GPG 是否已经安装。如果已经安装，但 Git 仍然找不到 GPG，可以手动指定 GPG 程序路径。

Windows 常见路径：

```bash
git config --global gpg.program "C:\Program Files (x86)\GnuPG\bin\gpg.exe"
```

macOS Homebrew 常见路径：

```bash
git config --global gpg.program /opt/homebrew/bin/gpg
```

如果是 Intel Mac，也可能是：

```bash
git config --global gpg.program /usr/local/bin/gpg
```

Linux 常见路径：

```bash
git config --global gpg.program /usr/bin/gpg
```

如果不确定实际路径，可以使用以下命令查找。

Windows：

```bash
where gpg
```

macOS / Linux：

```bash
which gpg
```

然后将查到的路径填入 `gpg.program`。

### 提交显示 `Unverified`

提交显示 `Unverified` 通常是身份信息没有匹配成功。

请检查以下内容：

1. 生成 GPG Key 时填写的邮箱是否正确。
2. `git config user.email` 是否与 GPG Key 邮箱一致。
3. 该邮箱是否已经添加到 GitHub。
4. 该邮箱是否已经在 GitHub 完成验证。
5. GitHub 中添加的是否是当前 Key ID 对应的公钥。
6. 提交是否确实使用 GPG 签名。

可以查看某个提交是否带有签名：

```bash
git log --show-signature -1
```

如果没有签名信息，说明提交时没有成功签名。请重新检查自动签名配置，或使用 `-S` 手动提交一次测试。

## 十一、后续维护建议

GPG 私钥应妥善保存，不要发送给他人，也不要上传到公开仓库。

如果你更换电脑，需要将私钥迁移到新设备，或在新设备上重新生成一对密钥，并将新的公钥添加到 GitHub。

如果密钥泄露、设备丢失，或你不再使用某个密钥，应及时在 GitHub 中删除对应 GPG Key，并重新生成新的密钥。
