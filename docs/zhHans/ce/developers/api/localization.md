---
order: 4
---

# 国际化与本地化

本文介绍 PCL CE 的语言资源组织方式、UI 语言与展示格式区域性的选择逻辑，以及如何在 C#、AXAML 和 ViewModel 中读取本地化文本。

本地化系统由语言资源字典、`LocalizationService`、`Lang` 以及界面层提供的绑定辅助入口组成。语言资源维护在 `PCL.Localization` 项目中，并由界面层通过 `ILocalizationBackend` 加载到 Avalonia 应用资源。

## 概览

本地化系统主要包含以下概念：

| 概念           | 说明                                                                                     |
|----------------|------------------------------------------------------------------------------------------|
| 语言资源       | 存放某种语言文本的资源字典，位于 `PCL.Localization/Languages`                            |
| UI 语言        | 界面文本所使用的语言，由 `LocalizationService.CurrentLanguage` 表示                      |
| 展示格式区域性 | 日期、时间和数值等内容所使用的区域性，由 `LocalizationService.CurrentFormatCulture` 表示 |
| 基础语言       | 语言资源的完整兜底语言，当前为 `zh-CN`                                                   |
| 资源键         | 用于定位单条资源文本的字符串标识，例如 `Common.Action.Confirm`                           |
| 本地化服务     | 负责解析并应用 UI 语言与展示格式区域性、加载资源并通知界面刷新                           |
| 本地化后端     | 负责加载语言资源字典，并通过界面资源系统查找文本                                         |

## 语言资源

语言资源文件位于 `PCL.Localization/Languages` 目录，文件名使用语言代码，例如 `zh-CN.axaml`、`en-US.axaml`。

这些文件会作为嵌入资源编译到 `PCL.Localization` 程序集中，并由 `PCL.Core.UI` 项目作为 Avalonia 资源引用。运行时，`ILocalizationBackend` 会将其加载为 Avalonia 资源字典。

语言资源文件的基本结构如下：

```xml
<ResourceDictionary xmlns="https://github.com/avaloniaui"
                    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
                    xmlns:sys="clr-namespace:System;assembly=System.Runtime"
                    xml:space="preserve">

    <!-- Common.Action -->

    <sys:String x:Key="Common.Action.Confirm">确定</sys:String>
    <sys:String x:Key="Common.Action.Refresh">刷新</sys:String>

    <!-- Common.Format -->

    <sys:String x:Key="Common.Format.DownloadCount">下载 {0} 次</sys:String>
</ResourceDictionary>
```

### 资源键

资源键使用点号分隔的层级命名，不应包含空格。通常按功能或页面分组，例如：

```text
Common.Action.Confirm
Download.Version.LoadingList
Setup.Language.Changed
```

同一资源文件中的键必须唯一。可以使用注释标记分组，便于维护和审阅。

### 文本格式

资源文本使用标准 .NET 复合格式字符串，例如 `{0}`、`{1:N2}`。`Lang.Text(key, args)` 会在运行时按照当前展示格式区域性填充这些占位符。

文本中的换行应使用 XML 实体 `&#xA;` 表示。`<`、`>`、`&` 等字符应按 XML 规则转义。

`ResourceDictionary` 的 `xml:space="preserve"` 属性会保留文本中的空白，因此不要在字符串值中随意添加缩进或换行，除非这些空白本身需要显示。

### 元数据

语言资源文件通常包含以下元数据：

| 键          | 说明           |
|-------------|----------------|
| `Meta.Code` | 语言代码       |
| `Meta.Name` | 语言的本地名称 |

这些元数据用于标识资源文件。UI 语言列表以 `LocalizationService.SupportedLanguages` 中的注册信息为准。

## UI 语言与展示格式区域性

`LocalizationService` 负责解析 UI 语言与展示格式区域性，应用对应的 .NET 区域性，并在配置发生变化时加载语言资源。

该服务在 `Loaded` 生命周期状态启动。启动时会读取本地化配置、应用区域性，并加载基础语言与当前语言资源。

### 受支持的语言

当前注册的 UI 语言如下：

| 语言代码 | 本地名称                 | 区域性名称 | 字体策略             |
|----------|--------------------------|------------|----------------------|
| `zh-CN`  | 简体中文（中国大陆）     | `zh-CN`    | `SimplifiedChinese`  |
| `zh-TW`  | 繁體中文（台灣）         | `zh-TW`    | `TraditionalChinese` |
| `en-US`  | English (US)             | `en-US`    | `English`            |
| `en-GB`  | English (United Kingdom) | `en-GB`    | `English`            |
| `ja-JP`  | 日本語（日本）           | `ja-JP`    | `Japanese`           |
| `fr-FR`  | Français (France)        | `fr-FR`    | `Other`              |
| `es-ES`  | Español (España)         | `es-ES`    | `Other`              |

