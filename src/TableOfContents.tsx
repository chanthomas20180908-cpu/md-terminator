import React from 'react';
import {DiagramIcon} from './DiagramIcon';
type Heading={id:string;text:string;level:number};
export function TableOfContents({headings,current,onSelect}:{headings:Heading[];current:string;onSelect:(id:string)=>void}){
 const stack:number[]=[];
 return <><div className="toc-heading"><span><DiagramIcon kind="document"/>本页目录</span><small>{headings.length}</small></div><div className="toc-items" role="navigation" aria-label="文章目录">{headings.map(h=>{
   while(stack.length&&stack[stack.length-1]>=h.level)stack.pop();
   const depth=stack.length;stack.push(h.level);
   const match=h.text.match(/^((?:[一二三四五六七八九十百]+[、．.]|\d+(?:\.\d+)*[.、．]))\s*(.+)$/);
   return <button key={h.id} type="button" title={h.text} aria-current={current===h.id?'location':undefined} className={'toc-item '+(depth===0?'toc-root ':'')+(current===h.id?'selected':'')} style={{'--toc-depth':depth} as React.CSSProperties} onClick={()=>onSelect(h.id)}>{match&&<span className="toc-number">{match[1].replace(/[、．.]$/,'')}</span>}<span className="toc-text">{match?match[2]:h.text}</span></button>
 })}</div></>
}
