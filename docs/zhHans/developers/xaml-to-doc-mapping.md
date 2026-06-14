# XAML 到文档 URL 映射表

本文档记录了从 PCL 内置帮助库的 XAML/JSON 文件路径到 PCL CE 文档站点 URL 的映射关系。

## 映射规则说明

- **XAML 路径**: `.temp/Xaml` 目录下的相对路径（JSON 和 XAML 文件同名）
- **文档 URL**: 相对于 `docs/zhHans/ce` 的文档路径
- **状态**: 标记文档的迁移状态

## 完整映射表

### Minecraft 游戏帮助

| XAML 路径              | 文档 URL                                                                     | 标题                  | 状态        |
| ---------------------- | ---------------------------------------------------------------------------- | --------------------- | ----------- |
| `Minecraft/加入服务器` | [/ce/new-user/join-server](/ce/new-user/join-server)                         | 多人游戏常见问题      | ✅ 已映射   |
| `Minecraft/存档损坏`   | [/ce/troubleshooting/saves-corruption](/ce/troubleshooting/saves-corruption) | 存档损坏的解决方案    | ✅ 已映射   |
| `Minecraft/安装 Mod`   | [/ce/gameplay/install-mod](/ce/gameplay/install-mod)                         | 安装 Mod              | ✅ 已映射   |
| `Minecraft/安装世界`   | [/ce/gameplay/install-saves](/ce/gameplay/install-saves)                     | 安装存档              | ✅ 已映射   |
| `Minecraft/安装光影`   | [/ce/gameplay/install-shader](/ce/gameplay/install-shader)                   | 安装光影              | ✅ 已映射   |
| `Minecraft/导出整合包` | [/ce/advanced/export-modpack](/ce/advanced/export-modpack)                   | 导出整合包            | ✅ 已映射   |
| `Minecraft/数据包安装` | [/ce/gameplay/install-datapack](/ce/gameplay/install-datapack)               | 安装数据包            | ✅ 已映射   |
| `Minecraft/整合包安装` | [/ce/gameplay/install-modpack](/ce/gameplay/install-modpack)                 | 安装整合包            | ✅ 已映射   |
| `Minecraft/更新 Mod`   | [/ce/gameplay/update-mod](/ce/gameplay/update-mod)                           | 更新 Mod              | ✅ 已映射   |
| `Minecraft/联机`       | [/ce/advanced/multiplayer](/ce/advanced/multiplayer)                         | 使用 PCL 进行多人游戏 | ✅ 已映射   |
| `Minecraft/购买正版`   | _(外部链接)_                                                                 | 购买 Minecraft 正版   | 🔗 外部链接 |
| `Minecraft/资源包安装` | [/ce/gameplay/install-resourcepack](/ce/gameplay/install-resourcepack)       | 安装资源包            | ✅ 已映射   |

### 个性化设置

| XAML 路径           | 文档 URL                                                                 | 标题                       | 状态        |
| ------------------- | ------------------------------------------------------------------------ | -------------------------- | ----------- |
| `个性化/XAML 格式`  | [/ce/customization/xaml-format](/ce/customization/xaml-format)           | 自定义主页与帮助 XAML 格式 | ✅ 已映射   |
| `个性化/替换标记`   | [/ce/customization/replacement-tags](/ce/customization/replacement-tags) | 替换标记                   | ✅ 已映射   |
| `个性化/自定义事件` | _(外部 Wiki)_                                                            | 自定义事件列表             | 🔗 外部链接 |

### 启动器功能

| XAML 路径                              | 文档 URL                                                                                 | 标题                                 | 状态      |
| -------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------ | --------- |
| `启动器/LittleSkin 外置登录使用教程`   | [/ce/new-user/littleskin-login](/ce/new-user/littleskin-login)                           | 设置 LittleSkin 登录                 | ✅ 已映射 |
| `启动器/Microsoft Defender 添加排除项` | [/ce/advanced/microsoft-defender-exclusions](/ce/advanced/microsoft-defender-exclusions) | 将 PCL 添加到 Windows 安全中心白名单 | ✅ 已映射 |
| `启动器/P2P 联机常见问题`              | [/ce/troubleshooting/multiplayer-faq](/ce/troubleshooting/multiplayer-faq)               | P2P 联机常见问题                     | ✅ 已映射 |
| `启动器/备份设置`                      | [/ce/advanced/backup-settings](/ce/advanced/backup-settings)                             | 备份启动器设置                       | ✅ 已映射 |
| `启动器/手动选择 Java 路径`            | _(不存在)_                                                                               | 手动选择 Java                        | ❓ 未找到 |
| `启动器/指定登录方式`                  | [/ce/new-user/set-login-method](/ce/new-user/set-login-method)                           | 设置第三方登录、限制登录方式         | ✅ 已映射 |
| `启动器/角色皮肤导出`                  | [/ce/advanced/export-skin](/ce/advanced/export-skin)                                     | 导出角色皮肤                         | ✅ 已映射 |

