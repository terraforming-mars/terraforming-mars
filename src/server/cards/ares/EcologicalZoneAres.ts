import {CardName} from '../../../common/cards/CardName';
import {EcologicalZone} from '../base/EcologicalZone';
import {SpaceBonus} from '../../../common/boards/SpaceBonus';
import {TileType} from '../../../common/TileType';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';
import {Tag} from '../../../common/cards/Tag';

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
            eb.tag(Tag.ANIMAL).slash().tag(Tag.PLANT).startEffect;
            eb.resource(CardResource.ANIMAL).tile(TileType.ECOLOGICAL_ZONE, false, true);
          }).br;
          b.vpText('The tile grants an ADJACENCY BONUS of 1 animal. 1 VP per 2 animals on this card.');
        }),
      },
    );
  }
}
