import {IGlobalEvent} from './IGlobalEvent';
import {GlobalEvent} from './GlobalEvent';
import {GlobalEventName} from '../../../common/turmoil/globalEvents/GlobalEventName';
import {PartyName} from '../../../common/turmoil/PartyName';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../../cards/render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';

export class ImprovedEnergyTemplates extends GlobalEvent implements IGlobalEvent {
  constructor() {
    super({
      name: GlobalEventName.IMPROVED_ENERGY_TEMPLATES,
      description: 'Increase energy production 1 step per 2 power tags (no limit). Influence counts as power tags.',
      revealedDelegate: PartyName.SCIENTISTS,
      currentDelegate: PartyName.KELVINISTS,
      behavior: {
        production: {
          energy: {
            tag: Tag.POWER,
            turmoil: {influence: {}},
            per: 2,
          },
        },
      },
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => pb.energy(1)).slash().tag(Tag.POWER, 2).influence({size: Size.SMALL});
      }),
    });
  }
}
