export interface ICardRenderDescription {
  text: string,
  align: 'left' | 'center' | 'right',
}

export function isIDescription(item: any): item is ICardRenderDescription {
  return item && item.text && typeof(item.text) === 'string';
}
