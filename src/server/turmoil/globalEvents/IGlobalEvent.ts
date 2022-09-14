import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {ICardRenderRoot} from '../../../common/cards/render/Types';
import {Game} from '../../Game';
import {Turmoil} from '../Turmoil';

export interface IGlobalEvent {
  name: GlobalEventName,
  description: string,
  revealedDelegate: PartyName,
  currentDelegate: PartyName,
  renderData: ICardRenderRoot;
  resolve: (game: Game, turmoil: Turmoil) => void;
}
