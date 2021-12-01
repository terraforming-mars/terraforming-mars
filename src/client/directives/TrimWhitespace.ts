
export function trimEmptyTextNodes(el: Node) {
  for (let i = 0; i < el.childNodes.length; i++) {
    const node = el.childNodes[i];
    if (node.nodeType === Node.TEXT_NODE && (node as Text).data.trim() === '') {
      node.remove();
      i--;
    }
  }
}
