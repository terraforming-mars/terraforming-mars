import {IGlobalEvent} from '../../turmoil/globalEvents/IGlobalEvent';
import {GlobalEvent} from '../../turmoil/globalEvents/GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {CardRenderer} from '../render/CardRenderer';

export class MagneticFieldStimulationDelays extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.MAGNETIC_FIELD_STIMULATION_DELAYS,
      description: 'Lower the temperature and oxygen 2 steps each. (-4C, -2% O2)',
      revealedDelegate: PartyName.REDS,
      currentDelegate: PartyName.GREENS,
      behavior: {
        once: {
          global: {
            oxygen: -2,
            temperature: -2,
          },
        },
      },
      renderData: CardRenderer.builder((b) => {
        b.minus().temperature(2).nbsp.minus().oxygen(2);
      }),
    });
  }
}
