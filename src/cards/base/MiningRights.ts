import {CardName} from '../../CardName';
import {MiningCard} from './MiningCard';
import {TileType} from '../../TileType';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class MiningRights extends MiningCard {
  public cost = 9;
  public name = CardName.MINING_RIGHTS;
  public metadata: CardMetadata = {
    cardNumber: '067',
    renderData: CardRenderer.builder((b) => {
      b.tile(TileType.MINING_RIGHTS, true).asterix().br;
      b.productionBox((pb) => {
        pb.steel(1).or().titanium(1);
      }).asterix();
    }),
    description: 'Place this tile on an area with a steel or titanium placement bonus. Increase that production 1 step.',
  };
}
