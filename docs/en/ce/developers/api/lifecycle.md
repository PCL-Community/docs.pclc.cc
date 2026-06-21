---
order: 1
---

# 生命周期管理

生命周期管理（Lifecycle Management）是 PCL CE 核心库中用于组织应用启动、运行与退出流程的基础机制，位于 `PCL.Core.App` 命名空间。

该系统通过固定的生命周期状态与可注册的生命周期服务，将不同模块的初始化、运行期任务和退出清理逻辑挂载到应用的指定阶段中执行。

本文介绍生命周期系统的核心概念、服务声明方式、运行行为，以及基于源生成器的作用域服务声明与依赖注入机制。

## 概览

生命周期系统由两个核心概念组成：

| 概念     | 说明                                          |
|--------|---------------------------------------------|
| 生命周期状态 | 应用运行过程中的固定阶段，由 `LifecycleState` 枚举表示        |
| 生命周期服务 | 参与生命周期调度的服务，由 `ILifecycleService` 或相关封装类型实现 |

生命周期服务会在声明的起始状态被初始化并启动。应用退出时，生命周期系统会对仍处于活动状态的服务执行停止逻辑。

生命周期系统的主要用途包括：

* 在指定应用阶段初始化服务；
* 统一管理服务启动与停止；
* 为服务提供生命周期上下文；
* 通过源生成器收集服务声明；
* 支持基于作用域的服务声明；
* 支持控制反转与依赖注入模式。

## 命名空间

生命周期相关 API 主要位于以下命名空间：

```cs
using PCL.Core.App;
```

## 生命周期状态

生命周期状态由 `LifecycleState` 枚举表示，用于描述应用当前所处的运行阶段。

文档中涉及的状态包括：

| 状态              | 说明     |
|-----------------|--------|
| `BeforeLoading` | 加载前阶段  |
| `Loaded`        | 加载完成阶段 |
| `Running`       | 正常运行阶段 |
| `Exiting`       | 退出阶段   |

生命周期服务通过 `LifecycleService` 特性声明自己的起始状态。服务会在应用进入对应状态时启动。

具体状态流转顺序、状态含义与调度细节以源码内代码文档为准。

## 生命周期服务

生命周期服务是由生命周期系统管理的服务实例。

一个标准生命周期服务需要满足以下条件：

* 实现 `ILifecycleService` 接口，或继承生命周期系统提供的服务基类；
* 使用 `LifecycleService` 特性声明服务起始状态；
* 提供可供生命周期系统实例化的构造方式；
* 实现启动与停止逻辑。

生命周期服务通常用于承载一个模块的全局能力，例如消息广播、更新检查、事件总线、配置系统初始化等。

## `ILifecycleService`

`ILifecycleService` 是生命周期服务的基础接口。

实现该接口的类型可以被生命周期系统识别并调度。

### 基本成员

| 成员                  | 说明       |
|---------------------|----------|
| `Identifier`        | 服务唯一标识   |
| `Name`              | 服务显示名称   |
| `SupportAsyncStart` | 是否支持异步启动 |
| `StartAsync()`      | 服务启动时调用  |
| `StopAsync()`       | 服务停止时调用  |

`StartAsync()` 会在服务声明的起始状态被调用。除特殊情况外，一个服务在整个应用运行期间只会启动一次。

`StopAsync()` 会在程序结束时被调用。若服务已声明自身停止，则生命周期系统不会再次调用其停止逻辑。

## `LifecycleService`

`LifecycleService` 特性用于声明一个生命周期服务。

```cs
[LifecycleService(LifecycleState.Loaded, Priority = 114)]
public sealed class MessageService : ILifecycleService
{
}
```

### 参数

| 参数               | 说明      |
|------------------|---------|
| `LifecycleState` | 服务的起始状态 |
| `Priority`       | 服务启动优先级 |

编译时，源生成器会扫描带有 `LifecycleService` 特性的服务类型，并将其记录到自动生成的生命周期注册文件中。运行时，生命周期系统会根据注册信息在对应状态初始化并启动服务。

## 标准服务声明

以下示例展示了一个直接实现 `ILifecycleService` 的生命周期服务。

