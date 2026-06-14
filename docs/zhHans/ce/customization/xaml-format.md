# XAML 格式

::: info 提示
由于我们将本文档从内置 XAML 模式迁移到网页，部分组件展示效果可能和实际不同，请以启动器内为准。
:::

> **作者**: 龙腾猫跃、XiaoFans、林小槐、TCJ

本篇简单介绍了在 PCL 中使用 XAML 进行自定义页面的相关语法。由于内容繁多，建议下载本篇代码参考学习。

## 纯文本

每个 `local:MyCard` 代表一张卡片，你可以添加、删除格式类似的 MyCard 来添加多个卡片。每个 `TextBlock` 代表一段文本，你可以在 Text 属性中书写任何你想写的内容，也可以自行添加更多的 TextBlock。

你可以通过添加、删除属性修改样式，例如上一行的 FontSize 就会将字号改为 11 号。

它还有许多可以调整的属性：上一行的 Margin 调整了边距，Foreground 则会让文字变色。

<CodeExample title="纯文本示例">

<CodeDisplay>
  <p class="m-0 text-sm">这是一段普通文本。</p>
  <p class="m-0 text-xs">这段文字使用了 FontSize="11" 属性。</p>
  <p class="m-0 text-amber-700">这段文字使用了 Foreground 属性改变颜色。</p>
</CodeDisplay>

<CodeContent>

```xml
<TextBlock Margin="0,0,0,4" Text="这是一段普通文本。" />
<TextBlock Margin="0,0,0,4" FontSize="11" Text="这段文字使用了 FontSize=&quot;11&quot; 属性。" />
<TextBlock Margin="20,5,20,0" Foreground="#8C7721" Text="这段文字使用了 Foreground 属性改变颜色。" />
```

</CodeContent>

</CodeExample>

## 卡片与提示条

<CodeExample title="提示条示例">

<CodeDisplay>
  <div class="flex flex-col gap-2">
    <PHint Text="local:MyHint 代表提示条。"></PHint>
    <PHint Theme="Yellow" Text="将提示条的 Theme 属性改为 Blue、Yellow 或 Red 即可修改配色。"></PHint>
    <PHint Theme="Red" Text="这是红色主题的提示条。"></PHint>
  </div>
</CodeDisplay>

<CodeContent>

```xml
<local:MyHint Theme="Blue" Text="local:MyHint 代表提示条。" />
<local:MyHint Theme="Yellow" Text="将提示条的 Theme 属性改为 Blue、Yellow 或 Red 即可修改配色。" />
<local:MyHint Theme="Red" Text="这是红色主题的提示条。" />
```

</CodeContent>

</CodeExample>

卡片（`local:MyCard`）的 Title 属性决定了它的标题。  
为卡片添加 `CanSwap` 属性让它可以被折叠，True 代表是，False 代表否。在此基础上，再使用 `IsSwapped` 属性调整它是否默认被折叠。

<CodeExample title="可折叠卡片">

<CodeDisplay>
  <PCard Title="可折叠卡片标题" :CanSwap="true">
    <p class="m-0">这是卡片的内容区域。</p>
  </PCard>
</CodeDisplay>

<CodeContent>

```xml
<local:MyCard Title="可折叠卡片标题" CanSwap="True" IsSwapped="False">
    <StackPanel Margin="25,40,23,15">
        <TextBlock Text="这是卡片的内容区域。" />
    </StackPanel>
</local:MyCard>
```

</CodeContent>

</CodeExample>

## 长宽属性与图片

任意项目都可以添加 Width 与 Height 属性来控制宽高。HorizontalAlignment 属性可以控制对齐：Center 代表居中，Right 代表居右。

<CodeExample title="尺寸与对齐">

<CodeDisplay>
  <div class="flex flex-col gap-2">
    <div class="w-80 ml-auto text-right p-2 bg-gray-100 rounded">这段文本宽度为 320，右对齐</div>
    <div class="w-52 mx-auto text-center p-2 bg-blue-50 rounded">这段文本宽度为 200，居中对齐</div>
  </div>
</CodeDisplay>

<CodeContent>

```xml
<TextBlock Width="320" HorizontalAlignment="Right" Text="这段文本宽度为 320，右对齐" />
<TextBlock Width="200" HorizontalAlignment="Center" Text="这段文本宽度为 200，居中对齐" />
```

