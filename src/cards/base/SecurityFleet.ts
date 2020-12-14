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

export class SecurityFleet implements IActionCard, IProjectCard, IResourceCard {
    public cost = 12;
    public tags = [Tags.SPACE];
    public cardType = CardType.ACTIVE;
    public name = CardName.SECURITY_FLEET;
    public resourceType = ResourceType.FIGHTER;
    public resourceCount: number = 0;

    public getVictoryPoints(): number {
      return this.resourceCount;
    }
    public play() {
      return undefined;
    }
    public canAct(player: Player): boolean {
      return player.titanium > 0;
    }
    public action(player: Player) {
      player.titanium--;
      this.resourceCount++;
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '028',
      renderData: CardRenderer.builder((b) => {
        b.effectBox((eb) => {
          eb.titanium(1).startAction.fighter();
          eb.description('Action: Spend 1 titanium to add 1 fighter resource to this card.');
        }).br;
        b.text('1 VP for each fighter resource on this card.', CardRenderItemSize.TINY, true);
      }),
      victoryPoints: CardRenderDynamicVictoryPoints.fighter(1, 1),
    }
}
