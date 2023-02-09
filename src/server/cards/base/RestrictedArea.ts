import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {TileType} from '../../../common/TileType';
import {CardName} from '../../../common/cards/CardName';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {AdjacencyBonus} from '../../ares/AdjacencyBonus';
import {CardRenderer} from '../render/CardRenderer';

export class RestrictedArea extends Card implements IActionCard, IProjectCard {
  constructor(
    name = CardName.RESTRICTED_AREA,
    adjacencyBonus: AdjacencyBonus | undefined = undefined,
    metadata = {
      cardNumber: '199',
      renderData: CardRenderer.builder((b) => {
        b.action('Spend 2 M€ to draw a card.', (eb) => {
          eb.megacredits(2).startAction.cards(1);
        }).br;
        b.tile(TileType.RESTRICTED_AREA, true);
      }),
      description: 'Place this tile.',
    }) {
    super({
      cardType: CardType.ACTIVE,
      name,
      tags: [Tag.SCIENCE],
      cost: 11,

      behavior: {
        tile: {
          type: TileType.RESTRICTED_AREA,
          on: 'land',
          adjacencyBonus: adjacencyBonus,
        },
      },
      metadata,
    });
  }

  public canAct(player: Player): boolean {
    return player.canAfford(2);
  }
  public action(player: Player) {
    player.game.defer(new SelectPaymentDeferred(player, 2, {title: 'Select how to pay for action', afterPay: () => {
      player.drawCard();
    }}));
    return undefined;
  }
}
