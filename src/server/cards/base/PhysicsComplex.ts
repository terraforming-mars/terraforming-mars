import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';

export class PhysicsComplex extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.PHYSICS_COMPLEX,
      tags: [Tag.SCIENCE, Tag.BUILDING],
      cost: 12,

      resourceType: CardResource.SCIENCE,
      victoryPoints: VictoryPoints.resource(2, 1),

      metadata: {
        cardNumber: '095',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 6 energy to add a science resource to this card.', (eb) => {
            eb.energy(6, {digit}).startAction.science();
          }).br;
          b.vpText('2 VP for each science resource on this card.');
        }),
      },
    });
  }


  public canAct(player: Player): boolean {
    return player.energy >= 6;
  }
  public action(player: Player) {
    player.energy -= 6;
    player.addResourceTo(this, 1);
    return undefined;
  }
}
