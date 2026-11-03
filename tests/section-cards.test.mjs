import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import Markdown from 'react-markdown';
import gfm from 'remark-gfm';
const source = ts.transpileModule(fs.readFileSync(new URL('../src/section-cards.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText;
const {default:cards} = await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
function ranges(text){const captured=[];renderToStaticMarkup(React.createElement(Markdown,{remarkPlugins:[gfm],rehypePlugins:[cards],components:{section:({node,children})=>{captured.push(text.slice(Number(node.properties.dataSourceStart),Number(node.properties.dataSourceEnd)));return React.createElement('section',null,children)}}},text));return captured}

test('copy ranges include descendants and exclude siblings and parents',()=>{
  const intro='引言\n\n',a='# 章节A\n\n**正文**\n\n',sub='### 子章\n\n```md\n# 代码内标题\n```\n\n',sibling='## 下一子章\n\n| 字段 | 值 |\n|---|---|\n| A | B |\n\n',b='# 章节B\n\n末尾';
  assert.deepEqual(ranges(intro+a+sub+sibling+b),[intro,a+sub+sibling,sub,sibling,b]);
});
test('plain text, CRLF, setext headings and quoted headings retain raw source',()=>{
  assert.deepEqual(ranges('无标题\r\n\r\n正文'),['无标题\r\n\r\n正文']);
  const a='章节A\r\n===\r\n\r\n> ## 引用内标题\r\n\r\n';const b='# B\r\n末尾';
  assert.deepEqual(ranges(a+b),[a,b]);
});
