import {IProjectCard} from '../IProjectCard';
import {IActionCard, VictoryPoints} from '../ICard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';
import {Tag} from '../../../common/cards/Tag';
import {CardRequirements} from '../CardRequirements';

export class Pollinators extends Card implements IProjectCard, IActionCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.POLLINATORS,
      cost: 19,
      tags: [Tag.PLANT, Tag.ANIMAL],
      resourceType: CardResource.ANIMAL,
      requirements: CardRequirements.builder((b) => b.tag(Tag.PLANT, 3)),
      victoryPoints: VictoryPoints.resource(1, 1),

      behavior: {
        production: {plants: 1, megacredits: 2},
      },

      metadata: {
        cardNumber: '...',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 animal on this card', (ab) => ab.empty().startAction.animals(1)).br;
          b.production((pb) => pb.plants(1).megacredits(2));
          b.vpText('1 VP per animal on this card.');
        }),
        description: 'Requires 3 plant tags. Raise your plant production 1 step and your M€ production 2 steps.',
      },
    });
  }

  public canAct() {
    return true;
  }

  public action(player: Player) {
    player.addResourceTo(this, 1);
    return undefined;
  }
}
