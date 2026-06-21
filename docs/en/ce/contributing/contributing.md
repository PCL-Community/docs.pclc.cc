# How to Contribute to the PCL CE Documentation Site?

This document is for developers and documentation maintainers who want to contribute content to the PCL CE documentation site. Whether you only want to fix a typo, add a screenshot, or write a complete new tutorial, you can follow the workflow in this document to contribute.

If this is your first time contributing, it is recommended to start with smaller changes, such as fixing errors in the documentation, adding missing explanations, or updating outdated screenshots. After you become familiar with the workflow, you can try adding new pages, migrating XAML help content, or improving the documentation site itself.

## 1. Before You Start: Confirm What You Want to Contribute

::: warning ✋ Before Proceeding
Please read and understand the [Writing Guidelines](./writing-guidelines.md) first. Contributions that do not comply with the guidelines may be rejected!
:::

Before making changes, it is recommended to first clarify the goal of your contribution. The PCL CE documentation site accepts many types of contributions, and different types of contributions require attention to slightly different things.

If you mainly want to modify documentation content, such as fixing errors, adding explanations, adding screenshots, translating pages, or creating new help documents, then in most cases you only need to understand Markdown syntax and the documentation directory structure.

If you want to improve site functionality, such as adjusting theme styles, writing Vue or VitePress components, or adding automated checking tools, you will also need to understand the frontend technology stack used by the project.

If you participate in maintenance work, such as organizing Issues, helping review Pull Requests, or adjusting the navigation structure, you can also complete these tasks through GitHub and do not necessarily need to write code.

## 2. Prepare the Local Environment

Before contributing, please install the following tools:

