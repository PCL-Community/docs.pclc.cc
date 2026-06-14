---
order: 6
---

# 身份认证组件文档

本文介绍 IdentityModel 中与身份认证相关的客户端组件，包括 OAuth、OpenID Connect、Yggdrasil Connect 与 Yggdrasil Legacy Login。

IdentityModel 的设计目标是作为协议传输层，将调用方提供的数据转换为对应协议所需的标准请求格式，并返回协议响应结果。

::: info 错误处理
IdentityModel 不会尝试处理协议错误或业务错误。
:::

调用过程中产生的错误需要由调用方自行判断和处理。IdentityModel 只负责发送请求、解析响应，以及在必要时转换为标准数据结构，其定位类似于 `HttpClient`。

## OAuth

OAuth 客户端用于处理标准 OAuth 授权流程，包括授权代码流、设备代码流和刷新登录。

### 客户端类型

| 客户端                 | 说明                    |
|---------------------|-----------------------|
| `SimpleOAuthClient` | 基础 OAuth 客户端          |
| `PkceClient`        | 支持 PKCE 扩展的 OAuth 客户端 |

::: tip PKCE 扩展
如果目标 OAuth 服务要求或推荐使用 PKCE，请使用 `PkceClient`，而不是 `SimpleOAuthClient`。
:::

### 初始化

```csharp
var options = new OAuthClientOptions
{
    ClientId = "0712",
    GetClient = () => _client,
    Headers = new()
    {
        ["User-Agent"] = "PCL-CE/2.14.2"
    },
    Meta = new EndpointMeta
    {
        AuthorizeEndpoint = "https://open.example.com/oauth/v2.0/authorize",
        DeviceEndpoint = "https://open.example.com/oauth/v2.0/device",
        TokenEndpoint = "https://open.example.com/oauth/v2.0/token"
    },
    RedirectUri = "http://localhost:7120/oauth/callback"
};

var client = new SimpleOAuthClient(options);
```

### `OAuthClientOptions`

| 属性                       | 说明                    |
|--------------------------|-----------------------|
| `ClientId`               | OAuth 客户端 ID          |
| `GetClient`              | 获取 `HttpClient` 实例的方法 |
| `Headers`                | 发送请求时附加的 HTTP Header  |
| `Meta.AuthorizeEndpoint` | 授权端点                  |
| `Meta.DeviceEndpoint`    | 设备代码端点                |
| `Meta.TokenEndpoint`     | 令牌端点                  |
| `RedirectUri`            | 授权代码流使用的回调地址          |

### 授权代码流

授权代码流通常包含两个阶段：生成授权地址，以及使用授权代码兑换令牌。

#### 获取授权地址

```csharp
var authorizeUri = client.GetAuthorizeUrl(
    scopes: ["offline_access"],
    state: "20120712"
);
```

`GetAuthorizeUrl` 会根据客户端配置、作用域和状态参数生成授权地址。调用方应将该地址交给用户打开，并自行处理后续回调。

#### 使用授权代码兑换令牌

```csharp
var result = await client.AuthorizeWithCodeAsync(
    code: code,
    cancellationToken: CancellationToken.None
);
```

`AuthorizeWithCodeAsync` 会使用授权服务器返回的授权代码请求令牌端点。

### 设备代码流

设备代码流适用于无法直接打开浏览器完成回调的场景。

#### 获取设备代码

```csharp
var codePair = await client.GetCodePairAsync(
    scopes: ["offline_access"],
    cancellationToken: CancellationToken.None
);
```

`GetCodePairAsync` 会向设备代码端点请求设备代码与用户代码。

#### 使用设备代码请求令牌

```csharp
var result = await client.AuthorizeWithDeviceAsync(
    data: codePair,
    cancellationToken: CancellationToken.None
);
```

::: info 轮询行为
`AuthorizeWithDeviceAsync` 只会发送一次令牌请求，不会自动轮询。

