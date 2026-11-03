import type {Root, Element} from 'hast';
const labels=['文书模板知识','取材指引知识','任务资料绑定','上传材料','知识库','任务上下文','审查任务','生成任务'];
function plain(node: any): string {return node.type==='text'?node.value:(node.children||[]).map(plain).join('')}
export default function structureFlow(){return(tree:Root,file:{value:unknown})=>{
  const nodes=tree.children;
  for(let i=0;i<nodes.length;i++){
    const first=nodes[i];if(first.type!=='element'||first.tagName!=='p'||plain(first).trim().split('\n')[0]!==labels[0])continue;
    const lines:string[]=[];let end=i;let valid=false;
    for(let j=i;j<nodes.length;j++){
      const n=nodes[j];if(n.type==='text'&&!n.value.trim())continue;
      if(n.type!=='element'||n.tagName!=='p'||n.children.some(c=>c.type!=='text'))break;
      lines.push(...plain(n).split('\n').map(s=>s.trim()).filter(Boolean));
      const found=lines.filter(l=>labels.includes(l));
      if(found.some((l,k)=>l!==labels[k])||found.length>labels.length)break;
      if(found.length===8&&lines.indexOf(labels[7])<lines.length-1){end=j;valid=true;break}
    }
    if(!valid)continue;
    const groups=labels.map((label,k)=>({label,description:lines.slice(lines.indexOf(label)+1,k===7?lines.length:lines.indexOf(labels[k+1])).join('\n')}));
    if(groups.some((g,k)=>k!==2&&(!g.description||g.description.includes('\n')))||groups[2].description)continue;
    const raw=String(file.value).slice(first.position?.start.offset??0,nodes[end].position?.end.offset??0);
    const block:Element={type:'element',tagName:'div',properties:{className:['structure-flow-block'],dataFlow:JSON.stringify(groups),dataOriginal:raw},children:[],position:{start:first.position!.start,end:nodes[end].position!.end}};
    nodes.splice(i,end-i+1,block);
  }
}}
