---
order: 1
---

# Lifecycle Management

Lifecycle Management is the basic mechanism used by the PCL CE core library to organize application startup, runtime, and shutdown processes. It is located in the `PCL.Core.App` namespace.

Through fixed lifecycle states and registerable lifecycle services, this system attaches initialization, runtime tasks, and shutdown cleanup logic from different modules to specific application phases for execution.

This article introduces the core concepts of the lifecycle system, service declaration methods, runtime behavior, and the source-generator-based scope service declaration and dependency injection mechanisms.

## Overview

The lifecycle system consists of two core concepts:

| Concept           | Description                                                                                                           |
|-------------------|-----------------------------------------------------------------------------------------------------------------------|
| Lifecycle state   | A fixed phase during application execution, represented by the `LifecycleState` enum                                  |
| Lifecycle service | A service that participates in lifecycle scheduling, implemented through `ILifecycleService` or related wrapper types |

Lifecycle services are initialized and started at their declared starting state. When the application exits, the lifecycle system executes stop logic for services that are still active.

The main purposes of the lifecycle system include:

* Initializing services at specified application phases;
* Managing service startup and shutdown in a unified way;
* Providing lifecycle context for services;
* Collecting service declarations through source generators;
* Supporting scope-based service declarations;
* Supporting Inversion of Control and Dependency Injection patterns.

## Namespace

Lifecycle-related APIs are mainly located in the following namespace:

```cs
using PCL.Core.App;
```

## Lifecycle States

Lifecycle states are represented by the `LifecycleState` enum and are used to describe the current runtime phase of the application.

The states mentioned in this document include:

| State           | Description          |
|-----------------|----------------------|
| `BeforeLoading` | Before-loading phase |
| `Loaded`        | Loaded phase         |
| `Running`       | Normal running phase |
| `Exiting`       | Exiting phase        |

Lifecycle services declare their starting state through the `LifecycleService` attribute. A service starts when the application enters the corresponding state.

The exact state transition order, state meanings, and scheduling details are subject to the code documentation in the source.

## Lifecycle Services

A lifecycle service is a service instance managed by the lifecycle system.

A standard lifecycle service needs to meet the following conditions:

* Implement the `ILifecycleService` interface, or inherit from a service base class provided by the lifecycle system;
* Declare the service starting state with the `LifecycleService` attribute;
* Provide a construction method that can be instantiated by the lifecycle system;
* Implement startup and shutdown logic.

Lifecycle services are usually used to carry global capabilities of a module, such as message broadcasting, update checks, event buses, configuration system initialization, and similar functionality.

## `ILifecycleService`

`ILifecycleService` is the basic interface for lifecycle services.

Types that implement this interface can be recognized and scheduled by the lifecycle system.

### Basic Members

| Member              | Description                               |
|---------------------|-------------------------------------------|
| `Identifier`        | Unique service identifier                 |
| `Name`              | Service display name                      |
| `SupportAsyncStart` | Whether asynchronous startup is supported |
| `StartAsync()`      | Called when the service starts            |
| `StopAsync()`       | Called when the service stops             |

`StartAsync()` is called at the service’s declared starting state. Except in special cases, a service is started only once during the entire application runtime.

`StopAsync()` is called when the program exits. If the service has declared itself stopped, the lifecycle system will not call its stop logic again.

## `LifecycleService`

The `LifecycleService` attribute is used to declare a lifecycle service.

```cs
[LifecycleService(LifecycleState.Loaded, Priority = 114)]
public sealed class MessageService : ILifecycleService
{
}
```

### Parameters

| Parameter        | Description                       |
|------------------|-----------------------------------|
| `LifecycleState` | The starting state of the service |
| `Priority`       | The service startup priority      |

At compile time, the source generator scans service types with the `LifecycleService` attribute and records them into the automatically generated lifecycle registration file. At runtime, the lifecycle system initializes and starts services in the corresponding states according to the registration information.

## Standard Service Declaration

The following example shows a lifecycle service that directly implements `ILifecycleService`.

