import {IAdjacencyBonus} from '../../ares/IAdjacencyBonus';
import {TileType} from '../../TileType';
import {CardName} from '../../CardName';
import {NuclearZone} from '../base/NuclearZone';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class NuclearZoneAres extends NuclearZone {
  public cost = 11;
  public name = CardName.NUCLEAR_ZONE_ARES;
  public adjacencyBonus: IAdjacencyBonus = {bonus: [], cost: 2};

  public metadata: CardMetadata = {
    cardNumber: 'A19',
    renderData: CardRenderer.builder((b) => {
      b.tile(TileType.NUCLEAR_ZONE, false, true).br;
      b.temperature(2);
    }),
    description: 'Raise the temperature two steps. Place this tile. Players must pay an additional 2MC when they place a tile with their player marker on it ADJACENT to the Nuclear Zone.',
    victoryPoints: -2,
  }
}
