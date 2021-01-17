import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {Turmoil} from '../Turmoil';
import {DiscardCards} from '../../deferredActions/DiscardCards';

export class ParadigmBreakdown implements IGlobalEvent {
    public name = GlobalEventName.PARADIGM_BREAKDOWN;
    public description = 'Discard 2 cards from hand. Gain 2 MC per influence.';
    public revealedDelegate = PartyName.KELVINISTS;
    public currentDelegate = PartyName.REDS;
    public resolve(game: Game, turmoil: Turmoil) {
      game.getPlayers().forEach((player) => {
        if (player.cardsInHand.length >= 2) {
          game.defer(new DiscardCards(player, 2, 'Global Event - Select 2 cards to discard'));
        } else if (player.cardsInHand.length === 1) {
          game.defer(new DiscardCards(player, 1, 'Global Event - Select a card to discard'));
        }
        player.setResource(Resources.MEGACREDITS, 2 * (turmoil.getPlayerInfluence(player)), game, undefined, true);
      });
    }
}
