# 提交帮助 - VSCode

> **作者**: Not_Killer_233、龙腾猫跃、XiaoFans、林小槐、WTP016、Dong_Yi_feng、huangminzhe、wuyuncheng-26

Visual Studio Code，简称 VSCode，是一款由微软开发的开源跨平台编辑器。你可以通过下面的按钮获取 VSCode 的 Windows 版本。

VSCode 安装后默认的语言为英语。你可以通过点击以下按钮查看 VSCode 设置语言为中文的方法。以下内容均使用 VSCode 中文语言包内译文书写。

[点击下载 VSCode](https://code.visualstudio.com/docs/?dv=win)

[访问官网](https://code.visualstudio.com)

[查看教程](https://blog.csdn.net/sinat_34104446/article/details/83033510)

1. 即使你使用 VSCode，依旧需要安装 Git 工具。点击左侧的第三个按钮 "源代码管理"，按照 VSCode 的引导完成 Git 安装。

2. 在左下角管理 → 设置或按下键盘上的 Ctrl 键 + , 键，在搜索框中输入 "git.path"，点击 "在 settings.json 中" 并设置 git.exe 路径（<Git 安装路径>\bin\git.exe），然后保存（Ctrl + S）

3. 在主界面按下 "F1" 键打开指令输入框，输入 "git clone" 并回车。

4. 打开 GitHub Fork 仓库，点击右上角 Code 后复制仓库的 Git 链接，在 VSCode 主界面按下 F1（对于部分笔记本应按 Fn + F1）打开指令输入框，输入"Git Clone"并回车。

5. 点击下方按钮，进入 PCL 文件夹，创建名称为 Help 的文件夹。

完成上述后，将第二步 clone 下仓库内 PCL2Help 文件夹剪切到 PCL 目录下并重命名文件夹 PCL2Help 为 Help 。

最后，点击左边栏 → 源代码管理 → 打开文件夹，选择 Help 文件夹即可。

在获取帮助库后，你就可以按照正常自定义帮助的方式对帮助库进行修改了。修改完成后，点击左侧的第三个按钮 "源代码管理" 或按下键盘上的 Ctrl 键 + Shift 键 + G 键，在上方输入你的修改内容，然后点击 "提交" 旁边的小三角，再点击 "提交和推送" ，你的更新就被推送到你的 Fork 仓库了。

在 Pull Request 前，你需要同步原仓库内的内容以保证你的仓库保持最新。打开你的 Fork 仓库主页，找到 "Sync fork" 按钮并点击，再点击 "Update branch"，你的仓库就同步了原仓库。经过了这些步骤之后，你就可以提交你的 Pull Request 了。

`在 settings.json 中写入此文本` (复制)

[打开文件夹] (事件: 打开文件)

![图片](/contents/011fbf49c33bafad055fb9b09ded59e4565437509.png)

![图片](/contents/065039878df4c60d12e46f686c09c8be565437509.png)

![图片](/contents/93b862d660e3bc984b69b5c539f899e8565437509.png)

![图片](/contents/3c0b5a42ba7a3d1dcabba91c6d9b5c5f565437509.png)

![图片](/contents/5ee850721deea6f7c5bcc887b7582a52558830935.png)
