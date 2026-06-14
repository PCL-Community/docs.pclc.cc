---
order: 5
---

# RPC API 说明

这个页面的主要内容为启动器 RPC 服务的基本信息及对外开放的 API 用法。

## 简介

PCL 社区版内置一个基于命名管道通信的 RPC 服务，可以用于与本地的第三方进程交换数据，常用的场景包括获取正在运行的启动器信息、以流式的方式获取实时日志、请求启动器修改某些设置项等。通过 RPC 服务，你可以在启动器运行时实时获取和改变启动器的当前状态，也可以通过 API 获取被启动器占用或除了启动器以外没有获取途径的实时数据。

## 基本用法

RPC 服务本身作为命名管道通信的服务端，接收客户端的请求并返回处理后的结果。

启动器运行后，将在名为 `PCLCE_RPC@ProcessID` 的管道开启服务端，其中 `ProcessID` 为启动器当前进程的 ID (.NET 平台可以通过 `System.Diagnostics` 命名空间提供的 API 获取)。客户端连接命名管道并写入[请求](#Request)文本，然后读取服务端 (即启动器) 返回的[响应](#Response)内容即可完成一次请求。启动器的 RPC 服务默认开启，若无法连接，可能是由于用户主动开启了"禁用 RPC 服务"设置项，也可能是其他进程占用了 RPC 管道。

请求和响应内容统一使用 `UTF-8` 编码，分为 header 和 content：header 是必要的且仅位于第一行，包含请求或响应的基本信息；content 在有必要时包含内容，若无必要则为空。内容应以特殊字符 `ESC` 结尾，该字符在 ASCII 和 Unicode 中均对应八/十/十六进制的 `033` / `27` / `0x1B`。

**无论 content 是否为空，请求或响应内容均应至少包含两行，即 header (第一行) 的末尾必须有一个换行符。**

### 请求 (Request)

**header**: `TYPE argument`

- `TYPE` - 请求类型，可能的取值：`GET` `SET` `REQ`
- `argument` - 请求参数

当请求类型为 `GET` 或 `SET` 时，整个 `argument` 被视为[属性](#Properties)名称 (不区分大小写)。`GET` 返回对应属性的值；`SET` 使用 content 修改属性值，并返回空响应，通过响应状态表示修改是否成功。

当请求类型为 `REQ` 时，以空格分割 `argument` 得到的第一项被视为[函数](#Functions)名称 (不区分大小写)，剩余部分被视为函数参数 (区分大小写，但最终行为取决于函数本身)，将调用该函数并返回函数的响应内容。

### 响应 (Response)

**header**: `STATUS type name`

- `STATUS` - 响应状态，可能的取值：`SUCCESS` `FAILURE` `ERR`
- `type` - 响应内容的类型，可能的取值：`empty` `text` `json` `base64`
- `name` - 响应内容的名称

若 `type` 为 `empty`，表示这个响应是空响应，没有任何内容（即 Content）。

## 属性 (Properties)

启动器的公开属性，所有属性的类型均为文本。

- 尝试对 `ro` / `xo` (只读) 属性使用 `SET` 或对 `ow` / `ox` (只写) 属性使用 `GET` 会得到 `FAILURE` 状态的空响应。
- 尝试对 `rx` / `ox` 属性使用 `SET` 或对 `xw` / `xo` 属性使用 `GET` 时，启动器会向用户弹窗询问，若用户拒绝，也会得到 `FAILURE` 状态的空响应。

**version** `ro` - 当前版本，如 2.11.2-beta.3

**branch** `ro` - 当前版本的分支名，如 Slow Ring

## 函数 (Functions)

RPC 函数。名称后面的三节分别表示接收的参数、内容 (content) 和返回值类型，没有参数则为 `void`，不需要内容则为 `empty`。

**ping** `void` `empty` `empty` - 测试连通性，返回状态为 `SUCCESS` 的空请求
