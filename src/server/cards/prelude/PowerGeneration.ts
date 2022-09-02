import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {IProjectCard} from '../IProjectCard';
import {Resources} from '../../../common/Resources';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class PowerGeneration extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.POWER_GENERATION,
      tags: [Tag.ENERGY],

      metadata: {
        cardNumber: 'P27',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(3));
        }),
        description: 'Increase your energy production 3 steps.',
      },
    });
  }
  public play(player: Player) {
    player.production.add(Resources.ENERGY, 3);
    return undefined;
  }
}
