---
order: 3
---

# Technical Guidelines

This document explains the basic guidelines that should be followed during PCL CE launcher development, including naming conventions, project development guidelines, commit message conventions, file format requirements, and other related content.

::: warning 🚧 This Document Is Still Incomplete
This document is still being improved. Developers are welcome to submit PRs to supplement or correct its content.
:::

## Normative Terms

The normative terms used in this document are defined as follows:

| Term                | Meaning                                                                              |
|---------------------|--------------------------------------------------------------------------------------|
| Must / must not     | Mandatory requirements. Submitted content must strictly follow them.                 |
| Should / should not | Default requirements. They should be followed unless there is a clear reason not to. |
| Recommended         | Non-mandatory requirements, but usually helpful for improving maintainability.       |
| May                 | Permitted practices that can be chosen according to the actual situation.            |

## Basic Naming Conventions

The purpose of the naming conventions is to improve code readability, allowing developers to determine the scope, type, or purpose of a symbol directly from its name, reducing reliance on IDE context hints, and avoiding issues caused by scope or type confusion as much as possible.

Some non-standard naming inherited from older code still exists in the PCL CE codebase. New code should prioritize following the conventions in this document. When modifying old code, such naming should be gradually corrected as long as no additional risk is introduced.

### Variables, Fields, Properties, and Events

This section applies to symbols that can bind or store values, such as local variables, parameters, fields, properties, and events. Unless otherwise specified, members in the table below refer to non-static members.

| Category                                                           | Naming convention | Examples                                       |
|--------------------------------------------------------------------|-------------------|------------------------------------------------|
| Local variables, method parameters, constructor parameters         | `camelCase`       | `name` `runningThread` `resourceMap`           |
| Private properties, private read-only fields                       | `_PascalCase`     | `_Items` `_PageMap`                            |
| Private fields, static private fields                              | `_camelCase`      | `_parameters` `_runningThreads` `_hasDisposed` |
| Primary-constructor properties (record), events, and other members | `PascalCase`      | `Name` `CurrentThread` `ActivePageCollection`  |

::: tip Note
“Fields” here include member-level variables that may be referred to as “global variables” in some older documents or legacy code.
:::

### Methods

In this document, function-like members in object-oriented programming are uniformly referred to as methods. Except for local functions, functions in most managed object-oriented languages usually exist as methods.

| Category                                                       | Naming convention | Examples                                      |
|----------------------------------------------------------------|-------------------|-----------------------------------------------|
| Non-private methods, static non-private methods, local methods | `PascalCase`      | `Start()` `ComposeMessage()` `WriteLogItem()` |
| Private methods                                                | `_PascalCase`     | `_StartInternal()` `_RaiseChanged()`          |

### Types

Types include, but are not limited to, classes, interfaces, enums, records, delegates, and other symbols that can be used as types.

| Category    | Naming convention | Examples                                    |
|-------------|-------------------|---------------------------------------------|
| Interfaces  | `IPascalCase`     | `ICollection` `ILifecycleService` `IConfig` |
| Other types | `PascalCase`      | `LaunchProfile` `ConfigSource` `PageState`  |

### Special Naming Requirements

| Category                                                                                               | Requirement                |
|--------------------------------------------------------------------------------------------------------|----------------------------|
| Events                                                                                                 | Should not start with `On` |
| Event synchronization objects such as `AutoResetEvent`, `ManualResetEvent`, and `ManualResetEventSlim` | Should end with `Event`    |

## Project Development Guidelines

This section explains standard practices and precautions for project development. New code should prioritize following the requirements in this section. When modifying old code, migration should be carried out gradually while maintaining compatibility.

### Scope of Code Changes

Each commit or PR should, as much as possible, address only one issue or one category of changes. Including multiple unrelated changes at the same time increases review difficulty and is also unfavorable for later rollbacks and issue tracing.

Submitted content should not include file changes unrelated to the current modification, including but not limited to:

* A large amount of unrelated diff caused by automatic IDE formatting;
* Adjustments to indentation, spaces, or line endings unrelated to functional changes;
* Local configuration files, temporary files, or build artifacts;
* Bulk reordering, renaming, or migration without an explained reason.

If some seemingly unrelated changes are indeed necessary, the reason should be explained in the commit message or PR description.

### Handling Legacy Code Style

When modifying existing files, the original code style should be preserved as much as possible while still complying with the guidelines, including indentation, blank lines, member ordering, and other formatting details, to reduce unrelated diffs.

If the original file clearly does not comply with this document, you may first submit a separate formatting correction commit, and then make functional changes in subsequent commits. Formatting correction commits should use the `style` type.