`LocalizationService.SupportedLanguages` 是 UI 语言列表的唯一来源。新增语言时，需要提供对应的资源文件，并在该列表中注册 `LocalizationLanguage`。

### 配置

`LocalizationService` 定义了以下配置值：

| 值                                                | 说明                                     |
|---------------------------------------------------|------------------------------------------|
| `LocalizationService.Auto`                        | 跟随系统设置，值为 `auto`                |
| `LocalizationService.FormatCultureFollowLanguage` | 展示格式跟随 UI 语言，值为 `ui-language` |

`LocalizationService.DefaultLanguageCode` 为 `zh-CN`，同时也是语言资源的完整兜底语言。

本地化相关设置位于 `Config.Preference.Localization`：

| 配置项          | 默认值 | 说明                                                                          |
|-----------------|--------|-------------------------------------------------------------------------------|
| `Language`      | `auto` | UI 语言。`auto` 表示跟随系统 UI 区域性                                        |
| `FormatCulture` | `auto` | 展示格式区域性。`auto` 表示跟随系统格式区域性，`ui-language` 表示跟随 UI 语言 |
| `Region`        | `auto` | 区域覆盖。`auto` 表示自动判断，与 UI 语言及展示格式区域性分开处理             |

修改 `Language` 或 `FormatCulture` 时，`LocalizationService` 会通过配置事件重新应用对应设置。`Region` 不属于这套语言与格式区域性应用流程。

### 应用语言

可以通过 `LocalizationService.Apply` 直接应用 UI 语言与展示格式区域性：

```cs
LocalizationService.Apply("en-US", LocalizationService.Auto);
```

展示格式参数默认为 `auto`，因此可以省略：

```cs
LocalizationService.Apply("zh-CN");
```

`Apply` 还接受 `save` 参数，默认值为 `true`，用于控制是否将规范化后的值写回配置。`ApplyFromConfig` 则按照当前配置重新应用，其 `save` 参数默认值为 `false`：

```cs
LocalizationService.ApplyFromConfig();
```

首次应用完成后，如果 UI 语言和展示格式区域性均未变化，`Apply` 会直接返回，不再重新加载资源。否则，方法会更新当前线程与默认线程的区域性。注册了 UI 后端时，区域性更新和资源应用会派发到 UI 线程执行，随后触发 `LanguageChanged` 事件。

### 语言解析与回退

`ResolveLanguage` 用于将配置值解析为受支持的语言：

```cs
var language = LocalizationService.ResolveLanguage("en-US");
```

解析规则如下：

* 配置值为空或为 `auto` 时，根据系统 UI 区域性选择语言
* 系统 UI 区域性存在精确匹配时，使用对应语言
* 不存在精确匹配时，使用语言代码具有相同两字母前缀的第一个受支持语言
* 仍无法匹配时，回退到 `zh-CN`
* 显式指定了不受支持的语言时，同样回退到 `zh-CN`

`IsLanguageSupported` 用于判断语言代码是否已注册。`null`、空字符串和 `auto` 均视为有效的配置值。

展示格式区域性可以设置为 `auto`、`ui-language` 或 .NET 区域性名称。显式指定的区域性名称无效时，服务会记录警告并回退到系统格式区域性。

## 资源加载与回退

`ILocalizationBackend` 是界面层使用的本地化后端接口：

```cs
public interface ILocalizationBackend
{
    string? TryFindResource(string key);

    void ApplyLanguageResources(string baseLanguageCode, string? currentLanguageCode);
}
```

`PCL.Core.UI` 中的 `LocalizationBackend` 使用 Avalonia 资源字典实现该接口。应用语言资源时，后端会先移除上一次加载的语言字典，再按以下顺序合并基础语言与当前语言：

1. 加载 `zh-CN` 基础语言资源
2. 当前语言不是 `zh-CN` 时，再加载当前语言资源
3. 当前语言资源覆盖基础语言中的同名键
4. 当前语言缺少某个键时，使用基础语言中的对应文本

本地化服务进入 `Loaded` 状态前，`ApplicationHost` 会调用 `LocalizationBackend.EnsureBaseLanguage`，确保应用启动早期的 `Lang.Text` 调用也能读取基础语言文本。

## 在代码中读取文本

### `Lang.Text`

使用 `Lang.Text` 读取指定资源键对应的文本：

```cs
var text = Lang.Text("Common.Action.Confirm");
```