</CodeContent>

</CodeExample>

`local:MyImage` 代表图片，你需要在它的 Source 属性中填写一个网址或文件路径，它会从该处获取图片并显示。通常需要使用 Height 限制它的高度。

<CodeExample title="图片展示">

<CodeDisplay>
  <div class="flex items-center justify-center flex-col">
    <img src="https://www.baidu.com/img/flexible/logo/pc/result.png" height="50" alt="百度 Logo" />
    <p class="mt-2 text-xs text-gray-500">Height="50" 限制图片高度</p>
  </div>
</CodeDisplay>

<CodeContent>

```xml
<local:MyImage Height="50" HorizontalAlignment="Center"
    Source="https://www.baidu.com/img/flexible/logo/pc/result.png" />
```

</CodeContent>

</CodeExample>

如果有多个网址，也可以通过设置 `FallbackSource` 属性来设置备用地址。  
当从网址 1 获取图片失败后，会自动从网址 2 获取图片。

## 按钮

添加 `local:MyButton` 即可新建一个按钮。你需要限定它的尺寸与位置，并通过 Padding 属性进一步控制它的内边距。

<CodeExample title="基础按钮">

<CodeDisplay>
  <div class="flex flex-col gap-3 items-start">
    <PButton>这是一个按钮！一个按钮！</PButton>
    <PButton ColorState="Highlight" title="……就能看到这句话！">把鼠标停在这里别动……</PButton>
  </div>
</CodeDisplay>

<CodeContent>

```xml
<local:MyButton Height="35" HorizontalAlignment="Left" Padding="25,0,25,0" Text="这是一个按钮！一个按钮！" />
<local:MyButton Width="250" Height="35" ColorType="Highlight" Text="把鼠标停在这里别动……" ToolTip="……就能看到这句话！"  />
```

</CodeContent>

</CodeExample>

你可以修改 `ColorType` 属性来调整按钮配色：Highlight 代表当前主题色，Red 代表红色。ToolTip 属性还可以让你在鼠标悬浮在上面的时候显示提示文本。

`local:MyTextButton` 是没有边框的"纯文本按钮"，其作用与 `local:MyButton` 一致。

<CodeExample title="文本按钮">

<CodeDisplay>
  <div class="text-center p-4">
    <PExtraTextButton Text="一个精简版的文本按钮" />
  </div>
</CodeDisplay>

<CodeContent>

```xml
<local:MyTextButton HorizontalAlignment="Center" Text="一个精简版的文本按钮" />
```

</CodeContent>

</CodeExample>

## 自定义事件

将按钮的 `EventType` 属性设为**打开网页**，然后在 `EventData` 属性中写入网址，即可通过点击按钮打开网页。

<CodeExample title="打开网页">

<CodeDisplay>
  <div class="p-4">
    <PButton ColorState="Highlight" @click="window.open('https://zh.minecraft.wiki/', '_blank')">打开 Minecraft Wiki</PButton>
  </div>
</CodeDisplay>

<CodeContent>

```xml
<local:MyButton Height="35" HorizontalAlignment="Left" Padding="20,0,20,0"
    Text="打开 Minecraft Wiki"
    EventType="打开网页"
    EventData="https://zh.minecraft.wiki/" />
```

</CodeContent>

</CodeExample>

或者将 `EventType` 属性改为**弹出窗口**，然后在 `EventData` 属性中写入弹窗的标题与内容……

<CodeExample title="弹出窗口">

<CodeDisplay>
  <div class="p-4">
    <PButton @click="alert('这是标题\n\n标题与内容以竖线间隔。')">显示一个弹窗</PButton>
    <p class="mt-2 text-xs text-gray-500">点击后会弹出窗口，标题与内容以竖线间隔</p>
  </div>
</CodeDisplay>

<CodeContent>

```xml
<local:MyButton Width="140" Height="35" HorizontalAlignment="Left" Padding="13,0,13,0"
    Text="显示一个弹窗"
    EventType="弹出窗口"
    EventData="这是标题|标题与内容以竖线间隔。
你也可以直接在其中换行。" />
```

</CodeContent>

</CodeExample>

`local:MyTextButton` 同样可以设置 EventType 与 EventData 让它具有特定功能。

