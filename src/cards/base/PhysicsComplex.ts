import {IActionCard, IResourceCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

export class PhysicsComplex extends Card implements IActionCard, IProjectCard, IResourceCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.PHYSICS_COMPLEX,
      tags: [Tags.SCIENCE, Tags.BUILDING],
      cost: 12,
      resourceType: ResourceType.SCIENCE,

      metadata: {
        cardNumber: '095',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 6 Energy to add a science resource to this card.', (eb) => {
            eb.energy(6).digit.startAction.science();
          }).br;
          b.vpText('2 VP for each science resource on this card.');
        }),
        victoryPoints: CardRenderDynamicVictoryPoints.science(2, 2),
      },
    });
  }

    public resourceCount: number = 0;

    public getVictoryPoints(): number {
      return 2 * this.resourceCount;
    }
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
