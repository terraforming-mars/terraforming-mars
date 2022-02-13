import {IGlobalEvent, GlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from '../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../common/turmoil/PartyName';
import {Game} from '../../Game';
import {Resources} from '../../common/Resources';
import {Turmoil} from '../Turmoil';
import {DiscardCards} from '../../deferredActions/DiscardCards';
import {CardRenderer} from '../../cards/render/CardRenderer';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.br.minus().cards(2).nbsp.megacredits(2).influence();
});

export class ParadigmBreakdown extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.PARADIGM_BREAKDOWN,
      description: 'Discard 2 cards from hand. Gain 2 M€ per influence.',
      revealedDelegate: PartyName.KELVINISTS,
      currentDelegate: PartyName.REDS,
      renderData: RENDER_DATA,
    });
  }
  public resolve(game: Game, turmoil: Turmoil) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      if (player.cardsInHand.length >= 2) {
        game.defer(new DiscardCards(player, 2, 'Global Event - Select 2 cards to discard'));
      } else if (player.cardsInHand.length === 1) {
        game.defer(new DiscardCards(player, 1, 'Global Event - Select a card to discard'));
      }
      player.addResource(Resources.MEGACREDITS, 2 * (turmoil.getPlayerInfluence(player)), {log: true, from: this.name});
    });
  }
}
