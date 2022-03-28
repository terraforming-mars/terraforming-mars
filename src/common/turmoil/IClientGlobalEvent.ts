import {ICardRenderRoot} from '../cards/render/Types';
import {GlobalEventName} from './globalEvents/GlobalEventName';
import {PartyName} from './PartyName';

export interface IClientGlobalEvent {
  name: GlobalEventName,
  description: string,
  revealedDelegate: PartyName,
  currentDelegate: PartyName,
  renderData: ICardRenderRoot;
}
