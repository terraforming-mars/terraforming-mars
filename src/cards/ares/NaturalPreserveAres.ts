import {SpaceBonus} from '../../SpaceBonus';
import {TileType} from '../../TileType';
import {CardName} from '../../CardName';
import {NaturalPreserve} from '../base/NaturalPreserve';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class NaturalPreserveAres extends NaturalPreserve {
  constructor() {
    super(
      CardName.NATURAL_PRESERVE_ARES,
      {bonus: [SpaceBonus.MEGACREDITS]},
      {
        cardNumber: 'A18',
        requirements: CardRequirements.builder((b) => b.oxygen(4).max()),
        renderData: CardRenderer.builder((b) => {
          b.productionBox((pb) => pb.megacredits(1)).nbsp.tile(TileType.NATURAL_PRESERVE, false, true).asterix();
        }),
        description: 'Oxygen must be 4% or less. Place this tile NEXT TO NO OTHER TILE. The tile grants an ADJACENCY BONUS of of 1MC. Increase your MC production 1 step.',
        victoryPoints: 1,
      });
  }
}
