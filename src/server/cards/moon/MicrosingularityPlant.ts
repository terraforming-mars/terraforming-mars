import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {Resources} from '../../../common/Resources';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {all} from '../Options';
import {IProjectCard} from '../IProjectCard';

export class MicrosingularityPlant extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.MICROSINGULARITY_PLANT,
      cardType: CardType.AUTOMATED,
      tags: [Tag.ENERGY],
      cost: 10,
      requirements: CardRequirements.builder((b) => b.colonyTiles(2, {all})),

      metadata: {
        description: 'Requires 2 colonies on the Moon. Increase your energy production 2 steps.',
        cardNumber: 'M40',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.energy(2));
        }),
      },
    });
  }

  public play(player: Player) {
    player.production.add(Resources.ENERGY, 2, {log: true});
    return undefined;
  }
}
