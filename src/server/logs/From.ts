import {CardName} from '../../common/cards/CardName';
import {GlobalEventName} from '../../common/turmoil/globalEvents/GlobalEventName';
import {ICard} from '../cards/ICard';
import {IPlayer} from '../IPlayer';
import {IGlobalEvent} from '../turmoil/globalEvents/IGlobalEvent';

/**
 * The source of something gained or taken. Used when logging.
 */
export type From =
  | {player: IPlayer}
  | {card: ICard}
  | {card: CardName}
  | {globalEvent: IGlobalEvent}
  | {globalEvent: GlobalEventName};

export function isFromPlayer(from: From | undefined): from is {player: IPlayer} {
  return from !== undefined && 'player' in from;
}