如果设备代码流要求等待用户完成授权，调用方需要自行实现轮询逻辑。可以使用 Polly 等重试库，也可以自行根据协议返回结果进行重试控制，但不能只调用一次后直接认为流程完成。
:::

### 刷新登录

```csharp
var result = await client.AuthorizeWithSilentAsync(
    data: data,
    cancellationToken: CancellationToken.None
);
```

`AuthorizeWithSilentAsync` 用于根据已有授权数据刷新登录状态，通常依赖刷新令牌或协议实现中保存的等效数据。

### 扩展请求数据

如果某个基于 OAuth 的协议需要附带额外请求载荷，可以通过各授权方法的 `extData` 参数传入。

```csharp
var result = await client.AuthorizeWithCodeAsync(
    code: code,
    cancellationToken: CancellationToken.None,
    extData: new Dictionary<string, string>
    {
        ["custom_field"] = "custom_value"
    }
);
```

::: warning 不要填写预定义字段
不要通过 `extData` 填写 `client_id`、`grant_type` 等 RFC 已定义字段。

这些字段由客户端实现负责生成，并会覆盖调用方传入的同名数据。如果确实需要完全自定义请求结构，请重新实现一个客户端类并实现 `IOAuthClient` 接口。
:::

## OpenID Connect

OpenID Connect 客户端基于 OAuth 流程，并通过 Discovery 文档获取协议端点配置。

::: info 精简版实现
IdentityModel 提供的是精简版 OpenID Connect 实现，不保证覆盖完整标准中的所有能力，但可满足当前项目所需的基础登录流程。
:::

### 初始化

```csharp
var options = new OpenIdOptions
{
    OpenIdDiscoveryAddress = "https://openid.example.com/.well-known/openid-configuration",
    ClientId = "0712",
    GetClient = () => _client
};

var client = new OpenIdClient(options);

await client.InitializeAsync(CancellationToken.None);
```

### `OpenIdOptions`

| 属性                       | 说明                    |
|--------------------------|-----------------------|
| `OpenIdDiscoveryAddress` | OpenID Discovery 文档地址 |
| `ClientId`               | OpenID 客户端 ID         |
| `GetClient`              | 获取 `HttpClient` 实例的方法 |
| `OnlyDeviceAuthorize`    | 是否仅使用设备代码流            |
| `EnablePkceSupport`      | 是否启用 PKCE 支持          |

::: info 初始化要求
所有基于 OpenID 协议实现的客户端在使用前都必须调用 `InitializeAsync()`。

该方法会从互联网拉取 Discovery 配置，并初始化后续授权流程所需的端点信息。
:::

::: tip 设备代码流模式
如果客户端只需要使用设备代码流登录，可以将 `OnlyDeviceAuthorize` 设置为 `true`。

启用后会跳过 `RedirectUri` 检查，因此允许 `RedirectUri` 为空。
:::

::: tip PKCE 支持
`OpenIdClient` 原生支持并默认启用 PKCE。

如果目标 OpenID 服务的实现与 PKCE 不兼容，可以将 `EnablePkceSupport` 设置为 `false`。
:::

### 登录流程

`OpenIdClient` 的登录调用方式与 OAuth 客户端一致。

可参考 `SimpleOAuthClient` 中的以下流程：

| 流程    | 对应能力               |
|-------|--------------------|
| 授权代码流 | 获取授权地址，并使用授权代码兑换令牌 |
| 设备代码流 | 获取设备代码，并使用设备代码请求令牌 |
| 刷新登录  | 使用已有授权数据刷新登录状态     |

## Yggdrasil Connect

Yggdrasil Connect 客户端的初始化方式与 `OpenIdClient` 相同。

使用前同样需要先完成客户端初始化，并在开始授权流程前调用：

```csharp
await client.InitializeAsync(CancellationToken.None);
```

其余登录流程可参考 OpenID Connect 与 OAuth 客户端的相关说明。

## Yggdrasil Legacy Login

