import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../../common/Resources';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {all} from '../Options';

export class SmallAnimals extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.SMALL_ANIMALS,
      tags: [Tag.ANIMAL],
      cost: 6,

      resourceType: CardResource.ANIMAL,
      victoryPoints: VictoryPoints.resource(1, 2),
      requirements: CardRequirements.builder((b) => b.oxygen(6)),

      behavior: {
        decreaseAnyProduction: {type: Resources.PLANTS, count: 1},
      },

      metadata: {
        cardNumber: '054',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 Animal to this card.', (eb) => {
            eb.empty().startAction.animals(1);
          }).br;
          b.production((pb) => pb.minus().plants(1, {all})).br;
          b.vpText('1 VP per 2 Animals on this card.');
        }),
        description: {
          text: 'Requires 6% oxygen. Decrease any plant production 1 step.',
          align: 'left',
        },
      },
    });
  }

  public canAct(): boolean {
    return true;
  }
  public action(player: Player) {
    player.addResourceTo(this);
    return undefined;
  }
}
