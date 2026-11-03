import {LocalImage} from './LocalImage';
import {type Handle} from './files';
import React,{useState} from 'react';

import Markdown from'react-markdown';
import gfm from'remark-gfm';
import cjkFriendly from 'remark-cjk-friendly/parseOnly';
import highlight from'rehype-highlight';

import './style.css';
import './themes.css';
import chapterTree from './chapter-tree';
import {ChapterTree} from './ChapterTree';
import structureFlow from './structure-flow';
import {StructureFlow} from './StructureFlow';
import sectionCards from './section-cards';
function RemoteImage({src,alt}:{src?:string;alt?:string}){const[show,setShow]=useState(false);return show?<img src={src} alt={alt}/>:<button className="image-load" onClick={()=>setShow(true)}>加载图片：{alt||'远程图片'}（将访问外部地址）</button>}

export const Reader=React.memo(function Reader({text,root,path='',onLink,onNotice}:{text:string;root?:Handle;path?:string;onLink?:(href:string)=>void;onNotice?:(message:string)=>void}){async function copy(value:string){try{await navigator.clipboard.writeText(value);onNotice?.('已复制')}catch{onNotice?.('无法复制，请手动选择文字')}}return <Markdown remarkPlugins={[gfm,cjkFriendly]} rehypePlugins={[chapterTree,structureFlow,highlight,sectionCards]} components={{div:({node,children,...props})=>node?.properties.dataChapterTree?<ChapterTree model={JSON.parse(String(node.properties.dataChapterTree))} original={String(node.properties.dataOriginal)}/>:node?.properties.dataFlow?<StructureFlow groups={JSON.parse(String(node.properties.dataFlow))} original={String(node.properties.dataOriginal)}/>:<div {...props}>{children}</div>,section:({node,children,...props})=><section {...props}><button type="button" className="card-copy" aria-label="复制本章节及子章节 Markdown" title="复制本章节及子章节 Markdown" onClick={()=>copy(text.slice(Number(node?.properties.dataSourceStart),Number(node?.properties.dataSourceEnd)))}><svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg></button>{children}</section>,a:props=><a {...props} target="_blank" rel="noopener noreferrer" onClick={e=>{if(props.href&&!/^[a-z][a-z\d+.-]*:|^\/\//i.test(props.href)){e.preventDefault();onLink?.(props.href)}}}/>,img:props=>props.src&&/^[a-z][a-z\d+.-]*:|^\/\//i.test(props.src)?<RemoteImage src={props.src} alt={props.alt}/>:<LocalImage root={root} path={path} src={props.src} alt={props.alt}/>,pre:({children,...props})=><div className="code-wrap"><button onClick={e=>copy(e.currentTarget.parentElement?.querySelector('pre')?.textContent||'')}>复制代码</button><pre {...props}>{children}</pre></div>,table:({children,...props})=><div className="table-wrap"><table {...props}>{children}</table></div>}}>{text}</Markdown>});
