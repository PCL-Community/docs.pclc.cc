---
order: 4
---

# Internationalization and Localization

This article describes how PCL CE organizes language resources, selects the UI language and formatting culture, and retrieves localized text from C# code, AXAML, and view models.

The localization system consists of language resource dictionaries, `LocalizationService`, `Lang`, and the binding helpers provided by the UI layer. Resource dictionaries are maintained in the `PCL.Localization` project and loaded into Avalonia application resources through `ILocalizationBackend`.

## Overview

The localization system mainly includes the following concepts:

| Concept              | Description                                                                                                     |
|----------------------|-----------------------------------------------------------------------------------------------------------------|
| Language resource    | A resource dictionary containing the text for a language, stored in `PCL.Localization/Languages`                |
| UI language          | The language used for interface text, represented by `LocalizationService.CurrentLanguage`                      |
| Formatting culture   | The culture used to format dates, times, and numbers, represented by `LocalizationService.CurrentFormatCulture` |
| Base language        | The complete fallback language for resources; currently `zh-CN`                                                 |
| Resource key         | A string identifier for a resource entry, such as `Common.Action.Confirm`                                       |
| Localization service | Resolves the UI language and formatting culture, applies them, loads resources, and notifies the UI             |
| Localization backend | Loads language dictionaries and looks up text in the UI resource system                                         |

## Language Resources

Language resource files are stored in `PCL.Localization/Languages` and use language codes as file names, such as `zh-CN.axaml` and `en-US.axaml`.

The files are embedded resources in the `PCL.Localization` assembly and are also linked as Avalonia resources by the `PCL.Core.UI` project. At runtime, `ILocalizationBackend` loads them as Avalonia resource dictionaries.

A language resource file has the following basic structure:

```xml
<ResourceDictionary xmlns="https://github.com/avaloniaui"
                    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
                    xmlns:sys="clr-namespace:System;assembly=System.Runtime"
                    xml:space="preserve">

    <!-- Common.Action -->

    <sys:String x:Key="Common.Action.Confirm">OK</sys:String>
    <sys:String x:Key="Common.Action.Refresh">Refresh</sys:String>

    <!-- Common.Format -->

    <sys:String x:Key="Common.Format.DownloadCount">Downloaded {0} times</sys:String>
</ResourceDictionary>
```

### Resource Keys

Resource keys use dot-separated hierarchical names and should not contain spaces. Group keys by feature or page, for example:

```text
Common.Action.Confirm
Download.Version.LoadingList
Setup.Language.Changed
```

Keys must be unique within each resource file. Comments can be used to mark groups and make the files easier to maintain and review.

### Text Formatting

Resource text uses standard .NET composite format strings, such as `{0}` and `{1:N2}`. `Lang.Text(key, args)` fills these placeholders at runtime using the current formatting culture.

Write line breaks as the XML entity `&#xA;`. Escape characters such as `<`, `>`, and `&` according to XML rules.

The `xml:space="preserve"` attribute preserves whitespace in resource text. Avoid adding indentation or line breaks inside a string value unless they are part of the displayed text.

### Metadata

Language resource files usually contain the following metadata:

| Key         | Description          |
|-------------|----------------------|
| `Meta.Code` | Language code        |
| `Meta.Name` | Native language name |

This metadata identifies the resource file. The list of selectable UI languages is determined by `LocalizationService.SupportedLanguages`.

## UI Language and Formatting Culture

`LocalizationService` resolves the UI language and formatting culture, applies the corresponding .NET cultures, and loads language resources when either value changes.

The service starts at the `Loaded` lifecycle state. During startup, it reads the localization configuration, applies the cultures, and loads the base language and current language resources.

### Supported Languages

The currently registered UI languages are:

| Language Code | Native Name              | Culture Name | Font Profile         |
|---------------|--------------------------|--------------|----------------------|
| `zh-CN`       | 简体中文（中国大陆）     | `zh-CN`      | `SimplifiedChinese`  |
| `zh-TW`       | 繁體中文（台灣）         | `zh-TW`      | `TraditionalChinese` |
| `en-US`       | English (US)             | `en-US`      | `English`            |
| `en-GB`       | English (United Kingdom) | `en-GB`      | `English`            |
| `ja-JP`       | 日本語（日本）           | `ja-JP`      | `Japanese`           |
| `fr-FR`       | Français (France)        | `fr-FR`      | `Other`              |
| `es-ES`       | Español (España)         | `es-ES`      | `Other`              |