Yggdrasil Legacy Login 用于兼容旧版 Yggdrasil 认证接口，提供登录、刷新、注销和全域登出能力。

### 初始化

```csharp
var options = new YggdrasilLegacyAuthenticateOptions
{
    Username = "LuoTianyi",
    Password = "QIDIJSIJIXIU*&*&*$&*$^*",
    AccessToken = "AccessToken",
    YggdrasilApiLocation = "https://api.example.com/yggdrasil",
    GetClient = () => _client
};

var client = new YggdrasilLegacyClient(options);
```

### `YggdrasilLegacyAuthenticateOptions`

| 属性                     | 说明                    |
|------------------------|-----------------------|
| `Username`             | 登录用户名                 |
| `Password`             | 登录密码                  |
| `AccessToken`          | 访问令牌                  |
| `YggdrasilApiLocation` | Yggdrasil API 地址      |
| `GetClient`            | 获取 `HttpClient` 实例的方法 |

### 登录

```csharp
var data = await client.AuthenticateAsync(CancellationToken.None);
```

`AuthenticateAsync` 会使用初始化参数中的账号信息向 Yggdrasil 服务发起登录请求。

### 刷新

```csharp
var refreshData = await client.RefreshAsync(
    cancellationToken: CancellationToken.None,
    selectedProfile: new Profile
    {
        Id = "LostInTianyi",
        Name = "LuoTianyi"
    }
);
```

`RefreshAsync` 用于刷新已有登录状态。

::: info 档案选择
如果刷新时需要选择档案，请在调用 `RefreshAsync` 时传入目标 `Profile`。

如果不需要选择档案，请不要传入该参数。
:::

### 注销

```csharp
await client.InvalidateAsync(CancellationToken.None);
```

`InvalidateAsync` 用于注销当前令牌。

### 全域登出

```csharp
await client.SignOutAsync(CancellationToken.None);
```

::: info 注意
`SignOutAsync` 会登出该账号下的全部会话，并不只影响由 PCL CE 登录的账号状态。

调用前应确保调用方已经向用户说明该操作的影响。
:::

## 方法行为总结

| 客户端                                | 方法                         | 说明                         |
|------------------------------------|----------------------------|----------------------------|
| `SimpleOAuthClient` / `PkceClient` | `GetAuthorizeUrl`          | 生成授权代码流使用的授权地址             |
| `SimpleOAuthClient` / `PkceClient` | `AuthorizeWithCodeAsync`   | 使用授权代码兑换令牌                 |
| `SimpleOAuthClient` / `PkceClient` | `GetCodePairAsync`         | 获取设备代码流所需的代码对              |
| `SimpleOAuthClient` / `PkceClient` | `AuthorizeWithDeviceAsync` | 使用设备代码请求令牌，仅发送一次请求         |
| `SimpleOAuthClient` / `PkceClient` | `AuthorizeWithSilentAsync` | 使用已有授权数据刷新登录状态             |
| `OpenIdClient`                     | `InitializeAsync`          | 拉取并初始化 OpenID Discovery 配置 |
| `YggdrasilLegacyClient`            | `AuthenticateAsync`        | 使用账号密码登录                   |
| `YggdrasilLegacyClient`            | `RefreshAsync`             | 刷新已有登录状态                   |
| `YggdrasilLegacyClient`            | `InvalidateAsync`          | 注销当前令牌                     |
| `YggdrasilLegacyClient`            | `SignOutAsync`             | 全域登出账号                     |

## 实现边界

IdentityModel 只处理协议请求和响应转换，不负责以下内容：

* 自动处理 OAuth 或 OpenID 错误；
* 自动轮询设备代码流；
* 自动弹出浏览器或处理本地回调；
* 自动保存、加密或持久化令牌；
* 自动决定用户是否需要重新登录；
* 自动处理 Yggdrasil 全域登出的用户确认流程。

这些逻辑应由调用方根据业务场景自行实现。
