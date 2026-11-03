import React,{useState} from 'react';
import type {ChapterTree as Model,ChapterNode} from './chapter-tree';
import {DiagramIcon} from './DiagramIcon';
function Branch({nodes}:{nodes:ChapterNode[]}){return <ul className="chapter-branches">{nodes.map(n=><li key={n.number}><div className="chapter-label"><span className="chapter-number">{n.number}</span><span>{n.title}</span></div>{n.notes.length>0&&<div className="chapter-notes">{n.notes.map((note,i)=><p key={i} className={note.startsWith('关联')?'chapter-relation':'chapter-detail'}>{note.startsWith('关联')&&<DiagramIcon kind="link"/>}<span>{note}</span></p>)}</div>}{n.children.length>0&&<Branch nodes={n.children}/>}</li>)}</ul>}
export function ChapterTree({model,original}:{model:Model;original:string}){
 const[raw,setRaw]=useState(false);
 return <div className="structure-flow chapter-tree"><div className="flow-toolbar"><span>章节结构 <span className="diagram-caption">/ 按原文编号分层</span></span><div className="diagram-switch"><button aria-pressed={!raw} onClick={()=>setRaw(false)}>结构树</button><button aria-pressed={raw} onClick={()=>setRaw(true)}>原文</button></div></div>{raw?<div className="flow-original">{original}</div>:<div aria-label={model.title}><div className="chapter-root"><span className="flow-icon"><DiagramIcon/></span><strong>{model.title}</strong></div><Branch nodes={model.nodes}/></div>}</div>
}
