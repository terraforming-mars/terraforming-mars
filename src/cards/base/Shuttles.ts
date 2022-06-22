import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {played} from '../Options';

export class Shuttles extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.SHUTTLES,
      tags: [Tags.SPACE],
      cost: 10,
      victoryPoints: 1,

      requirements: CardRequirements.builder((b) => b.oxygen(5)),
      cardDiscount: {tag: Tags.SPACE, amount: 2},
      metadata: {
        cardNumber: '166',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play a Space card, you pay 2 M€ less for it.', (eb) => {
            eb.space({played}).startEffect.megacredits(-2);
          }).br;
          b.production((pb) => {
            pb.minus().energy(1).nbsp;
            pb.plus().megacredits(2);
          });
        }),
        description: {
          text: 'Requires 5% oxygen. Decrease your Energy production 1 step and increase your M€ production 2 steps.',
          align: 'left',
        },
      },
    });
  }
  public override canPlay(player: Player): boolean {
    return player.getProduction(Resources.ENERGY) >= 1;
  }

  public play(player: Player) {
    player.addProduction(Resources.ENERGY, -1);
    player.addProduction(Resources.MEGACREDITS, 2);
    return undefined;
  }
}
