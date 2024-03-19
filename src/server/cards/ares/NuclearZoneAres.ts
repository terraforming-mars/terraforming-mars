import {TileType} from '../../../common/TileType';
import {CardName} from '../../../common/cards/CardName';
import {NuclearZone} from '../base/NuclearZone';
import {CardRenderer} from '../render/CardRenderer';

export class NuclearZoneAres extends NuclearZone {
  constructor() {
    super(
      CardName.NUCLEAR_ZONE_ARES,
      11,
      {bonus: [], cost: 2},
      {
        cardNumber: 'A19',
        renderData: CardRenderer.builder((b) => {
          b.tile(TileType.NUCLEAR_ZONE, false, true).temperature(2);
        }),
        description: 'Raise the temperature two steps. Place this tile. Players must pay an additional 2M€ when they place a tile with their player marker on it ADJACENT to the Nuclear Zone.',
      });
  }
}