A large amount of formatting changes should not be mixed into a functional commit. If functional changes and formatting changes are mixed together, maintainers may ask you to split the commits.

### Maintainability Requirements

New code should prioritize readability and maintainability. Clarity should not be sacrificed merely to reduce line count or pursue clever techniques.

The following practices should be avoided as much as possible:

* Excessively deep nested logic;
* Implicit side effects whose state source is difficult to determine;
* Reimplementing utility methods that already exist in the project;
* Introducing overly complex abstractions for a single scenario;
* Unnecessary global state or static mutable state;
* Background tasks, event subscriptions, or resource usage without clear lifecycle management.

If newly added logic is relatively complex, maintenance costs should be reduced by reasonably splitting methods, adding necessary comments, or supplementing tests.

#### `goto` and Code Labels

The `goto` statement and code labels must not be used in new code unless there is a very clear and irreplaceable technical reason for that scenario.

If a feature appears to be implementable only through `goto`, it usually means the control flow needs to be reorganized. Because jump-based structures have a high maintenance cost, PRs containing `goto` are very likely to be rejected by maintainers.

### Testing and Pre-commit Checks

Code related to business logic should be basically tested locally before submission. When only modifying text content such as documentation, comments, or README files, whether full testing is necessary may be decided according to the scope of the changes.

Before committing, at least the following items should be checked:

* Whether the project can build normally;
* Whether the modified functionality can basically run;
* Whether there are file changes unrelated to the current modification;
* Whether temporary files, build artifacts, or local configuration files have been committed by mistake;
* Whether the commit message complies with the commit message convention in this document;
* Whether all commits include verified signatures.

If you commit through an IDE or graphical Git tool, you should also check the diff file by file before committing to confirm that all changes belong to the current modification scope.

### AI Tool Usage Guidelines

The project allows contributors to reasonably use AI tools, such as GitHub Copilot, ChatGPT, DeepSeek, Claude, and others, to improve development efficiency.

AI may only be used as an auxiliary tool. Submitters must understand, review, and maintain all content they submit, and must not directly submit unverified AI-generated results as final code.

::: warning Important
If a PR does not comply with the requirements in this section, maintainers may close the PR. If a contributor repeatedly submits PRs that do not meet the requirements, maintainers have the right to restrict that contributor from continuing to participate in repository activities.
:::

#### Indicate the Model and Version Used

If submitted content contains code generated by AI or substantially rewritten by AI, the submitter must clearly indicate the model and version used.

The model identifier may be added to the end of the commit message or PR title, for example:

```text
[DeepSeek-V3.2]
[Claude-Opus-4.6]
[GPT-5.1]
```

Example:

```text
fix(scope): 修复某功能在特定情况下的异常 [GPT-5.1]
```

If multiple models are used in the same PR, the approximate purpose of each model should be explained in the PR description.

#### Do Not Directly Submit Large AI-generated PRs

Large PRs are defined as follows:

* More than 200 lines of code are added or modified at once;
* Or more than 5 `.cs` or `.xaml` files are modified at once.

For such PRs, AI-generated code must not be submitted directly without splitting, understanding, and refactoring it.

Submitters should split large tasks into multiple smaller commits, and ensure that every logic change has been manually understood, reviewed, and verified. Otherwise, maintainers may reject or close the PR.

#### Do Not Submit Unreviewed Low-quality AI Code

AI-generated code may contain fabricated APIs, logic flaws, duplicated existing functionality, overengineering, inconsistent style, or performance issues. Submitters must review and correct these issues themselves.

Before submission, at least the following items should be checked:

* Whether the code style complies with this document;
* Whether there are unresolved `TODO` comments;
* Whether nonexistent APIs, parameters, or types are used;
* Whether utilities already existing in the project have been reimplemented;
* Whether unnecessary dependencies have been introduced;
* Whether there are obvious performance issues;
* Whether the design is overly complex;
* Whether the implementation approach and behavior boundaries of the new code can be explained.

Maintainers are not obligated to help submitters review unorganized AI-generated code. If the code is clearly AI-generated and lacks signs of manual review, the related PR may be closed directly.

### Lifecycle and Services

#### Lifecycle Management

For the basic concepts of the lifecycle system, see [Introduction to Lifecycle](./api/lifecycle.md).

When calling service-related content, you must ensure that the called service has completed initialization. If the call order cannot be guaranteed, exceptions such as `NullReferenceException` or `InvalidOperationException` may be thrown.

For synchronous services, one of the following conditions should be met:

* They are called in a later lifecycle state;
* They are called during asynchronous service initialization in the same lifecycle state;
* They are called in the same lifecycle state by the initialization logic of a synchronous service with lower priority.