资源键不能为 `null`、空字符串或空白字符串，否则会抛出 `ArgumentException`。

资源键不存在时，调试构建会返回带感叹号的键名，例如 `!Common.Action.Missing!`；其他构建会直接返回键名。

### 带参数的文本

`Lang.Text` 支持传入格式参数：

```cs
var text = Lang.Text("Common.Format.DownloadCount", 1234);
```

该方法使用当前展示格式区域性执行 `string.Format`，因此数值、日期等参数会按照所选区域性格式化。

### 格式化辅助方法

`Lang` 还提供以下格式化方法：

| 方法                      | 说明                                                 |
|---------------------------|------------------------------------------------------|
| `Lang.Date(...)`          | 按当前展示格式区域性格式化日期时间                   |
| `Lang.TimeSpan(...)`      | 格式化时间间隔；负值表示过去，零值及正值表示未来     |
| `Lang.Number(...)`        | 按当前区域性格式化数值或其他 `IFormattable` 类型的值 |
| `Lang.CompactNumber(...)` | 格式化紧凑数值，例如下载量                           |
| `Lang.FileSize(...)`      | 格式化文件大小，例如 `1.28 MB`                       |

`Lang.TimeSpan` 默认会为文本添加“过去”或“未来”语义。将 `addAffixes` 设为 `false` 时，只返回格式化后的时间间隔。

这些方法用于生成展示给用户的文本。配置文件、日志、协议、缓存键、文件名等需要稳定格式的场景，应使用 `CultureInfo.InvariantCulture`。

### 区域性相关属性

| 属性                          | 说明                                                                                                                            |
|-------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| `Lang.Culture`                | 当前展示格式区域性                                                                                                              |
| `Lang.IsChineseMainland`      | 当前展示格式区域性是否为 `zh-CN`                                                                                                |
| `Lang.IsFeaturesUnrestricted` | 是否允许使用受区域限制的功能：调试配置放行，或本地时区为 `China Standard Time` 且当前区域性或 UI 区域性为 `zh-CN` 时返回 `true` |

## 在 AXAML 中使用

在 AXAML 中引入 `PCL.Core.UI` 命名空间后，即可使用本地化文本：

```xml
<TextBlock xmlns:loc="using:PCL.Core.UI"
           Text="{loc:Loc Common.Action.Refresh}" />
```

`LocExtension` 会返回一个绑定到 `LocalizationSource.Instance` 索引器的单向绑定。语言切换后，`LocalizationSource` 会通知绑定重新读取资源键，无需重新加载 AXAML。

资源键不能为空，否则 `LocExtension` 会抛出 `ArgumentException`。

## 在 ViewModel 与代码绑定中使用

### `LocalizedProperty`

如果某个属性只需要在语言变化后重新读取文本，可以使用 `LocalizedProperty` 注解：

```cs
public partial class SomeViewModel
{
    [LocalizedProperty("Page.Title")]
    public partial string Title { get; }
}
```

包含该属性的类型和属性本身都必须声明为 `partial`。源生成器会生成 getter，并在其中调用 `Lang.Text` 读取指定资源键。

### `LocalizedObservableObject`

`LocalizedObservableObject` 是 `PCL.Core.ViewModel` 提供的 ViewModel 基类。语言变化时，基类会触发 `PropertyChanged`，使绑定属性重新求值：

```cs
public sealed partial class SomeViewModel : LocalizedObservableObject
{
    public string Description => Lang.Text("Page.Description");
}
```

默认情况下，基类会通知所有属性。如果只需要刷新部分属性，可以重写 `OnLanguageChanged`。

### 代码创建的绑定

对于通过代码创建的控件或绑定，可以使用以下辅助入口：

| 入口                              | 适用场景                                               |
|-----------------------------------|--------------------------------------------------------|
| `LocalizationTextSource.Get(key)` | 获取可绑定的文本源，并按资源键缓存实例                 |
| `LocalizedText.Bind(...)`         | 将委托生成的文本绑定到属性，适用于依赖运行时数据的文本 |
| `SetLocalizedValue(...)`          | 为 Avalonia 属性设置单向本地化绑定                     |

`LocalizationTextSource` 会按资源键缓存实例。同一个键始终返回同一个对象，并在语言变化时通过 `PropertyChanged` 通知绑定刷新。

## 维护语言资源

### 添加或修改文本

功能开发期间需要维护 `zh-CN.axaml` 与 `en-US.axaml`。`zh-TW`、`en-GB`、`fr-FR`、`ja-JP`、`es-ES` 等其他语言由翻译站维护；除非修改内容本身涉及对应语言的翻译，否则不应在功能 PR 中手动修改这些资源文件。

