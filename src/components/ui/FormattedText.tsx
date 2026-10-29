"use client";

import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import React, { useEffect, useRef } from 'react';

export interface FormattedTextProps {
  text: string;
  defaultCodeLanguage?: string;
  style?: string;
  clampLines?: number;
  setIsClamped: (value: React.SetStateAction<boolean>) => void
}

type TokenMatch = {
  index: number;
  value: string;
  render: (key: string) => React.ReactNode;
};

type FormatRule = {
  name: string;
  regex: RegExp;
  className: string;
};

const rules: FormatRule[] = [
  {
    name: 'italic',
    regex: /(?<![\p{L}\p{N}_])__([\s\S]+?)__(?![\p{L}\p{N}_])/gu,
    className: 'italic',
  },
  {
    name: 'bold',
    regex: /(?<![\p{L}\p{N}_])\*\*([\s\S]+?)\*\*(?![\p{L}\p{N}_])/gu,
    className: 'font-bold',
  },
  {
    name: 'strike',
    regex: /(?<![\p{L}\p{N}_])--([\s\S]+?)--(?![\p{L}\p{N}_])/gu,
    className: 'line-through',
  },
];

const codeBlockRegex = /```([a-zA-Z0-9_+#.-]*)[ \t]*\r?\n([\s\S]*?)\r?\n?```/g;

const linkRegex = /\[([^\]\n]+)\]\(([^)\s]+)\)/g;

const escapeRegex = /\\(__|\*\*|--|```|\[)/g;

const newlineRegex = /\r?\n/g;

function isSafeHref(href: string): boolean {
  return (
    (href.startsWith('/') && !href.startsWith('//')) ||
    href.startsWith('#') ||
    /^https?:\/\//i.test(href) ||
    /^mailto:/i.test(href)
  );
}

function getNextMatch(
  text: string,
  position: number,
  prefix: string,
): TokenMatch | null {
  const candidates: TokenMatch[] = [];

  function search(
    regex: RegExp,
    createToken: (match: RegExpExecArray) => TokenMatch,
  ) {
    const matcher = new RegExp(regex.source, regex.flags);
    matcher.lastIndex = position;

    const match = matcher.exec(text);

    if (match) {
      candidates.push(createToken(match));
    }
  }

  search(codeBlockRegex, (match) => ({
    index: match.index,
    value: match[0],
    render: (key) => {
      const language = match[1] || 'text';
      const code = match[2];

      return (
        <SyntaxHighlighter
          key={key}
          language={language}
          style={dracula}
          customStyle={{ margin: 0 }}
          PreTag="pre"
          wrapLongLines
        >
          {code}
        </SyntaxHighlighter>
      );
    },
  }));

  search(escapeRegex, (match) => ({
    index: match.index,
    value: match[0],
    render: () => match[1],
  }));

  search(linkRegex, (match) => ({
    index: match.index,
    value: match[0],
    render: (key) => {
      const label = match[1];
      const href = match[2];

      if (!isSafeHref(href)) return match[0];

      return (
        <Link key={key} href={href} className="relative z-10 text-info hover:underline">
          {label}
        </Link>
      );
    },
  }));

  search(newlineRegex, (match) => ({
    index: match.index,
    value: match[0],
    render: (key) => <br key={key} />,
  }));

  for (const rule of rules) {
    search(rule.regex, (match) => ({
      index: match.index,
      value: match[0],
      render: (key) => (
        <span key={key} className={rule.className}>
          {parseInline(
            match[1],
            `${prefix}-${key}`,
          )}
        </span>
      ),
    }));
  }

  if (candidates.length === 0) return null;

  candidates.sort((a, b) => a.index - b.index);

  return candidates[0];
}

function parseInline(
  text: string,
  prefix = 'formatted',
): React.ReactNode[] {
  const result: React.ReactNode[] = [];
  let position = 0;
  let keyCounter = 0;

  while (position < text.length) {
    const token = getNextMatch(
      text,
      position,
      prefix,
    );

    if (!token) {
      result.push(text.slice(position));
      break;
    }

    if (token.index > position) {
      result.push(text.slice(position, token.index));
    }

    const key = `${prefix}-${keyCounter++}`;
    result.push(token.render(key));

    position = token.index + token.value.length;
  }

  return result;
}

export default function FormattedText({
  text,
  style,
  clampLines,
  setIsClamped,
}: FormattedTextProps) {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = textRef.current;

    if (!element || !clampLines) {
      setIsClamped(false);
      return;
    }

    const checkClamp = () => {
      const clamped = element.scrollHeight > element.clientHeight + 1;
      setIsClamped(clamped);
    };

    checkClamp();
  }, []);


  return (
    <div
      ref={textRef}
      className={style}
      style={
        clampLines
          ? {
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: clampLines,
            overflow: 'hidden',
          }
          : undefined
      }
    >
      {parseInline(text)}
    </div>
  );
}