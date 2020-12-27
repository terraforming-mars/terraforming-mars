import {IActionCard, IResourceCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

export class PhysicsComplex implements IActionCard, IProjectCard, IResourceCard {
    public cost = 12;
    public tags = [Tags.SCIENCE, Tags.BUILDING];
    public name = CardName.PHYSICS_COMPLEX;
    public cardType = CardType.ACTIVE;
    public resourceType = ResourceType.SCIENCE;
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
      this.resourceCount++;
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '095',
      renderData: CardRenderer.builder((b) => {
        b.effectBox((eb) => {
          eb.energy(6).digit.startAction.science();
          eb.description('Action: Spend 6 Energy to add a science resource to this card.');
        }).br;
        b.text('2 VP for each science resource on this card.', CardRenderItemSize.TINY, true);
      }),
      victoryPoints: CardRenderDynamicVictoryPoints.science(2, 2),
    }
}