```cs
using PCL.Core.App;

namespace PCL.Core.Native;

[LifecycleService(LifecycleState.Loaded, Priority = 114)]
public sealed class MessageService : ILifecycleService
{
    public string Identifier => "message";

    public string Name => "Message Service";

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
        Context.Debug($"Broadcast message: {message}");

        // broadcast message
    }
}
```

In this example, the service starts in the `LifecycleState.Loaded` state and obtains the lifecycle context corresponding to the current service through `Lifecycle.GetContext(this)`.

Because a lifecycle service usually has only one instance during application runtime, the service can expose module-level APIs through static members. Whether to use static members, singleton objects, or instance members should be decided according to the responsibility and calling pattern of the service itself.

## `LifecycleContext`

`LifecycleContext` represents the runtime context of a lifecycle service.

Services can use the context to perform operations related to the lifecycle system, such as logging output and status declaration.

Example:

```cs
Context.Debug("message");
```

A service can also declare that it has stopped:

```cs
Context.DeclareStopped();
```

After a service declares itself stopped, the lifecycle system will not call that service’s stop logic again when the application exits.

## `GeneralService`

`GeneralService` is a convenient base class provided by the lifecycle system. If a service does not need to inherit from another type, it can inherit from `GeneralService` to reduce boilerplate code.

```cs
using PCL.Core.App;

namespace PCL.Core.Update;

[LifecycleService(LifecycleState.Running)]
public sealed class UpdateCheckService : GeneralService
{
    private static LifecycleContext? _context;

    private static LifecycleContext Context => _context!;

    private UpdateCheckService()
        : base("update-check", "Update Check")
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

`GeneralService` is suitable for services that do not need to manually implement the full `ILifecycleService` interface.

### Constructor Parameters

| Parameter    | Description                                                            |
|--------------|------------------------------------------------------------------------|
| `identifier` | Unique service identifier                                              |
| `name`       | Service display name                                                   |
| `asyncStart` | Whether asynchronous startup is supported. The default value is `true` |

### Overridable Members

| Member    | Description            |
|-----------|------------------------|
| `Start()` | Service startup logic  |
| `Stop()`  | Service shutdown logic |

If a service does not need startup or shutdown logic, the corresponding override method can be omitted.

## Runtime Behavior

The runtime behavior of lifecycle services is uniformly managed by the lifecycle system.

| Phase        | Behavior                                                                                         |
|--------------|--------------------------------------------------------------------------------------------------|
| Compile time | The source generator collects services with the `LifecycleService` attribute                     |
| Runtime      | The corresponding services are started when the application enters the specified lifecycle state |
| Shutdown     | Services that are still active are stopped when the application exits                            |

`StartAsync()` or `Start()` is usually called only once at the service’s starting state.

When the program ends, the lifecycle system calls the stop logic of all services that have not declared themselves stopped.

The exact call order, exception handling, priority ordering, and state transition rules are subject to the code documentation in the source.

## Scope-based Service Declaration

The lifecycle system supports Scope-based Service Declaration.

This mechanism works based on source generators and is used to simplify lifecycle service declarations. Developers can declare a service scope, and the source generator will generate part of the lifecycle-service-related code, reducing the boilerplate needed to manually implement interfaces, contexts, and registration logic.

This mechanism is currently the recommended service declaration method.

::: warning Note
Scope-based service declaration hides part of the implementation details of lifecycle services. Before using this mechanism, you should first understand lifecycle states, service startup timing, context acquisition, and the general structure of source generator outputs, to avoid writing services with unclear responsibilities or ambiguous lifecycles.
:::

For the related implementation, see: [PCL.Core#150](https://github.com/PCL-Community/PCL.Core/pull/150)

## Inversion of Control and Dependency Injection

On top of scope-based service declaration, the lifecycle system further provides Inversion of Control (IoC) and Dependency Injection (DI) mechanisms.

This mechanism is also implemented through source generators. Developers can use custom attributes to declare dependency providers and consumers. At compile time, the source generator completes dependency collection and injects the results into the specified entry methods of lifecycle services.

This mechanism is suitable for scenarios such as plugin-style registration, command collection, and RPC function collection.

## Dependency Providers

Dependency providers are declared through custom attributes. A custom attribute can use `DependencyCollector` to mark the collectible dependency type and target member type.

The following example defines an attribute used to register RPC members:

```cs
[AttributeUsage(AttributeTargets.Method | AttributeTargets.Property)]
[DependencyCollector<RpcFunction>("rpc-function", AttributeTargets.Method)]
[DependencyCollector<string>("rpc-property", AttributeTargets.Property)]
public sealed class RegisterRpc(string name) : Attribute;
```

This declaration means:

| Dependency key | Target type | Collected type |
|----------------|-------------|----------------|
| `rpc-function` | `Method`    | `RpcFunction`  |
| `rpc-property` | `Property`  | `string`       |

The source generator scans members marked with `[RegisterRpc]`, then classifies them into the corresponding dependency collections according to the target type and dependency key.

## Dependency Injection Entry Points

A lifecycle service can use `LifecycleDependencyInjection` to declare dependency injection entry points.

```cs
[LifecycleService(LifecycleState.Loaded)]
[LifecycleScope("rpc", "Remote Execution Service")]
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

