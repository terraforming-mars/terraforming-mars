import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {CardRenderer} from '../../cards/render/CardRenderer';

export class VolcanicEruptions extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.VOLCANIC_ERUPTIONS,
      description: 'Increase temperature 2 steps. Increase heat production 1 step per influence.',
      revealedDelegate: PartyName.SCIENTISTS,
      currentDelegate: PartyName.KELVINISTS,
      behavior: {
        once: {
          global: {
            temperature: 2,
          },
        },
        production: {
          heat: {turmoil: {influence: {}}},
        },
      },
      renderData: CardRenderer.builder((b) => {
        b.temperature(2).nbsp.production((pb)=>pb.heat(1)).slash().influence();
      }),
    });
  }
}
