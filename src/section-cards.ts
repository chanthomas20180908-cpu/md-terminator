import type {Root, RootContent, Element} from 'hast';

// Group the parsed document, so code fences, references and Markdown semantics
// remain intact. Only document-level headings start a section.
export default function sectionCards() {
  return (tree: Root, file: {value: unknown}) => {
    const sourceLength = String(file.value).length;
    const result: RootContent[] = [];
    const stack: {level: number; card: Element}[] = [];
    let intro: Element | undefined;
    let index = 0;
    for (const node of tree.children) {
      const level = node.type === 'element' && /^h[1-6]$/.test(node.tagName)
        ? Number(node.tagName[1]) : 0;
      if (level && node.type === 'element') {
        while (stack.length && stack[stack.length - 1].level >= level) {
          const previous = stack.pop()!;
          previous.card.properties.dataSourceEnd = node.position?.start.offset ?? sourceLength;
        }
        if (intro) intro.properties.dataSourceEnd = Math.min(Number(intro.properties.dataSourceEnd), node.position?.start.offset ?? sourceLength);
        const id = `section-${index++}`;
        node.properties.id = id;
        const card: Element = {
          type: 'element', tagName: 'section',
          properties: {className: ['section-card'], ariaLabelledBy: [id], dataSourceStart: node.position?.start.offset ?? 0, dataSourceEnd: sourceLength},
          children: [node],
        };
        const parent = stack[stack.length - 1];
        if (parent) parent.card.children.push(card);
        else result.push(card);
        stack.push({level, card});
      } else if (stack.length) {
        stack[stack.length - 1].card.children.push(node as Element['children'][number]);
      } else {
        if (!intro) {
          intro = {type: 'element', tagName: 'section', properties: {className: ['section-card', 'section-intro'], ariaLabel: '文章引言', dataSourceStart: 0, dataSourceEnd: sourceLength}, children: []};
          result.push(intro);
        }
        intro.children.push(node as Element['children'][number]);
      }
    }
    // Whitespace before the first heading should not create an empty card.
    if (intro && intro.children.every(n => n.type === 'text' && !n.value.trim())) {
      result.splice(result.indexOf(intro), 1);
    }
    tree.children = result;
  };
}