```cs
using PCL.Core.App;

namespace PCL.Core.Native;

[LifecycleService(LifecycleState.Loaded, Priority = 114)]
public sealed class MessageService : ILifecycleService
{
    public string Identifier => "message";

    public string Name => "消息服务";

    public bool SupportAsyncStart => true;

    private static LifecycleContext? _context;

    private static LifecycleContext Context => _context!;

    private MessageService()
    {
        _context = Lifecycle.GetContext(this);
    }

    public Task StartAsync()
    {
        // initialize service
        return Task.CompletedTask;
    }

    public Task StopAsync()
    {
        // release service resources
        return Task.CompletedTask;
    }

    public static void Broadcast(string message)
    {
        Context.Debug($"广播消息: {message}");

        // broadcast message
    }
}
```

该示例中，服务在 `LifecycleState.Loaded` 状态启动，并通过 `Lifecycle.GetContext(this)` 获取当前服务对应的生命周期上下文。

由于生命周期服务在应用运行期间通常只存在一个实例，因此服务可以通过静态成员公开模块级 API。是否使用静态成员、单例对象或实例成员，应根据服务本身的职责和调用方式决定。

## `LifecycleContext`

`LifecycleContext` 表示生命周期服务的运行上下文。

服务可以通过上下文执行日志输出、状态声明等与生命周期系统相关的操作。

示例：

```cs
Context.Debug("message");
```

服务也可以声明自身已经停止：

```cs
Context.DeclareStopped();
```

服务声明自身停止后，应用退出时生命周期系统不会再调用该服务的停止逻辑。

## `GeneralService`

`GeneralService` 是生命周期系统提供的便捷基类。若服务不需要继承其他类型，可以继承 `GeneralService` 以减少样板代码。

```cs
using PCL.Core.App;

namespace PCL.Core.Update;

[LifecycleService(LifecycleState.Running)]
public sealed class UpdateCheckService : GeneralService
{
    private static LifecycleContext? _context;

    private static LifecycleContext Context => _context!;

    private UpdateCheckService()
        : base("update-check", "更新检测")
    {
        _context = ServiceContext;
    }

    public override void Start()
    {
        // start update check

        Context.DeclareStopped();
    }

    public override void Stop()
    {
        // stop update check
    }
}
```

`GeneralService` 适用于不需要手动实现完整 `ILifecycleService` 接口的服务。

### 构造参数

| 参数           | 说明                   |
|--------------|----------------------|
| `identifier` | 服务唯一标识               |
| `name`       | 服务显示名称               |
| `asyncStart` | 是否支持异步启动，默认值为 `true` |

### 可重写成员

| 成员        | 说明     |
|-----------|--------|
| `Start()` | 服务启动逻辑 |
| `Stop()`  | 服务停止逻辑 |

如果服务不需要启动或停止逻辑，可以省略对应重写方法。

## 运行行为

生命周期服务的运行行为由生命周期系统统一管理。

| 阶段  | 行为                                |
|-----|-----------------------------------|
| 编译期 | 源生成器收集带有 `LifecycleService` 特性的服务 |
| 运行期 | 应用进入指定生命周期状态时启动对应服务               |
| 退出期 | 应用退出时停止仍处于活动状态的服务                 |

`StartAsync()` 或 `Start()` 通常只会在服务起始状态被调用一次。

程序结束时，生命周期系统会调用所有未声明自身已停止的服务的停止逻辑。

具体调用顺序、异常处理、优先级排序与状态切换规则，以源码内代码文档为准。

## 基于作用域的服务声明

生命周期系统支持基于作用域的服务声明（Scope-based Service Declaration）。

该机制基于源生成器工作，用于简化生命周期服务声明。开发者可以通过声明服务作用域，让源生成器生成部分生命周期服务相关代码，从而减少手动实现接口、上下文和注册逻辑的样板代码。

该机制目前是推荐的服务声明方式。

::: warning 注意
基于作用域的服务声明会隐藏一部分生命周期服务的实现细节。使用该机制前，应先理解生命周期状态、服务启动时机、上下文获取方式和源生成器产物的大致结构，避免写出职责不清或生命周期不明确的服务。