翻译站：[PCL CE 翻译站](https://translate.pclc.cc/projects/pcl-ce/)。

添加或修改文本时，按以下顺序操作：

1. 在 `zh-CN.axaml` 中添加或修改资源键
2. 在 `en-US.axaml` 中添加或修改对应英文文本
3. 在 C# 代码或 AXAML 中引用该资源键
4. 运行 `dotnet test` 检查语言资源与代码引用

资源键应保持稳定。重命名或删除键之前，应检查代码、AXAML 和测试中的引用。

### 添加新语言

新增语言的资源文件通常由翻译流程提供。代码侧需要完成以下工作：

1. 在 `PCL.Localization/Languages` 中添加对应语言代码的资源文件
2. 在 `LocalizationService.SupportedLanguages` 中注册 `LocalizationLanguage`
3. 选择匹配的 `LocalizationFontProfile`
4. 如果该语言尚未完成翻译，在 `PCL.Core.Test/LocalizationTest.cs` 的部分语言列表中登记

`LocalizationCatalog` 会自动发现嵌入的语言资源，因此不需要额外维护语言代码列表。

## 框架无关的资源目录

`LocalizationCatalog` 位于 `PCL.Localization` 项目中，不依赖 Avalonia。测试、语言校验工具和非 UI 入口可以通过它读取与界面层相同的嵌入语言资源。

| 成员                            | 说明                                 |
|---------------------------------|--------------------------------------|
| `LocalizationCatalog.Languages` | 按字典序返回程序集中的全部语言代码   |
| `IsSupported(...)`              | 判断某个语言代码是否存在对应资源文件 |
| `GetKeys(...)`                  | 读取某一语言的全部资源键             |
| `GetEntries(...)`               | 按资源文件顺序读取键值对             |

示例：

```cs
var languages = LocalizationCatalog.Languages;
var entries = LocalizationCatalog.GetEntries("zh-CN");
```

`GetEntries` 会读取每个条目的 `x:Key` 与文本内容，重复键只保留首次出现的条目。请求的语言资源不存在时，会抛出 `FileNotFoundException`。

### 校验

`PCL.Core.Test` 中包含以下检查：

* 完整语言字典应包含基础语言的全部键；部分语言字典可以缺少键，但不能引入基础语言中不存在的键
* 语言字典中不能存在重复键
* 资源键应使用点号分隔的命名，且不包含空格
* 每种受支持语言都应具有有效的区域性名称和对应资源文件
* 语言注册信息应使用预期的字体策略
* C# 代码和 AXAML 引用的资源键应存在于 `zh-CN` 中
* 缺失资源键时应返回非空的兜底文本

修改语言资源后，可以在仓库根目录运行：

```cmd
dotnet test
```

## API 摘要

### 核心类型

| API                       | 说明                         |
|---------------------------|------------------------------|
| `Lang`                    | 代码侧本地化文本与格式化入口 |
| `LocalizationService`     | UI 语言与展示格式区域性服务  |
| `LocalizationLanguage`    | 受支持语言的描述信息         |
| `LocalizationFontProfile` | 语言对应的字体策略           |
| `LocalizationCatalog`     | 框架无关的语言资源目录       |
| `ILocalizationBackend`    | 界面层使用的本地化后端接口   |

### AXAML 与绑定类型

| API                         | 说明                                |
|-----------------------------|-------------------------------------|
| `LocalizationSource`        | AXAML 绑定使用的本地化文本源         |
| `LocExtension`              | AXAML 本地化标记扩展                 |
| `LocalizedProperty`         | 为 partial 属性生成本地化 getter    |
| `LocalizationTextSource`    | 按资源键缓存的代码绑定文本源        |
| `LocalizedText`             | 根据委托生成文本的绑定源            |
| `LocalizedObservableObject` | 语言变化时刷新绑定的 ViewModel 基类 |

## 使用建议

* 用户可见文本应通过 `Lang.Text` 或 `{loc:Loc ...}` 读取，不应在 C# 代码或 AXAML 中硬编码
* 每个句子应使用完整的资源文本，不要拼接多个已翻译片段
* 资源键应语义清晰且保持稳定，避免使用只与临时界面位置相关的名称
* 界面需要支持实时语言切换时，不应跨语言缓存已经解析的文本
* 高频循环中避免重复读取相同的本地化文本；可以在单次逻辑操作期间缓存结果
* 展示给用户的日期、时间和数值应使用 `Lang` 中的格式化方法；需要稳定格式时使用 `CultureInfo.InvariantCulture`
* 功能开发期间应维护 `zh-CN` 与 `en-US`，其他语言通过翻译站维护