For asynchronous services, they should only be called in a later lifecycle state. You should not assume that they have completed initialization in the same lifecycle state.

#### Configuration System

For the basic concepts of the configuration system, see [Introduction to the Application Configuration System](./api/config.md).

For ease of maintenance, new configuration items should be declared in the core library’s `Config.cs` file as uniformly as possible, and necessary comments should be added for them.

If it can be clearly confirmed that a configuration item is used only within a single subsystem, it may be declared inside that subsystem.

Before registering configuration item events, you should confirm that the event handling logic has sufficiently good performance. All events in the configuration system are executed synchronously to ensure global consistency of configuration values. Therefore, event handling logic with poor performance, long execution time, or possible blocking behavior will directly affect the configuration read/write process.

## Compile-time Code Generation Optimization

New code should use .NET’s compile-time source generation capabilities as much as possible, reducing the overhead caused by runtime reflection, dynamic initialization, and repeated compilation.

### Regular Expressions

.NET 7 introduced [`GeneratedRegexAttribute`](https://learn.microsoft.com/en-us/dotnet/standard/base-types/regular-expression-source-generators), which pre-generates regular expression matching logic at compile time to improve runtime performance.

New regular expression matching logic should follow the requirements below:

* Newly added regular expression matching outside existing subsystems must use `GeneratedRegex`;
* Regular expressions that can be statically determined should not be dynamically initialized;
* New methods with regular expression parameters should receive a `Regex` instance instead of a regular expression string, unless there is a special need;
* It is recommended to add new regular expression declarations to the core library’s `Utils/RegexPatterns.cs` file.

For standard usage of `GeneratedRegex`, refer to `Utils/RegexPatterns.cs` in the core library.

### External Library Calls (P/Invoke)

.NET 7 introduced [`LibraryImportAttribute`](https://learn.microsoft.com/en-us/dotnet/standard/native-interop/pinvoke-source-generation), which pre-generates static marshalling code at compile time and allows P/Invoke calls to be optimized through inlining.

New P/Invoke calls should follow the requirements below:

* `LibraryImport` must be used instead of `DllImport`;
* When using `LibraryImport`, the `partial` keyword should be used instead of `extern`;
* Static marshalling features should be preferred;
* In suitable scenarios, types such as `Span<T>` may be used to safely handle pointer-exported data, improving safety and performance;
* Unless truly necessary, P/Invoke declarations should not be exposed outside the current class scope.

::: tip Note
`LibraryImport` requires methods to use the `partial` keyword. The `extern` keyword commonly used with `DllImport` does not apply to this pattern.
:::

::: info Note
In official examples, the visibility of P/Invoke declarations may be relaxed to `internal`, but for better maintainability, the project still recommends declaring `LibraryImport` as `private`.
:::

## Commit Message Convention

::: info Note
Part of this section comes from the repository’s original `CONTRIBUTING.md` file. Thanks to the original authors @WorldHim, @wyc-26, and @3gf8jv4dv for their contributions.
:::

### Commit Signature Requirement

The PCL CE repository requires all commits in PRs to include verified signatures.

Submitters should use GPG signing or SSH signing supported by GitHub, and ensure that the commit email matches a verified email address in their GitHub account.

Commits without verified signatures may not be mergeable. If a commit is shown as `Unverified`, fix the signing configuration first, then recommit or amend the commit history.

### Simple Format

The simple format applies to single-line commit messages and PR titles.

```text
type(scope?): digest
```

The meanings of each field are as follows:

| Field    | Requirement                                                                           |
|----------|---------------------------------------------------------------------------------------|
| `type`   | Must be lowercase English, indicating the commit type                                 |
| `scope`  | Optional. Should use English to describe the affected module or subsystem             |
| `digest` | Should summarize the commit content in Chinese and start with a verb in its base form |

`scope` should be lowercase English. If it contains multiple words, they should be connected with hyphens, for example `profile`, `lifecycle`, `java-manage`, or `rpc`.

`digest` should explain what the commit specifically did. Necessary technical terms may be written in English. Recommended examples include:

```text
feat(profile): 支持可选的高级材质
fix(java-manage): 修复 Java 8 及以前的版本无法被正确识别
imp(rpc): 默认启用 RPC 服务
```

::: tip Note
There must be a space between the colon after `scope` and `digest`.
:::

### Commit Types

| Type                   | Description                                                                                                                                                                                    |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `feat` / `feature`     | Introduces a new feature. This is usually a user-facing change, such as dark mode or Java management, but may also be a developer-facing capability, such as introducing lifecycle management. |
| `fix`                  | Fixes a bug found in production or development, restoring the program to the expected behavior.                                                                                                |
| `imp` / `improve`      | Improves the interaction experience, readability, or other aspects of an existing feature. This is usually a user-facing change.                                                               |
| `ref` / `refactor`     | Refactors existing code structure or implementation without significantly changing external functionality, mainly improving maintainability.                                                   |
| `docs`                 | Modifies only documentation content, such as README files, comments, or API documentation, without involving program logic.                                                                    |
| `style`                | Code formatting adjustments unrelated to functionality, including but not limited to spaces, indentation, semicolons, and naming style.                                                        |
| `perf` / `performance` | Optimizations specifically targeting performance, such as algorithm improvements, caching strategies, or rendering optimizations.                                                              |
| `test`                 | Adds or modifies unit tests, integration tests, test scripts, and similar content.                                                                                                             |
| `chore`                | Miscellaneous changes unrelated to business logic, such as build process maintenance, dependency upgrades, or project configuration adjustments.                                               |
| `bump`                 | Version-related changes, such as publishing a new release version.                                                                                                                             |
| `ci`                   | Modifies CI/CD configuration files, automation scripts, build pipelines, and similar content.                                                                                                  |

The commit type should be chosen to match the modification as closely as possible. Some types are relatively general-purpose, but when a more specific category exists, the general category should not be used.

For example:

* When fixing a CI build failure, use `ci` instead of `fix`;
* When fixing an issue that can be mitigated by improving device performance, first consider whether it belongs to `perf`;
* When modifying build configuration or adding dependencies, use `chore` instead of `feat`.

### Requirements for Writing `digest`

`digest` should be concise and clear, and it should make the actual changes in the commit directly understandable.

`digest` should not use the following styles:

* Past tense or future tense;
* Pure noun phrases;
* Vague descriptions whose specific relevance cannot be understood;
* A period at the end.

Incorrect examples:

```text
docs: 深色模式
fix: 更正了 typo
imp: 一个高占用功能现在会默认关闭
```

Recommended examples:

```text
docs: 补充深色主题适配说明
fix: 更正下载页面的 NeoForge 拼写错误
imp: 默认关闭资源扫描中的高占用检查
```

A clear `digest` should usually not exceed 30 Chinese characters or 50 English letters.

### Multi-line Format

The multi-line format applies to commit messages that need to explain changes in detail.

```text
type(scope?): subject

body

footer
```

The rules for the first line are basically the same as the simple format, but `subject` does not need to fully expand all details.

`body` is used to describe the commit content in detail, and should include the motivation for the change as well as differences from previous behavior.

`footer` may include breaking changes, co-author information, or linked issues. If there is no corresponding content, it may be omitted.

Issues may be linked using the following format:

```text
Close #234
Close #234, #114, #514
```

If there are breaking changes, they should be clearly explained in `footer`.

### Revert Commits

When reverting a commit or PR, the commit message should start with `revert:`.

```text
revert: digest (hash)
```

The fields are as follows:

| Field    | Description                                                                            |
|----------|----------------------------------------------------------------------------------------|
| `digest` | The first line of the original commit message                                          |
| `hash`   | The hash of the original commit, or the original PR ID. A PR ID should start with `#`. |

Example:

```text
revert: feat(profile): 支持可选的高级材质 (#123)
```

## Miscellaneous Guidelines

### Line Endings and Encoding

Differences in line endings and file encoding may cause a large number of meaningless changes, increasing review and later tracing costs.

New files must use the following format:

| Item          | Requirement    |
|---------------|----------------|
| Line endings  | LF             |
| File encoding | Standard UTF-8 |
| BOM           | No BOM         |

When modifying existing files, the original file format should be followed as much as possible. If the original file uses different line endings or encoding, a large amount of unrelated diff should not be produced merely for format unification, so as to avoid conflicts with changes in other branches.

PRs that cause a large number of meaningless changes due to line ending or encoding changes may be required to be resubmitted, and in serious cases may be closed directly.

::: tip Git Line Ending Handling
Git can automatically handle line endings in submitted content. In general, you do not need to manually manage local file line endings. For details, refer to the [GitHub documentation page](https://docs.github.com/en/get-started/git-basics/configuring-git-to-handle-line-endings).
:::

::: tip Rider Encoding Settings
Rider can be configured in Settings to use standard UTF-8 encoding by default. Some editors or IDEs may automatically add a BOM, so you should check before committing whether meaningless changes appear on the first line of a file. If an abnormal diff appears on the first line of a file, you usually need to check whether a BOM has been added.
:::