## 横向布局

你需要使用 `StackPanel` 在一行里塞下多个按钮。你可以仅在这个教学卡片的基础上稍作调整，来实现自己的按钮布局。

<CodeExample title="横向按钮布局">

<CodeDisplay>
  <div class="flex flex-col gap-2">
    <div class="flex gap-2 justify-center">
      <PButton ColorState="Highlight">打开 B 站</PButton>
      <PButton>进入 Hypixel</PButton>
      <PButton>打开记事本</PButton>
    </div>
    <div class="flex gap-2 justify-center">
      <PButton ColorState="Red">复制召唤命令</PButton>
      <PButton>内存优化</PButton>
      <PButton>下载文件</PButton>
    </div>
  </div>
</CodeDisplay>

<CodeContent>

```xml
<!-- 这是第一行 -->
<StackPanel Orientation="Horizontal" HorizontalAlignment="Center">
    <local:MyButton Margin="0,0,10,0" Width="140" Height="35"
        ColorType="Highlight"
        Text="打开 B 站" EventType="打开网页" EventData="https://www.bilibili.com/" />
    <local:MyButton Margin="0,0,10,0" Width="140" Height="35"
        Text="进入 Hypixel" EventType="启动游戏" EventData="1.16.3|mc.hypixel.net" />
    <local:MyButton Margin="0,0,10,0" Width="140" Height="35"
        Text="打开记事本" EventType="打开文件" EventData="notepad" />
</StackPanel>
<!-- 这是第二行 -->
<StackPanel Orientation="Horizontal" HorizontalAlignment="Center" Margin="0,10,0,0">
    <local:MyButton Margin="0,0,10,0" Width="140" Height="35" ColorType="Red"
        Text="复制召唤命令" EventType="复制文本"
        EventData="/execute as @a at @s run summon Creeper ~ ~2 ~" />
    <local:MyButton Margin="0,0,10,0" Width="140" Height="35"
        Text="内存优化" EventType="内存优化" />
    <local:MyButton Margin="0,0,10,0" Width="140" Height="35"
        Text="下载文件" EventType="下载文件"
        EventData="https://example.com/file.zip" />
</StackPanel>
```

</CodeContent>

</CodeExample>

## 列表项

你也可以使用列表项 `local:MyListItem` 来替代按钮，其使用方式与按钮类似。

<CodeExample title="列表项">

<CodeDisplay>
  <PListItem 
    Logo="https://www.baidu.com/favicon.ico"
    Title="百度"
    Info="百度一下，你就知道！"
    Type="Clickable"
    @click="window.open('https://www.baidu.com/', '_blank')"
  />
</CodeDisplay>

<CodeContent>

```xml
<local:MyListItem Margin="-5,2,-5,8"
    Logo="https://www.baidu.com/favicon.ico"
    Title="百度"
    Info="百度一下，你就知道！"
    EventType="打开网页"
    EventData="https://www.baidu.com/"
    Type="Clickable" />
```

</CodeContent>

</CodeExample>

Logo 属性为列表项的图标，指定的可以是链接也可以是文件路径；Title 是大标题，Info 是可选的小标题（详细信息）；Type 如果省略，该列表项则单纯只展示信息，仅当 Type 为 Clickable 才能触发点击效果。

EventType、EventData 与按钮几乎一致。唯一不同的是，列表项联网加载帮助文件时，必须手动设置 Title、Info、Type、Logo 属性。

## 内置图片

PCL 内置了一些 Minecraft 方块与物品图片，可以直接使用。

<CodeExample title="Minecraft 方块图标">

<CodeDisplay>
  <div class="flex gap-2 flex-wrap justify-center">
    <img src="/pack/Images/Blocks/CommandBlock.png" width="30" height="30" title="命令方块" />
    <img src="/pack/Images/Blocks/CobbleStone.png" width="30" height="30" title="圆石" />
    <img src="/pack/Images/Blocks/GoldBlock.png" width="30" height="30" title="金块" />
    <img src="/pack/Images/Blocks/Grass.png" width="30" height="30" title="草方块" />
    <img src="/pack/Images/Blocks/GrassPath.png" width="30" height="30" title="草径" />
    <img src="/pack/Images/Blocks/Anvil.png" width="30" height="30" title="铁砧" />
    <img src="/pack/Images/Blocks/RedstoneBlock.png" width="30" height="30" title="红石块" />
    <img src="/pack/Images/Blocks/RedstoneLampOn.png" width="30" height="30" title="红石灯（亮）" />
    <img src="/pack/Images/Blocks/RedstoneLampOff.png" width="30" height="30" title="红石灯（灭）" />
    <img src="/pack/Images/Blocks/Egg.png" width="30" height="30" title="鸡蛋" />
    <img src="/pack/Images/Blocks/Fabric.png" width="30" height="30" title="Fabric" />
    <img src="/pack/Images/Blocks/NeoForge.png" width="30" height="30" title="NeoForge" />
  </div>
