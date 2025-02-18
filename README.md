# 📦 use-mutable-state-hook

[![wakatime](https://wakatime.com/badge/user/a0b906ce-b8e7-4463-8bce-383238df6d4b/project/c1957c46-f653-4b73-ac2b-2f4d5772a6da.svg)](https://wakatime.com/badge/user/a0b906ce-b8e7-4463-8bce-383238df6d4b/project/c1957c46-f653-4b73-ac2b-2f4d5772a6da)
![GitHub Release](https://img.shields.io/github/v/release/ragaeeb/use-mutable-state-hook)
![GitHub](https://img.shields.io/github/license/ragaeeb/use-mutable-state-hook)
[![codecov](https://codecov.io/gh/ragaeeb/use-mutable-state-hook/graph/badge.svg?token=IA2FW0D7MR)](https://codecov.io/gh/ragaeeb/use-mutable-state-hook)
[![Size](https://deno.bundlejs.com/badge?q=use-mutable-state-hook@latest&badge=detailed)](https://bundlejs.com/?q=use-mutable-state-hook%40latest)
![typescript](https://badgen.net/badge/icon/typescript?icon=typescript&label&color=blue)
![npm](https://img.shields.io/npm/dm/use-mutable-state-hook)
![npm](https://img.shields.io/npm/v/use-mutable-state-hook)
![GitHub issues](https://img.shields.io/github/issues/ragaeeb/use-mutable-state-hook)
![GitHub stars](https://img.shields.io/github/stars/ragaeeb/use-mutable-state-hook?style=social)

## 📖 Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Examples](#examples)
- [Caveats](#caveats)
- [Performance Considerations](#performance-considerations)
- [Use Cases & Considerations](#use-cases--considerations)
- [Why Use This?](#why-use-this)
- [License](#license)

## 🚀 Introduction

**use-mutable-state-hook** is a lightweight and efficient React hook that enables deep state mutation with automatic reactivity. With this hook, you can modify deeply nested objects without needing to spread state manually or call additional update functions—thanks to JavaScript Proxies.

TL;DR you can condense code like this:

```tsx
import { useState } from 'react';

const [state, setState] = useState({
    level1: { level2: { level3: { level4: { count: 0 } } } },
});

const increment = () => {
    setState((prev) => ({
        ...prev,
        level1: {
            ...prev.level1,
            level2: {
                ...prev.level1.level2,
                level3: {
                    ...prev.level1.level2.level3,
                    level4: {
                        ...prev.level1.level2.level3.level4,
                        count: prev.level1.level2.level3.level4.count + 1,
                    },
                },
            },
        },
    }));
};

return (
    <div>
        <h3>Count: {state.level1.level2.level3.level4.count}</h3>
        <button onClick={increment}>Increment</button>
    </div>
);
```

with:

```tsx
import { useMutableState } from 'use-mutable-state-hook';

const MyComponent = () => {
    const state = useMutableState({
        level1: { level2: { level3: { level4: { count: 0 } } } },
    });

    return (
        <div>
            <h3>Count: {state.level1.level2.level3.level4.count}</h3>
            <button onClick={() => state.level1.level2.level3.level4.count++}>Increment</button>
        </div>
    );
};
```

✅ No Spreading – Modify deeply nested values directly
✅ Automatic Reactivity – No need to call setState manually
✅ Simplifies State Updates – Works with objects & arrays seamlessly

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

Once you are done with your state object and you need to send it to another component or consume the value, you can use the `toObject()` method.

```tsx
const pojo = state.toObject();
console.log(pojo); // Outputs the plain object version of state
```

### 🔹 Tracking Changes in Effects

```tsx
useEffect(() => {
    console.log('State changed:', state.toObject());
}, [state]); // The proxy reference updates on every mutation.
```

## ⚠️ Caveats

1. **Proxies Change on Every Render:**

    - Since a new proxy reference is created on each state update, using `useMemo` with `[state]` will work as expected.
    - However, be cautious when passing the proxy as a dependency where identity comparisons matter.

2. **`toObject()` Always Returns a Fresh Deep Clone:**

    - The returned object is fully detached from the proxy and can be safely mutated without affecting the original state.

3. **RegExp Objects Are Not Deep Cloned:**
    - If your state includes `RegExp` objects, they will remain the same reference inside the state.

## 🚀 Performance Considerations

- **State mutations trigger updates efficiently.**
    - Instead of deep-cloning state on every update, it uses in-place mutation while replacing the proxy reference.
- **Arrays are mutable, but costly operations (e.g., `splice`, `sort`) trigger full re-renders.**
    - Avoid unnecessary array reassignments; prefer push/pop/filter to minimize reactivity overhead.
- **For performance-sensitive applications, avoid excessive deep mutations.**
    - If you frequently modify deeply nested structures, consider whether immutability (e.g., Redux, Zustand) may be a better fit.

## 🎯 Use Cases & Considerations

### When to Use:

✔️ **Forms & UI State:** Easily manage deeply nested form state without complex state updates.  
✔️ **Local Component State:** Works well for localized UI-driven state that doesn’t need to be stored globally.  
✔️ **Dynamic Object Modifications:** Perfect when working with deeply nested structures that require real-time updates.

### When to Avoid:

❌ **Large-Scale Global State Management:** Proxies can introduce unnecessary complexity when scaling state across multiple components.  
❌ **Heavy Computation-Based State:** If state calculations need to be memoized or derived efficiently, use `useState` with controlled updates instead.  
❌ **Highly Immutable State Requirements:** If strict immutability is necessary (e.g., undo/redo features, history tracking), this approach may not be ideal.

## ❓ Why Use This?

- **No need for spread operators** – Modify deeply nested objects directly.
- **No external dependencies** – Uses built-in JavaScript Proxies.
- **Works with arrays & objects** – Mutate lists without extra steps.
- **Automatic Reactivity** – The proxy updates and triggers re-renders without manual state setters.

## 📜 License

This project is licensed under the **MIT License**.

---

[🔗 GitHub Repository](https://github.com/ragaeeb/use-mutable-state-hook)
