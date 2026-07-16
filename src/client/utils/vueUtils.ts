import Vue from 'vue';
export function isVueComponent(ref: Vue | Element | undefined): ref is Vue {
  // Check for the internal Vue flag to distinguish it from a raw DOM element
  // The 'as Vue' cast is sometimes needed if the ref starts as 'Element'
  return !!(ref as any)?._isVue;
}

export function isHTMLElement(ref: Vue | Element | undefined): ref is HTMLElement {
  // 1. Check if it's an Element (nodeType === 1).
  // 2. Check if it is NOT in the SVG namespace.
  const svgNamespace = 'http://www.w3.org/2000/svg';

  return ref !== undefined &&
    typeof ref === 'object' &&
    (ref as any).nodeType === 1 && // Is a basic Element
    (ref as any).namespaceURI !== svgNamespace;
}