</CodeDisplay>

<CodeContent>

```xml
<!-- 命令方块 -->
<local:MyImage Source="pack://application:,,,/images/Blocks/CommandBlock.png"/>
<!-- 圆石 -->
<local:MyImage Source="pack://application:,,,/images/Blocks/Cobblestone.png"/>
<!-- 金块 -->
<local:MyImage Source="pack://application:,,,/images/Blocks/GoldBlock.png"/>
<!-- 草方块 -->
<local:MyImage Source="pack://application:,,,/images/Blocks/Grass.png"/>
<!-- 草径 -->
<local:MyImage Source="pack://application:,,,/images/Blocks/GrassPath.png"/>
<!-- 铁砧 -->
<local:MyImage Source="pack://application:,,,/images/Blocks/Anvil.png"/>
<!-- 红石块 -->
<local:MyImage Source="pack://application:,,,/images/Blocks/RedstoneBlock.png"/>
<!-- 红石灯（亮） -->
<local:MyImage Source="pack://application:,,,/images/Blocks/RedstoneLampOn.png"/>
<!-- 红石灯（灭） -->
<local:MyImage Source="pack://application:,,,/images/Blocks/RedstoneLampOff.png"/>
<!-- 鸡蛋 -->
<local:MyImage Source="pack://application:,,,/images/Blocks/Egg.png"/>
<!-- 布料（Fabric 图标） -->
<local:MyImage Source="pack://application:,,,/images/Blocks/Fabric.png"/>
<!-- 狐狸（NeoForge 图标） -->
<local:MyImage Source="pack://application:,,,/images/Blocks/NeoForge.png"/>
```

</CodeContent>

</CodeExample>

使用时，将上方对应行的 Source 复制到 MyListItem 的 Logo 属性处即可。

## 主题色

你可以用类似 `{DynamicResource ColorBrush5}` 的格式使用 PCL 当前的主题颜色，修改末尾的数字编号以改变颜色浓度。

<CodeExample title="主题色浓度">

<CodeDisplay>
  <div class="grid grid-cols-4 grid-rows-2 gap-y-2 w-86!">
    <span class="w-20 text-center px-2 py-1 text-[var(--color-brush-1)] border border-[var(--color-brush-4)] rounded">浓度 1</span>
    <span class="w-20 text-center px-2 py-1 text-[var(--color-brush-2)] border border-[var(--color-brush-4)] rounded">浓度 2</span>
    <span class="w-20 text-center px-2 py-1 text-[var(--color-brush-3)] border border-[var(--color-brush-4)] rounded">浓度 3</span>
    <span class="w-20 text-center px-2 py-1 text-[var(--color-brush-4)] border border-[var(--color-brush-4)] rounded">浓度 4</span>
    <span class="w-20 text-center px-2 py-1 text-[var(--color-brush-5)] border border-[var(--color-brush-4)] rounded">浓度 5</span>
    <span class="w-20 text-center px-2 py-1 text-[var(--color-brush-6)] border border-[var(--color-brush-4)] rounded">浓度 6</span>
    <span class="w-20 text-center px-2 py-1 text-[var(--color-brush-7)] border border-[var(--color-brush-4)] rounded">浓度 7</span>
    <span class="w-20 text-center px-2 py-1 text-[var(--color-brush-8)] border border-[var(--color-brush-4)] rounded">浓度 8</span>
  </div>
</CodeDisplay>

<CodeContent>

