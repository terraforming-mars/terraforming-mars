import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {IActionCard} from '../ICard';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';

export class InventorsGuild extends Card implements IActionCard, IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.INVENTORS_GUILD,
      tags: [Tags.SCIENCE],
      cost: 9,

      metadata: {
        cardNumber: '006',
        renderData: CardRenderer.builder((b) => {
          b.action(undefined, (eb) => eb.empty().startAction.empty()).text('Action: Look at the top card and either buy it or discard it', Size.SMALL, true);
        }),
      },
    });
  }

  public play(_player: Player) {
    return undefined;
  }
  public canAct(): boolean {
    return true;
  }
  public action(player: Player) {
    return player.drawCardKeepSome(1, {paying: true});
  }
}
