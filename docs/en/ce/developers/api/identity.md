---
order: 6
---

# Identity Authentication Component Documentation

This article introduces the client components related to identity authentication in IdentityModel, including OAuth, OpenID Connect, Yggdrasil Connect, and Yggdrasil Legacy Login.

IdentityModel is designed as a protocol transport layer. It converts data provided by the caller into the standard request format required by the corresponding protocol, and returns the protocol response result.

::: info Error Handling
IdentityModel does not attempt to handle protocol errors or business errors.
:::

Errors produced during invocation need to be judged and handled by the caller. IdentityModel is only responsible for sending requests, parsing responses, and converting them into standard data structures when necessary. Its role is similar to `HttpClient`.

## OAuth

The OAuth client is used to handle standard OAuth authorization flows, including the authorization code flow, device code flow, and refresh login.

### Client Types

| Client              | Description                              |
|---------------------|------------------------------------------|
| `SimpleOAuthClient` | Basic OAuth client                       |
| `PkceClient`        | OAuth client with PKCE extension support |

::: tip PKCE Extension
If the target OAuth service requires or recommends PKCE, use `PkceClient` instead of `SimpleOAuthClient`.
:::

### Initialization

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

| Property                 | Description                                          |
|--------------------------|------------------------------------------------------|
| `ClientId`               | OAuth client ID                                      |
| `GetClient`              | Method used to obtain an `HttpClient` instance       |
| `Headers`                | Additional HTTP headers attached to requests         |
| `Meta.AuthorizeEndpoint` | Authorization endpoint                               |
| `Meta.DeviceEndpoint`    | Device code endpoint                                 |
| `Meta.TokenEndpoint`     | Token endpoint                                       |
| `RedirectUri`            | Callback address used by the authorization code flow |

### Authorization Code Flow

The authorization code flow usually consists of two stages: generating an authorization URL, and exchanging the authorization code for tokens.

#### Get the Authorization URL

```csharp
var authorizeUri = client.GetAuthorizeUrl(
    scopes: ["offline_access"],
    state: "20120712"
);
```

`GetAuthorizeUrl` generates an authorization URL based on the client configuration, scopes, and state parameter. The caller should pass this URL to the user to open, and handle the subsequent callback by itself.

#### Exchange the Authorization Code for Tokens

```csharp
var result = await client.AuthorizeWithCodeAsync(
    code: code,
    cancellationToken: CancellationToken.None
);
```

`AuthorizeWithCodeAsync` uses the authorization code returned by the authorization server to request the token endpoint.

### Device Code Flow

The device code flow is suitable for scenarios where the browser cannot be opened directly to complete a callback.

#### Get the Device Code

```csharp
var codePair = await client.GetCodePairAsync(
    scopes: ["offline_access"],
    cancellationToken: CancellationToken.None
);
```

`GetCodePairAsync` requests a device code and user code from the device code endpoint.

#### Request Tokens with the Device Code

```csharp
var result = await client.AuthorizeWithDeviceAsync(
    data: codePair,
    cancellationToken: CancellationToken.None
);
```

::: info Polling Behavior
`AuthorizeWithDeviceAsync` only sends one token request. It does not poll automatically.

If the device code flow requires waiting for the user to complete authorization, the caller needs to implement polling logic by itself. You can use a retry library such as Polly, or control retries yourself according to the protocol response result. However, you must not call it only once and then directly assume that the flow has completed.
:::

### Refresh Login

```csharp
var result = await client.AuthorizeWithSilentAsync(
    data: data,
    cancellationToken: CancellationToken.None
);
```

`AuthorizeWithSilentAsync` is used to refresh the login state based on existing authorization data. It usually depends on a refresh token or equivalent data stored by the protocol implementation.

### Extended Request Data

If an OAuth-based protocol needs to attach additional request payload, it can be passed through the `extData` parameter of each authorization method.

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

::: warning Do Not Fill Predefined Fields
Do not use `extData` to fill fields defined by RFCs, such as `client_id` or `grant_type`.

These fields are generated by the client implementation and will override same-name data passed by the caller. If you truly need a fully custom request structure, reimplement a client class and implement the `IOAuthClient` interface.
:::

## OpenID Connect

The OpenID Connect client is based on the OAuth flow and obtains protocol endpoint configuration through the Discovery document.

::: info Minimal Implementation
IdentityModel provides a minimal OpenID Connect implementation. It does not guarantee coverage of all capabilities in the full standard, but it can satisfy the basic login flow currently required by the project.
:::

### Initialization

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

| Property                 | Description                                    |
|--------------------------|------------------------------------------------|
| `OpenIdDiscoveryAddress` | Address of the OpenID Discovery document       |
| `ClientId`               | OpenID client ID                               |
| `GetClient`              | Method used to obtain an `HttpClient` instance |
| `OnlyDeviceAuthorize`    | Whether to use only the device code flow       |
| `EnablePkceSupport`      | Whether to enable PKCE support                 |

