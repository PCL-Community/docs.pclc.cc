# LittleSkin 外置登录使用教程

::: warning 🚧 文档尚未完善
本文档仍在持续完善中，部分内容可能不完整、未验证或暂未覆盖最新实现。

如果你有兴趣，欢迎提交 Pull Request 来完善本文档。
:::

LittleSkin 是一个第三方皮肤站，可用于在 PCL CE 中配置外置登录，并在支持第三方登录的联机环境中使用对应角色进入游戏。

::: danger 注意
LittleSkin 登录不能用于进入正版服务器。
:::

## 一、使用前须知

如果你想用于联机，加入者必须使用正版登录或第三方登录；房主本身没有特殊要求。

如果你想在多人游戏中展示自己的皮肤，请确保所有参与联机的成员都使用 LittleSkin 登录。

皮肤显示不正常时，也可以搭配 CustomSkinLoader 模组，并添加 ExtraList 文件，以达到相同效果。

## 二、准备工作

请先打开以下页面：

* [打开 LittleSkin](https://littleskin.cn)
* [获取配置文件（须登录 LittleSkin）](https://littleskin.cn/user/config)

::: tip 注意
注册 LittleSkin 账号时，不建议使用第三方登录。第三方登录可能导致账号无法设置密码，从而无法继续在 PCL CE 中登录。

下方需要填写的邮箱地址应全部使用英文小写字母。否则可能出现 UUID 为 `null` 的情况，导致无法进入服务器。
:::

## 三、注册 LittleSkin 账号并创建角色

1. 前往 LittleSkin 注册账号。

   ![LittleSkin 注册或登录页面](/contents/3ee81c368db7c1dd5ba75a3511f07a53565437509.jpg)

2. 登录后进入“仪表盘”。点击左侧的“角色管理”，然后点击“添加新角色”。

   ![LittleSkin 仪表盘页面](/contents/013fe81892559ee494dfc5b1d283d11b565437509.png)

3. 在弹出的窗口中输入角色名。该角色名会成为联机时显示的 ID，也就是游戏内用户名。

   填写完成后，点击“确定”。

   ![角色管理页面](/contents/3c2575356c7af53c14c8ab8386272962565437509.png)

## 四、在 PCL CE 中添加 LittleSkin 登录

1. 打开 PCL CE。点击“新建档案”按钮。

   ![添加角色示例](/contents/a29ba973a02174fa0a2df8c63a457ff066c98692.png)

2. 选择“第三方验证”，然后点击“确认”。

   ![新建档案入口](/contents/ea582f473ceebb22ca683a397767e230669e6d58.png)

4. 在第一栏填写 LittleSkin 外置登录认证服务器地址 `https://littleskin.cn/api/yggdrasil`。  
   在第二栏填写注册 LittleSkin 时使用的邮箱。  
   在第三栏填写 LittleSkin 账号密码。  
   点击“登录”。

   ![填写 LittleSkin 外置登录信息](/contents/5a941b35c2f67c1368dd91cc189d3bd9b87de664.png)

## 五、常见问题

### 1. 为什么无法进入正版服务器？

LittleSkin 属于第三方登录，不能用于进入正版服务器。若需要进入正版服务器，请使用正版账号登录。

### 2. 为什么 UUID 显示为 `null`？

请检查登录时填写的邮箱是否全部为英文小写字母。邮箱中存在大写字母时，可能导致 UUID 异常。

### 3. 为什么皮肤没有正常显示？

请确认所有参与联机的成员都使用 LittleSkin 登录。若仍无法显示，可以搭配 [CustomSkinLoader](https://modrinth.com/mod/customskinloader) 模组，并添加 ExtraList 文件。
