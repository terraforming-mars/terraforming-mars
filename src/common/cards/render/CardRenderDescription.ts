export type CardRenderDescription = {
  text: string,
  align: 'left' | 'center' | 'right',
}

export function isDescription(item: any): item is CardRenderDescription {
  return item && item.text && typeof(item.text) === 'string';
}