`LocalizationService.SupportedLanguages` is the source of the UI language list. To add a language, provide its resource file and register a corresponding `LocalizationLanguage` in this list.

### Configuration

`LocalizationService` defines the following configuration values:

| Value                                             | Description                                                               |
|---------------------------------------------------|---------------------------------------------------------------------------|
| `LocalizationService.Auto`                        | Follow the system setting; the value is `auto`                            |
| `LocalizationService.FormatCultureFollowLanguage` | Use the UI language as the formatting culture; the value is `ui-language` |

`LocalizationService.DefaultLanguageCode` is `zh-CN`, which is also the complete fallback language for resources.

Localization-related settings are stored under `Config.Preference.Localization`:

| Configuration Item | Default | Description                                                                                                 |
|--------------------|---------|-------------------------------------------------------------------------------------------------------------|
| `Language`         | `auto`  | UI language. `auto` follows the system UI culture                                                           |
| `FormatCulture`    | `auto`  | Formatting culture. `auto` follows the system formatting culture; `ui-language` follows the UI language     |
| `Region`           | `auto`  | Region override. `auto` enables automatic detection and is separate from UI language and formatting culture |

Changes to `Language` or `FormatCulture` trigger `LocalizationService` to reapply the corresponding settings. The `Region` setting is separate from this language and formatting workflow.

### Applying a Language

Use `LocalizationService.Apply` to apply a UI language and formatting culture directly:

```cs
LocalizationService.Apply("en-US", LocalizationService.Auto);
```

The formatting culture defaults to `auto`, so it can be omitted:

```cs
LocalizationService.Apply("zh-CN");
```

`Apply` also accepts a `save` argument, which defaults to `true` and controls whether the normalized values are written back to the configuration. `ApplyFromConfig` reapplies the current configuration and defaults its `save` argument to `false`:

```cs
LocalizationService.ApplyFromConfig();
```

After the first application, `Apply` returns without reloading resources when neither the UI language nor the formatting culture has changed. Otherwise, it updates the current-thread and default-thread cultures. When a UI backend is registered, the update and resource application are dispatched to the UI thread before the `LanguageChanged` event is raised.

### Language Resolution and Fallback

`ResolveLanguage` resolves a configuration value to a supported language:

```cs
var language = LocalizationService.ResolveLanguage("en-US");
```

The resolution rules are:

* When the value is empty or `auto`, select a language based on the system UI culture
* Use an exact match when the system UI culture matches a supported language
* Otherwise, use the first supported language with the same two-letter language prefix
* If no match is found, use `zh-CN`
* An explicitly specified but unsupported language also resolves to `zh-CN`

`IsLanguageSupported` checks whether a language code is registered. `null`, an empty string, and `auto` are considered supported configuration values.

The formatting culture can be set to `auto`, `ui-language`, or a .NET culture name. If an explicit culture name is invalid, the service logs a warning and falls back to the system formatting culture.

## Resource Loading and Fallback

`ILocalizationBackend` is the localization backend interface used by the UI layer:

```cs
public interface ILocalizationBackend
{
    string? TryFindResource(string key);

    void ApplyLanguageResources(string baseLanguageCode, string? currentLanguageCode);
}
```

`LocalizationBackend` in `PCL.Core.UI` implements this interface with Avalonia resource dictionaries. When applying language resources, it removes the dictionaries loaded previously and then merges the base language and current language in this order:

1. Load the `zh-CN` base language resources
2. If the current language is not `zh-CN`, load its resources after the base language
3. Let the current language override entries from the base language
4. Use the base language when an entry is missing from the current language

Before the localization service reaches the `Loaded` state, `ApplicationHost` calls `LocalizationBackend.EnsureBaseLanguage`. This makes base-language text available to earlier `Lang.Text` calls during application startup.

## Reading Text in Code

### `Lang.Text`

Use `Lang.Text` to retrieve the text for a resource key:

```cs
var text = Lang.Text("Common.Action.Confirm");
```

