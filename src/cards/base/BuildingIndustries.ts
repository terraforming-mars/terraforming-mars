
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class BuildingIndustries extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.BUILDING_INDUSTRIES,
      tags: [Tags.BUILDING],
      cost: 6,
      hasRequirements: false,

      metadata: {
        cardNumber: '065',
        description: 'Decrease your Energy production 1 step and increase your steel production 2 steps.',
        renderData: CardRenderer.builder((b) => {
          b.productionBox((pb) => {
            pb.minus().energy(1).br;
            pb.plus().steel(2);
          });
        }),
      },
    });
  }
  public canPlay(player: Player): boolean {
    return player.getProduction(Resources.ENERGY) >= 1;
  }
  public play(player: Player) {
    player.addProduction(Resources.ENERGY, -1);
    player.addProduction(Resources.STEEL, 2);
    return undefined;
  }
}