```xml
<TextBlock Text=" 浓度 1 " Background="{DynamicResource ColorBrush1}" />
<TextBlock Text=" 浓度 2 " Background="{DynamicResource ColorBrush2}" />
<TextBlock Text=" 浓度 3 " Background="{DynamicResource ColorBrush3}" />
<TextBlock Text=" 浓度 4 " Background="{DynamicResource ColorBrush4}" />
<TextBlock Text=" 浓度 5 " Background="{DynamicResource ColorBrush5}" />
<TextBlock Text=" 浓度 6 " Background="{DynamicResource ColorBrush6}" />
<TextBlock Text=" 浓度 7 " Background="{DynamicResource ColorBrush7}" />
<TextBlock Text=" 浓度 8 " Background="{DynamicResource ColorBrush8}" />
```

</CodeContent>

</CodeExample>

除了字体颜色，你也可以将主题色用于背景色、边框颜色等颜色参数。

## 进阶：Grid 布局

如果要实现更复杂的布局，则必须使用 `Grid`。Grid 可以让按钮们自动适应窗口宽度：随意拉伸 PCL 窗口，按钮大小会自动改变。

你可以上网查找 "WPF Grid" 的相关教程，这里仅给出一个例子，不作详细介绍。你可以仅在这个教学卡片的基础上稍作调整，来实现自己的按钮布局。

<CodeExample title="Grid 布局">

<CodeDisplay>
  <div class="grid grid-cols-[1fr_1.6fr_150px] gap-2">
    <PButton ColorState="Highlight">打开 B 站</PButton>
    <PButton>进入 Hypixel</PButton>
    <PButton>打开记事本</PButton>
  </div>
</CodeDisplay>

<CodeContent>

```xml
<Grid>
    <Grid.ColumnDefinitions>
        <ColumnDefinition Width="1*" />
        <ColumnDefinition Width="1.6*" MinWidth="200" />
        <ColumnDefinition Width="150" />
    </Grid.ColumnDefinitions>
    <local:MyButton Grid.Column="0" Margin="0,0,10,0" Height="35" ColorType="Highlight"
        Text="打开 B 站" EventType="打开网页" EventData="https://www.bilibili.com/" />
    <local:MyButton Grid.Column="1" Margin="0,0,10,0" Height="35"
        Text="进入 Hypixel" EventType="启动游戏" EventData="1.16.3|mc.hypixel.net" />
    <local:MyButton Grid.Column="2" Margin="0,0,10,0" Height="35"
        Text="打开记事本" EventType="打开文件" EventData="notepad" />
</Grid>
```

</CodeContent>

</CodeExample>

## 进阶：图标按钮

`MyIconTextButton` 是一种带有自定义矢量图标的按钮变体，它同样支持 EventType 与 EventData 属性。  
通过设置 Logo 属性来控制它的图标，设置 LogoScale 属性还可以调整图标的缩放比例。

<CodeExample title="带图标的按钮">

<CodeDisplay>
  <div class="flex flex-col gap-3 items-center">
    <PIconTextButton 
      Logo="M1091 0H78C35 0 0 35 0 78v863c0 43 35 78 78 78h1013c43 0 78-35 78-78V78c0-43-36-78-78-78z"
      LogoScale="1.02"
      Text="查看 SVG Path 简介"
      @click="window.open('https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Paths', '_blank')"
    >
    </PIconTextButton>
    <PIconTextButton 
      Logo="M510 959c-51-31-40-86-74-120-61-63-168-66-231-138C-5 457 196 3 593 70c231 39 407 363 250 592-67 98-198 106-277 213-23 23-11 81-55 83z"
      ColorState="Highlight"
      @click="window.open('https://www.iconfont.cn/', '_blank')"
      Text="打开 IconFont"
    >
    </PIconTextButton>
  </div>
</CodeDisplay>

<CodeContent>

```xml
<local:MyIconTextButton Height="35" HorizontalAlignment="Center"
    Text="查看 SVG Path 简介" EventType="打开网页"
    EventData="https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Paths"
    LogoScale="1.02"
    Logo="M1091 0H78C35 0 0 35 0 78v863c0 43 35 78 78 78h1013c43 0 78-35 78-78V78c0-43-36-78-78-78z" />
<local:MyIconTextButton Height="35" HorizontalAlignment="Center" ColorType="Highlight"
    Text="打开 IconFont" EventType="打开网页" EventData="https://www.iconfont.cn/"
    LogoScale="1"
    Logo="M510 959c-51-31-40-86-74-120-61-63-168-66-231-138C-5 457 196 3 593 70c231 39 407 363 250 592-67 98-198 106-277 213-23 23-11 81-55 83z" />
```

