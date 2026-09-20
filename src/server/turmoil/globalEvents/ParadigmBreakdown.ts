import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {DiscardCards} from '../../deferredActions/DiscardCards';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {IPlayer} from '@/server/IPlayer';

export class ParadigmBreakdown extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.PARADIGM_BREAKDOWN,
      description: 'Discard 2 cards from hand. Gain 2 M€ per influence.',
      revealedDelegate: PartyName.KELVINISTS,
      currentDelegate: PartyName.REDS,
      behavior: {
        stock: {
          megacredits: {each: 2, turmoil: {influence: {}}},
        },
      },
      renderData: CardRenderer.builder((b) => {
        b.minus().cards(2).nbsp.megacredits(2).slash().influence();
      }),
    });
  }
  public override bespokeResolvePlayer(player: IPlayer) {
    if (player.cardsInHand.length >= 2) {
      player.game.defer(new DiscardCards(player, 2, 2, 'Global Event - Select 2 cards to discard'));
    } else if (player.cardsInHand.length === 1) {
      player.game.defer(new DiscardCards(player, 1, 1, 'Global Event - Select a card to discard'));
    }
  }
}
