import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {TileType} from '../../../common/TileType';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
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
      adjacencyBonus,

      metadata,
    });
  }
  public override bespokeCanPlay(player: Player): boolean {
    return player.game.board.getAvailableSpacesOnLand(player).length > 0;
  }
  public override bespokePlay(player: Player) {
    return new SelectSpace('Select space for tile', player.game.board.getAvailableSpacesOnLand(player), (space: ISpace) => {
      player.game.addTile(player, space.spaceType, space, {tileType: TileType.RESTRICTED_AREA});
      space.adjacency = this.adjacencyBonus;
      return undefined;
    });
  }
  public canAct(player: Player): boolean {
    return player.canAfford(2);
  }
  public action(player: Player) {
    player.game.defer(new SelectPaymentDeferred(player, 2, {title: 'Select how to pay for action'}));
    player.drawCard();
    return undefined;
  }
}
