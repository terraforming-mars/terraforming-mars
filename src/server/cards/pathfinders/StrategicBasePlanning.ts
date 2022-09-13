import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../../common/Resources';
import {Tag} from '../../../common/cards/Tag';

export class StrategicBasePlanning extends PreludeCard {
  constructor() {
    super({
      name: CardName.STRATEGIC_BASE_PLANNING,
      tags: [Tag.BUILDING],

      behavior: {
        colonies: {buildColony: {}},
        city: {},
      },

      metadata: {
        cardNumber: 'P08',
        renderData: CardRenderer.builder((b) => {
          b.minus().megacredits(8).city().colonies();
        }),
        description: 'Pay 8M€. Place a city. Place a colony.',
      },
    });
  }
  public override bespokePlay(player: Player) {
    player.deductResource(Resources.MEGACREDITS, 8);
    return undefined;
  }
}

