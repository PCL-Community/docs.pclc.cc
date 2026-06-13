# 提交帮助 - Intellij Idea

> **作者**: Ian-Rin、iammcjack6、龙腾猫跃、XiaoFans

IntelliJ IDEA 是主流的 Java 集成开发环境，适用于商业和开源开发。你可以通过点击下面的按钮来进行下载或访问其官方网站。由 JetBrains 开发的其他 IDE 或任何基于 InteillJ IDEA 的 IDE (如 Android Studio)同样适用于该教程。

[下载 IntelliJ IDEA](https://www.jetbrains.com/zh-cn/idea/download/?section=windows)

[访问 IntelliJ IDEA 官网](https://www.jetbrains.com/zh-cn/idea/)

如果要在 IntelliJ IDEA 中使用 Git 工具，你需要按照以下步骤进行相关设置：

1. 安装 Git Integration 插件。首先打开 IntelliJ IDEA，然后依次点击 "File" → "Settings" → "Plugins" ，在出现的搜索框内输入 "Git Integration" ，找到插件并进行安装。

2. 生成 SSH 公钥和私钥。打开 "Terminal"，并输入 "ssh-keygen -t rsa -C <你的邮箱>" 以生成 SSH 公钥和私钥，然后打开生成的 id_rsa.pub 文件，并复制文件中的内容。

3. 将 SSH 公钥添加到 GitHub。点击下面的 "访问设置" 按钮，然后在 GitHub 设置页面点击 "SSH and GPG keys"，接着点击 "New SSH Key"，最后在 "Key" 区域粘贴步骤2中复制的 SSH 公钥，并为其添加标题。

4. 在 "Terminal" 中设置 Git 用户信息，需确保 Git 邮箱和 SSH 公钥使用的是相同的邮箱。如果只对当前库设置用户信息，"--global" 参数可以省略。

[访问 GitHub 设置](https://github.com/settings/keys)

`设置 Git 用户名` (复制)

`设置 Git 邮箱` (复制)

1. 克隆仓库到本地。打开 "Terminal"，输入 git clone https://github.com/PCL-Community/PCL2CEHelp.git ，此操作会在本地创建一个名为 "PCL2Help" 的文件夹，并将代码仓库的内容下载到这个文件夹。

2. 使用 IntelliJ IDEA 进行编写。首先，在 "Terminal" 中输入 "cd PCL2Help" 切换到代码仓库目录，然后打开 IntelliJ IDEA，选择 "打开已有的项目"，选择刚刚下载的 "PCL2Help" 文件夹，编写代码并保存更改。

3. 将更改提交到 GitHub。在 "Terminal" 中，运行以下三个命令，将新更改添加到暂存区，然后提交并推送到远程仓库。

在 GitHub 源代码仓库页面创建新的 Pull Request。点击下方的 "新建 Pull Request" 按钮，填写标题和描述，然后提交。在创建 Pull Request 之前，请确保你的分支与源仓库是同步的。

若需同步源仓库和你的分支，打开你的 Fork 仓库页面，点击 "Fetch upstream"，然后点击 "Fetch and merge"。

`git add .` (复制)

`git commit -m &lt;提交信息&gt; ` (复制)

`git push` (复制)

[新建合并请求](https://github.com/PCL-Community/PCL2CEHelp/compare)
