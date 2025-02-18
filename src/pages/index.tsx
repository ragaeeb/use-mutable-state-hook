/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button } from '@/components/ui/button';
import { CodeBlock } from '@/components/ui/code-block';
import React, { useEffect, useMemo, useState } from 'react';
import { useMutableState } from 'use-mutable-state-hook';

(RegExp.prototype as any).toJSON = RegExp.prototype.toString;

export default function Home() {
    const [activeTab, setActiveTab] = useState(0);
    const state = useMutableState({
        count: 0,
        items: [1, 2, 3],
        nested: { value: { deep: 42 } },
        regex: /abc/i,
    });
    const [state2, setState2] = useState({
        count: 0,
        items: [1, 2, 3],
        nested: { value: { deep: 42 } },
        regex: /abc/i,
    });
    const [log, setLog] = useState('');

    const pojo = useMemo(() => {
        return state.toObject();
    }, [state]);

    useEffect(() => {
        setLog((prev) => [prev, `Updated with ${JSON.stringify(pojo)}`].join('\n').trim());
    }, [pojo]);

    const UseMutableStateCode = `const state = useMutableState({
    count: ${state.count},
    items: [${state.items.toString()}],
    nested: { value: { deep: ${state.nested.value.deep} } },
    regex: ${state.regex},
});

return (<div>
    <Button onClick={() => (state.count += 1)}>state.count += 1</Button>
    <Button onClick={() => (state.nested.value.deep += 1)}>state.nested.value.deep += 1</Button>
    <Button onClick={() => state.items.push(state.items.length + 1)}>state.items.push()</Button>
    <Button onClick={() => state.items.pop()}>state.items.pop()</Button>
    <Button onClick={() => (state.regex = new RegExp(Date.now().toString(), 'g'))}>
        state.regex = Date.now()
    </Button>
</div>);
  `;

    const UseStateCode = `const state = useState({
    count: ${state2.count},
    items: [${state2.items.toString()}],
    nested: { value: { deep: ${state2.nested.value.deep} } },
    regex: ${state2.regex},
});

return (<div>
    <Button onClick={() => setState2((prev) => ({ ...prev, count: prev.count + 1 }))}>
        state.count += 1
    </Button>
    <Button
        onClick={() => {
            setState2((prev) => ({
                ...prev,
                nested: {
                    ...prev.nested,
                    value: { ...prev.nested.value, deep: prev.nested.value.deep + 1 },
                },
            }));
        }}
    >
        state.nested.value.deep += 1
    </Button>
    <Button
        onClick={() =>
            setState2((prev) => ({ ...prev, items: prev.items.concat(prev.items.length + 1) }))
        }
    >
        state.items.push()
    </Button>
    <Button onClick={() => setState2((prev) => ({ ...prev, items: prev.items.slice(0, -1) }))}>
        state.items.pop()
    </Button>
    <Button
        onClick={() =>
            setState2((prev) => ({ ...prev, regex: new RegExp(Date.now().toString(), 'g') }))
        }
    >
        state.regex = Date.now()
    </Button>
</div>);
  `;

    return (
        <>
            {activeTab === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 w-full mx-auto gap-3 py-3 px-5">
                    <Button onClick={() => (state.count += 1)}>state.count += 1</Button>
                    <Button onClick={() => (state.nested.value.deep += 1)}>state.nested.value.deep += 1</Button>
                    <Button onClick={() => state.items.push(state.items.length + 1)}>state.items.push()</Button>
                    <Button onClick={() => state.items.pop()}>state.items.pop()</Button>
                    <Button onClick={() => (state.regex = new RegExp(Date.now().toString(), 'g'))}>
                        state.regex = Date.now()
                    </Button>
                </div>
            )}
            {activeTab === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 w-full mx-auto gap-3 py-3 px-5">
                    <Button onClick={() => setState2((prev) => ({ ...prev, count: prev.count + 1 }))}>
                        state.count += 1
                    </Button>
                    <Button
                        onClick={() => {
                            setState2((prev) => ({
                                ...prev,
                                nested: {
                                    ...prev.nested,
                                    value: { ...prev.nested.value, deep: prev.nested.value.deep + 1 },
                                },
                            }));
                        }}
                    >
                        state.nested.value.deep += 1
                    </Button>
                    <Button
                        onClick={() =>
                            setState2((prev) => ({ ...prev, items: prev.items.concat(prev.items.length + 1) }))
                        }
                    >
                        state.items.push()
                    </Button>
                    <Button onClick={() => setState2((prev) => ({ ...prev, items: prev.items.slice(0, -1) }))}>
                        state.items.pop()
                    </Button>
                    <Button
                        onClick={() =>
                            setState2((prev) => ({ ...prev, regex: new RegExp(Date.now().toString(), 'g') }))
                        }
                    >
                        state.regex = Date.now()
                    </Button>
                </div>
            )}
            <div className="mx-auto w-full px-5">
                <CodeBlock
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    tabs={[
                        { code: UseMutableStateCode, language: 'tsx', name: 'useMutableState' },
                        {
                            code: UseStateCode,
                            language: 'tsx',
                            name: 'useState',
                        },
                    ]}
                />
            </div>
            {activeTab === 0 && (
                <div className="text-xs mx-auto w-full py-5 px-5">
                    <p>
                        {log.split('\n').map((item, key) => (
                            <React.Fragment key={key}>
                                {item}
                                <br />
                            </React.Fragment>
                        ))}
                    </p>
                </div>
            )}

            <footer className="bg-black rounded-lg shadow-sm m-4">
                <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
                    <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
                        <a className="hover:underline me-4 md:me-6" href="https://github.com/ragaeeb">
                            @ragaeeb
                        </a>
                    </span>
                    <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                        <li>
                            <a
                                className="hover:underline me-4 md:me-6"
                                href="https://github.com/ragaeeb/use-mutable-state-hook"
                            >
                                GitHub Repo: use-mutable-state-hook
                            </a>
                        </li>
                    </ul>
                </div>
            </footer>
        </>
    );
}
