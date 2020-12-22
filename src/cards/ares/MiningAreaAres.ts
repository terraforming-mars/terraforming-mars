import {CardName} from '../../CardName';
import {MiningArea} from '../base/MiningArea';
import {TileType} from '../../TileType';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class MiningAreaAres extends MiningArea {
  public name = CardName.MINING_AREA_ARES;
  public metadata: CardMetadata = {
    cardNumber: 'A14',
    renderData: CardRenderer.builder((b) => {
      b.tile(TileType.MINING_STEEL_BONUS, false, true);
      b.tile(TileType.MINING_TITANIUM_BONUS, false, true).asterix().br;
      b.productionBox((pb) => {
        pb.steel(1).or().titanium(1);
      }).asterix();
    }),
    description: 'Place one of these tiles on an area with a steel or titanium placement bonus, adjacent to another of your tiles. This tile provides an ADJACENCY BONUS of the same resource as the area. Increase your production of that resource 1 step.',
  }
}
