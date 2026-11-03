import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import ts from 'typescript';import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';import Markdown from 'react-markdown';
const source=ts.transpileModule(fs.readFileSync(new URL('../src/chapter-tree.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText;
const {default:tree}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const sample=['软件需求规格说明模板','3 需求','3.1 要求的状态和方式','3.2 CSCI能力需求','3.2.X（CSCI能力）','内容属性：能力名称、需求条目、需求标识符、需求描述……','子章节可按具体能力重复','3.3 CSCI外部接口需求','4 合格性规定','内容属性：检验方法、需求与方法对应信息','关联第3章的软件需求','5 需求可追踪性','内容属性：双向需求追踪信息','关联第3章和上层系统需求材料'].join('\n\n');
function render(text){let data;const html=renderToStaticMarkup(React.createElement(Markdown,{rehypePlugins:[tree],components:{div:({node,children})=>{if(node.properties.dataChapterTree)data=node.properties;return React.createElement('div',null,children)}}},text));return{data,html}}
test('numbered chapters, X placeholder, notes and relations are grouped by prefix',()=>{
 const {data,html}=render(sample+'\n\n这是模板结构的示意，不是附录 J 的完整目录。');
 const model=JSON.parse(data.dataChapterTree);
 assert.equal(model.nodes.length,3);
 assert.deepEqual(model.nodes[0].children.map(n=>n.number),['3.1','3.2','3.3']);
 assert.equal(model.nodes[0].children[1].children[0].number,'3.2.X');
 assert.equal(model.nodes[0].children[1].children[0].notes.length,2);
 assert.equal(model.nodes[1].notes[1],'关联第3章的软件需求');
 assert.equal(data.dataOriginal,sample);assert.match(html,/不是附录 J 的完整目录/);
});
test('soft breaks work; ambiguous numbering is kept as text',()=>{
 assert.ok(render(sample.replaceAll('\n\n','\n')).data);
 assert.equal(render(sample.replace('3.2 CSCI能力需求\n\n','')).data,undefined);
 assert.equal(render(sample.replace('3.3 CSCI外部接口需求','3.1 重复编号')).data,undefined);
 assert.equal(render('模板\n\n普通正文\n\n3 需求').data,undefined);
});
