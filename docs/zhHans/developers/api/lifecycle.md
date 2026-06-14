---
order: 1
---

# 生命周期简介

本页面主要内容为社区版核心库 **生命周期管理** (Lifecycle Management) 系统的简介和基本用法。

## 简介

生命周期管理是一个用于控制整个程序执行流程的机制，所有内容均位于 `PCL.Core.App` 命名空间中。与 Android 开发等领域的生命周期不同，它的核心功能就是根据开发者的设计在特定生命周期状态 (state) 让程序做特定的事情，仅此而已，没有很复杂的设定，整体设计思路也非常简单。

生命周期基于两大基本要素工作，即 **生命周期状态** (Lifecycle State) 和 **生命周期服务** (Lifecycle Service)。其中生命周期状态就是从 `BeforeLoading` 到 `Exiting` 的几个固定的状态，位于 `LifecycleState` 枚举类型中；生命周期服务是指实现了 `ILifecycleService` 接口同时使用 `LifecycleService` 注解的类型，编译时这些类型会被记录在一个自动生成的文件中，并于运行时在指定的 起始状态 (Start State) 初始化和执行。

每个服务项均必须实现 `StartAsync()` 和 `StopAsync()` 方法，但不一定需要有具体内容。`StartAsync()` 方法将在指定起始状态被调用，若无特殊情况，整个程序运行期间只会被调用一次。程序结束时，将调用所有未声明自身已退出的服务项的 `StopAsync()` 方法。具体的调用规则可以参考源码内的文档，这里不再赘述。

## 基本用法

以下是一个符合设计预期的服务项实现：

```cs
using PCL.Core.App;

namespace PCL.Core.Native;

[LifecycleService(LifecycleState.Loaded, Priority = 114)]
public sealed class MessageService : ILifecycleService {
    // 基本属性
    public string Identifier => "message";
    public string Name => "消息服务";
    public bool SupportAsyncStart => true;

    // 上下文和构造函数
    // 设计预期是使用静态成员提供公开 API，因为这个服务在程序运行期间只会存在一个实例，故上下文对象使用静态私有成员即可
    // 当然你也可以用单例，这时上下文就可以不声明为静态了，但 C# 的单例调用不如 Kotlin 之类的优雅
    private static LifecycleContext? _context;
    private static LifecycleContext Context => _context!;
    private MessageService() { _context = Lifecycle.GetContext(this); }

    // 开始事件
    public Task StartAsync() {
        // do something...
    }

    // 结束事件
    public Task StopAsync() {
        // do something...
    }

    // 其它对外公开的静态方法，如广播信息文本
    public static void Broadcast(string message) {
        Context.Debug($"广播消息: {message}"); // 利用上下文输出日志
        // do something...
    }
}
```

如果不需要继承其它类，你也可以直接继承更为方便的 `GeneralService`：

```cs
using PCL.Core.App;

namespace PCL.Core.Update;

[LifecycleService(LifecycleState.Running)]
public sealed class UpdateCheckService : GeneralService {

    // 上下文
    // 如果没有在静态上下文中使用的需求，可以省略这里的声明并直接使用 ServiceContext
    // 如果省略，记得替换成 primary constructor
    private static LifecycleContext? _context;
    private static LifecycleContext Context => _context!;

    // 继承父类构造函数，此处 asyncStart 参数默认值为 true，因此省略
    private UpdateCheckService() : base("update-check", "更新检测") { _context = ServiceContext; }

    // 开始事件，可以不写
    public override void Start() {
        // do something...
        Context.DeclareStopped(); // 可选：主动停止服务，程序关闭时不会执行 Stop() 方法
    }

    // 结束事件，可以不写
    public override void Stop() {
        // do something...
    }

    // 其它对外公开的静态方法
}
```

::: note
Lifecycle 后续的一次更新中引入了更为方便的**基于作用域的服务声明** (Scope-based Service Declaration)，这个特性基于源生成器工作，极大简化了服务声明，是目前主要推荐的方式。

但这种方式隐藏了生命周期服务的技术细节，可能会导致开发者写出质量不高的代码，因此**在使用前请确保自己了解生命周期的工作逻辑**，能理解此处源生成器产出代码的大概过程。

可参考 [PCL.Core#150](https://github.com/PCL-Community/PCL.Core/pull/150)
:::

这里只给出标准用例，有关各种成员的作用等更多信息请参阅代码文档。

## 控制反转与依赖注入

在上述基于作用域的服务声明基础上，生命周期系统进一步引入了**控制反转** (Inversion of Control, IoC) 与**依赖注入** (Dependency Injection, DI) 机制，同样基于源生成器实现。该机制允许开发者通过自定义特性 (Attribute) 声明依赖提供方与消费方，编译时自动完成依赖收集与注入，是一种更为简化的写法。

以下以一个 RPC 功能注册为例说明此模式。

### 提供方

提供方通过自定义特性上的 `DependencyCollector` 注解声明可收集的依赖类型，并在生命周期服务中使用 `LifecycleDependencyInjection` 注解声明依赖注入的入口方法：

```cs
[AttributeUsage(AttributeTargets.Method | AttributeTargets.Property)]
[DependencyCollector<RpcFunction>("rpc-function", AttributeTargets.Method)]
[DependencyCollector<string>("rpc-property", AttributeTargets.Property)]
public sealed class RegisterRpc(string name) : Attribute;

[LifecycleService(LifecycleState.Loaded)]
[LifecycleScope("rpc", "远程执行服务")]
public sealed partial class RpcService
{
    // 通过 LifecycleDependencyInjection 声明依赖注入入口
    [LifecycleDependencyInjection("rpc-property", AttributeTargets.Property)]
    private static void _CollectRpcPropertyRegistry(ImmutableList<(PropertyAccessor<string> prop, string name)> items)
    {
        // 处理收集到的属性依赖...
    }

    [LifecycleDependencyInjection("rpc-function", AttributeTargets.Method)]
    private static void _CollectRpcFunctionRegistry(ImmutableList<(RpcFunction func, string name)> items)
    {
        // 处理收集到的方法依赖...
    }
}
```

- `RegisterRpc` 通过 `DependencyCollector` 声明自身可作为依赖收集的来源，分别针对方法和属性两种目标收集不同类型的依赖项。
- `RpcService` 声明 `LifecycleScope` 以定义一个作用域，并通过 `LifecycleDependencyInjection` 声明两个依赖注入入口方法。源生成器会在编译时自动扫描带有 `[RegisterRpc]` 特性的成员，将其收集后传入对应的注入方法。

### 消费方

消费方只需在目标成员上使用提供方定义的自定义特性即可，无需手动注册：

```cs
[RegisterRpc("user")]
public static string Username { get; set; }

[RegisterRpc("activate")]
public static RpcResponse Activate(string? argument, string? content, bool indent)
{
    // 处理激活逻辑...
}
```

- `[RegisterRpc("user")]` 标记的属性会被自动收集并传入 `_CollectRpcPropertyRegistry` 方法。
- `[RegisterRpc("activate")]` 标记的方法会被自动收集并传入 `_CollectRpcFunctionRegistry` 方法。

此模式将依赖的声明与收集完全分离，降低了服务类的耦合度，同时减少了样板代码。
