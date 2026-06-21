---
order: 5
---

# RPC API Reference

This article introduces the basic information, communication format, request and response structures, and currently exposed properties and functions of the PCL CE launcher RPC service.

PCL CE includes an RPC service based on named pipe communication. Local third-party processes can use this service to exchange data with the running launcher, such as obtaining the launcher version, reading real-time status, listening to log streams, or requesting the launcher to modify certain settings.

## Service Information

After the launcher starts, it creates a named pipe server. The pipe name format is as follows:

```text
PCLCE_RPC@ProcessID
```

Here, `ProcessID` is the ID of the current launcher process. In .NET, the process ID can be obtained through APIs provided by the `System.Diagnostics` namespace.

The RPC service is enabled by default. If a client cannot connect to the pipe, possible reasons include:

* The user has enabled the “Disable RPC Service” setting in the launcher;
* The launcher is not running yet;
* The target process ID is incorrect;
* Another process is occupying the RPC pipe;
* The current process does not have permission to access the named pipe.

## Communication Format

Both requests and responses use `UTF-8` encoding.

Each message consists of two parts:

| Part      | Description                                                                                              |
|-----------|----------------------------------------------------------------------------------------------------------|
| `header`  | Required. Located on the first line and used to describe basic information about the request or response |
| `content` | Optional. Located after the header and used to pass body content                                         |

The message body must end with the special character `ESC`. This character is encoded as follows in ASCII and Unicode:

| Representation  | Value  |
|-----------------|--------|
| Octal           | `033`  |
| Decimal         | `27`   |
| Hexadecimal     | `0x1B` |
| Escape sequence | `\x1B` |

Regardless of whether `content` is empty, requests and responses must contain at least two lines. In other words, the line containing `header` must end with a line break.

```text
HEADER
CONTENT\x1B
```

When `content` is empty, the line break after `header` must still be preserved.

```text
HEADER
\x1B
```

## Request Format

The request header format is as follows:

```text
TYPE argument
```

| Field      | Description      |
|------------|------------------|
| `TYPE`     | Request type     |
| `argument` | Request argument |

### Request Types

| Type  | Description                                  |
|-------|----------------------------------------------|
| `GET` | Gets the value of the specified property     |
| `SET` | Modifies the value of the specified property |
| `REQ` | Calls the specified RPC function             |

### `GET`

`GET` is used to read a property value.

```text
GET version
\x1B
```

When the request type is `GET`, the entire `argument` is treated as the property name. Property names are case-insensitive.

### `SET`

`SET` is used to modify a property value.

```text
SET SomeProperty
NewValue\x1B
```

When the request type is `SET`, the entire `argument` is treated as the property name. Property names are case-insensitive.

The new value to write should be placed in `content`. If the write succeeds, the server returns an empty response and indicates the operation result through the response status.

### `REQ`

`REQ` is used to call an RPC function.

```text
REQ ping
\x1B
```

When the request type is `REQ`, `argument` is split by spaces:

* The first item is the function name;
* The remaining items are function arguments.

Function names are case-insensitive. Function arguments are case-sensitive, but the final behavior depends on the implementation of the function itself.

For example:

```text
REQ SomeFunction arg1 arg2
\x1B
```

## Response Format

The response header format is as follows:

```text
STATUS type name
```

| Field    | Description           |
|----------|-----------------------|
| `STATUS` | Response status       |
| `type`   | Response content type |
| `name`   | Response content name |

### Response Status

| Status    | Description                                                  |
|-----------|--------------------------------------------------------------|
| `SUCCESS` | The request was processed successfully                       |
| `FAILURE` | The request was processed, but the operation did not succeed |
| `ERR`     | An error occurred while processing the request               |

### Response Content Types

| Type     | Description                         |
|----------|-------------------------------------|
| `empty`  | Empty response with no body content |
| `text`   | Text content                        |
| `json`   | JSON content                        |
| `base64` | Base64-encoded content              |

When `type` is `empty`, the response has no body content.

```text
SUCCESS empty ping
\x1B
```

When `type` is not `empty`, the response body is located after the header.

```text
SUCCESS text version
2.11.2-beta.3\x1B
```

## Property Permission Marks

Properties may have access permission marks. A permission mark consists of two characters:

```text
<read permission><write permission>
```

The meaning of each character is as follows:

| Character | Meaning                                            |
|-----------|----------------------------------------------------|
| `r`       | Can be read directly                               |
| `w`       | Can be written directly                            |
| `x`       | User confirmation is required before the operation |
| `o`       | The operation is not supported                     |

For example:

| Mark | Description                                                |
|------|------------------------------------------------------------|
| `ro` | Readable, not writable                                     |
| `ow` | Not readable, writable                                     |
| `rw` | Readable and writable                                      |
| `rx` | Readable; user confirmation is required before writing     |
| `xw` | User confirmation is required before reading; writable     |
| `xo` | User confirmation is required before reading; not writable |
| `ox` | Not readable; user confirmation is required before writing |

When a request is made for an unsupported operation, the server returns an empty response with the `FAILURE` status.

For example:

* Using `SET` on a property marked `ro` or `xo`;
* Using `GET` on a property marked `ow` or `ox`.

When a request is made for an operation that requires user confirmation, the launcher displays a dialog asking the user. If the user rejects the request, an empty response with the `FAILURE` status is also returned.

## Properties

The launcher currently exposes the following properties. All property values are text values.

| Property name | Permission | Type   | Description                 | Example         |
|---------------|------------|--------|-----------------------------|-----------------|
| `version`     | `ro`       | `text` | Current launcher version    | `2.11.2-beta.3` |
| `branch`      | `ro`       | `text` | Current version branch name | `Slow Ring`     |

### `version`

Gets the current launcher version.

Request example:

```text
GET version
\x1B
```

Response example:

```text
SUCCESS text version
2.11.2-beta.3\x1B
```

### `branch`

Gets the current version branch name.

Request example:

```text
GET branch
\x1B
```

Response example:

```text
SUCCESS text branch
Slow Ring\x1B
```

## Functions

RPC functions are defined in the following format:

```text
function-name arguments content return-type
```

| Function | Arguments | content | Return type | Description                    |
|----------|-----------|---------|-------------|--------------------------------|
| `ping`   | `void`    | `empty` | `empty`     | Tests RPC service connectivity |

### `ping`

Tests connectivity between the client and the launcher RPC service.

Request example:

```text
REQ ping
\x1B
```

Response example:

```text
SUCCESS empty ping
\x1B
```

If the client receives a response with the `SUCCESS` status, the RPC service is communicating normally.