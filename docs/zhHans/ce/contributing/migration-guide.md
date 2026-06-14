# 迁移指南

## 文件映射表

| 原文件 (`.temp/Xaml/`) | 新文件 (`docs/zhHans/ce/`) |
|----------------------|---------------------------|
| `Minecraft/安装 Mod.xaml` | `gameplay/install-mod.md` |
| `Minecraft/整合包安装.xaml` | `gameplay/install-modpack.md` |
| `Minecraft/资源包安装.xaml` | `gameplay/install-resourcepack.md` |
| `Minecraft/安装光影.xaml` | `gameplay/install-shader.md` |
| `Minecraft/安装世界.xaml` | `gameplay/install-saves.md` |
| `Minecraft/数据包安装.xaml` | `gameplay/install-datapack.md` |
| `Minecraft/更新 Mod.xaml` | `gameplay/update-mod.md` |
| `Minecraft/加入服务器.xaml` | `new-user/join-server.md` |
| `Minecraft/联机.xaml` | `advanced/multiplayer.md` |
| `Minecraft/存档损坏.xaml` | `troubleshooting/saves-corruption.md` |
| `Minecraft/导出整合包.xaml` | `advanced/export-modpack.md` |
| `启动器/LittleSkin 外置登录使用教程.xaml` | `new-user/littleskin-login.md` |
| `启动器/指定登录方式.xaml` | `new-user/set-login-method.md` |
| `启动器/备份设置.xaml` | `advanced/backup-settings.md` |
| `启动器/角色皮肤导出.xaml` | `advanced/export-skin.md` |
| `启动器/Microsoft Defender 添加排除项.xaml` | `advanced/microsoft-defender-exclusions.md` |
| `启动器/P2P 联机常见问题.xaml` | `troubleshooting/multiplayer-faq.md` |
| `个性化/XAML 格式.xaml` | `customization/xaml-format.md` |
| `个性化/替换标记.xaml` | `customization/replacement-tags.md` |
| `个性化/自定义帮助.xaml` | `customization/custom-help.md` |
| `个性化/自定义帮助 - JSON 格式.xaml` | `customization/custom-help-json.md` |
| `帮助/提交帮助.xaml` | `contributing/submit-help.md` |
| `帮助/提交帮助 - 编写规范.xaml` | `contributing/writing-guidelines.md` |
| `帮助/提交帮助 - VSCode.xaml` | `contributing/vscode-workflow.md` |
| `帮助/提交帮助 - Intellij Idea.xaml` | `contributing/intellij-idea-workflow.md` |
| `帮助/提交帮助 - GitHub Desktop.xaml` | `contributing/github-desktop-workflow.md` |
| `指南/资源安装指南.xaml` | `advanced/resource-installation-guide.md` |

## 新文档格式

```markdown
---
order: 1
---

# 页面标题

> **作者**: 作者名

正文内容...

> **提示**: 提示内容

![图片描述](/contents/xxx.png)
```

## XAML → Markdown 对照

| XAML | Markdown |
|-----|----------|
| `<local:MyCard Title="标题">` | `## 标题` |
| `<TextBlock Text="内容" />` | 普通段落 |
| `<local:MyHint Text="提示" />` | `> **提示**: 提示` |
| `<local:MyImage Source="url" />` | `![描述](url)` |
| `<local:MyButton Text="按钮" ... />` | `[按钮](url)` |

## 待迁移

- `Minecraft/购买正版.xaml`
- `启动器/手动选择 Java 路径.xaml`
- `个性化/自定义事件.xaml`
- `指南/整合包制作.xaml`
