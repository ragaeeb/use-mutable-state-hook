# 📦 use-mutable-state-hook

[![wakatime](https://wakatime.com/badge/user/a0b906ce-b8e7-4463-8bce-383238df6d4b/project/c1957c46-f653-4b73-ac2b-2f4d5772a6da.svg)](https://wakatime.com/badge/user/a0b906ce-b8e7-4463-8bce-383238df6d4b/project/c1957c46-f653-4b73-ac2b-2f4d5772a6da)
![GitHub Release](https://img.shields.io/github/v/release/ragaeeb/use-mutable-state-hook)
[![codecov](https://codecov.io/github/ragaeeb/use-mutable-state-hook/graph/badge.svg?token=9DWYN1ETDS)](https://codecov.io/github/ragaeeb/use-mutable-state-hook)
[![Size](https://deno.bundlejs.com/badge?q=use-mutable-state-hook@latest&badge=detailed)](https://bundlejs.com/?q=use-mutable-state-hook%40latest)
![typescript](https://badgen.net/badge/icon/typescript?icon=typescript&label&color=blue)
![npm](https://img.shields.io/npm/dm/use-mutable-state-hook)
![GitHub issues](https://img.shields.io/github/issues/ragaeeb/use-mutable-state-hook)
![GitHub stars](https://img.shields.io/github/stars/ragaeeb/use-mutable-state-hook?style=social)

## 📖 Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Examples](#examples)
- [Why Use This?](#why-use-this)
- [License](#license)

## 🚀 Introduction

**use-mutable-state-hook** is a lightweight and efficient React hook that enables deep state mutation with automatic reactivity. With this hook, you can modify deeply nested objects without needing to spread state manually or call additional update functions—thanks to JavaScript Proxies.

## 📦 Installation

Install the package via npm or yarn:

```sh
bun add use-mutable-state-hook
```

or

```sh
pnpm add use-mutable-state-hook
```

or

```sh
npm install use-mutable-state-hook
```

or

```sh
yarn add use-mutable-state-hook
```

## 💡 Usage

```tsx
import { useMutableState } from 'use-mutable-state-hook';

const MyComponent = () => {
    const state = useMutableState({
        count: 0,
        nested: { value: { deep: 42 } },
        items: [1, 2, 3],
    });

    return (
        <div>
            <h3>Count: {state.count}</h3>
            <button onClick={() => state.count++}>Increment Count</button>

            <h3>Nested Value: {state.nested.value.deep}</h3>
            <button onClick={() => state.nested.value.deep++}>Increment Deep Value</button>
        </div>
    );
};
```

## 🛠 API

### `useMutableState<T>(initialState: T): ProxyState<T>`

Creates a deeply reactive proxy state that triggers re-renders upon mutation.

#### Parameters

- `initialState: T` – The initial state object to be used.

#### Returns

- `ProxyState<T>` – A proxy object with reactive updates and a `.toObject()` method to retrieve the plain object state.

## 📌 Examples

### 🔹 Modifying State Without Spreading

```tsx
const state = useMutableState({
    user: { name: 'Alice', details: { age: 25 } },
});

state.user.details.age++; // UI re-renders automatically
```

### 🔹 Using `toObject()` for Comparison or Sharing

```tsx
const pojo = state.toObject();
console.log(pojo); // Outputs the plain object version of state
```

## ❓ Why Use This?

- **No need for spread operators** – Modify deeply nested objects directly.
- **No external dependencies** – Uses built-in JavaScript Proxies.
- **Improved performance** – Triggers re-renders only when necessary.
- **Works with arrays & objects** – Mutate lists without extra steps.

## 📜 License

This project is licensed under the **MIT License**.

---

[🔗 GitHub Repository](https://github.com/ragaeeb/use-mutable-state-hook)
