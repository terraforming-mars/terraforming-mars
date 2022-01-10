import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {SpaceType} from '../../SpaceType';
import {Player} from '../../Player';
import {TileType} from '../../TileType';
import {ISpace} from '../../boards/ISpace';
import {SelectSpace} from '../../inputs/SelectSpace';
import {CardName} from '../../CardName';
import {IAdjacencyBonus} from '../../ares/IAdjacencyBonus';
import {CardRenderer} from '../render/CardRenderer';

export class LavaFlows extends Card implements IProjectCard {
  constructor(
    name: CardName = CardName.LAVA_FLOWS,
    adjacencyBonus: IAdjacencyBonus | undefined = undefined,
    metadata = {
      cardNumber: '140',
      renderData: CardRenderer.builder((b) => {
        b.temperature(2).br;
        b.tile(TileType.LAVA_FLOWS, true, false).asterix();
      }),
      description: 'Raise temperature 2 steps and place this tile ON EITHER THARSIS THOLUS, ASCRAEUS MONS, PAVONIS MONS OR ARSIA MONS.',
    }) {
    super({
      cardType: CardType.EVENT,
      name,
      cost: 18,
      adjacencyBonus,
      metadata,
      tr: {temperature: 2},
    });
  }

  public static getVolcanicSpaces(player: Player): Array<ISpace> {
    const board = player.game.board;
    const volcanicSpaceIds = board.getVolcanicSpaceIds();

    const spaces = board.getAvailableSpacesOnLand(player);
    if (volcanicSpaceIds.length > 0) {
      return spaces.filter((space) => volcanicSpaceIds.includes(space.id));
    }
    return spaces;
  }

  public canPlay(player: Player): boolean {
    return LavaFlows.getVolcanicSpaces(player).length > 0;
  }
  public play(player: Player) {
    player.game.increaseTemperature(player, 2);
    return new SelectSpace('Select either Tharsis Tholus, Ascraeus Mons, Pavonis Mons or Arsia Mons', LavaFlows.getVolcanicSpaces(player), (space: ISpace) => {
      player.game.addTile(player, SpaceType.LAND, space, {tileType: TileType.LAVA_FLOWS});
      space.adjacency = this.adjacencyBonus;
      return undefined;
    });
  }
}
