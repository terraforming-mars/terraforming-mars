
export function trimEmptyTextNodes(el: Node) {
  for (let i = 0; i < el.childNodes.length; i++) {
    const node = el.childNodes[i];
    if (node.nodeType !== Node.TEXT_NODE) {
      continue;
    }
    const data = (node as Text).data;
    if (data === '') {
      // This is almost certainly a Vue 3 fragment anchor. Vue uses these to find
      // a fragment's boundaries, so it must be preserved.
      // https://v3-migration.vuejs.org/new/fragments
      continue;
    }
    if (data.trim() === '') {
      node.remove();
      i--;
    }
  }
}
