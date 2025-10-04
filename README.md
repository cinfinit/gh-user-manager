
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

