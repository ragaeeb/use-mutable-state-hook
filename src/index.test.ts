import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useMutableState } from './index';

describe('useMutableState', () => {
    it('should initialize with the provided state', () => {
        const { result } = renderHook(() => useMutableState({ count: 0 }));
        expect(result.current.count).toBe(0);
    });

    it('should update primitive state values', () => {
        const { result } = renderHook(() => useMutableState({ count: 0 }));

        act(() => {
            result.current.count++;
        });

        expect(result.current.count).toBe(1);
    });

    it('should update nested state properties', () => {
        const { result } = renderHook(() => useMutableState({ nested: { value: { deep: 42 } } }));

        act(() => {
            result.current.nested.value.deep++;
        });

        expect(result.current.nested.value.deep).toBe(43);
    });

    it('should allow array mutations', () => {
        const { result } = renderHook(() => useMutableState({ items: [1, 2, 3] }));

        act(() => {
            result.current.items.push(4);
        });

        expect(result.current.items).toEqual([1, 2, 3, 4]);
    });

    it('should correctly return a plain object from toObject()', () => {
        const { result } = renderHook(() => useMutableState({ count: 0, nested: { value: 42 } }));

        const pojo = result.current.toObject();
        expect(pojo).toEqual({ count: 0, nested: { value: 42 } });
    });

    it('should trigger a re-render on state mutation', () => {
        const { rerender, result } = renderHook(() => useMutableState({ count: 0 }));

        act(() => {
            result.current.count++;
        });

        rerender();

        expect(result.current.count).toBe(1);
    });

    it('should create independent state instances', () => {
        const { result: state1 } = renderHook(() => useMutableState({ count: 0 }));
        const { result: state2 } = renderHook(() => useMutableState({ count: 0 }));

        act(() => {
            state1.current.count += 1;
        });

        expect(state1.current.count).toBe(1);
        expect(state2.current.count).toBe(0);
    });

    it('should delete a property and trigger an update', () => {
        const { result } = renderHook(() => useMutableState({ count: 0, name: 'Test' }));

        act(() => {
            Reflect.deleteProperty(result.current, 'name');
        });

        expect(result.current.toObject()).toEqual({ count: 0 });
    });

    it('should modify arrays reactively', () => {
        const { result } = renderHook(() => useMutableState({ items: [1, 2, 3] }));

        act(() => {
            result.current.items.shift(); // Remove first element
            result.current.items.unshift(99); // Add at the beginning
            result.current.items.splice(1, 1, 42); // Replace index 1 with 42
        });

        expect(result.current.items).toEqual([99, 42, 3]); // Expected transformed array
    });

    it('should preserve RegExp properties correctly', () => {
        const { result } = renderHook(() => useMutableState({ regex: /abc/i }));

        act(() => {
            result.current.regex = /xyz/g; // Replace with new RegExp
        });

        expect(result.current.regex.source).toBe('xyz'); // Should update correctly
    });

    it('should ensure deeply nested properties are independent', () => {
        const initialState = { user: { profile: { name: 'Alice' } } };
        const { result: state1 } = renderHook(() => useMutableState(initialState));
        const { result: state2 } = renderHook(() => useMutableState(initialState));

        act(() => {
            state1.current.user.profile.name = 'Bob';
        });

        expect(state1.current.user.profile.name).toBe('Bob');
        expect(state2.current.user.profile.name).toBe('Alice'); // Should remain unchanged
    });

    it('should remain reactive after multiple updates', () => {
        const { result } = renderHook(() => useMutableState({ count: 0 }));

        act(() => {
            result.current.count++;
            result.current.count++;
        });

        expect(result.current.count).toBe(2);

        act(() => {
            result.current.count += 5;
        });

        expect(result.current.count).toBe(7);
    });

    it('should return a deep clone from toObject()', () => {
        const { result } = renderHook(() => useMutableState({ user: { name: 'Alice' } }));

        const pojo = result.current.toObject();

        pojo.user.name = 'Bob'; // Mutate the clone

        expect(result.current.user.name).toBe('Alice'); // Original state should be unaffected
    });
});
