
import {CardName} from '../../common/cards/CardName';
import {MiningCard} from './MiningCard';
import {TileType} from '../../common/TileType';
import {CardRenderer} from '../render/CardRenderer';

export class MiningRights extends MiningCard {
  constructor(
    name: CardName = CardName.MINING_RIGHTS,
    metadata = {
      cardNumber: '067',
      renderData: CardRenderer.builder((b) => {
        b.tile(TileType.MINING_RIGHTS, true).asterix().br;
        b.production((pb) => {
          pb.steel(1).or().titanium(1);
        }).asterix();
      }),
      description: 'Place this tile on an area with a steel or titanium placement bonus. Increase that production 1 step.',
    },
  ) {
    super(
      name,
      9,
      metadata);
  }
}