### Parameters

| Parameter      | Description                                                                |
|----------------|----------------------------------------------------------------------------|
| Dependency key | Corresponds to the key declared in `DependencyCollector`                   |
| Target type    | Specifies whether methods, properties, or other member types are collected |

The source generator collects matching dependencies at compile time and passes them to the corresponding injection entry methods when the lifecycle service is initialized.

## Dependency Consumers

A dependency consumer only needs to use the custom attribute defined by the provider on the target member. No manual registration is required.

```cs
[RegisterRpc("user")]
public static string Username { get; set; }

[RegisterRpc("activate")]
public static RpcResponse Activate(string? argument, string? content, bool indent)
{
    // handle activation
}
```

In the example above:

| Member     | Target type | Collection result                                       |
|------------|-------------|---------------------------------------------------------|
| `Username` | Property    | Collected into the `rpc-property` dependency collection |
| `Activate` | Method      | Collected into the `rpc-function` dependency collection |

The dependency provider is only responsible for declaring “which members can be collected”, while the dependency consumer is only responsible for marking “itself as needing to be collected”. The actual collection and injection process is completed automatically by the source generator.

## API Summary

### Core Lifecycle Types

| API                 | Description                             |
|---------------------|-----------------------------------------|
| `LifecycleState`    | Lifecycle state enum                    |
| `ILifecycleService` | Lifecycle service interface             |
| `LifecycleService`  | Lifecycle service declaration attribute |
| `LifecycleContext`  | Lifecycle service context               |
| `Lifecycle`         | Lifecycle system access entry point     |
| `GeneralService`    | Convenient lifecycle service base class |

### Scope and Dependency Injection Types

| API                            | Description                                 |
|--------------------------------|---------------------------------------------|
| `LifecycleScope`               | Declares a lifecycle service scope          |
| `DependencyCollector`          | Declares dependency collection rules        |
| `LifecycleDependencyInjection` | Declares a dependency injection entry point |
| `PropertyAccessor<T>`          | Property dependency accessor                |

## Usage Recommendations

* Lifecycle services should keep a single responsibility. Multiple unrelated modules should not be placed into the same service.
* The service starting state should be the latest phase that actually satisfies its needs, to avoid initializing too early.
* Long-lived resources should be released in the stop logic.
* If a service has actively completed and does not need shutdown cleanup, it can declare itself stopped through the context.
* Public service APIs should remain stable and should avoid making callers depend on lifecycle internal details.
* Before using scope-based service declaration, you should first understand the generation target and runtime model of standard lifecycle services.
* When using the dependency injection mechanism, dependency keys should be clearly named, and multiple features should avoid reusing the same key name with different meanings.

## Further Reference

For complete definitions of each member, state scheduling rules, source generator outputs, and exception behavior, please refer to the code documentation in the source.