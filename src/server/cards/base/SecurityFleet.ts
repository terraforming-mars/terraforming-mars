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

export class SecurityFleet extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.SECURITY_FLEET,
      tags: [Tag.SPACE],
      cost: 12,
      resourceType: CardResource.FIGHTER,

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

  public canAct(player: Player): boolean {
    return player.titanium > 0;
  }
  public action(player: Player) {
    player.titanium--;
    player.addResourceTo(this, 1);
    return undefined;
  }
}
