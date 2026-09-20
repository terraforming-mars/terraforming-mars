import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {ICardRenderRoot} from '../../../common/cards/render/Types';
import {IGame} from '../../IGame';

export interface IGlobalEvent {
  name: GlobalEventName,
  description: string,
  revealedDelegate: PartyName,
  currentDelegate: PartyName,
  renderData: ICardRenderRoot;
  resolve: (game: IGame) => void;
}

export function isIGlobalEvent(object: any): object is IGlobalEvent {
  // `in` rather than hasOwnProperty: GlobalEvent exposes these as prototype getters.
  return (
    object !== undefined &&
    'revealedDelegate' in object &&
    'currentDelegate' in object
  );
}
