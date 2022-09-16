import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {SelectSpace} from '../../inputs/SelectSpace';
import {TileType} from '../../../common/TileType';
import {ISpace} from '../../boards/ISpace';
import {CardName} from '../../../common/cards/CardName';
import {AdjacencyBonus} from '../../ares/AdjacencyBonus';
import {CardRenderer} from '../render/CardRenderer';

export class NuclearZone extends Card implements IProjectCard {
  constructor(
    name = CardName.NUCLEAR_ZONE,
    cost = 10,
    adjacencyBonus: AdjacencyBonus | undefined = undefined,
    metadata = {
      cardNumber: '097',
      renderData: CardRenderer.builder((b) => {
        b.tile(TileType.NUCLEAR_ZONE, true).br;
        b.temperature(2);
      }),
      description: 'Place this tile and raise temperature 2 steps.',
    }) {
    super({
      cardType: CardType.AUTOMATED,
      name,
      tags: [Tag.EARTH],
      cost,
      adjacencyBonus,
      metadata,
      victoryPoints: -2,
      tr: {temperature: 2},
    });
  }
  public override bespokeCanPlay(player: Player): boolean {
    return player.game.board.getAvailableSpacesOnLand(player).length > 0;
  }

  public override bespokePlay(player: Player) {
    player.game.increaseTemperature(player, 2);
    return new SelectSpace('Select space for special tile', player.game.board.getAvailableSpacesOnLand(player), (space: ISpace) => {
      player.game.addTile(player, space.spaceType, space, {tileType: TileType.NUCLEAR_ZONE});
      space.adjacency = this.adjacencyBonus;
      return undefined;
    });
  }
}