</CodeContent>

</CodeExample>

Logo 属性的内容是 SVG Path 的值，你需要使用 SVG 编辑器或者从图标资源网站（如 IconFont）查找它。不要自己写，写不懂的。  
此外，它还有两种 ColorType：Black（默认）和 Highlight。

如果只想要图标，不要文字，还可以使用 `MyIconButton`。它不能设置 Text 属性，只有一个图标可以按。  
它的 Theme 属性可以设置为 Color（默认）、White、Black、Red。

<CodeExample title="纯图标按钮">

<CodeDisplay>
  <div class="text-center">
    <PIconButton 
      Logo="M149 873c47 47 101 83 162 109 63 26 130 40 199 40 69 0 136-13 199-40 61-25 115-62 162-109s83-101 109-162c26-63 40-130 40-199 0-69-13-136-40-199-25-61-62-115-109-162-46-46-101-83-162-109C648 13 580 0 511 0s-136 13-199 40c-61 25-115 62-162 109s-83 101-109 162C13 375 0 442 0 511s13 136 40 199c25 61 62 115 109 162z"
      @click="alert('事件\n\nMyIconButton 支持 EventType 和 EventData')"
    />
  </div>
</CodeDisplay>

<CodeContent>

```xml
<local:MyIconButton Width="25" Height="25" HorizontalAlignment="Center" Theme="Black"
    EventType="弹出窗口" EventData="事件|MyIconButton 支持 EventType 和 EventData"
    LogoScale="1"
    Logo="M149 873c47 47 101 83 162 109 63 26 130 40 199 40 69 0 136-13 199-40 61-25 115-62 162-109s83-101 109-162c26-63 40-130 40-199 0-69-13-136-40-199-25-61-62-115-109-162-46-46-101-83-162-109C648 13 580 0 511 0s-136 13-199 40c-61 25-115 62-162 109s-83 101-109 162C13 375 0 442 0 511s13 136 40 199c25 61 62 115 109 162z" />
```

</CodeContent>

</CodeExample>

如果只想显示一个图标，不想让它是能按的按钮，可以使用 WPF 自带的 Path 等绘图控件，感兴趣的话可以自行搜索。想偷懒也可以把 MyIconButton 的 `IsHitTestVisible` 属性改为 False……

## 进阶：联网自定义主页

如果你在尝试制作联网更新的自定义主页，可以查看下方的 GitHub 讨论页。  
你可以根据其中的介绍为主页添加版本号检查以节省流量，也可以通过检查 Referer 和 User Agent 来确定对方的 PCL 版本。

