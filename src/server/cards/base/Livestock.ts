import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class Livestock extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.LIVESTOCK,
      tags: [Tag.ANIMAL],
      cost: 13,

      resourceType: CardResource.ANIMAL,
      victoryPoints: VictoryPoints.resource(1, 1),
      requirements: CardRequirements.builder((b) => b.oxygen(9)),

      behavior: {
        production: {plants: -1, megacredits: 2},
      },

      metadata: {
        cardNumber: '184',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 Animal to this card.', (eb) => {
            eb.empty().startAction.animals(1);
          }).br;
          b.production((pb) => {
            pb.minus().plants(1).nbsp.plus().megacredits(2);
          }).br;
          b.vpText('1 VP for each Animal on this card.');
        }),
        description: {
          text: 'Requires 9% oxygen. Decrease your plant production 1 step and increase your M€ production 2 steps',
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

