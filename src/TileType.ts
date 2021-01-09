// There might be a temptation to rename or reorder these, but TileType is stored in the database
// as its number. Would have been better if this was stored as a string, but that ship has sailed,
// for now.
export enum TileType {
    GREENERY, // 0
    OCEAN, // 1
    CITY, // 2

    CAPITAL, // 3
    COMMERCIAL_DISTRICT, // 4
    ECOLOGICAL_ZONE, // 5
    INDUSTRIAL_CENTER, // 6
    LAVA_FLOWS, // 7
    MINING_AREA, // 8
    MINING_RIGHTS, // 9
    MOHOLE_AREA, // 10
    NATURAL_PRESERVE, // 11
    NUCLEAR_ZONE, // 12
    RESTRICTED_AREA, // 13

    DEIMOS_DOWN, // 14
    GREAT_DAM, // 15
    MAGNETIC_FIELD_GENERATORS, // 16

    BIOFERTILIZER_FACILITY, // 17
    METALLIC_ASTEROID, // 18
    SOLAR_FARM, // 19
    OCEAN_CITY, // 20
    OCEAN_FARM, // 21
    OCEAN_SANCTUARY, // 22
    DUST_STORM_MILD, // 23
    DUST_STORM_SEVERE, // 24
    EROSION_MILD, // 25
    EROSION_SEVERE, // 26
    MINING_STEEL_BONUS, // 27
    MINING_TITANIUM_BONUS, // 28
}

const TO_STRING_MAP: Map<TileType, string> = new Map([
  [TileType.GREENERY, 'greenery'],
  [TileType.OCEAN, 'ocean'],
  [TileType.CITY, 'city'],

  [TileType.CAPITAL, 'Capital'],
  [TileType.COMMERCIAL_DISTRICT, 'Commercial District'],
  [TileType.ECOLOGICAL_ZONE, 'Ecological Zone'],
  [TileType.INDUSTRIAL_CENTER, 'Industrial Center'],
  [TileType.LAVA_FLOWS, 'Lava Flows'],
  [TileType.MINING_AREA, 'Mining Area'],
  [TileType.MINING_RIGHTS, 'Mining Rights'],
  [TileType.MOHOLE_AREA, 'Mohole Area'],
  [TileType.NATURAL_PRESERVE, 'Natural Preserve'],
  [TileType.NUCLEAR_ZONE, 'Nuclear Zone'],
  [TileType.RESTRICTED_AREA, 'Restricted Area'],
  [TileType.DEIMOS_DOWN, 'Deimos Down'],
  [TileType.GREAT_DAM, 'Great Dam'],
  [TileType.MAGNETIC_FIELD_GENERATORS, 'Magnetic Field Generators'],
  [TileType.BIOFERTILIZER_FACILITY, 'Bio-Fertilizer Facility'],
  [TileType.METALLIC_ASTEROID, 'Metallic Asteroid'],
  [TileType.SOLAR_FARM, 'Solar Farm'],
  [TileType.OCEAN_CITY, 'Ocean City'],
  [TileType.OCEAN_FARM, 'Ocean Farm'],
  [TileType.OCEAN_SANCTUARY, 'Ocean Sanctuary'],
  [TileType.DUST_STORM_MILD, 'Mild Dust Storm'],
  [TileType.DUST_STORM_SEVERE, 'Severe Dust Storm'],
  [TileType.EROSION_MILD, 'Mild Erosion'],
  [TileType.EROSION_SEVERE, 'Severe Erosion'],
  [TileType.MINING_STEEL_BONUS, 'Mining (Steel)'],
  [TileType.MINING_TITANIUM_BONUS, 'Mining (Titanium)'],
]);

export namespace TileType {
  export function toString(tileType: TileType): string {
    return TO_STRING_MAP.get(tileType) || `(unnamed tile, id ${tileType})`;
  }
}
