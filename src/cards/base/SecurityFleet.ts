import {IActionCard, IResourceCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {VictoryPoints} from '../ICard';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class SecurityFleet extends Card implements IActionCard, IProjectCard, IResourceCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.SECURITY_FLEET,
      tags: [Tags.SPACE],
      cost: 12,
      resourceType: ResourceType.FIGHTER,

      victoryPoints: VictoryPoints.resource(1, 1),

      metadata: {
        cardNumber: '028',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 titanium to add 1 fighter resource to this card.', (eb) => {
            eb.titanium(1).startAction.fighter();
          }).br;
          b.vpText('1 VP for each fighter resource on this card.');
        }),
      },
    });
  }
    public resourceCount = 0;

    public play() {
      return undefined;
    }
    public canAct(player: Player): boolean {
      return player.titanium > 0;
    }
    public action(player: Player) {
      player.titanium--;
      player.addResourceTo(this, 1);
      return undefined;
    }
}
