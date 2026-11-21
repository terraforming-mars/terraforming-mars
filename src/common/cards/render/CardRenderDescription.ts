import {isObject} from '@/common/utils/utils';

export type CardRenderDescription = {
  text: string,
  align: 'left' | 'center' | 'right',
}

export function isDescription(item: unknown): item is CardRenderDescription {
  return isObject(item) && 'text' in item && typeof item.text === 'string';
}
