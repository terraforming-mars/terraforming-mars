import {ComponentPublicInstance} from 'vue';

export function isHTMLElement(ref: ComponentPublicInstance | Element | undefined): ref is HTMLElement {
  // 1. Check if it's an Element.
  // 2. Check if it is NOT in the SVG namespace.
  return ref instanceof Element &&
    ref.namespaceURI !== 'http://www.w3.org/2000/svg';
}
