import {IActionCard, IResourceCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardResource} from '../../common/CardResource';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';

export class PhysicsComplex extends Card implements IActionCard, IProjectCard, IResourceCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.PHYSICS_COMPLEX,
      tags: [Tags.SCIENCE, Tags.BUILDING],
      cost: 12,

      resourceType: CardResource.SCIENCE,
      victoryPoints: VictoryPoints.resource(2, 1),

      metadata: {
        cardNumber: '095',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 6 Energy to add a science resource to this card.', (eb) => {
            eb.energy(6, {digit}).startAction.science();
          }).br;
          b.vpText('2 VP for each science resource on this card.');
        }),
      },
    });
  }

  public override resourceCount: number = 0;

  public play() {
    return undefined;
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
