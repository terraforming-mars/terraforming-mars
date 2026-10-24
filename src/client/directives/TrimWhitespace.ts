
export function trimEmptyTextNodes(el: Node) {
  for (let i = 0; i < el.childNodes.length; i++) {
    const node = el.childNodes[i];
    // Keeps the zero-length text nodes Vue uses as fragment anchors.
    if (node.nodeType === Node.TEXT_NODE && (node as Text).data !== '' && (node as Text).data.trim() === '') {
      node.remove();
      i--;
    }
  }
}
