import React,{useState} from 'react';
import {DiagramIcon} from './DiagramIcon';
type Group={label:string;description:string};
const icons=['document','guide','context','upload','library','context','review','write'];
export function StructureFlow({groups,original}:{groups:Group[];original:string}){
 const[raw,setRaw]=useState(false);
 const card=(i:number)=><div className={'flow-node flow-node-'+i}><div className="flow-node-heading"><span className="flow-icon"><DiagramIcon kind={icons[i]}/></span><strong>{groups[i].label}</strong></div><p>{groups[i].description}</p></div>;
 const arrow=<div className="flow-arrow"><DiagramIcon kind="arrow"/></div>;
 return <div className="structure-flow"><div className="flow-toolbar"><span>业务结构 <span className="diagram-caption">/ 按文本顺序编排</span></span><div className="diagram-switch"><button aria-pressed={!raw} onClick={()=>setRaw(false)}>结构图</button><button aria-pressed={raw} onClick={()=>setRaw(true)}>原文</button></div></div>{raw?<div className="flow-original">{original}</div>:<div className="flow-canvas" aria-label="总体业务结构">{card(0)}{arrow}{card(1)}{arrow}<div className="flow-binding"><div className="flow-group-title"><DiagramIcon kind="context"/><strong>{groups[2].label}</strong></div><div className="flow-row">{card(3)}{card(4)}</div></div>{arrow}{card(5)}{arrow}<div className="flow-row flow-outcomes">{card(6)}{card(7)}</div></div>}</div>
}
