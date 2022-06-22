import {CardName} from '../../common/cards/CardName';
import {EcologicalZone} from '../base/EcologicalZone';
import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {TileType} from '../../common/TileType';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';

export class EcologicalZoneAres extends EcologicalZone {
  constructor() {
    super(
      CardName.ECOLOGICAL_ZONE_ARES,
      11,
      {bonus: [SpaceBonus.ANIMAL]},
      {
        description: {
          text: 'Requires that YOU have a greenery tile. Place this tile adjacent to ANY greenery.',
          align: 'left',
        },
        cardNumber: 'A08',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play an animal or plant tag INCLUDING THESE, add an animal to this card.', (eb) => {
            eb.animals(1, {played}).slash().plants(1, {played}).startEffect;
            eb.animals(1).tile(TileType.ECOLOGICAL_ZONE, false, true);
          }).br;
          b.vpText('The tile grants an ADJACENCY BONUS of 1 animal. 1 VP per 2 Animals on this card.');
        }),
      },
    );
  }
}