相关实现可参考：[PCL.Core#150](https://github.com/PCL-Community/PCL.Core/pull/150)
:::

## 控制反转与依赖注入

在基于作用域的服务声明基础上，生命周期系统进一步提供了控制反转（Inversion of Control, IoC）与依赖注入（Dependency Injection, DI）机制。

该机制同样基于源生成器实现。开发者可以通过自定义特性声明依赖提供方与消费方，编译时由源生成器完成依赖收集，并将结果注入到生命周期服务指定的入口方法中。

该机制适用于插件式注册、命令收集、RPC 函数收集等场景。

## 依赖提供方

依赖提供方通过自定义特性声明。自定义特性可以使用 `DependencyCollector` 标记其可收集的依赖类型和目标成员类型。

以下示例定义了一个用于注册 RPC 成员的特性：

```cs
[AttributeUsage(AttributeTargets.Method | AttributeTargets.Property)]
[DependencyCollector<RpcFunction>("rpc-function", AttributeTargets.Method)]
[DependencyCollector<string>("rpc-property", AttributeTargets.Property)]
public sealed class RegisterRpc(string name) : Attribute;
```

该声明表示：

| 依赖键            | 目标类型       | 收集类型          |
|----------------|------------|---------------|
| `rpc-function` | `Method`   | `RpcFunction` |
| `rpc-property` | `Property` | `string`      |

源生成器会扫描使用 `[RegisterRpc]` 标记的成员，并根据目标类型和依赖键将其归入对应依赖集合。

## 依赖注入入口

生命周期服务可以使用 `LifecycleDependencyInjection` 声明依赖注入入口。

```cs
[LifecycleService(LifecycleState.Loaded)]
[LifecycleScope("rpc", "远程执行服务")]
public sealed partial class RpcService
{
    [LifecycleDependencyInjection("rpc-property", AttributeTargets.Property)]
    private static void _CollectRpcPropertyRegistry(
        ImmutableList<(PropertyAccessor<string> prop, string name)> items)
    {
        // handle collected property dependencies
    }

    [LifecycleDependencyInjection("rpc-function", AttributeTargets.Method)]
    private static void _CollectRpcFunctionRegistry(
        ImmutableList<(RpcFunction func, string name)> items)
    {
        // handle collected method dependencies
    }
}
```

### 参数

| 参数   | 说明                              |
|------|---------------------------------|
| 依赖键  | 与 `DependencyCollector` 中声明的键对应 |
| 目标类型 | 指定收集方法、属性或其他成员类型                |

源生成器会在编译时收集匹配的依赖项，并在生命周期服务初始化时传入对应的注入入口方法。

## 依赖消费方

依赖消费方只需要在目标成员上使用提供方定义的自定义特性，无需手动注册。

```cs
[RegisterRpc("user")]
public static string Username { get; set; }

[RegisterRpc("activate")]
public static RpcResponse Activate(string? argument, string? content, bool indent)
{
    // handle activation
}
```

上方示例中：

| 成员         | 目标类型 | 收集结果                     |
|------------|------|--------------------------|
| `Username` | 属性   | 被收集到 `rpc-property` 依赖集合 |
| `Activate` | 方法   | 被收集到 `rpc-function` 依赖集合 |

依赖提供方只负责声明“哪些成员可以被收集”，依赖消费方只负责标记“自身需要被收集”。实际收集和注入过程由源生成器自动完成。

## API 摘要

### 生命周期核心类型

| API                 | 说明         |
|---------------------|------------|
| `LifecycleState`    | 生命周期状态枚举   |
| `ILifecycleService` | 生命周期服务接口   |
| `LifecycleService`  | 生命周期服务声明特性 |
| `LifecycleContext`  | 生命周期服务上下文  |
| `Lifecycle`         | 生命周期系统访问入口 |
| `GeneralService`    | 生命周期服务便捷基类 |

### 作用域与依赖注入相关类型

| API                            | 说明          |
|--------------------------------|-------------|
| `LifecycleScope`               | 声明生命周期服务作用域 |
| `DependencyCollector`          | 声明依赖收集规则    |
| `LifecycleDependencyInjection` | 声明依赖注入入口    |
| `PropertyAccessor<T>`          | 属性依赖访问器     |

## 使用建议

* 生命周期服务应保持职责单一，不应将多个无关模块塞入同一个服务。
* 服务起始状态应选择实际需要的最晚阶段，避免过早初始化。
* 长生命周期资源应在停止逻辑中释放。
* 若服务已主动完成并不需要退出清理，可通过上下文声明自身已停止。
* 对外公开的服务 API 应保持稳定，避免让调用方依赖生命周期内部细节。
* 使用基于作用域的服务声明前，应先理解标准生命周期服务的生成目标和运行模型。
* 使用依赖注入机制时，应保证依赖键命名清晰，避免多个功能复用含义不同的同一键名。

## 后续参考

有关各成员的完整定义、状态调度规则、源生成器产物和异常行为，请以源码内代码文档为准。
