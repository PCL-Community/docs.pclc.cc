---
order: 3
---

# Introduction to the Application Configuration System

This article introduces the declaration methods, generated members, access patterns, and the underlying event and scope mechanisms based on the NTraffic API in the PCL CE application configuration system.

The configuration system binds configuration items to C# properties through source generators. Developers only need to declare configuration items, and can then read and write configuration values through properties, or perform operations such as resetting, default-value checks, and event listening through the corresponding `ConfigItem` instance.

## Overview

The configuration system mainly includes the following concepts:

| Concept              | Description                                                                                                                        |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Configuration item   | A single readable and writable configuration value, declared by `ConfigItem<T>` or `AnyConfigItem<T>`                              |
| Configuration group  | A collection of multiple configuration items or child configuration groups, declared by `ConfigGroup`                              |
| Configuration source | The storage location of a configuration item, such as globally shared configuration or local configuration                         |
| Context argument     | Additional arguments attached to configuration reads and writes, used to distinguish configuration values under different contexts |
| Event                | A synchronous callback mechanism triggered when a configuration item is read, written, or changed                                  |

## Configuration Sources

Configuration items specify their storage location through `ConfigSource`.

The configuration sources covered in this document include:

| Value                 | Description                   |
| --------------------- | ----------------------------- |
| `ConfigSource.Shared` | Globally shared configuration |
| `ConfigSource.Local`  | Local configuration           |

The third parameter of `ConfigItem<T>` is used to specify the configuration source. If this parameter is omitted, `ConfigSource.Shared` is used by default.

## Declaring Configuration Items

### Using `ConfigItem<T>`

`ConfigItem<T>` is used to declare a configuration item with an explicit default value.

```cs
[ConfigItem<int>("SomeKey", 114514, ConfigSource.Shared)]
public static partial int SomeConfig { get; set; }
```

The declaration above generates a configuration item with the key `SomeKey` and binds it to the `SomeConfig` property.

This configuration item has the following characteristics:

| Item                 | Value                 |
| -------------------- | --------------------- |
| Configuration key    | `SomeKey`             |
| Configuration type   | `int`                 |
| Default value        | `114514`              |
| Configuration source | `ConfigSource.Shared` |
| Bound property       | `SomeConfig`          |

Since `ConfigSource.Shared` is the default value, the third parameter can be omitted:

```cs
[ConfigItem<int>("SomeKey", 114514)]
public static partial int SomeConfig { get; set; }
```

Configuration item declarations can be written in any top-level `partial` class.

::: note Note
To improve maintainability, most configuration items should be declared uniformly in the `App\Config.cs` file.
:::

### Type Support

The type parameter `T` of `ConfigItem<T>` can be any type, but the types that can actually be used depend on the implementation support of the underlying Provider and NTraffic.

The JSON implementation is currently known to have full support. Support in the YAML implementation should be determined according to the corresponding Provider implementation.

## Using `AnyConfigItem<T>`

`AnyConfigItem<T>` is used to declare configuration items of non-primitive types that cannot be written directly into annotation parameters.

```cs
[AnyConfigItem<GrayProfileConfig>("SomeKey", ConfigSource.Local)]
public static partial GrayProfileConfig SomeConfig { get; set; }
```

Unlike `ConfigItem<T>`, `AnyConfigItem<T>` does not accept a default value parameter. The default value is created through the public parameterless constructor of type `T`.

Therefore, when using `AnyConfigItem<T>`, type `T` must meet the following conditions:

* It has a public parameterless constructor;
* It can be correctly serialized and deserialized by the underlying Provider;
* It can be recognized and handled by the current NTraffic implementation.

If type `T` does not have a public parameterless constructor, compilation will fail.

## Accessing Configuration Items

After a configuration item is declared, its configuration value can be read or written directly through the bound property.

```cs
var value = SomeClass.SomeConfig;

SomeClass.SomeConfig = value;
```

When reading the property, the configuration system obtains the current value from the corresponding configuration source. When writing the property, the configuration system writes the new value back to the corresponding configuration source.

## Accessing the Generated `ConfigItem` Instance

For each bound property, the source generator also generates an additional access entry point for the corresponding `ConfigItem` instance.

The naming rule for the generated member is:

```text
{PropertyName}Config
```

For example, when the property name is `SomeConfig`, the corresponding `ConfigItem` instance is:

```cs
SomeClass.SomeConfigConfig
```

You can use this instance to perform operations such as default-value checks and resets:

```cs
var item = SomeClass.SomeConfigConfig;

var isDefault = item.IsDefault();

item.Reset();
```

Common operations include:

| Operation       | Description                                                             |
| --------------- | ----------------------------------------------------------------------- |
| `IsDefault()`   | Determines whether the current configuration value is the default value |
| `Reset()`       | Resets the configuration item to its default value                      |
| `GetValue(...)` | Gets the configuration value, optionally with context arguments         |
| `SetValue(...)` | Sets the configuration value, optionally with context arguments         |

::: note Note
Reading and writing configuration items costs more than ordinary property access, especially for encrypted configuration items. If a real-time value is not required, cache the read result to avoid frequent access. If you need to respond to configuration changes, it is recommended to use the event mechanism instead of repeatedly reading the configuration through polling.
:::

## Using Context Arguments

