import {CardName} from '../CardName';
import {SpaceBonus} from '../SpaceBonus';
import {TileType} from '../TileType';

// TODO(kberg): convert to a log message type
const tileTypeToStringMap: Map<TileType, string> = new Map([
  [TileType.GREENERY, 'greenery'],
  [TileType.OCEAN, 'ocean'],
  [TileType.CITY, 'city'],

  [TileType.CAPITAL, CardName.CAPITAL],
  [TileType.COMMERCIAL_DISTRICT, CardName.COMMERCIAL_DISTRICT],
  [TileType.ECOLOGICAL_ZONE, CardName.ECOLOGICAL_ZONE],
  [TileType.INDUSTRIAL_CENTER, CardName.INDUSTRIAL_CENTER],
  [TileType.LAVA_FLOWS, CardName.LAVA_FLOWS],
  [TileType.MINING_AREA, CardName.MINING_AREA],
  [TileType.MINING_RIGHTS, CardName.MINING_RIGHTS],
  [TileType.MOHOLE_AREA, CardName.MOHOLE_AREA],
  [TileType.NATURAL_PRESERVE, CardName.NATURAL_PRESERVE],
  [TileType.NUCLEAR_ZONE, CardName.NUCLEAR_ZONE],
  [TileType.RESTRICTED_AREA, CardName.RESTRICTED_AREA],

  // DEIMOS_DOWN, "",
  // GREAT_DAM, "",
  // MAGNETIC_FIELD_GENERATORS, "",

  [TileType.BIOFERTILIZER_FACILITY, CardName.BIOFERTILIZER_FACILITY],
  [TileType.METALLIC_ASTEROID, CardName.METALLIC_ASTEROID],
  [TileType.SOLAR_FARM, CardName.SOLAR_FARM],
  [TileType.OCEAN_CITY, CardName.OCEAN_CITY],
  [TileType.OCEAN_FARM, CardName.OCEAN_FARM],
  [TileType.OCEAN_SANCTUARY, CardName.OCEAN_SANCTUARY],
  [TileType.DUST_STORM_MILD, 'Mild Dust Storm'],
  [TileType.DUST_STORM_SEVERE, 'Severe Dust Storm'],
  [TileType.EROSION_MILD, 'Mild Erosion'],
  [TileType.EROSION_SEVERE, 'Severe Erosion'],
  [TileType.MINING_STEEL_BONUS, 'Mining (Steel)'],
  [TileType.MINING_TITANIUM_BONUS, 'Mining (Titanium)'],
]);

export function tileTypeAsString(tileType: TileType | undefined): string {
  if (tileType === undefined) {
    return 'undefined';
  };
  return tileTypeToStringMap.get(tileType)|| 'special';
}


const bonusToStringMap: Map<SpaceBonus, string> = new Map([
  [SpaceBonus.TITANIUM, 'Titanium'],
  [SpaceBonus.STEEL, 'Steel'],
  [SpaceBonus.PLANT, 'Plant'],
  [SpaceBonus.DRAW_CARD, 'Card'],
  [SpaceBonus.HEAT, 'Heat'],
  [SpaceBonus.OCEAN, 'Ocean'],
  [SpaceBonus.MEGACREDITS, 'MC'],
  [SpaceBonus.ANIMAL, 'Animal'],
  [SpaceBonus.MICROBE, 'Microbe'],
  [SpaceBonus.POWER, 'Power'],
]);

export function bonusAsString(bonus: SpaceBonus | undefined): string {
  return (bonus === undefined) ? 'undefined' : (bonusToStringMap.get(bonus)|| 'special');
}
