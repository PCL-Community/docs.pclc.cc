---
order: 4
---

# GPG Signing Configuration Guide

GPG (GNU Privacy Guard) can add digital signatures to Git commits. After you add your GPG public key to GitHub, GitHub can verify whether commits are indeed from the corresponding account. Commits that pass verification will display the **Verified** badge.

This article will guide you through installing GPG, generating a key, configuring GitHub, setting up Git commit signing, and creating a signed commit for verification.

Before you begin, please make sure Git is already installed.

## 1. Install GPG Tools

The way to install GPG differs by operating system. After installation, you can run `gpg --version` to check whether it was installed successfully.

### Windows

Visit the [GnuPG download page](https://gnupg.org/download/index.html), and select the Windows version in the `GnuPG binary releases` section to download it.

You can choose:

* **Gpg4win**: A complete package that includes graphical tools;
* **GnuPG**: A lighter package that only includes basic command-line tools.

If you are not sure which one to choose, Gpg4win is recommended.

### macOS

It is recommended to install GPG using [Homebrew](https://brew.sh/):

```bash
brew install gnupg
```

After installation, check the version:

```bash
gpg --version
```

### Linux

GPG is usually preinstalled on Debian / Ubuntu. You can first run:

```bash
gpg --version
```

If the command is not found, run:

```bash
sudo apt-get update
sudo apt-get install gnupg
```

## 2. Generate a GPG Key Pair

After installation, open a terminal.

Windows users can use Git Bash, PowerShell, or Windows Terminal. macOS and Linux users can use the system terminal.

Run the following command to start generating a key:

```bash
gpg --full-generate-key
```

GPG will then ask you a series of questions. You can follow the suggestions below.

### 1. Select the Key Type

When the key type selection appears, enter:

```text
10
```

This means selecting:

```text
(10) ECC (set your own capabilities)
```

Then press Enter.

### 2. Select Key Capabilities

Keep the default key capabilities.

The default usually includes:

```text
S
E
```

Where:

* `S` means the key can be used for signing;
* `E` means the key can be used for encryption.

Press Enter directly to continue.

### 3. Select the Elliptic Curve

When asked to select an elliptic curve, enter:

```text
1
```

This means selecting:

```text
(1) Curve 25519
```

Then press Enter.

Curve 25519 is a commonly used modern elliptic curve. Its security and performance make it suitable for everyday Git commit signing.

### 4. Set the Expiration Date

It is recommended to enter:

```text
1y
```

This means the key will be valid for 1 year.

You can also press Enter directly to make the key never expire, but this is not recommended. Setting an expiration date can reduce the risks caused by long-term key leakage.

After confirming the expiration date, enter:

```text
y
```

Then press Enter.

## 3. Enter Identity Information

Next, you need to enter the identity information associated with the key.

### Real name

Enter your name, nickname, or commonly used developer name.

For example:

```text
Wang Xiaoming
```

### Email address

You must enter an email address that has been verified on GitHub.

This email address must meet all of the following conditions:

* It has been added to your GitHub account;
* It has been verified on GitHub;
* It matches the local Git `user.email`.

You can view your current Git email with the following command:

```bash
git config --global user.email
```

If you need to change it, run:

```bash
git config --global user.email "your_email@example.com"
```

### Comment

Comment is optional. You can press Enter directly to skip it.

After confirming that the information is correct, enter:

```text
O
```

Then press Enter.

## 4. Set the Private Key Passphrase

GPG will ask you to set a Passphrase for the private key, meaning the private key password.

It is recommended to set a password that is secure enough, but still memorable to you.

Later, every time you create a signed commit, the system may ask you to enter this password. `gpg-agent` will cache the password for a period of time, so repeated commits within a short time usually do not require entering it again.

## 5. View the Key ID

After the key is generated, run the following command to view the existing private keys on your machine:

```bash
gpg --list-secret-keys --keyid-format=long
```

You will see output similar to this:

```text
sec   ed25519/3AA5C34371567BD2 2025-08-28 [SC] [expires: 2026-08-28]
      B2A8C24C270A9448C01B34253AA5C34371567BD2
uid                 [ultimate] Wang Xiaoming <your_email@example.com>
```

In the `sec` line, the content after the slash `/` is the Key ID:

```text
3AA5C34371567BD2
```

In subsequent commands, `YOUR_KEY_ID` needs to be replaced with this value.

## 6. Add the GPG Public Key to GitHub

After generating the key locally, you also need to add the public key to GitHub. GitHub can verify the signatures in your commits only after it has your public key.

First, export the public key:

```bash
gpg --armor --export YOUR_KEY_ID
```

Replace `YOUR_KEY_ID` with the Key ID found in the previous section.

After the command runs, it will output a block of text that starts and ends like this:

```text
-----BEGIN PGP PUBLIC KEY BLOCK-----
...
-----END PGP PUBLIC KEY BLOCK-----
```

Copy this entire block of text.

Then open GitHub:

1. Go to **Settings**.
2. Open **SSH and GPG keys**.
3. Click **New GPG key**.
4. Paste the public key you just copied into the **Key** text box.
5. Click **Add GPG key**.

After it is added, GitHub can recognize Git commits signed with the corresponding private key.

## 7. Configure Git to Use GPG Signing

Next, you need to tell Git which GPG key to use for signing.

Run:

```bash
git config --global user.signingkey YOUR_KEY_ID
```

Again, replace `YOUR_KEY_ID` with the actual Key ID.

Then enable automatic signing:

```bash
git config --global commit.gpgsign true
```

After this is enabled, Git will automatically add a GPG signature every time you run `git commit`, so you do not need to manually add the `-S` parameter.

If you only want to sign a single commit, you can leave global automatic signing disabled and manually use the following command when committing:

```bash
git commit -S -m "feat: signed commit"
```

## 8. Create a Signed Commit

Enter any Git repository, then modify or create a file.

Then run:

```bash
git add .
git commit -m "feat: first signed commit"
```

When committing, the system may open a GPG password input window, or ask you to enter the Passphrase in the terminal.

After you enter the correct password, the commit will be created successfully.

Then push it to GitHub:

```bash
git push
```

Open the commit history of the GitHub repository. If the configuration is correct, the commit you just created will display the **Verified** badge next to it.

## 9. Check the Current Configuration

If the commit does not display **Verified**, you can first check the current Git configuration.

View the signing key:

```bash
git config --global user.signingkey
```

Check whether automatic signing is enabled:

```bash
git config --global commit.gpgsign
```

View the Git email:

```bash
git config --global user.email
```

View GPG private keys:

```bash
gpg --list-secret-keys --keyid-format=long
```

Confirm whether the following items are consistent:

* The email in the GPG Key;
* Git’s `user.email`;
* The verified email address in your GitHub account;
* The GPG public key added to GitHub.

## 10. Common Issues

### `gpg failed to sign the data`

This error usually means that Git failed to call GPG for signing.

First, check whether private keys can be listed normally:

```bash
gpg --list-secret-keys --keyid-format=long
```

If you can see the key, then check whether Git is configured with the correct Key ID:

```bash
git config --global user.signingkey
```

If the Key ID is incorrect, set it again:

```bash
git config --global user.signingkey YOUR_KEY_ID
```

### `Inappropriate ioctl for device`

This error usually occurs because GPG did not correctly recognize the current terminal.

Add the following to your shell configuration file:

```bash
export GPG_TTY=$(tty)
```

Common configuration files include:

* Bash: `~/.bashrc`
* Zsh: `~/.zshrc`

After adding it, restart the terminal, or run:

```bash
source ~/.bashrc
```

If you are using Zsh, run:

```bash
source ~/.zshrc
```

### `gpg: command not found`

This error means the system cannot find the GPG command.

Please first confirm whether GPG has already been installed. If it has been installed but Git still cannot find GPG, you can manually specify the GPG program path.

Common Windows path:

```bash
git config --global gpg.program "C:\Program Files (x86)\GnuPG\bin\gpg.exe"
```

Common macOS Homebrew path:

```bash
git config --global gpg.program /opt/homebrew/bin/gpg
```

For Intel Macs, it may also be:

```bash
git config --global gpg.program /usr/local/bin/gpg
```

Common Linux path:

```bash
git config --global gpg.program /usr/bin/gpg
```

If you are not sure of the actual path, use the following command to find it.

Windows:

```bash
where gpg
```

macOS / Linux:

```bash
which gpg
```

Then fill the path you found into `gpg.program`.

### Commits Display `Unverified`

Commits displaying `Unverified` usually means that the identity information did not match successfully.

Please check the following:

1. Whether the email entered when generating the GPG Key is correct.
2. Whether `git config user.email` matches the email in the GPG Key.
3. Whether the email has been added to GitHub.
4. Whether the email has been verified on GitHub.
5. Whether the key added to GitHub is the public key corresponding to the current Key ID.
6. Whether the commit was actually signed with GPG.

You can check whether a commit includes a signature:

```bash
git log --show-signature -1
```

If no signature information is shown, the commit was not successfully signed when it was created. Please check the automatic signing configuration again, or use `-S` to manually create one signed test commit.

## 11. Ongoing Maintenance Recommendations

Your GPG private key should be stored properly. Do not send it to others, and do not upload it to public repositories.

If you change computers, you need to migrate the private key to the new device, or generate a new key pair on the new device and add the new public key to GitHub.

If the key is leaked, the device is lost, or you no longer use a key, you should promptly delete the corresponding GPG Key from GitHub and generate a new key.