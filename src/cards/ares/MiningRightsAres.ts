import {CardName} from '../../CardName';
import {MiningRights} from '../base/MiningRights';
import {TileType} from '../../TileType';
import {CardRenderer} from '../render/CardRenderer';

export class MiningRightsAres extends MiningRights {
  constructor() {
    super(
      CardName.MINING_RIGHTS_ARES,
      {
        cardNumber: 'A15',
        renderData: CardRenderer.builder((b) => {
          b.tile(TileType.MINING_STEEL_BONUS, false, true);
          b.tile(TileType.MINING_TITANIUM_BONUS, false, true).asterix().br;
          b.production((pb) => {
            pb.steel(1).or().titanium(1);
          }).asterix();
        }),
        description: 'Place one of these tiles on an area with a steel or titanium placement bonus. This tile provides an ADJACENCY BONUS of the same resource as the area. Increase your production of that resource 1 step.',
      });
  }
}
