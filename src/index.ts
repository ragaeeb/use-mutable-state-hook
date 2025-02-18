import { useCallback, useMemo, useState } from 'react';

type ProxyState<T> = {
    [K in keyof T]: T[K] extends object ? ProxyState<T[K]> | T[K] : T[K];
} & {
    toObject: () => T;
};

export function useMutableState<T extends object>(initialState: T): ProxyState<T> {
    const [state, setState] = useState<T>(() => structuredClone(initialState));

    const triggerUpdate = useCallback(() => {
        setState((prevState: T) => ({ ...prevState })); // Replace the reference
    }, []);

    const proxy = useMemo(() => createReactiveProxy(state, triggerUpdate), [state]);

    return proxy;
}

/**
 * A React hook that provides a deeply reactive state proxy.
 * Mutations to any property (including nested) trigger component re-renders.
 *
 * @template T - The type of the object used for the state.
 * @param initialState - The initial state object.
 * @returns A deeply reactive proxy of the initial state.
 */

/**
 * Creates a recursive reactive proxy for the given object.
 * Updates trigger re-renders of the React component.
 *
 * @param obj - The object to be wrapped in a proxy.
 * @param triggerUpdate - Function to force a React re-render.
 * @returns A proxy object with reactive updates.
 */
function createReactiveProxy<T extends object>(obj: T, triggerUpdate: () => void): ProxyState<T> {
    return new Proxy(obj, {
        deleteProperty(target, property) {
            if (property in target) {
                delete target[property as keyof T];
                triggerUpdate(); // Notify React to trigger a render
            }
            return true;
        },

        get(target, property) {
            if (property === 'toObject') {
                return () => {
                    const serialized: any = Array.isArray(target) ? [] : {};
                    for (const key in target) {
                        const value = target[key];
                        serialized[key] =
                            value && typeof value === 'object' && !(value instanceof RegExp)
                                ? ((value as any).toObject?.() ?? value)
                                : value;
                    }
                    return serialized;
                };
            }

            const value = target[property as keyof T];

            if (value instanceof RegExp) {
                return value;
            }

            if (value && typeof value === 'object' && !Object.isFrozen(value)) {
                return createReactiveProxy(value as Record<string, T>, triggerUpdate);
            }

            return value;
        },

        set(target, property, value) {
            if (value && typeof value === 'object' && !(value instanceof RegExp)) {
                value = createReactiveProxy(value as Record<string, T>, triggerUpdate);
            }

            if (target[property as keyof T] !== value) {
                target[property as keyof T] = value;
                triggerUpdate(); // Notify React to trigger a render
            }

            return true;
        },
    }) as ProxyState<T>;
}