* [Node.js](https://nodejs.org/): The LTS version is recommended. Due to pnpm version restrictions, `22.x` or later is required.
* [pnpm](https://pnpm.io/): `v11` or later is required.
* [Git](https://git-scm.com/): Used to clone the repository, commit changes, and push branches.

In addition, it is recommended to prepare an editor or IDE suitable for editing Markdown and frontend projects. [VS Code](https://code.visualstudio.com/) is recommended because it starts quickly and provides convenient Markdown preview, Git operations, and terminal integration. If you are more used to JetBrains tools, you can also use [WebStorm](https://www.jetbrains.com/webstorm/) or [IntelliJ IDEA](https://www.jetbrains.com/idea/).

After installation, run the following commands in a terminal to confirm the versions:

```bash
node -v
pnpm -v
git -v
```

If all of these commands output version numbers correctly, the basic environment is ready.

## 3. Configure GitHub and SSH

The project is hosted on GitHub. To clone the repository, push branches, and submit Pull Requests, you need to prepare a GitHub account and configure an SSH key first.

If you have not configured SSH yet, refer to the official GitHub documentation:

[Adding a new SSH key to your GitHub account](https://docs.github.com/zh/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)

After configuration, you can test whether SSH is available with the following command:

```bash
ssh -T git@github.com
```

When connecting for the first time, the terminal may ask whether to trust the GitHub host. After confirming, if you see a message similar to successful authentication, you can continue to the next step.

## 4. Fork and Clone the Repository

When contributing, it is recommended to fork the project repository first, then create branches and submit changes in your own fork.

After opening the project repository page, click **Fork** in the upper-right corner to copy the repository to your own GitHub account.

After the fork is complete, clone your fork locally:

```bash
git clone git@github.com:your-username/docs.pclc.cc.git
cd docs.pclc.cc
```

To make it easier to sync with the upstream repository later, it is recommended to add the original repository as `upstream`:

```bash
git remote add upstream git@github.com:PCL-Community/docs.pclc.cc.git
```

You can check the remote repository configuration with the following command:

```bash
git remote -v
```

Normally, you should see `origin` pointing to your own fork, and `upstream` pointing to the original PCL Community repository.

After cloning is complete, open the project directory with your preferred editor or IDE. Later operations such as installing dependencies, starting the development server, and editing documentation can all be completed in the IDE’s built-in terminal.

## 5. Install Dependencies and Start Local Preview

After entering the project directory, install dependencies first:

```bash
pnpm install
```

After the dependencies are installed, start the local development server:

```bash
nr dev
```

After startup succeeds, the terminal will display the local preview address. Open this address to view the documentation site in your browser.

When modifying documentation, the development server usually refreshes the page automatically. It is recommended to edit the documentation while checking the final display result in the browser.

## 6. Create a New Working Branch

Do not modify content directly on the main branch. Before each contribution, you should create a new working branch.

The branch name should briefly describe the current change, for example:

```bash
git checkout -b docs/update-littleskin-guide
```

You can also name the branch according to the contribution type:

```bash
git checkout -b docs/fix-typos
git checkout -b docs/add-mod-install-guide
git checkout -b feat/add-doc-component
```

A branch should ideally handle only one category of changes. This makes later review and merging clearer.

## 7. Write or Modify Documentation

Documentation is written in Markdown, and file names use the `.md` extension. When adding new files, file names should use lowercase letters and separate words with hyphens, for example:

```text
install-mods.md
external-login.md
troubleshooting-launch-failed.md
```

Each document is recommended to include frontmatter metadata for controlling ordering and titles:

```yaml
---
order: 1
title: Document Title
---
```

Here, `order` is used to control document ordering. A smaller number means the document appears earlier. `title` can be used to override the default display title.

The body can be written using the following structure:

```markdown
---
order: 1
---

# Document Title

Write a short introduction here, explaining what problem this document solves and who should read it.

## 1. Preparation

Explain what needs to be prepared before starting.

## 2. Steps

Explain the steps in the actual operation order.

## 3. Common Issues

Add notes about things that are easy to get wrong.
```

When writing tutorials, try to use complete sentences to explain the reason and result of each operation. Do not only stack commands, lists, or screenshots. Readers should be able to understand “why to do this”, not only “where to click next”.

## 8. Add Images and Links

Documentation images should be placed in the `public/contents/` directory.

When referencing images, use paths starting with `/contents/`:

```markdown
![Image description](/contents/image-name.png)
```

The image description should explain the image content as much as possible, instead of only saying “image”. For example:

```markdown
![LittleSkin character management page](/contents/littleskin-role-page.png)
```

Links between documents should use relative paths:

```markdown
[Related document](./other-doc.md)
```

When referencing external pages, you can use full links directly:

```markdown
[GitHub Issues](https://github.com/PCL-Community/docs.pclc.cc/issues)
```

## 9. Check the Changes Locally

After completing the changes, return to the local preview page in your browser and check the following:

1. Whether the page opens normally.
2. Whether heading levels are correct.
3. Whether images display correctly.
4. Whether links can be opened.
5. Whether code blocks, admonition blocks, tables, and other formats are displayed correctly.
6. Whether the content follows a reasonable tutorial reading order.

If you added a new document, also confirm whether it appears in the correct navigation position. If it does not appear, you may need to check the document’s directory location, frontmatter metadata, or site navigation configuration.

## 10. Commit Changes

After confirming that the changes are correct, view the current changes:

```bash
git status
```

You can also view the specific modifications:

```bash
git diff
```

After confirming everything is correct, add the changes to the staging area:

```bash
git add .
```

Then commit the changes:

```bash
git commit -m "docs: 更新 LittleSkin 外置登录教程"
```

::: warning Note
The commit message should follow the format specified in [Technical Guidelines - Commit Message Convention - Simple Format](/ce/developers/guidelines#%E7%AE%80%E5%8D%95%E6%A0%BC%E5%BC%8F).
:::

## 11. Push the Branch and Create a Pull Request

After committing, push the branch to your fork repository:

```bash
git push origin docs/update-littleskin-guide
```

After the push succeeds, open GitHub. The page will usually prompt you to create a Pull Request.

When creating the Pull Request, please explain the changes made in this submission. You can briefly write:

```markdown
## Changes

- Improved the structure of the LittleSkin third-party login tutorial
- Moved screenshots closer to the corresponding steps
- Added common issue explanations

## Checks

- Previewed locally by starting the development server
- Checked image and link display
```

After submitting the Pull Request, maintainers may suggest changes. Continue modifying and committing to the same branch according to the suggestions, and the Pull Request will update automatically.

## 12. Sync the Upstream Repository

If your fork is behind the original repository, you can sync upstream updates.

First, fetch information from the upstream repository:

```bash
git fetch upstream
```

Switch to the main branch:

```bash
git checkout main
```

Merge the upstream main branch:

```bash
git merge upstream/main
```

Then push the updates to your own fork:

```bash
git push origin main
```

Creating a new working branch afterward can reduce conflicts.

## 13. Common Issues

### How do I add images?

Place the images in the `public/contents/` directory, then reference them in Markdown:

```markdown
![Image description](/contents/image-name.png)
```

### How should links in documentation be written?

When linking to other documents within the site, use relative paths:

```markdown
[Link text](./relative-path.md)
```

When linking to external websites, use full links:

```markdown
[Link text](https://example.com)
```

### How do I set document ordering?

Set the `order` field in the frontmatter metadata at the beginning of the document:

```yaml
---
order: 1
---
```

A smaller number means the document appears earlier.

### Can I continue modifying a Pull Request after submitting it?

Yes. As long as you continue committing and pushing to the same branch, the Pull Request will update automatically.

## 14. Getting Help

If you encounter problems, you can get help in the following ways:

* Ask a question in [GitHub Issues](https://github.com/PCL-Community/docs.pclc.cc/issues).
* Explain the issue in your Pull Request and wait for maintainers to help.

Thank you for contributing to the PCL CE documentation site!