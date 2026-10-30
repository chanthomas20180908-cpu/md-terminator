import React,{useState,useEffect,useRef} from 'react';
import{createRoot}from'react-dom/client';
import Markdown from'react-markdown';
import gfm from'remark-gfm';
import highlight from'rehype-highlight';
import'highlight.js/styles/github-dark.css';
import './style.css';
const sample=`# 给信息一点呼吸的空间

每天读很多回答，也值得拥有舒服的阅读体验。

## 01 好的排版，让思考浮现

信息不必一直拥挤在一起。**清楚的层次**、恰当的留白，以及一点温柔的颜色，让重要的内容自然浮现。

> 阅读不是赶路。停下来，把一个想法读明白，也是一种进展。

## 02 从三个小步骤开始

1. 把 GPT 的回答粘贴到左侧。
2. 看看标题、列表和引用如何各就各位。
3. 切换到阅读模式，让注意力回到内容。

- [x] 保留原始文字与顺序
- [x] 支持表格、引用与代码
- [ ] 留一点时间慢慢读

### 不同信息，各有位置

| 元素 | 呈现方式 | 用途 |
| --- | --- | --- |
| 标题 | 清楚的层级 | 理清脉络 |
| 引用 | 柔和的色块 | 留下旁注 |
| 代码 | 独立的深色区域 | 专注细节 |

## 03 想法也可以运行

行内的代码像这样：\`const idea = 'start small'\`。

\`\`\`javascript
function readSlowly(text) {
  return text.trim();
}
\`\`\`

---

文字来自你，阅读的节奏也由你决定。[了解 Markdown](https://www.markdownguide.org/)。`;
function saved(){try{return JSON.parse(localStorage.getItem('md-terminator')||'{}')}catch{return{}}}
function RemoteImage({src,alt}:{src?:string;alt?:string}){const[show,setShow]=useState(false);return show?<img src={src} alt={alt}/>:<button className="image-load" onClick={()=>setShow(true)}>加载图片：{alt||'远程图片'}（将访问外部地址）</button>}
function App(){const initial=useRef(saved());const[text,setText]=useState<string>(initial.current.text??'');const[rendered,setRendered]=useState(text);const[reading,setReading]=useState(!!initial.current.reading);const[notice,setNotice]=useState('');const[toc,setToc]=useState(false);const file=useRef<HTMLInputElement>(null);const article=useRef<HTMLElement>(null);
useEffect(()=>{const timer=setTimeout(()=>setRendered(text),180);return()=>clearTimeout(timer)},[text]);
useEffect(()=>{try{localStorage.setItem('md-terminator',JSON.stringify({text,reading}))}catch{setNotice('本地保存不可用，请及时复制原文。')}},[text,reading]);
useEffect(()=>{if(!notice)return;const timer=setTimeout(()=>setNotice(''),4000);return()=>clearTimeout(timer)},[notice]);
async function copy(value:string){try{await navigator.clipboard.writeText(value);setNotice('已复制')}catch{setNotice('无法访问剪贴板，请手动选择文字复制')}}
return <><header><a className="brand" href="#"><b>M<span>✳</span></b><div>MD TERMINATOR<small>让文字，好好说话。</small></div></a><span className="mode">● 彩色编辑部</span><nav><button onClick={async()=>{try{setText(await navigator.clipboard.readText())}catch{setNotice('无法读取剪贴板，请在编辑区手动粘贴');setReading(false)}}}>粘贴回答</button><button onClick={()=>file.current?.click()}>导入 .md</button><button className="primary" onClick={()=>setReading(!reading)}>{reading?'返回编辑':'进入阅读 ↗'}</button></nav></header>
<input hidden type="file" accept=".md,.markdown,.txt" ref={file} onChange={async e=>{const f=e.target.files?.[0];if(f)try{setText(await f.text());setNotice('文件已导入')}catch{setNotice('文件读取失败')}e.target.value=''}}/>
<div className="intro"><span>YOUR PERSONAL READING ROOM</span><h1>给好内容，一个好看的样子<span>。</span></h1><p>把纷繁的回答，变成愿意慢慢读的文章。</p></div>
<main className={reading?'reading':''}>{!reading&&<section className="editor"><div className="panel-head"><span>01 / 原始文字</span><button onClick={()=>setText(sample)}>载入示例</button></div><textarea aria-label="Markdown 输入" placeholder={'把 GPT 的回答粘贴在这里…\n\n支持 Markdown 标题、列表、表格、代码与引用。'} value={text} onChange={e=>setText(e.target.value)}/><footer><span>{text.length.toLocaleString()} 字符 · 自动保存在本机</span><button onClick={()=>{if(confirm('清空当前内容？'))setText('')}}>清空</button></footer></section>}
<section className="preview"><div className="panel-head"><span>02 / 彩色编辑部</span><div><button onClick={()=>setToc(!toc)}>目录 {toc?'−':'+'}</button><button onClick={()=>copy(text)}>复制原文</button></div></div>{toc&&<aside aria-label="文章目录">{Array.from(article.current?.querySelectorAll('h1,h2,h3')||[]).map((h,i)=><button key={i} onClick={()=>h.scrollIntoView({behavior:'smooth',block:'start'})}>{h.textContent}</button>)}</aside>}
<article ref={article}>{text?<Markdown remarkPlugins={[gfm]} rehypePlugins={[highlight]} components={{a:props=><a {...props} target="_blank" rel="noopener noreferrer"/>,img:props=><RemoteImage src={props.src} alt={props.alt}/>,pre:({children,...props})=><div className="code-wrap"><button onClick={e=>copy(e.currentTarget.parentElement?.querySelector('pre')?.textContent||'')}>复制代码</button><pre {...props}>{children}</pre></div>,table:({children,...props})=><div className="table-wrap"><table {...props}>{children}</table></div>}}>{rendered}</Markdown>:<div className="empty"><span>✳</span><h2>你的下一篇好读文章，从这里开始</h2><p>粘贴一段回答，或者先看看我们准备的示例。</p><button className="primary" onClick={()=>setText(sample)}>看看阅读效果 ↗</button></div>}</article><div className="endnote">END OF PAGE · 留一点空白，给自己的思考</div></section></main><div className="bottom">本地阅读 · 无 AI 调用 · 文字不上传</div>{notice&&<div role="status" className="toast">{notice}</div>}</>}
createRoot(document.getElementById('root')!).render(<App/>);
