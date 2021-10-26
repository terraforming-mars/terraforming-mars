import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Turmoil} from '../Turmoil';
import {CorrosiveRainDeferredAction} from '../../deferredActions/CorrosiveRainDeferredAction';
import {CardRenderer} from '../../cards/render/CardRenderer';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.minus().floaters(2).or().megacredits(-10).br.cards(1).slash().influence();
});

export class CorrosiveRain implements IGlobalEvent {
    public name = GlobalEventName.CORROSIVE_RAIN;
    public description = 'Lose 2 floaters from a card or 10 M€. Draw 1 card for each influence.';
    public revealedDelegate = PartyName.KELVINISTS;
    public currentDelegate = PartyName.GREENS;
    public resolve(game: Game, turmoil: Turmoil) {
      game.getPlayers().forEach((player) => {
        player.drawCard(turmoil.getPlayerInfluence(player));
        game.defer(new CorrosiveRainDeferredAction(player));
      });
    }
    public renderData = RENDER_DATA;
}