Methods such as `GetValue`, `SetValue`, and `Reset` on `ConfigItem` support context arguments. Context arguments can be used to distinguish different invocation environments under the same configuration item.

When the type of the bound property is `ArgConfig<T>`, the property generates an accessor with context arguments. In this case, values can be read or written using index syntax.

```cs
[ConfigItem<int>("SomeKey", 114514)]
public static partial ArgConfig<int> SomeConfig { get; }
```

::: warning Note
When the configuration item property type is `ArgConfig<T>`, the property must not include a `set` accessor.
:::

Example:

```cs
void SomeMethod()
{
    var context = "1919810";

    var value = SomeConfig[context];

    SomeConfig[context] = 1919820;
}
```

If you need to access the configuration item without context arguments, pass `null`:

```cs
SomeConfig[null] = 114524;
```

For `ArgConfig<T>`, the indexer cannot be omitted. Even when context arguments are not used, `null` must be passed explicitly.

## Declaring Configuration Groups

Configuration groups are used to organize multiple configuration items or child configuration groups into the same scope. Configuration groups can be used for scenarios such as batch resets, default-value checks, and event registration.

Configuration groups are declared through `ConfigGroup`. The declaration can be located in any top-level `partial` class, or in another class that has already been declared as a configuration group.

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

The code above declares a configuration group named `SomeName`. This configuration group contains two configuration items:

| Configuration key | Property | Type   | Default value |
| ----------------- | -------- | ------ | ------------- |
| `Item1`           | `Item1`  | `int`  | `123`         |
| `Item2`           | `Item2`  | `bool` | `true`        |

::: warning Note
Configuration items inside a configuration group must not include the `static` modifier.
:::

## Using Configuration Groups

After a configuration group is declared, it can be accessed through the name specified in the `ConfigGroup` annotation.

```cs
var value = SomeClass.SomeName.Item1;
```

Configuration groups support unified operations on all configuration items in the group:

```cs
SomeClass.SomeName.Reset();

var isDefault = SomeClass.SomeName.IsDefault();
```

A configuration group can also be passed as a scope to other APIs, such as event listening or observer registration:

```cs
ConfigService.RegisterProvider(
    SomeClass.SomeName,
    new ConfigObserver(...)
);
```

A configuration group reference can also be stored in a variable:

```cs
var group = SomeClass.SomeName;

group.Item2 = false;
```

## Configuration Events

The configuration system supports triggering events when configuration items are read, written, or changed. Event triggers are executed synchronously when the corresponding operation occurs, and they check the events registered on the current configuration item or configuration scope.

Configuration item instances provide `Observe` and `Unobserve` methods for directly managing event listeners.

In addition, events can also be registered using the `RegisterConfigEvent` annotation. This annotation should be applied to a public static property of type `ConfigEventRegistry`.

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

### `ConfigEventRegistry` Parameters

| Parameter   | Description                                                                                                               |
| ----------- | ------------------------------------------------------------------------------------------------------------------------- |
| `scope`     | The event scope, which can be a configuration item, a configuration group, or any instance that implements `IConfigScope` |
| `trigger`   | The event trigger type, such as `ConfigEvent.Changed`                                                                     |
| `handler`   | The event handler function                                                                                                |
| `isPreview` | Whether this is a preview-phase event                                                                                     |

The exact event types, event argument structures, and trigger timing are subject to the code documentation.

## Scopes

Scopes in the configuration system are represented by `IConfigScope`.

The following objects can all be used as the scope of an event or observer:

* A single configuration item;
* A configuration group;
* Other instances that implement `IConfigScope`.

When the scope is a configuration group, related operations are applied to all configuration items and child configuration groups within that group.

## Performance Considerations

Configuration item properties are not equivalent to ordinary C# properties. When reading or writing a configuration item, the system may perform additional operations such as serialization, deserialization, Provider access, event triggering, encryption, or decryption.

Therefore, the following principles should be followed:

* Configuration values that are read frequently should be cached by the caller;
* Frequent writes should be merged or reduced as much as possible;
* Encrypted configuration items should not be accessed frequently on hot paths;
* When changes need to be monitored, use the event system instead of polling configuration values.

## API Summary

### Property Annotations

| API                   | Description                                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| `ConfigItem<T>`       | Declares a configuration item with an explicit default value                                            |
| `AnyConfigItem<T>`    | Declares a configuration item whose default value is created through a public parameterless constructor |
| `ConfigGroup`         | Declares a configuration group                                                                          |
| `RegisterConfigEvent` | Registers a configuration event                                                                         |

### Configuration Access Types

| API            | Description                                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------------------------- |
| `ConfigItem`   | Configuration item instance, supporting operations such as default-value checks, resets, and event management |
| `ArgConfig<T>` | Configuration accessor with context arguments                                                                 |
| `IConfigScope` | Configuration scope interface                                                                                 |

### Event-related Types

| API                   | Description                                  |
| --------------------- | -------------------------------------------- |
| `ConfigEventRegistry` | Configuration event registration information |
| `ConfigEvent`         | Configuration event trigger type             |
| `ConfigObserver`      | Configuration observer                       |

## Further Supplements

The following content still needs to be supplemented together with code documentation:

* The complete enum values of `ConfigEvent`;
* Parameter details of `ConfigEventRegistry`;
* The complete method list of `ConfigItem`;
* The complete enum values of `ConfigSource`;
* Differences in type serialization support among different Providers.