[打开 GitHub 讨论页](https://github.com/Meloong-Git/PCL/discussions/2528)

## 属性参考

### 全部通用属性

| 属性                  | 说明                                                                           |
| --------------------- | ------------------------------------------------------------------------------ |
| `Width`、`Height`     | 设置宽度与高度                                                                 |
| `ToolTip`             | 设置鼠标指向时的提示文本                                                       |
| `Margin`              | 调整外边距（格式为 左,上,右,下。例如 Margin="0,0,0,2" 即为 2 单位的下边距）    |
| `HorizontalAlignment` | 设置横向对齐方式；居左：Left、居中：Center、居右：Right、拉伸（默认）：Stretch |
| `VerticalAlignment`   | 设置纵向对齐方式；居上：Top、居中：Center、居下：Bottom、拉伸（默认）：Stretch |
| `IsHitTestVisible`    | 该控件是否响应交互（点击、指向动画等）；True 为是（默认），False 为否          |

### TextBlock（纯文本）

| 属性           | 说明                                                                                                                    |
| -------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `Text`         | 设置显示的文本（如果要使用引号等特殊字符，自行百度 XAML 转义）                                                          |
| `TextWrapping` | 开启自动换行                                                                                                            |
| `FontSize`     | 设置字号                                                                                                                |
| `FontWeight`   | 设置为 Bold 时，文字加粗                                                                                                |
| `Foreground`   | 调整前景颜色（十六进制字符串，例如 #FF010203 代表 ARGB 中的 255,1,2,3。前两位代表不透明度，FF 为全不透明，00 为全透明） |

### local:MyImage（图片）

| 属性             | 说明                                                                                                      |
| ---------------- | --------------------------------------------------------------------------------------------------------- |
| `Source`         | 要显示的图片的网址，或 PCL 内置图片位置                                                                   |
| `FallbackSource` | 当 Source 首次下载失败时，会从该备用地址加载图片                                                          |
| `LoadingSource`  | 正在下载网络图片时显示的本地图片（不支持联网下载）；默认为 pack://application:,,,/images/Icons/NoIcon.png |
| `EnableCache`    | 若图片是联网获取的，是否将图片保存到本地缓存，在 7 天内不再重新下载；True 为是（默认），False 为否        |

### local:MyCard（卡片）

| 属性                  | 说明                                                              |
| --------------------- | ----------------------------------------------------------------- |
| `Title`               | 设置显示的标题文本                                                |
| `CanSwap`             | 卡片是否可以折叠，True 为是，False 为否                           |
| `IsSwapped`           | 卡片是否默认折叠，要求 CanSwap 必须为 True                        |
| `HorizontalAlignment` | 若使用，要求 CanSwap 必须为 False                                 |
| `UseAnimation`        | 是否在展开等高度改变时触发动画；True 为是（默认），False 为否     |
| `SwapLogoRight`       | 卡片折叠时的箭头是朝下还是朝右；True 为朝右，False 为朝下（默认） |
| `HasMouseAnimation`   | 是否在鼠标指向时改变卡片颜色；True 为是（默认），False 为否       |

### local:MyHint（提示条）

| 属性    | 说明                                |
| ------- | ----------------------------------- |
| `Text`  | 设置显示的文本（&#xA; 代表换行）    |
| `Theme` | 设置颜色主题（Blue、Yellow 或 Red） |

### local:MyButton（按钮）

| 属性                     | 说明                                                                     |
| ------------------------ | ------------------------------------------------------------------------ |
| `Text`                   | 设置显示的文本                                                           |
| `Padding`                | 设置内边距，格式与 Margin 一致                                           |
| `ColorType`              | 设置颜色主题（Highlight 为当前启动器的主题颜色，Red 为红色，默认为黑色） |
| `EventType`、`EventData` | 触发特定事件                                                             |

### local:MyTextButton（文本按钮）

| 属性                     | 说明           |
| ------------------------ | -------------- |
| `Text`                   | 设置显示的文本 |
| `EventType`、`EventData` | 触发特定事件   |

### local:MyListItem（列表项）

| 属性    | 说明                                                |
| ------- | --------------------------------------------------- |
| `Logo`  | 列表项的图标（所指定的可以是链接也可以是文件路径）  |
| `Title` | 列表项的大标题                                      |
| `Info`  | 列表项的详细信息，它将会以灰色显示在大标题下方      |
| `Type`  | 若留空仅单纯展示信息，设置为 Clickable 触发相应活动 |

### local:MyIconTextButton（带图标的按钮）

| 属性                     | 说明                                                         |
| ------------------------ | ------------------------------------------------------------ |
| `Text`                   | 设置显示的文本                                               |
| `Logo`                   | 设置显示的图标                                               |
| `LogoScale`              | 设置图标的缩放，默认为 1                                     |
| `ColorType`              | 设置颜色主题（Highlight 为当前启动器的主题颜色，默认为黑色） |
| `EventType`、`EventData` | 触发特定事件                                                 |

### local:MyIconButton（图标按钮）

| 属性                     | 说明                                                                            |
| ------------------------ | ------------------------------------------------------------------------------- |
| `Logo`                   | 设置显示的图标                                                                  |
| `LogoScale`              | 设置图标的缩放，默认为 1                                                        |
| `Theme`                  | 设置颜色主题，Color（默认）为当前启动器的主题颜色，也可设置为 White、Black、Red |
| `EventType`、`EventData` | 触发特定事件                                                                    |

### 默认命名空间

默认会声明以下命名空间：

```xml
xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
xmlns:sys="clr-namespace:System;assembly=mscorlib"
xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
xmlns:local="clr-namespace:PCL;assembly=Plain Craft Launcher 2"
```

除此之外，不能声明其他命名空间。
