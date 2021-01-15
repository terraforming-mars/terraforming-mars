import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {Turmoil} from '../Turmoil';
import {MAX_TEMPERATURE} from '../../constants';

export class SnowCover implements IGlobalEvent {
    public name = GlobalEventName.SNOW_COVER;
    public description = 'Decrease temperature 2 steps. Draw 1 card per influence.';
    public revealedDelegate = PartyName.KELVINISTS;
    public currentDelegate = PartyName.KELVINISTS;
    public resolve(game: Game, turmoil: Turmoil) {
      const canDecreaseTemperature = game.getTemperature() !== MAX_TEMPERATURE;
      if (canDecreaseTemperature) game.increaseTemperature(game.getPlayers()[0], -2);

      game.getPlayers().forEach((player) => {
        player.drawCard(turmoil.getPlayerInfluence(player));
      });
    }
}
