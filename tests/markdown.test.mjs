import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import Markdown from 'react-markdown';
import gfm from 'remark-gfm';
import cjkFriendly from 'remark-cjk-friendly/parseOnly';

const render = text => renderToStaticMarkup(React.createElement(Markdown, {remarkPlugins: [gfm, cjkFriendly]}, text));

test('Chinese punctuation-ended emphasis next to text', () => {
  assert.equal(render('**可以借鉴：**以原文的章条结构作为导航。'), '<p><strong>可以借鉴：</strong>以原文的章条结构作为导航。</p>');
  assert.match(render('先看**“内容在哪里”**再定位。'), /先看<strong>“内容在哪里”<\/strong>再定位/);
  assert.match(render('**不要求一个章节对应一条指引。**一个取材目标可能涉及多个章节。'), /<strong>不要求一个章节对应一条指引。<\/strong>一个取材目标/);
});

test('emphasis inside headings, quotes, lists and tables', () => {
  const html = render('## **章节：**正文\n\n> **说明：**引用\n\n- **注意：**事项\n\n| 属性 | 说明 |\n|---|---|\n| **范围：**内容 | **方法** |');
  for (const word of ['章节：', '说明：', '注意：', '范围：', '方法']) assert.ok(html.includes(`<strong>${word}</strong>`));
  assert.match(html, /<table>/);
});

test('inline code, fenced code and escaped stars remain literal', () => {
  assert.equal(render('`**可以借鉴：**以原文`'), '<p><code>**可以借鉴：**以原文</code></p>');
  assert.match(render('```md\n**可以借鉴：**以原文\n```'), /<code class="language-md">\*\*可以借鉴：\*\*以原文/);
  assert.equal(render('\\*\\*可以借鉴：\\*\\*以原文'), '<p>**可以借鉴：**以原文</p>');
});

test('normal emphasis, links and safety are preserved', () => {
  assert.match(render('**English** and *italic*'), /<strong>English<\/strong> and <em>italic<\/em>/);
  assert.match(render('**可以借鉴：**[原文](https://example.com)'), /<strong>可以借鉴：<\/strong><a href="https:\/\/example.com">原文<\/a>/);
  assert.doesNotMatch(render('[危险](javascript:alert%281%29)'), /href="javascript:/);
  assert.doesNotMatch(render('<script>alert(1)</script>'), /<script>/);
});
