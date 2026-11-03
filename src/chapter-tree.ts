import type {Root, Element, RootContent} from 'hast';
export type ChapterNode = {number:string;title:string;notes:string[];children:ChapterNode[]};
export type ChapterTree = {title:string;nodes:ChapterNode[]};
const chapter = /^(\d+(?:\.(?:\d+|[xX]))*)(?=\s|[（(])\s*(.+)$/;
function lines(node:RootContent):string[]|undefined{
  if(node.type!=='element'||node.tagName!=='p'||node.children.some(c=>c.type!=='text'))return;
  return node.children.map(c=>c.type==='text'?c.value:'').join('').split('\n').map(s=>s.trim()).filter(Boolean);
}
// Number prefixes express containment; notes attach only to the preceding node.
function parse(input:string[]):ChapterTree|undefined{
  const title=input[0];const nodes:ChapterNode[]=[];const stack:ChapterNode[]=[];
  const seen=new Set<string>();
  for(const line of input.slice(1)){
    const match=line.match(chapter);
    if(match){
      const number=match[1];if(seen.has(number))return;seen.add(number);
      while(stack.length&&!number.startsWith(stack[stack.length-1].number+'.'))stack.pop();
      const parent=stack[stack.length-1];
      // Do not invent missing parents or fill gaps in the source.
      if(number.includes('.')&&(!parent||number.split('.').length!==parent.number.split('.').length+1))return;
      const node:ChapterNode={number,title:match[2],notes:[],children:[]};
      (parent?parent.children:nodes).push(node);stack.push(node);
    }else if(/^(内容属性[：:]|关联|子章节可)/.test(line)&&stack.length){stack[stack.length-1].notes.push(line)}
    else return;
  }
  return seen.size>=3&&nodes.some(n=>n.children.length)?{title,nodes}:undefined;
}
export default function chapterTree(){return(tree:Root,file:{value:unknown})=>{
  for(let i=0;i<tree.children.length;i++){
    const first=tree.children[i];const startLines=lines(first);
    if(!startLines||!/^.{1,80}模板$/.test(startLines[0]))continue;
    const input=[...startLines];let end=i;
    for(let j=i+1;j<tree.children.length;j++){
      const node=tree.children[j];if(node.type==='text'&&!node.value.trim())continue;
      const next=lines(node);if(!next||next.some(l=>!chapter.test(l)&&!/^(内容属性[：:]|关联|子章节可)/.test(l)))break;
      input.push(...next);end=j;
    }
    const model=parse(input);if(!model||!first.position||!tree.children[end].position)continue;
    const finish=tree.children[end].position!.end;
    const original=String(file.value).slice(first.position.start.offset,finish.offset);
    const block:Element={type:'element',tagName:'div',properties:{dataChapterTree:JSON.stringify(model),dataOriginal:original},children:[],position:{start:first.position.start,end:finish}};
    tree.children.splice(i,end-i+1,block);
  }
}}
