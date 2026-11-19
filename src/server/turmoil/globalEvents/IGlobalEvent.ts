import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {ICardRenderRoot} from '../../../common/cards/render/Types';
import {IGame} from '../../IGame';
import {isObject} from '@/common/utils/utils';

export interface IGlobalEvent {
  name: GlobalEventName,
  description: string,
  revealedDelegate: PartyName,
  currentDelegate: PartyName,
  renderData: ICardRenderRoot;
  resolve: (game: IGame) => void;
}

export function isIGlobalEvent(object: unknown): object is IGlobalEvent {
  return isObject(object) && 'revealedDelegate' in object && 'currentDelegate' in object;
}
