---
order: 3
---

# 应用配置系统简介

本文介绍 PCL CE 应用配置系统的声明方式、生成成员、访问方式，以及其底层基于 NTraffic API 的事件与作用域机制。

配置系统通过源生成器将配置项绑定到 C# 属性。开发者只需要声明配置项，后续即可通过属性读写配置值，或通过对应的 `ConfigItem` 实例执行重置、默认值判断、事件监听等操作。

## 概览

配置系统主要包含以下概念：

| 概念    | 说明                                                  |
|-------|-----------------------------------------------------|
| 配置项   | 单个可读写的配置值，由 `ConfigItem<T>` 或 `AnyConfigItem<T>` 声明 |
| 配置组   | 多个配置项或子配置组的集合，由 `ConfigGroup` 声明                    |
| 配置源   | 配置项的存储位置，例如全局共享配置或本地配置                              |
| 上下文参数 | 配置读写时附带的额外参数，用于区分不同上下文下的配置值                         |
| 事件    | 配置项读取、写入或变更时触发的同步回调机制                               |

## 配置源

配置项通过 `ConfigSource` 指定存储位置。

目前文档中涉及的配置源包括：

| 值                     | 说明     |
|-----------------------|--------|
| `ConfigSource.Shared` | 全局共享配置 |
| `ConfigSource.Local`  | 本地配置   |

`ConfigItem<T>` 的第三个参数用于指定配置源。若省略该参数，则默认使用 `ConfigSource.Shared`。

## 声明配置项

### 使用 `ConfigItem<T>`

`ConfigItem<T>` 用于声明带有显式默认值的配置项。

```cs
[ConfigItem<int>("SomeKey", 114514, ConfigSource.Shared)]
public static partial int SomeConfig { get; set; }
```

上方声明会生成一个键为 `SomeKey` 的配置项，并将其绑定到 `SomeConfig` 属性。

该配置项具有以下特征：

| 项目   | 值                     |
|------|-----------------------|
| 配置键  | `SomeKey`             |
| 配置类型 | `int`                 |
| 默认值  | `114514`              |
| 配置源  | `ConfigSource.Shared` |
| 绑定属性 | `SomeConfig`          |

由于 `ConfigSource.Shared` 是默认值，因此可以省略第三个参数：

```cs
[ConfigItem<int>("SomeKey", 114514)]
public static partial int SomeConfig { get; set; }
```

配置项声明可以写在任意顶层 `partial` 类中。

::: note 提示 
为了提高可维护性，绝大多数配置项应统一声明在 `App\Config.cs` 文件中。
:::

### 类型支持

`ConfigItem<T>` 的类型参数 `T` 可以是任意类型，但实际可用类型取决于底层 Provider 与 NTraffic 的实现支持情况。

目前 JSON 实现可以确定具有完整支持；YAML 实现的支持情况需以对应 Provider 实现为准。

## 使用 `AnyConfigItem<T>`

`AnyConfigItem<T>` 用于声明无法直接写入注解参数的非基本类型配置项。

```cs
[AnyConfigItem<GrayProfileConfig>("SomeKey", ConfigSource.Local)]
public static partial GrayProfileConfig SomeConfig { get; set; }
```

与 `ConfigItem<T>` 不同，`AnyConfigItem<T>` 不接收默认值参数。默认值会通过类型 `T` 的公共无参构造函数创建。

因此，使用 `AnyConfigItem<T>` 时，类型 `T` 必须满足以下条件：

* 存在公共无参构造函数；
* 可被底层 Provider 正确序列化和反序列化；
* 可被 NTraffic 当前实现识别和处理。

如果类型 `T` 不存在公共无参构造函数，编译将失败。

## 访问配置项

配置项声明后，可以直接通过绑定属性读取或写入配置值。

```cs
var value = SomeClass.SomeConfig;

SomeClass.SomeConfig = value;
```

读取属性时，配置系统会从对应配置源中取得当前值。写入属性时，配置系统会将新值写回对应配置源。

## 访问生成的 `ConfigItem` 实例

对于每个绑定属性，源生成器会额外生成一个对应的 `ConfigItem` 实例访问入口。

生成成员的命名规则为：

```text
{属性名}Config
```

例如，属性名为 `SomeConfig` 时，对应的 `ConfigItem` 实例为：

```cs
SomeClass.SomeConfigConfig
```

可以通过该实例执行默认值判断、重置等操作：

```cs
var item = SomeClass.SomeConfigConfig;

var isDefault = item.IsDefault();

item.Reset();
```

常用操作包括：

| 操作              | 说明             |
|-----------------|----------------|
| `IsDefault()`   | 判断当前配置值是否为默认值  |
| `Reset()`       | 将配置项重置为默认值     |
| `GetValue(...)` | 获取配置值，可附带上下文参数 |
| `SetValue(...)` | 设置配置值，可附带上下文参数 |

::: note 提示
配置项的读取与写入成本高于普通属性访问，尤其是加密配置项。若不需要实时值，应缓存读取结果，避免频繁访问。若需要响应配置变更，推荐使用事件机制，而不是通过轮询反复读取配置。
:::

## 使用上下文参数

`ConfigItem` 的 `GetValue`、`SetValue`、`Reset` 等方法支持上下文参数。上下文参数可用于在同一个配置项下区分不同调用环境。

当绑定属性的类型为 `ArgConfig<T>` 时，该属性会生成带上下文参数的访问器。此时可使用索引语法读取或写入值。

```cs
[ConfigItem<int>("SomeKey", 114514)]
public static partial ArgConfig<int> SomeConfig { get; }
```

