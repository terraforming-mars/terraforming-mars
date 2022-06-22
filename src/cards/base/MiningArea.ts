import {Player} from '../../Player';
import {TileType} from '../../common/TileType';
import {CardName} from '../../common/cards/CardName';
import {MiningCard} from './MiningCard';
import {CardRenderer} from '../render/CardRenderer';

export class MiningArea extends MiningCard {
  constructor(
    name: CardName = CardName.MINING_AREA,
    metadata = {
      cardNumber: '064',
      renderData: CardRenderer.builder((b) => {
        b.tile(TileType.MINING_AREA, true).asterix().br;
        b.production((pb) => {
          pb.steel(1).or().titanium(1);
        }).asterix();
      }),
      description: 'Place this tile on an area with a steel or titanium placement bonus, adjacent to another of your tiles. Increase your production of that resource 1 step.',
    }) {
    super(
      name,
      4,
      metadata,
    );
  }
  protected override getAvailableSpaces(player: Player) {
    return super.getAvailableSpaces(player)
      .filter((space) => player.game.board.getAdjacentSpaces(space).some((adjacentSpace) => adjacentSpace.tile !== undefined && adjacentSpace.tile.tileType !== TileType.OCEAN && adjacentSpace.player === player));
  }
}
