import {IGlobalEvent, GlobalEvent} from './IGlobalEvent';
import {GlobalEventName} from './GlobalEventName';
import {PartyName} from '../parties/PartyName';
import {Game} from '../../Game';
import {CardRenderer} from '../../cards/render/CardRenderer';

const RENDER_DATA = CardRenderer.builder((b) => {
  b.minus().temperature(2).nbsp.minus().oxygen(2);
});

export class MagneticFieldStimulationDelays extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.MAGNETIC_FIELD_STIMULATION_DELAYS,
      description: 'Lower the temperature and oxygen 2 steps each. (-4C, -2% O2)',
      revealedDelegate: PartyName.REDS,
      currentDelegate: PartyName.GREENS,
      renderData: RENDER_DATA,
    });
  }

  public resolve(game: Game) {
    game.increaseOxygenLevel(game.getPlayers()[0], -2);
    game.increaseTemperature(game.getPlayers()[0], -2);
  }
}
