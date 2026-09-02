import {ComponentPublicInstance} from 'vue';

export function isHTMLElement(ref: ComponentPublicInstance | Element | undefined): ref is HTMLElement {
  // 1. Check if it's an Element (nodeType === 1).
  // 2. Check if it is NOT in the SVG namespace.
  const svgNamespace = 'http://www.w3.org/2000/svg';

  return ref !== undefined &&
    typeof ref === 'object' &&
    (ref as any).nodeType === 1 && // Is a basic Element
    (ref as any).namespaceURI !== svgNamespace;
}
