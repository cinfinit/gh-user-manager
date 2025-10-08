
## 🧙‍♂️ gh-user-manager [![NPM version](https://img.shields.io/npm/v/gh-user-manager.svg?style=flat)](https://www.npmjs.com/package/gh-user-manager) [![NPM downloads](https://img.shields.io/npm/dm/gh-user-manager.svg?style=flat)](https://npmjs.org/package/gh-user-manager) 

> *A CLI tool that lets you juggle multiple GitHub identities like a pro (or wizard)*

Tired of Git yelling at you for using the wrong credentials?
Switching between your personal and work GitHub accounts shouldn't feel like hacking the matrix.

**`gh-user-manager`** is your command-line sidekick that helps you **add, switch, and manage multiple GitHub profiles instantly** — securely, with minimal setup, and full control.

---

## 🚀 Installation

```bash
npm install -g gh-user-manager
```

✨ Boom! You now have `gh-user-manager` available globally.

Now if you want the pre-commit hook to show the current identity and confirm the commit, run:

```bash
gh-user-manager init
```

This will add a pre-commit hook to your repository that will show the current identity and confirm before commit.
---

## 🧰 Features

* ✅ Add multiple GitHub profiles (work, personal, secret villain account, etc.)
* ✅ Switch between them instantly
* 🧹 Auto-clears Keychain access to prevent weird Git behavior
* ✨ No need to manually edit `.gitconfig` ever again
* 💥 Ships like a native CLI

---

## 💡 Why tho?

Git doesn't like confusion. If you're using multiple accounts on the same machine, it often:

* Pushes with the wrong user/email
* Prompts for wrong credentials
* Uses cached Keychain tokens
* Breaks your commit history

**This tool fixes all of that.**
Set your Git profile **once**, switch between them like a breeze, and **focus on your actual code**.

---

## 🛠️ Usage

### ➕ Add a profile

```bash
gh-user-manager add \
  --name work \
  --email dev@company.com \
  --username work-dev \
  --platform github \
  --auth https \
  --token ghp_xxxxxx
```

> Adds a new profile to gh-user-manager config
---

### 🔀 Switch profiles

```bash
gh-user-manager switch work
```

This will:
* switch to the profile you mention
* Clean up old GitHub credentials 

---

### ❌ Delete a profile

```bash
gh-user-manager delete work
```

This will:

* Remove the profile from gh-user-manager config

---

### 👀 List profiles

```bash
gh-user-manager list
```

See all your saved profiles and the currently active one.

---

## 🌐 Git Platforms in gh-user-manager

A platform defines the Git hosting service (like GitHub, GitLab, Bitbucket, etc.) and how authentication is handled — especially for HTTPS-based personal access tokens (PATs).

Each platform has:

A domain (e.g., github.com)

An authFormat (e.g., https://{username}:{token}@{domain}) used to construct the credential string saved to .git-credentials

Your profiles use these platforms when switching Git identities on your system.


## 🧰 Platform Management Commands

### ➕ Add a New Platform

```bash
gh-user-manager add-platform \
  --name myhost \
  --domain git.mycompany.com \
  --auth-format "https://{username}:{token}@{domain}"
```

Option	Description	Required	Default
--name	Name/key of the platform (e.g., github, gitea)	✅ Yes	—
--domain	Git domain used by this platform	✅ Yes	—
--auth-format	Credential format (with {username}, {token}, {domain})	No	https://{username}:{token}@{domain}

ℹ️ If --auth-format is not provided, a sensible default will be used.

### 📋 List All Platforms

```bash
gh-user-manager list-platforms
```

Displays all registered Git platforms along with their domains and auth formats.

### 🖊️ Update an Existing Platform

```bash
gh-user-manager update-platform \
  --name gitlab \
  --domain gitlab.company.com \
  --auth-format "https://{username}:{token}@{domain}"
```

Option	Description	Required
--name	Platform name to update	✅ Yes
--domain	New domain (optional)	No
--auth-format	New auth format string (optional)	No

You can update just the domain, just the auth format, or both.

### 🗑️ Delete a Platform

```bash
gh-user-manager delete-platform \
  --name myhost
```

Removes a custom platform by name. Built-in platforms (like github) can also be deleted, though it's not recommended unless you plan to override them.

### 🔄 Reset Platforms to Defaults

```bash
gh-user-manager reset-platforms
```

Restores the default platforms:

github.com

gitlab.com

bitbucket.org

A backup of the current platform file will be saved as:

~/.gh-user-manager-platforms.json.bak

### ♻️ Restore Platforms from Backup

```bash
gh-user-manager restore-platforms
```

Restores the platform config from the last .bak backup (if available).

### 🧠 Additional Notes

You can define custom Git providers (e.g., Gitea, Azure DevOps) using add-platform

Every profile is linked to a platform using the --platform flag (defaults to github if omitted)

HTTPS authentication only works if authFormat is valid and includes {username}, {token}, and {domain} placeholders

### 💡 Example: Adding & Using a Custom Platform

```bash
gh-user-manager add-platform \
  --name gitea \
  --domain gitea.dev.local \
  --auth-format "https://{username}:{token}@{domain}"
```

```bash
gh-user-manager add \
  --name dev \
  --email dev@gitea.dev.local \
  --username dev-user \
  --platform gitea \
  --auth https \
  --token your_token_here
```

Now, switching to dev will use your custom Gitea host and its credentials.


## 📦 What This Tool Doesn’t Do (Yet)

* Wash your dishes

---

## 🤹‍♂️ Final Words

Managing multiple GitHub users shouldn't be harder than managing your personal life.
Let `gh-user-manager` do the juggling — **you just commit**.

---

## ✍️ About the Author

Built with ☕, 🚀, and a healthy dose of **"Why isn't this easier?"**,
**`gh-user-manager`** was crafted by  [cinfinit](https://github.com/cinfinit) — a developer who got tired of Git forgetting who they were.

When not switching identities like a GitHub secret agent, they’re probably:

* Refactoring code that was "just fine yesterday"
* Naming things (the hardest part of programming)
* Avoiding merge conflicts like landmines

> *"I built this tool because I felt we all have been at that place once where we really needed it. You’re welcome to use it, break it, improve it, or just stare at it in awe."*
> — You, probably

---

## Change Log

### v0.2.0

- Added the concept of platforms and it's management commands
- Added pre-commit hook to show current identity and confirm commit
