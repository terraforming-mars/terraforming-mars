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

export class Birds extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.BIRDS,
      tags: [Tag.ANIMAL],
      cost: 10,

      resourceType: CardResource.ANIMAL,
      requirements: CardRequirements.builder((b) => b.oxygen(13)),
      victoryPoints: VictoryPoints.resource(1, 1),

      behavior: {
        decreaseAnyProduction: {type: Resources.PLANTS, count: 2},
      },

      metadata: {
        cardNumber: '072',
        description: 'Requires 13% oxygen. Decrease any plant production 2 steps. 1 VP per Animal on this card.',
        renderData: CardRenderer.builder((b) => {
          b.action('Add an animal to this card.', (eb) => {
            eb.empty().startAction.animals(1);
          }).br;
          b.production((pb) => {
            pb.minus().plants(-2, {all});
          });
        }),
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
