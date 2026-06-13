# XAML 格式

> **作者**: 龙腾猫跃、XiaoFans、林小槐、TCJ

本篇简单介绍了在 PCL 中使用 XAML 进行自定义页面的相关语法。由于内容繁多，建议下载本篇代码参考学习。

[下载本篇的代码] (事件: 下载文件)

每个 local:MyCard 代表一张卡片，你可以添加、删除格式类似的 MyCard 来添加多个卡片。每个 TextBlock 代表一段文本，你可以在 Text 属性中书写任何你想写的内容，也可以自行添加更多的 TextBlock。

你可以通过添加、删除属性修改样式，例如上一行的 FontSize 就会将字号改为 11 号。

它还有许多可以调整的属性：上一行的 Margin 调整了边距，Foreground 则会让文字变色。

卡片（local:MyCard）的 Title 属性决定了它的标题。&#xA;为卡片添加 CanSwap 属性让它可以被折叠，True 代表是，False 代表否。在此基础上，再使用 IsSwapped 属性调整它是否默认被折叠。

> **提示**: local:MyHint 代表提示条。

> **提示**: 将提示条的 Theme 属性改为 Blue、Yellow 或 Red 即可修改配色。&#xA;使用左边的那堆字符可以在任意地方手动换行，如果需要使用等号、引号等特殊字符，可以自行百度 XAML 转义字符。

任意项目都可以添加 Width 与 Height 属性来控制宽高。HorizontalAlignment 属性可以控制对齐：Center 代表居中，Right 代表居右，例如这段文本就被居右了。

local:MyImage 代表图片，你需要在它的 Source 属性中填写一个网址或文件路径，它会从该处获取图片并显示。通常需要使用 Height 限制它的高度。

如果有多个网址。也可以通过设置 FallbackSource 属性来设置备用地址。&#xA;当从网址 1 获取图片失败后，会自动从网址 2 获取图片。

![图片](/contents/result.png)

添加 local:MyButton 即可新建一个按钮。你需要限定它的尺寸与位置，并通过 Padding 属性进一步控制它的内边距。

你可以修改 ColorType 属性来调整按钮配色：Highlight 代表当前主题色，Red 代表红色。ToolTip 属性还可以让你在鼠标悬浮在上面的时候显示提示文本。

local:MyTextButton 是没有边框的 "纯文本按钮"，其作用与 local:MyButton 一致。

按钮可以做到很多事，具体将在 "事件" 部分介绍。

将按钮的 EventType 属性设为 打开网页，然后在 EventData 属性中写入网址，即可通过点击按钮打开网页。

或者将 EventType 属性改为 弹出窗口，然后在 EventData 属性中写入弹窗的标题与内容……

local:MyTextButton 同样可以设置 EventType 与 EventData 让它具有特定功能。

自定义事件的详细用法请参考下方的页面。

[打开 Minecraft Wiki](https://zh.minecraft.wiki/)

[显示一个弹窗] (事件: 弹出窗口)

你可以让一个控件触发多个事件。下方的例子展示了连续触发多个事件搭配 {variable} 替换标记的效果。

![图片](/contents/result.png)

你需要使用 StackPanel 在一行里塞下多个按钮。你可以仅在这个教学卡片的基础上稍作调整，来实现自己的按钮布局。

[打开 B 站](https://www.bilibili.com/)

[进入 Hypixel] (事件: 启动游戏)

[打开记事本] (事件: 打开文件)

`复制召唤命令` (复制)

[下载百度的 Logo] (事件: 下载文件)

## 百度

你也可以使用列表项 "local:MyListItem" 来替代按钮，其使用方式与按钮类似。

Logo 属性为列表项的图标，指定的可以是链接也可以是文件路径；Title 是大标题，Info 是可选的小标题（详细信息）；Type 如果省略，该列表项则单纯只展示信息，仅当 Type 为 Clickable 才能触发点击效果。

EventType、EventData 与按钮几乎一致。唯一不同的是，列表项联网加载帮助文件时，必须手动设置 Title、Info、Type、Logo 属性。

## 清理垃圾

PCL 内置了一些 Minecraft 方块与物品图片，可以直接使用。

使用时，将上方对应行的 Source 复制到 MyListItem 的 Logo 属性处即可。

![图片](pack://application:,,,/images/Blocks/CommandBlock.png)

![图片](pack://application:,,,/images/Blocks/Cobblestone.png)

![图片](pack://application:,,,/images/Blocks/GoldBlock.png)

![图片](pack://application:,,,/images/Blocks/Grass.png)

![图片](pack://application:,,,/images/Blocks/GrassPath.png)

![图片](pack://application:,,,/images/Blocks/Anvil.png)

![图片](pack://application:,,,/images/Blocks/RedstoneBlock.png)

![图片](pack://application:,,,/images/Blocks/RedstoneLampOn.png)

![图片](pack://application:,,,/images/Blocks/RedstoneLampOff.png)

![图片](pack://application:,,,/images/Blocks/Egg.png)

![图片](pack://application:,,,/images/Blocks/Fabric.png)

![图片](pack://application:,,,/images/Blocks/NeoForge.png)

你可以用类似 {DynamicResource ColorBrush5} 的格式使用 PCL 当前的主题颜色，修改末尾的数字编号以改变颜色浓度。

 浓度 1 

 浓度 2 

 浓度 3 

 浓度 4 

 浓度 5 

 浓度 6 

 浓度 7 

 浓度 8 

除了字体颜色，你也可以将主题色用于背景色、边框颜色等颜色参数。例如这行字的颜色为浓度 2，背景为浓度 6。

如果要实现更复杂的布局，则必须使用 Grid。Grid 可以让按钮们自动适应窗口宽度：随意拉伸 PCL 窗口，按钮大小会自动改变。

你可以上网查找 "WPF Grid" 的相关教程，这里仅给出一个例子，不作详细介绍。你可以仅在这个教学卡片的基础上稍作调整，来实现自己的按钮布局。

[打开 B 站](https://www.bilibili.com/)

[进入 Hypixel] (事件: 启动游戏)

[打开记事本] (事件: 打开文件)

MyIconTextButton 是一种带有自定义矢量图标的按钮变体，它同样支持 EventType 与 EventData 属性。
通过设置 Logo 属性来控制它的图标，设置 LogoScale 属性还可以调整图标的缩放比例。

Logo 属性的内容是 SVG Path 的值，你需要使用 SVG 编辑器或者从图标资源网站（如 IconFont）查找它。不要自己写，写不懂的。
此外，它还有两种 ColorType：Black（默认）和 Highlight。

如果只想要图标，不要文字，还可以使用 MyIconButton。它不能设置 Text 属性，只有一个图标可以按。
它的 Theme 属性可以设置为 Color（默认）、White、Black、Red。

如果只想显示一个图标，不想让它是能按的按钮，可以使用 WPF 自带的 Path 等绘图控件，感兴趣的话可以自行搜索。想偷懒也可以把 MyIconButton 的 IsHitTestVisible 属性改为 False……

如果你在尝试制作联网更新的自定义主页，可以查看下方的 GitHub 讨论页。
你可以根据其中的介绍为主页添加版本号检查以节省流量，也可以通过检查 Referer 和 User Agent 来确定对方的 PCL 版本。

[打开 GitHub 讨论页](https://github.com/Meloong-Git/PCL/discussions/2528)
