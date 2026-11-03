# MD Terminator

本地 Markdown 阅读工具：彩色编辑部模式。

```sh
npm install
npm run dev
```

在终端显示的地址打开。`npm run build` 运行类型检查与生产构建。

默认仅展示输入框。粘贴非空文本立即进入阅读；手动输入后按 Cmd/Ctrl+Enter。支持导入 Markdown 文件。顶部“新建”开始空白输入，“历史”恢复本次打开的文章与阅读位置。阅读页不显示源码，左侧提供多级目录，手机通过目录按钮展开。

历史与草稿仅存在当前标签页内存，刷新、关闭后清空；不使用持久化存储。旧版 md-terminator localStorage 键会被删除。文字不上传，无 AI 调用。远程图片需手动加载；加载会访问图片地址。剪贴板不可用时可手动粘贴。支持 GFM 和代码高亮，原始 HTML 不执行。大文档暂未使用虚拟滚动。

## 阅读外观

顶部“外观”支持 14–24px 字号、1.4–2.2 倍正文行距与四个主题，即时生效，仅存本次页面内存。恢复默认回到彩色编辑部 / 17px / 1.85 倍。

主题使用各项目色板适配本站排版，并非官方阅读器移植：
- Solarized：https://github.com/altercation/solarized （MIT）
- Nord：https://github.com/nordtheme/nord （MIT）
- Catppuccin：https://github.com/catppuccin/catppuccin （MIT）
