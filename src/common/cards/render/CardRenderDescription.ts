export type CardRenderDescription = {
  text: string,
  align: 'left' | 'center' | 'right',
}

export function isDescription(item: unknown): item is CardRenderDescription {
  return typeof item === 'object' && item !== null && 'text' in item && typeof item.text === 'string';
}
