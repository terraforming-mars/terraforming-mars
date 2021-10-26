import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Turmoil} from '../Turmoil';
import {CardRenderer} from '../../cards/render/CardRenderer';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.minus().temperature(2).br.cards(1).slash().influence();
});

export class SnowCover implements IGlobalEvent {
    public name = GlobalEventName.SNOW_COVER;
    public description = 'Decrease temperature 2 steps. Draw 1 card per influence.';
    public revealedDelegate = PartyName.KELVINISTS;
    public currentDelegate = PartyName.KELVINISTS;
    public resolve(game: Game, turmoil: Turmoil) {
      game.increaseTemperature(game.getPlayers()[0], -2);

      game.getPlayers().forEach((player) => {
        player.drawCard(turmoil.getPlayerInfluence(player));
      });
    }
    public renderData = RENDER_DATA;
}
