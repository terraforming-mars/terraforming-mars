import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';

export class Shuttles extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.SHUTTLES,
      tags: [Tags.SPACE],
      cost: 10,

      requirements: CardRequirements.builder((b) => b.oxygen(5)),
      cardDiscount: {tag: Tags.SPACE, amount: 2},
      metadata: {
        cardNumber: '166',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play a Space card, you pay 2 MC less for it.', (eb) => {
            eb.space().played.startEffect.megacredits(-2);
          }).br;
          b.production((pb) => {
            pb.minus().energy(1).nbsp;
            pb.plus().megacredits(2);
          });
        }),
        description: {
          text: 'Requires 5% oxygen. Decrease your Energy production 1 step and increase your MC production 2 steps.',
          align: 'left',
        },
        victoryPoints: 1,
      },
    });
  }
  public canPlay(player: Player): boolean {
    return super.canPlay(player) && player.getProduction(Resources.ENERGY) >= 1;
  }


  public getCardDiscount(_player: Player, card: IProjectCard) {
    if (card.tags.includes(Tags.SPACE)) {
      return 2;
    }
    return 0;
  }
  public play(player: Player) {
    player.addProduction(Resources.ENERGY, -1);
    player.addProduction(Resources.MEGACREDITS, 2);
    return undefined;
  }
  public getVictoryPoints() {
    return 1;
  }
}
