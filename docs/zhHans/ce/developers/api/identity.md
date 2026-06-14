---
order: 6
---

# 身份认证组件文档

::: important 错误处理
IdentityModel 不会尝试处理任何错误，因为其设计目标是作为协议传输层将调用方提供的数据转换为标准数据格式（类似 HttpClient）。错误需要调用方自行处理。
:::

## 普通 OAuth

### 初始化

```csharp
var option = new OAuthClientOptions()
{
    ClientId = "0712",
    GetClient = () => _client,
    Headers = new(){
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

var client = new SimpleOAuthClient(option);
```

::: tip PKCE 扩展
如果需要 PKCE 扩展支持，请使用 PkceClient 而不是 SimpleOAuthClient
:::

### 授权代码流

获取授权 Url

```csharp
var authorizeUri = client.GetAuthorizeUrl(["offline_access"],"20120712");
```

使用授权代码兑换令牌

```csharp
var result = await client.AuthorizeWithCodeAsync("",CancellationToken.None);
```

### 设备代码流

获取代码对

```csharp
var data = await client.GetCodePairAsync(["offline_access"], CancellationToken.None);
```

```csharp
var data = await client.AuthorizeWithDeviceAsync(data, CancellationToken.None);
```

::: important 轮询注意
AuthorizeWithDeviceAsync 仅会发送一次请求（不会轮询）。你可以配合 Polly 做重试，或者自己糊也行，但绝对不能只调用一次。
:::

### 刷新登录

```csharp
await client.AuthorizeWithSilentAsync(data, CancellationToken.None);
```

::: tip 扩展数据支持
如果某一个协议基于 OAuth 但需要提供更多的请求载荷，你可以设置每个方法的 extData 参数（字典）并提供对应的数据。
:::

::: warning 不要填写预定义字段
请不要试图填写诸如 `client_id` `grant_type` 之类的由 RFC 预先定义的字段，这些字段会被覆盖掉。

如果实在有需要，请重新开一个类并实现 IOAuthClient 接口。
:::

## OpenId Connect

::: important 精简版实现
IdentityModel 提供的实现为精简版，可能不是标准 OpenID 实现，但应该够用。
:::

### 初始化

::: tip 设备代码流模式
如果只需要设备代码流登录，请设置 OnlyDeviceAuthorize 为 true，这将跳过 RedirectUri 的检查，从而允许传入空值。
:::

```csharp
var options = new OpenIdOptions{
    OpenIdDiscoveryAddress = "https://openid.example.com/.well-known/openid-configuration",
    ClientId = "0712",
    GetClient = () => _client
};
var client = new OpenIdClient(options);

client.InitializeAsync(CancellationToken.None)
```

::: important 初始化要求
因为需要从互联网拉取配置，基于 OpenID 协议（包括 OpenID）实现的客户端均需要在开始使用前调用 `.InitializeAsync()`
:::

::: tip PKCE 支持
OpenID Client 原生支持（并默认启用） PKCE 扩展。如果 PKCE 扩展支持导致登录问题，请设置 EnablePkceSupport 为 false。
:::

OpenID Client 的登录过程与 OAuth 相同，请参考 SimpleOAuthClient 的用例。

## Yggdrasil Connect

Yggdrasil Connect Client 的初始化方式与 OpenID Client 相同，请直接参考 OpenID Client 的初始化方式。

## Yggdrasil Legacy Login

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

### 登录

```csharp
var data = await client.AuthenticateAsync(CancellationToken.None);
```

### 刷新

```csharp
var refreshData = await client.RefreshAsync(CancellationToken.None, new Profile
{
    Id = "LostInTianyi",
    Name = "LuoTianyi"
});
```

::: important 档案选择
如果需要选择档案，请务必在调用时传递要选择的档案。如果不需要，请移除传递。
:::

### 注销

```csharp
await client.InvalidateAsync(CancellationToken.None);
```

### 全域登出

::: important 注意
此方法将登出全部账号，无论是不是 PCL CE 登录的。
:::

```csharp
await client.SignOutAsync(CancellationToken.None);
```