::: info Initialization Requirement
All clients implemented based on the OpenID protocol must call `InitializeAsync()` before use.

This method fetches the Discovery configuration from the Internet and initializes the endpoint information required by subsequent authorization flows.
:::

::: tip Device Code Flow Mode
If the client only needs to log in using the device code flow, set `OnlyDeviceAuthorize` to `true`.

After it is enabled, the `RedirectUri` check is skipped, so `RedirectUri` is allowed to be empty.
:::

::: tip PKCE Support
`OpenIdClient` natively supports PKCE and enables it by default.

If the target OpenID service implementation is incompatible with PKCE, set `EnablePkceSupport` to `false`.
:::

### Login Flow

`OpenIdClient` is invoked in the same way as the OAuth client.

You can refer to the following flows in `SimpleOAuthClient`:

| Flow                    | Corresponding capability                                                   |
|-------------------------|----------------------------------------------------------------------------|
| Authorization code flow | Gets the authorization URL and exchanges the authorization code for tokens |
| Device code flow        | Gets the device code and requests tokens with the device code              |
| Refresh login           | Uses existing authorization data to refresh the login state                |

## Yggdrasil Connect

The Yggdrasil Connect client is initialized in the same way as `OpenIdClient`.

Before use, the client must also be initialized first, and the following method must be called before starting the authorization flow:

```csharp
await client.InitializeAsync(CancellationToken.None);
```

For the remaining login flow, refer to the relevant OpenID Connect and OAuth client descriptions.

## Yggdrasil Legacy Login

Yggdrasil Legacy Login is used for compatibility with the legacy Yggdrasil authentication API, providing login, refresh, invalidation, and global sign-out capabilities.

### Initialization

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

| Property               | Description                                    |
|------------------------|------------------------------------------------|
| `Username`             | Login username                                 |
| `Password`             | Login password                                 |
| `AccessToken`          | Access token                                   |
| `YggdrasilApiLocation` | Yggdrasil API address                          |
| `GetClient`            | Method used to obtain an `HttpClient` instance |

### Login

```csharp
var data = await client.AuthenticateAsync(CancellationToken.None);
```

`AuthenticateAsync` sends a login request to the Yggdrasil service using the account information in the initialization parameters.

### Refresh

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

`RefreshAsync` is used to refresh an existing login state.

::: info Profile Selection
If a profile needs to be selected during refresh, pass the target `Profile` when calling `RefreshAsync`.

If no profile selection is required, do not pass this parameter.
:::

### Invalidate

```csharp
await client.InvalidateAsync(CancellationToken.None);
```

`InvalidateAsync` is used to invalidate the current token.

### Global Sign-out

```csharp
await client.SignOutAsync(CancellationToken.None);
```

::: info Note
`SignOutAsync` signs out all sessions under this account, not only the account state logged in through PCL CE.

Before calling it, make sure the caller has explained the impact of this operation to the user.
:::

## Method Behavior Summary

| Client                             | Method                     | Description                                                         |
|------------------------------------|----------------------------|---------------------------------------------------------------------|
| `SimpleOAuthClient` / `PkceClient` | `GetAuthorizeUrl`          | Generates the authorization URL used by the authorization code flow |
| `SimpleOAuthClient` / `PkceClient` | `AuthorizeWithCodeAsync`   | Exchanges an authorization code for tokens                          |
| `SimpleOAuthClient` / `PkceClient` | `GetCodePairAsync`         | Gets the code pair required by the device code flow                 |
| `SimpleOAuthClient` / `PkceClient` | `AuthorizeWithDeviceAsync` | Requests tokens with the device code. Only sends one request        |
| `SimpleOAuthClient` / `PkceClient` | `AuthorizeWithSilentAsync` | Uses existing authorization data to refresh the login state         |
| `OpenIdClient`                     | `InitializeAsync`          | Fetches and initializes OpenID Discovery configuration              |
| `YggdrasilLegacyClient`            | `AuthenticateAsync`        | Logs in with username and password                                  |
| `YggdrasilLegacyClient`            | `RefreshAsync`             | Refreshes an existing login state                                   |
| `YggdrasilLegacyClient`            | `InvalidateAsync`          | Invalidates the current token                                       |
| `YggdrasilLegacyClient`            | `SignOutAsync`             | Globally signs out the account                                      |

## Implementation Boundaries

IdentityModel only handles protocol request and response conversion. It is not responsible for the following:

* Automatically handling OAuth or OpenID errors;
* Automatically polling the device code flow;
* Automatically opening a browser or handling local callbacks;
* Automatically saving, encrypting, or persisting tokens;
* Automatically deciding whether the user needs to log in again;
* Automatically handling the user confirmation flow for Yggdrasil global sign-out.

These parts of the logic should be implemented by the caller according to the business scenario.