'use client';

import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

type CodeBlockProps = {
    activeTab: number;
    setActiveTab: React.Dispatch<React.SetStateAction<number>>;
} & (
    | {
          code: string;
          tabs?: never;
      }
    | {
          code?: never;
          tabs: Array<{
              code: string;
              highlightLines?: number[];
              language?: string;
              name: string;
          }>;
      }
);

export const CodeBlock = ({ activeTab, setActiveTab, tabs = [] }: CodeBlockProps) => {
    const activeCode = tabs[activeTab].code;
    const activeLanguage = tabs[activeTab].language;
    const activeHighlightLines = tabs[activeTab].highlightLines || [];

    return (
        <div className="relative w-full rounded-lg bg-slate-900 p-4 font-mono text-sm">
            <div className="flex flex-col gap-2">
                <div className="flex  overflow-x-auto">
                    {tabs.map((tab, index) => (
                        <button
                            className={`px-3 !py-2 text-lg transition-colors font-sans ${
                                activeTab === index ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
                            }`}
                            key={index}
                            onClick={() => setActiveTab(index)}
                        >
                            {tab.name}
                        </button>
                    ))}
                </div>
            </div>
            <SyntaxHighlighter
                customStyle={{
                    background: 'transparent',
                    fontSize: '0.875rem', // text-sm equivalent
                    margin: 0,
                    padding: 0,
                }}
                language={activeLanguage}
                lineProps={(lineNumber) => ({
                    style: {
                        backgroundColor: activeHighlightLines.includes(lineNumber)
                            ? 'rgba(255,255,255,0.1)'
                            : 'transparent',
                        display: 'block',
                        width: '100%',
                    },
                })}
                PreTag="div"
                showLineNumbers={true}
                style={atomDark}
                wrapLines={true}
            >
                {String(activeCode)}
            </SyntaxHighlighter>
        </div>
    );
};