### 帮助贡献

| XAML 路径                        | 文档 URL                                                                             | 标题                           | 状态      |
| -------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------ | --------- |
| `帮助/提交帮助 - GitHub Desktop` | [/ce/contributing/github-desktop-workflow](/ce/contributing/github-desktop-workflow) | 使用 GitHub Desktop 获取帮助库 | ✅ 已映射 |
| `帮助/提交帮助 - Intellij Idea`  | [/ce/contributing/intellij-idea-workflow](/ce/contributing/intellij-idea-workflow)   | 使用 IntelliJ IDEA 获取帮助库  | ✅ 已映射 |
| `帮助/提交帮助 - VSCode`         | [/ce/contributing/vscode-workflow](/ce/contributing/vscode-workflow)                 | 使用 VSCode 获取帮助库         | ✅ 已映射 |
| `帮助/提交帮助 - 编写规范`       | [/ce/contributing/writing-guidelines](/ce/contributing/writing-guidelines)           | PCL 帮助库编写规范             | ✅ 已映射 |
| `帮助/提交帮助`                  | [/ce/contributing/submit-help](/ce/contributing/submit-help)                         | 参与完善 PCL 帮助库            | ✅ 已映射 |
| `帮助/自定义帮助 - JSON 格式`    | [/ce/customization/custom-help-json](/ce/customization/custom-help-json)             | 帮助 JSON 格式                 | ✅ 已映射 |
| `帮助/自定义帮助`                | [/ce/customization/custom-help](/ce/customization/custom-help)                       | 自定义帮助页面                 | ✅ 已映射 |

### 指南

| XAML 路径           | 文档 URL                                                                             | 标题           | 状态      |
| ------------------- | ------------------------------------------------------------------------------------ | -------------- | --------- |
| `指南/整合包制作`   | _(内容整合中)_                                                                       | 整合包制作指南 | 📝 待整理 |
| `指南/资源安装指南` | [/ce/advanced/resource-installation-guide](/ce/advanced/resource-installation-guide) | 资源安装指南   | ✅ 已映射 |

### 百科链接

| XAML 路径              | 文档 URL                                         | 标题     | 状态      |
| ---------------------- | ------------------------------------------------ | -------- | --------- |
| `百科/MCMOD`           | [/ce/external-resources](/ce/external-resources) | MC 百科  | ✅ 已映射 |
| `百科/Minecraft Wiki`  | [/ce/external-resources](/ce/external-resources) | 原版百科 | ✅ 已映射 |
| `百科/Mineplugin Wiki` | [/ce/external-resources](/ce/external-resources) | 插件百科 | ✅ 已映射 |

## 特殊说明

### 状态图标说明

- ✅ **已映射**: 已完成迁移到文档站点的内容
- ⚠️ **未公开**: 原 XAML 中设置了 `ShowInPublic: false`，不在公开文档中显示
- 🔗 **外部链接**: 原 XAML 中设置了 `IsEvent: true`，点击后直接打开外部网页
- 📝 **待整理**: 内容尚未完全迁移或需要进一步整理
- ❓ **未找到**: 在文档站点中未找到对应内容

### 文档站点 URL 格式

完整 URL 格式为：`/zhHans/ce/{文档路径}`

例如：

- XAML: `Minecraft/加入服务器`
- 文档 URL: `/zhHans/ce/new-user/join-server`

### 目录结构对应关系

| XAML 目录    | 文档站点目录                                 | 说明                       |
| ------------ | -------------------------------------------- | -------------------------- |
| `Minecraft/` | `new-user/`, `gameplay/`, `troubleshooting/` | 游戏相关内容分散到多个目录 |
| `个性化/`    | `customization/`                             | 个性化设置                 |
| `启动器/`    | `new-user/`, `advanced/`, `troubleshooting/` | 启动器功能分散到多个目录   |
| `帮助/`      | `contributing/`, `customization/`            | 贡献指南和自定义帮助       |
| `指南/`      | `advanced/`                                  | 进阶指南                   |
| `百科/`      | `external-resources/`                        | 外部资源链接               |

---

_本文档由自动化分析生成，最后更新时间: 2026-06-14_

