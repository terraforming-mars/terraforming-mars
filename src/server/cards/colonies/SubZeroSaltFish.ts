import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../../common/cards/CardName';
import {Resources} from '../../../common/Resources';
import {CardResource} from '../../../common/CardResource';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';
import {all} from '../Options';

export class SubZeroSaltFish extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 5,
      tags: [Tag.ANIMAL],
      name: CardName.SUBZERO_SALT_FISH,
      cardType: CardType.ACTIVE,

      resourceType: CardResource.ANIMAL,
      victoryPoints: VictoryPoints.resource(1, 2),
      requirements: CardRequirements.builder((b) => b.temperature(-6)),

      behavior: {
        decreaseAnyProduction: {type: Resources.PLANTS, count: 1},
      },

      metadata: {
        cardNumber: 'C42',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 Animal to this card.', (eb) => {
            eb.empty().startAction.animals(1);
          }).br;
          b.production((pb) => pb.minus().plants(1, {all})).br;
          b.vpText('1 VP per 2 Animals on this card.');
        }),
        description: {
          text: 'Requires -6 C. Decrease any plant production 1 step.',
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
