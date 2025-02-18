import { useCallback, useMemo, useRef, useState } from 'react';

type ProxyState<T> = {
    [K in keyof T]: T[K] extends object ? ProxyState<T[K]> | T[K] : T[K];
} & {
    toObject: () => T;
};

/**
 * A React hook that provides a deeply reactive state proxy.
 * Mutations to any property (including nested) trigger component re-renders.
 *
 * @template T - The type of the object used for the state.
 * @param initialState - The initial state object.
 * @returns A deeply reactive proxy of the initial state.
 */
export function useMutableState<T extends object>(initialState: T): ProxyState<T> {
    const stateRef = useRef<T>(structuredClone(initialState));
    const [tick, setTick] = useState(0);

    const triggerUpdate = useCallback(() => {
        setTick((t) => t + 1);
    }, []);

    const proxy = useMemo(() => createReactiveProxy(stateRef.current, triggerUpdate), [tick]);
    return proxy;
}

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
                triggerUpdate(); // Trigger a re-render
            }
            return true;
        },

        get(target, property) {
            if (property === 'toObject') {
                return () => structuredClone(target);
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
                triggerUpdate(); // Trigger a re-render
            }

            return true;
        },
    }) as ProxyState<T>;
}
