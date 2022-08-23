import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../../common/Resources';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../../common/Units';

export class TropicalResort extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.TROPICAL_RESORT,
      tags: [Tag.BUILDING],
      cost: 13,
      productionBox: Units.of({megacredits: 3, heat: -2}),
      victoryPoints: 2,

      metadata: {
        cardNumber: '098',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) =>{
            pb.minus().heat(2).br;
            pb.plus().megacredits(3);
          });
        }),
        description: 'Reduce your heat production 2 steps and increase your M€ production 3 steps.',
      },
    });
  }
  public override canPlay(player: Player): boolean {
    return player.production.heat >= 2;
  }
  public play(player: Player) {
    player.production.add(Resources.HEAT, -2);
    player.production.add(Resources.MEGACREDITS, 3);
    return undefined;
  }
}
