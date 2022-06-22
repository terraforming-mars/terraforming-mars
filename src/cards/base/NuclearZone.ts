import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {SelectSpace} from '../../inputs/SelectSpace';
import {TileType} from '../../common/TileType';
import {ISpace} from '../../boards/ISpace';
import {CardName} from '../../common/cards/CardName';
import {IAdjacencyBonus} from '../../ares/IAdjacencyBonus';
import {CardRenderer} from '../render/CardRenderer';

export class NuclearZone extends Card implements IProjectCard {
  constructor(
    name: CardName = CardName.NUCLEAR_ZONE,
    cost: number = 10,
    adjacencyBonus: IAdjacencyBonus | undefined = undefined,
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
      tags: [Tags.EARTH],
      cost,
      adjacencyBonus,
      metadata,
      victoryPoints: -2,
      tr: {temperature: 2},
    });
  }
  public override canPlay(player: Player): boolean {
    return player.game.board.getAvailableSpacesOnLand(player).length > 0;
  }

  public play(player: Player) {
    player.game.increaseTemperature(player, 2);
    return new SelectSpace('Select space for special tile', player.game.board.getAvailableSpacesOnLand(player), (foundSpace: ISpace) => {
      player.game.addTile(player, foundSpace.spaceType, foundSpace, {tileType: TileType.NUCLEAR_ZONE});
      foundSpace.adjacency = this.adjacencyBonus;
      return undefined;
    });
  }
}