The key must not be `null`, empty, or whitespace; otherwise, the method throws an `ArgumentException`.

When a key cannot be found, debug builds return the key wrapped in exclamation marks, such as `!Common.Action.Missing!`. Other builds return the key itself.

### Text with Arguments

`Lang.Text` accepts formatting arguments:

```cs
var text = Lang.Text("Common.Format.DownloadCount", 1234);
```

The method uses `string.Format` with the current formatting culture, so numeric and date values follow the selected culture.

### Formatting Helpers

`Lang` also provides the following formatting methods:

| Method                    | Description                                                                                                      |
|---------------------------|------------------------------------------------------------------------------------------------------------------|
| `Lang.Date(...)`          | Formats a date and time using the current formatting culture                                                     |
| `Lang.TimeSpan(...)`      | Formats a time interval; negative values represent the past, while zero and positive values represent the future |
| `Lang.Number(...)`        | Formats a numeric or other `IFormattable` value using the current culture                                        |
| `Lang.CompactNumber(...)` | Formats a compact number, such as a download count                                                               |
| `Lang.FileSize(...)`      | Formats a file size, such as `1.28 MiB`                                                                           |

`Lang.TimeSpan` adds past or future wording by default. Set `addAffixes` to `false` to return only the formatted interval.

These methods are intended for user-visible text. Use `CultureInfo.InvariantCulture` for values that require a stable format, such as configuration files, logs, protocols, cache keys, and file names.

### Culture-related Properties

| Property                      | Description                                                                                                                                                                         |
|-------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Lang.Culture`                | The current formatting culture                                                                                                                                                      |
| `Lang.IsChineseMainland`      | Whether the current formatting culture is `zh-CN`                                                                                                                                   |
| `Lang.IsFeaturesUnrestricted` | Whether region-restricted features are allowed; this is enabled by the debug override or when the local time zone is `China Standard Time` and the current or UI culture is `zh-CN` |

## Using Localization in AXAML

Import the `PCL.Core.UI` namespace to use localized text in AXAML:

```xml
<TextBlock xmlns:loc="using:PCL.Core.UI"
           Text="{loc:Loc Common.Action.Refresh}" />
