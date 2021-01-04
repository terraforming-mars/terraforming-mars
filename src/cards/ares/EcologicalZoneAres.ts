import {CardName} from '../../CardName';
import {EcologicalZone} from '../base/EcologicalZone';
import {SpaceBonus} from '../../SpaceBonus';
import {TileType} from '../../TileType';
import {CardRequirements} from '../CardRequirements';
import {CardRenderItemSize} from '../render/CardRenderItemSize';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

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
        requirements: CardRequirements.builder((b) => b.greeneries()),
        renderData: CardRenderer.builder((b) => {
          b.effectBox((eb) => {
            eb.animals(1).played.slash().plants(1).played.startEffect;
            eb.animals(1).tile(TileType.ECOLOGICAL_ZONE, false, true);
            eb.description('Effect: When you play an animal or plant tag /including these/, add an animal to this card.');
          }).br;
          b.text('The tile grants an ADJACENCY BONUS of 1 animal. 1 VP per 2 Animals on this card.', CardRenderItemSize.TINY, true);
        }),
        victoryPoints: CardRenderDynamicVictoryPoints.animals(1, 2),
      },
    );
  }
}
