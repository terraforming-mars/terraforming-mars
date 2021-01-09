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

export class SecurityFleet extends Card implements IActionCard, IProjectCard, IResourceCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.SECURITY_FLEET,
      tags: [Tags.SPACE],
      cost: 12,
      resourceType: ResourceType.FIGHTER,

      metadata: {
        cardNumber: '028',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 titanium to add 1 fighter resource to this card.', (eb) => {
            eb.titanium(1).startAction.fighter();
          }).br;
          b.vpText('1 VP for each fighter resource on this card.');
        }),
        victoryPoints: CardRenderDynamicVictoryPoints.fighter(1, 1),
      },
    });
  }
    public resourceCount = 0;

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
}
