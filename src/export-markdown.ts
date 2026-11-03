// Use local wall-clock time for naming and a monotonic microsecond suffix to
// avoid reusing a name when exports happen within the same clock tick.
let lastExportMicros = 0;
export function markdownFilename(title: string): string {
  const micros = Math.max(Math.floor((performance.timeOrigin + performance.now()) * 1000), lastExportMicros + 1);
  lastExportMicros = micros;
  const date = new Date(Math.floor(micros / 1000));
  const pad = (value: number, width = 2) => String(value).padStart(width, '0');
  const stamp = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}-${pad(micros % 1000000, 6)}`;
  const name = Array.from(title.replace(/[<>:"/\\|?*\u0000-\u001f\u007f]/g, '_').replace(/^[.\s]+|[.\s]+$/g, '')).slice(0, 60).join('') || '阅读文档';
  return `${name}_${stamp}.md`;
}

export function downloadMarkdown(text: string, title: string): void {
  const url = URL.createObjectURL(new Blob([text], {type: 'text/markdown;charset=utf-8'}));
  const anchor = document.createElement('a');
  try {
    anchor.href = url;
    anchor.download = markdownFilename(title);
    document.body.appendChild(anchor);
    anchor.click();
  } finally {
    anchor.remove();
    // Allow the browser to start consuming the download before releasing it.
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }
}
