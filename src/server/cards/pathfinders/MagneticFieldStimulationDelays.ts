import {IGlobalEvent} from '../../turmoil/globalEvents/IGlobalEvent';
import {GlobalEvent} from '../../turmoil/globalEvents/GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {IGame} from '../../IGame';
import {CardRenderer} from '../render/CardRenderer';

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

  public resolve(game: IGame) {
    game.increaseOxygenLevel(game.getPlayersInGenerationOrder()[0], -2);
    game.increaseTemperature(game.getPlayersInGenerationOrder()[0], -2);
  }
}
