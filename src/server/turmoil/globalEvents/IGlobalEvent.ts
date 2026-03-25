import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {ICardRenderRoot} from '../../../common/cards/render/Types';
import {IGame} from '../../IGame';
import {Turmoil} from '../Turmoil';

export interface IGlobalEvent {
  name: GlobalEventName,
  description: string,
  revealedDelegate: PartyName,
  currentDelegate: PartyName,
  renderData: ICardRenderRoot;
  resolve: (game: IGame, turmoil: Turmoil) => void;
}

export function isIGlobalEvent(object: any): object is IGlobalEvent {
  return (
    object !== undefined &&
    object.hasOwnProperty('revealedDelegate') &&
    object.hasOwnProperty('revealedDelegate')
  );
}
