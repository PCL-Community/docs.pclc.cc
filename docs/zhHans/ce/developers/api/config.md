---
order: 3
---

# 应用配置系统简介

本文主要讲述配置系统的用法及底层 NTraffic API 的运行原理。

## 配置项的声明与使用

### 声明

很简单，一行代码:

```cs
[ConfigItem<int>("SomeKey", 114514, ConfigSource.Shared)] public static partial int SomeConfig { get; set; }
```

这样你就声明了一个键为 `SomeKey` 的配置项，其具有默认值 `114514`，配置项的存储位置是 Shared (全局共享配置)，并将其绑定到了属性 `SomeConfig` 上。这个声明可以写在任意顶层 `partial` 类中。

其中，注解的第三个参数默认为 `Shared`，故以上示例的注解部分可以不写第三个参数，简化为 `[ConfigItem<int>("SomeKey", 114514)]`。配置项的类型可以是任意类型，但需要底层 Provider 和 NTraffic 实现支持这个类型，目前 JSON 实现可以确定具有完整支持，YAML 实现尚不明确。

::: note
为了增强可维护性，绝大多数配置项都应统一声明在 `App\Config.cs` 文件中。
:::

你也可以使用 `AnyConfigItem` 注解来声明配置项，例如:

```cs
[AnyConfigItem<GrayProfileConfig>("SomeKey", ConfigSource.Local)] public static partial GrayProfileConfig SomeConfig { get; set; }
```

这个注解与上面的唯一区别是它不需要填写默认值参数，默认值将通过给定类型的公共无参构造函数获得，以解决巨硬在 2025 年仍旧不支持隔壁 JVM 在 2015 年就支持的极其先进的非基本类型注解参数的问题。因此，使用这个注解需要确保给定类型存在公共无参构造函数，否则将会编译失败。

### 使用

直接调用配置项绑定的属性即可，获取值和设置值都可以。

你也可以在配置项绑定的属性名后面加上 `Config` 来访问该配置项对应的 `ConfigItem` 实例，它支持获取默认值和重置等非基本操作。

::: note
获取和设置配置项的性能代价远比使用一个常规属性大，尤其是加密的配置项。因此，在获取配置值时，若不需要实时更新的值，请缓存而不是频繁多次获取，设置配置值时同理。若需实时更新的值，请考虑使用事件系统而不是轮询观察。
:::

```cs
var a = SomeClass.SomeConfig; // 获取值
SomeClass.SomeConfig = a; // 设置值
// 使用对应的 ConfigItem 实例
var item = SomeClass.SomeConfigConfig;
var isDefault = item.IsDefault();
item.Reset();
```

### 附带上下文参数

`ConfigItem` 的 `GetValue` `SetValue` `Reset` 等方法原生支持添加上下文参数，可直接使用。同时，当一个配置项绑定的属性类型为 `ArgConfig<T>` 而不是 `T` 时，这个属性将会指向带参数的访问器，可以通过索引语法来附带上下文参数获取和设置值。

```cs
// ** 类型为 ArgConfig<T> 时不能添加 set 修饰 **
[ConfigItem<int>("SomeKey", 114514)] public static partial ArgConfig<int> SomeConfig { get; }

void SomeMethod() {
    var a = "1919810";
    LogWrapper.Info(SomeConfig[a].ToString());
    SomeConfig[a] = 1919820;
    // 你也可以传 null, 相当于不附带上下文参数, 但不可省略 []
    SomeConfig[null] = 114524;
}
```

## 配置组的声明与使用

### 声明

在任意**顶层** `partial` 类或另一个声明为配置组的类中声明一个 `partial class` 并标记 `[ConfigGroup("SomeName")]` 注解即可声明一个配置组:

```cs
public partial class SomeClass {
    [ConfigGroup("SomeName")] partial class SomeNameConfigGroup {
        // 注意: 配置组中的配置项不可添加 static 修饰符
        [ConfigItem<int>("Item1", 123)] public partial int Item1 { get; set; }
        [ConfigItem<bool>("Item2", true)] public partial bool Item2 { get; set; }
    }
}
```

这样就声明了一个叫 `SomeName` 的配置组，其拥有对内部所有配置项和配置组同时操作的能力，可以用于重置和事件订阅等场景。

### 使用

直接使用上面声明时填写的名称访问即可，例如:

```cs
// 访问配置组的成员
var a = SomeClass.SomeName.Item1;
// 同时操作组中的所有配置项, 领先龙猫 100 年
SomeClass.SomeName.Reset();
var isDefault = SomeClass.SomeName.IsDefault();
// 向组中所有作用域注册事件观察器, 下面会详细讲
ConfigService.RegisterProvider(SomeClass.SomeName, new ConfigObserver(...));
// 将配置组引用传递给变量
var group = SomeClass.SomeName;
group.Item2 = false;
```

## 事件触发与监听

配置项的某个读取/写入操作被调用时将同步调用事件触发器，检查已向当前配置项注册的事件并触发。

配置项实例提供了 `Observe` 和 `Unobserve` 方法用于管理向此配置项注册的事件，但可能更常用 `[RegisterConfigEvent]` 注解标记一个类型为 `ConfigEventRegistry` 的公共静态属性来注册配置项，如下方示例。

```cs
[RegisterConfigEvent]
public static ConfigEventRegistry SomeConfigChanged => new(
    scope: SomeConfigConfig,
    trigger: ConfigEvent.Changed,
    handler: e => {
        // some code
    },
    isPreview: false
);
```

其中作用域可以传入一个配置项、配置组亦或是其他实现了 `IConfigScope` 的类型的任意实例，具体信息及其他参数的用法可以参考代码文档。

*未完待续*