```

`LocExtension` returns a one-way binding to the indexer of `LocalizationSource.Instance`. When the language changes, `LocalizationSource` notifies the bindings to evaluate the resource key again; the AXAML does not need to be reloaded.

The resource key cannot be empty. Otherwise, `LocExtension` throws an `ArgumentException`.

## Using Localization in ViewModels and Code Bindings

### `LocalizedProperty`

Use the `LocalizedProperty` attribute when a property only needs to retrieve its text again after a language change:

```cs
public partial class SomeViewModel
{
    [LocalizedProperty("Page.Title")]
    public partial string Title { get; }
}
```

Both the containing type and the property must be `partial`. The source generator implements the getter by calling `Lang.Text` with the specified resource key.

### `LocalizedObservableObject`

`LocalizedObservableObject` is a view model base class in `PCL.Core.ViewModel`. When the language changes, it raises `PropertyChanged` so that bound properties are evaluated again:

```cs
public sealed partial class SomeViewModel : LocalizedObservableObject
{
    public string Description => Lang.Text("Page.Description");
}
```

By default, the base class notifies all properties. Override `OnLanguageChanged` when only specific properties need to be refreshed.

### Code-created Bindings

For controls or bindings created in code, the following helpers are available:

| Entry Point                       | Use Case                                                                   |
|-----------------------------------|----------------------------------------------------------------------------|
| `LocalizationTextSource.Get(key)` | Provides a cached text source for binding a resource key to a property     |
| `LocalizedText.Bind(...)`         | Binds text generated from a delegate, including text based on runtime data |
| `SetLocalizedValue(...)`          | Sets a one-way localized binding on an Avalonia property                   |

`LocalizationTextSource` caches instances by resource key. Calls with the same key return the same instance, which raises `PropertyChanged` when the language changes.

## Maintaining Language Resources

### Adding or Modifying Text

During feature development, maintain `zh-CN.axaml` and `en-US.axaml`. Other languages are maintained through the translation site. Do not edit those resource files manually in feature PRs unless the change specifically concerns their translations.

Translation site: [PCL CE Translation Site](https://translate.pclc.cc/projects/pcl-ce/).

When adding or modifying text:

1. Add or update the resource key in `zh-CN.axaml`
2. Add or update the corresponding English text in `en-US.axaml`
3. Reference the key from C# code or AXAML
4. Run `dotnet test` to validate the language resources and code references

Keep resource keys stable. Before renaming or deleting a key, check its references in code, AXAML, and tests.

### Adding a Language

The translation process usually provides the resource file for a new language. The code changes are:

1. Add the language resource file to `PCL.Localization/Languages`
2. Register a `LocalizationLanguage` in `LocalizationService.SupportedLanguages`
3. Select the matching `LocalizationFontProfile`
4. If the translation is incomplete, add the language code to the partial-language list in `PCL.Core.Test/LocalizationTest.cs`

`LocalizationCatalog` discovers embedded language resources automatically, so it does not require a separate language list.

## Framework-neutral Resource Catalog

`LocalizationCatalog` is provided by the `PCL.Localization` project and does not depend on Avalonia. It can be used by tests, localization validation tools, and non-UI entry points to inspect the same embedded language resources used by the UI.

| Member                          | Description                                               |
|---------------------------------|-----------------------------------------------------------|
| `LocalizationCatalog.Languages` | Returns all embedded language codes in ordinal order      |
| `IsSupported(...)`              | Checks whether a resource file exists for a language code |
| `GetKeys(...)`                  | Returns all resource keys for a language                  |
| `GetEntries(...)`               | Returns the resource key/value pairs in file order        |

Example:

```cs
var languages = LocalizationCatalog.Languages;
var entries = LocalizationCatalog.GetEntries("zh-CN");
```

`GetEntries` reads each entry's `x:Key` and text content, keeps the first occurrence of a duplicate key, and throws `FileNotFoundException` when the requested language resource does not exist.

### Validation

`PCL.Core.Test` includes checks for the following:

* Complete language dictionaries contain the base-language keys; partial dictionaries do not introduce keys that are absent from the base language
* Language dictionaries do not contain duplicate keys
* Resource keys use dot-separated names and contain no spaces
* Every supported language has a valid culture name and a corresponding resource file
* Language registrations use the expected font profiles
* Resource keys referenced by C# code and AXAML exist in `zh-CN`
* Missing resource keys return non-empty fallback text

After changing language resources, run the following command from the repository root:

```cmd
dotnet test
```

## API Summary

### Core Types

| API                       | Description                                             |
|---------------------------|---------------------------------------------------------|
| `Lang`                    | Code-side entry point for localized text and formatting |
| `LocalizationService`     | UI language and formatting culture service              |
| `LocalizationLanguage`    | Description of a supported language                     |
| `LocalizationFontProfile` | Font profile assigned to a language                     |
| `LocalizationCatalog`     | Framework-neutral language resource catalog             |
| `ILocalizationBackend`    | Localization backend interface used by the UI layer     |

### AXAML and Binding Types

| API                         | Description                                                       |
|-----------------------------|-------------------------------------------------------------------|
| `LocalizationSource`        | Text source used by AXAML bindings                                |
| `LocExtension`              | AXAML localization markup extension                               |
| `LocalizedProperty`         | Generates a localized getter for a partial property               |
| `LocalizationTextSource`    | Text source cached by resource key for code-created bindings      |
| `LocalizedText`             | Binding source that generates text from a delegate                |
| `LocalizedObservableObject` | View model base class that refreshes bindings on language changes |

## Usage Recommendations

* Retrieve user-visible text through `Lang.Text` or `{loc:Loc ...}` instead of hard-coding it in C# or AXAML
* Use a complete resource string for each sentence rather than concatenating translated fragments
* Keep resource keys descriptive and stable; avoid names tied only to a temporary UI location
* Do not cache localized text across language changes when the UI must support live language switching
* Avoid repeatedly reading the same localized text in high-frequency loops; cache it for the duration of a single logical operation
* Use `Lang` formatting helpers for user-visible dates, times, and numbers; use `CultureInfo.InvariantCulture` when a stable format is required
* During feature development, keep `zh-CN` and `en-US` up to date and use the translation site for other languages
