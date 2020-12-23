import {CardName} from '../../CardName';
import {SpaceBonus} from '../../SpaceBonus';
import {MoholeArea} from '../base/MoholeArea';
import {IAdjacencyBonus} from '../../ares/IAdjacencyBonus';
import {TileType} from '../../TileType';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class MoholeAreaAres extends MoholeArea {
  public name = CardName.MOHOLE_AREA_ARES;
  public adjacencyBonus: IAdjacencyBonus = {bonus: [SpaceBonus.HEAT, SpaceBonus.HEAT]};
  public metadata: CardMetadata = {
    cardNumber: 'A16',
    renderData: CardRenderer.builder((b) => {
      b.productionBox((pb) => pb.heat(4).digit).br;
      b.tile(TileType.MOHOLE_AREA, false, true);
    }),
    description: 'Increase your heat production 4 steps. Place this tile ON AN AREA RESERVED FOR OCEAN. The tile grants an ADJACENCY BONUS of 2 heat.',
  }
}
