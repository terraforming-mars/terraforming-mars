import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {TileType} from '../../TileType';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {CardName} from '../../CardName';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {IAdjacencyBonus} from '../../ares/IAdjacencyBonus';
import {CardRenderer} from '../render/CardRenderer';

export class RestrictedArea extends Card implements IActionCard, IProjectCard {
  constructor(
    name: CardName = CardName.RESTRICTED_AREA,
    adjacencyBonus: IAdjacencyBonus | undefined = undefined,
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
      tags: [Tags.SCIENCE],
      cost: 11,
      adjacencyBonus,

      metadata,
    });
  }
  public canPlay(player: Player): boolean {
    return player.game.board.getAvailableSpacesOnLand(player).length > 0;
  }
  public play(player: Player) {
    return new SelectSpace('Select space for tile', player.game.board.getAvailableSpacesOnLand(player), (foundSpace: ISpace) => {
      player.game.addTile(player, foundSpace.spaceType, foundSpace, {tileType: TileType.RESTRICTED_AREA});
      foundSpace.adjacency = this.adjacencyBonus;
      return undefined;
    });
  }
  public canAct(player: Player): boolean {
    return player.canAfford(2);
  }
  public action(player: Player) {
    player.game.defer(new SelectHowToPayDeferred(player, 2, {title: 'Select how to pay for action'}));
    player.drawCard();
    return undefined;
  }
}