::: warning 注意
当配置项属性类型为 `ArgConfig<T>` 时，属性不能添加 `set` 修饰符。
:::

使用示例：

```cs
void SomeMethod()
{
    var context = "1919810";

    var value = SomeConfig[context];

    SomeConfig[context] = 1919820;
}
```

如果需要在不附带上下文参数的情况下访问配置项，可以传入 `null`：

```cs
SomeConfig[null] = 114524;
```

对于 `ArgConfig<T>`，索引器不能省略。即使不使用上下文参数，也需要显式传入 `null`。

## 声明配置组

配置组用于将多个配置项或子配置组组织到同一个作用域中。配置组可用于批量重置、默认值判断、事件注册等场景。

配置组通过 `ConfigGroup` 声明。声明位置可以是任意顶层 `partial` 类，或另一个已经声明为配置组的类。

```cs
public partial class SomeClass
{
    [ConfigGroup("SomeName")]
    partial class SomeNameConfigGroup
    {
        [ConfigItem<int>("Item1", 123)]
        public partial int Item1 { get; set; }

        [ConfigItem<bool>("Item2", true)]
        public partial bool Item2 { get; set; }
    }
}
```

上方代码会声明一个名为 `SomeName` 的配置组。该配置组包含两个配置项：

| 配置键     | 属性      | 类型     | 默认值    |
|---------|---------|--------|--------|
| `Item1` | `Item1` | `int`  | `123`  |
| `Item2` | `Item2` | `bool` | `true` |

::: warning 注意
配置组内部的配置项不能添加 `static` 修饰符。
:::

## 使用配置组

配置组声明完成后，可以通过 `ConfigGroup` 注解中指定的名称访问。

```cs
var value = SomeClass.SomeName.Item1;
```

配置组支持对组内所有配置项执行统一操作：

```cs
SomeClass.SomeName.Reset();

var isDefault = SomeClass.SomeName.IsDefault();
```

配置组也可以作为作用域传递给其他 API，例如事件监听或观察器注册：

```cs
ConfigService.RegisterProvider(
    SomeClass.SomeName,
    new ConfigObserver(...)
);
```

也可以将配置组引用保存到变量中：

```cs
var group = SomeClass.SomeName;

group.Item2 = false;
```

## 配置事件

配置系统支持在配置项被读取、写入或变更时触发事件。事件触发器会在对应操作发生时同步执行，并检查当前配置项或配置作用域上注册的事件。

配置项实例提供 `Observe` 与 `Unobserve` 方法，用于直接管理事件监听。

除此之外，也可以使用 `RegisterConfigEvent` 注解注册事件。该注解应标记在类型为 `ConfigEventRegistry` 的公共静态属性上。

```cs
[RegisterConfigEvent]
public static ConfigEventRegistry SomeConfigChanged => new(
    scope: SomeConfigConfig,
    trigger: ConfigEvent.Changed,
    handler: e =>
    {
        // handle config event
    },
    isPreview: false
);
```

### `ConfigEventRegistry` 参数

| 参数          | 说明                                        |
|-------------|-------------------------------------------|
| `scope`     | 事件作用域，可以是配置项、配置组，或任意实现 `IConfigScope` 的实例 |
| `trigger`   | 事件触发类型，例如 `ConfigEvent.Changed`           |
| `handler`   | 事件处理函数                                    |
| `isPreview` | 是否为预览阶段事件                                 |

具体事件类型、事件参数结构及触发时机以代码文档为准。

## 作用域

配置系统中的作用域由 `IConfigScope` 表示。

以下对象均可作为事件或观察器的作用域：

* 单个配置项；
* 配置组；
* 其他实现 `IConfigScope` 的实例。

当作用域为配置组时，相关操作会应用到该配置组内的所有配置项和子配置组。

## 性能注意事项

配置项属性并不等价于普通 C# 属性。读取或写入配置项时，系统可能会执行序列化、反序列化、Provider 访问、事件触发、加密或解密等额外操作。

因此应遵守以下原则：

* 高频读取的配置值应在调用方缓存；
* 高频写入应尽量合并或减少次数；
* 加密配置项应避免在热路径中频繁访问；
* 需要监听变化时，应使用事件系统，而不是轮询配置值。

## API 摘要

### 属性注解

| API                   | 说明                    |
|-----------------------|-----------------------|
| `ConfigItem<T>`       | 声明具有显式默认值的配置项         |
| `AnyConfigItem<T>`    | 声明通过公共无参构造函数创建默认值的配置项 |
| `ConfigGroup`         | 声明配置组                 |
| `RegisterConfigEvent` | 注册配置事件                |

### 配置访问类型

| API            | 说明                       |
|----------------|--------------------------|
| `ConfigItem`   | 配置项实例，支持默认值判断、重置、事件管理等操作 |
| `ArgConfig<T>` | 带上下文参数的配置访问器             |
| `IConfigScope` | 配置作用域接口                  |

### 事件相关类型

| API                   | 说明       |
|-----------------------|----------|
| `ConfigEventRegistry` | 配置事件注册信息 |
| `ConfigEvent`         | 配置事件触发类型 |
| `ConfigObserver`      | 配置观察器    |

## 后续补充

以下内容仍需结合代码文档继续补充：

* `ConfigEvent` 的完整枚举值；
* `ConfigEventRegistry` 的参数细节；
* `ConfigItem` 的完整方法列表；
* `ConfigSource` 的完整枚举值；
* 不同 Provider 对类型序列化的支持差异。
