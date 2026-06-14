---
order: 4
---

# GPG 签名配置指南

GPG (GNU Privacy Guard) 可为 Git 提交提供数字签名，GitHub 据此验证提交者身份，验证通过后显示 **Verified** 徽章。

准备工作：确保已安装 Git。

---

## 配置步骤

1.  安装 GPG 工具 (GnuPG)
2.  生成 GPG 密钥对
3.  将 GPG 公钥添加到 GitHub
4.  配置 Git 使用 GPG 签名
5.  验证签名提交

---

## 第 1 步：安装 GPG 工具 (GnuPG)

- **Windows：** 访问[GnuPG 官网](https://gnupg.org/download/index.html)下载页面在 `GnuPG binary releases` 栏中选择 Windows 版本下载，可会选择全功能的 Gpg4win 或者简单的 GnuPG。
- **macOS：** 使用 [Homebrew](https://brew.sh/) 安装：

  ```bash
  brew install gnupg
  ```

- **Linux (Debian/Ubuntu)：** 通常预装，运行 `gpg --version` 检查。未安装则执行：

  ```bash
  sudo apt-get update
  sudo apt-get install gnupg
  ```

---

## 第 2 步：生成 GPG 密钥对

1. 打开终端 (Git Bash / Terminal)，运行：

   ```bash
   gpg --full-generate-key
   ```

2. 按提示依次回答：

   - **密钥类型：** 输入 `10` 选择 `(10) ECC (set your own capabilities)` 后回车。
   - **密钥用途：** 直接回车，保持默认的 `S` (Sign) 和 `E` (Encrypt) 即可。
   - **椭圆曲线：** 输入 `1` 选择 `(1) Curve 25519` 后回车。这是目前推荐的现代曲线，性能与安全性优于 RSA。
   - **有效期：** 建议输入 `1y`（1年）后回车；直接回车选择永不过期（不推荐）。
   - **确认：** 输入 `y` 后回车。

3. 输入个人信息：

   - **Real name：** 姓名或昵称。
   - **Email address：** **必须与 GitHub 已验证邮箱一致**，否则无法匹配签名。
   - **Comment：** 可选，直接回车跳过。

   确认无误后输入 `O` (Okay) 回车。

4. 设置私钥密码 (Passphrase)，输入两次确认。此后每次签名提交均需输入此密码。

5. 查看 Key ID：

   ```bash
   gpg --list-secret-keys --keyid-format=long
   ```

   输出示例：

   ```
   sec   ed25519/3AA5C34371567BD2 2025-08-28 [SC] [expires: 2026-08-28]
         B2A8C24C270A9448C01B34253AA5C34371567BD2
   uid                 [ultimate] Wang Xiaoming <your_email@example.com>
   ```

   `sec` 行斜杠 `/` 后的 `3AA5C34371567BD2` 即为 Key ID。

---

## 第 3 步：将 GPG 公钥添加到 GitHub

1. 导出公钥（将 `YOUR_KEY_ID` 替换为实际 Key ID）：

   ```bash
   gpg --armor --export YOUR_KEY_ID
   ```

2. 复制输出的完整文本块（`-----BEGIN PGP PUBLIC KEY BLOCK-----` 至 `-----END PGP PUBLIC KEY BLOCK-----`）。

3. 登录 GitHub，进入 **Settings** > **SSH and GPG keys**，点击 **New GPG key**。

4. 将公钥粘贴至 "Key" 文本框，点击 **Add GPG key**。

---

## 第 4 步：配置 Git 使用 GPG 签名

1. 指定签名密钥：

   ```bash
   git config --global user.signingkey YOUR_KEY_ID
   ```

2. 启用自动签名：

   ```bash
   git config --global commit.gpgsign true
   ```

   此后每次 `git commit` 自动签名，无需手动添加 `-S` 参数。

---

## 第 5 步：验证签名提交

1. 进入本地 Git 仓库，修改或新建文件后执行提交流程：

   ```bash
   git add .
   git commit -m "feat: first signed commit"
   ```

2. 按提示输入 GPG 密码。`gpg-agent` 会缓存密码一段时间，短时间内多次提交可能无需重复输入。

3. 推送至 GitHub：

   ```bash
   git push
   ```

4. 在 GitHub 仓库的提交记录中，签名通过的提交旁会显示 **Verified** 徽章。

---

## 常见问题

### `gpg failed to sign the data` 或 `Inappropriate ioctl for device`

GPG 未正确识别终端。在 shell 配置文件（`.bashrc`、`.zshrc` 等）中添加：

```bash
export GPG_TTY=$(tty)
```

重启终端后生效。

### Git 提示 `gpg: command not found` 或找不到签名程序

Git 未能定位到 GPG 可执行文件，需手动指定路径。使用 `git config --global gpg.program` 配置 GPG 程序的完整路径：

```bash
# Windows (Gpg4win 默认路径)
git config --global gpg.program "C:\Program Files (x86)\GnuPG\bin\gpg.exe"

# macOS (Homebrew)
git config --global gpg.program /usr/local/bin/gpg

# Linux
git config --global gpg.program /usr/bin/gpg
```

也可用 `where gpg`（Windows）或 `which gpg`（macOS/Linux）查找实际路径后填入。

### 提交显示 "Unverified"

- **邮箱不一致：** 生成 GPG Key 所用邮箱、`git config user.email`、GitHub 绑定邮箱三者必须完全一致，且该邮箱须在 GitHub 完成验证。
- **公钥错误：** 重新执行第 3 步，确认导出和添加的是正确的公钥。
