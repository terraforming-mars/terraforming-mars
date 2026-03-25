// There might be a temptation to rename or reorder these, but TileType is stored in the database
// as its number. Would have been better if this was stored as a string, but that ship has sailed,

import {CardName} from './cards/CardName';

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
    OCEAN_CITY, // 20, Also used in Pathfinders
    OCEAN_FARM, // 21
    OCEAN_SANCTUARY, // 22
    DUST_STORM_MILD, // 23
    DUST_STORM_SEVERE, // 24
    EROSION_MILD, // 25
    EROSION_SEVERE, // 26
    MINING_STEEL_BONUS, // 27
    MINING_TITANIUM_BONUS, // 28

    // The Moon
    MOON_MINE, // 29
    MOON_HABITAT, // 30
    MOON_ROAD, // 31
    LUNA_TRADE_STATION, // 32
    LUNA_MINING_HUB, // 33
    LUNA_TRAIN_STATION, // 34
    LUNAR_MINE_URBANIZATION, // 35

    // Pathfinders
    WETLANDS, // 36
    RED_CITY, // 37
    MARTIAN_NATURE_WONDERS, // 38
    CRASHLANDING, // 39

    MARS_NOMADS, // 40
    REY_SKYWALKER, // 41

    // Underworld
    MAN_MADE_VOLCANO, // 42

    // Promo
    NEW_HOLLAND, // 43
  }

export const tileTypeToString: Record<TileType, string> = {
  [TileType.GREENERY]: 'greenery',
  [TileType.OCEAN]: 'ocean',
  [TileType.CITY]: 'city',

  [TileType.CAPITAL]: CardName.CAPITAL,
  [TileType.COMMERCIAL_DISTRICT]: CardName.COMMERCIAL_DISTRICT,
  [TileType.ECOLOGICAL_ZONE]: CardName.ECOLOGICAL_ZONE,
  [TileType.INDUSTRIAL_CENTER]: CardName.INDUSTRIAL_CENTER,
  [TileType.LAVA_FLOWS]: CardName.LAVA_FLOWS,
  [TileType.MINING_AREA]: CardName.MINING_AREA,
  [TileType.MINING_RIGHTS]: CardName.MINING_RIGHTS,
  [TileType.MOHOLE_AREA]: CardName.MOHOLE_AREA,
  [TileType.NATURAL_PRESERVE]: CardName.NATURAL_PRESERVE,
  [TileType.NUCLEAR_ZONE]: CardName.NUCLEAR_ZONE,
  [TileType.RESTRICTED_AREA]: CardName.RESTRICTED_AREA,
  [TileType.DEIMOS_DOWN]: CardName.DEIMOS_DOWN,
  [TileType.GREAT_DAM]: CardName.GREAT_DAM,
  [TileType.MAGNETIC_FIELD_GENERATORS]: CardName.MAGNETIC_FIELD_GENERATORS,
  [TileType.BIOFERTILIZER_FACILITY]: CardName.BIOFERTILIZER_FACILITY,
  [TileType.METALLIC_ASTEROID]: CardName.METALLIC_ASTEROID,
  [TileType.SOLAR_FARM]: CardName.SOLAR_FARM,
  [TileType.OCEAN_CITY]: CardName.OCEAN_CITY,
  [TileType.OCEAN_FARM]: CardName.OCEAN_FARM,
  [TileType.OCEAN_SANCTUARY]: CardName.OCEAN_SANCTUARY,
  [TileType.DUST_STORM_MILD]: 'Mild Dust Storm',
  [TileType.DUST_STORM_SEVERE]: 'Severe Dust Storm',
  [TileType.EROSION_MILD]: 'Mild Erosion',
  [TileType.EROSION_SEVERE]: 'Severe Erosion',
  [TileType.MINING_STEEL_BONUS]: 'Mining (Steel)',
  [TileType.MINING_TITANIUM_BONUS]: 'Mining (Titanium)',
  [TileType.MOON_MINE]: 'Mine',
  [TileType.MOON_HABITAT]: 'Habitat',
  [TileType.MOON_ROAD]: 'Road',
  [TileType.LUNA_TRADE_STATION]: CardName.LUNA_TRADE_STATION,
  [TileType.LUNA_MINING_HUB]: CardName.LUNA_MINING_HUB,
  [TileType.LUNA_TRAIN_STATION]: CardName.LUNA_TRAIN_STATION,
  [TileType.LUNAR_MINE_URBANIZATION]: CardName.LUNAR_MINE_URBANIZATION,
  [TileType.WETLANDS]: CardName.WETLANDS,
  [TileType.RED_CITY]: CardName.RED_CITY,
  [TileType.MARTIAN_NATURE_WONDERS]: CardName.MARTIAN_NATURE_WONDERS,
  [TileType.CRASHLANDING]: CardName.CRASHLANDING,
  [TileType.MARS_NOMADS]: CardName.MARS_NOMADS,
  [TileType.REY_SKYWALKER]: CardName.REY_SKYWALKER,
  [TileType.MAN_MADE_VOLCANO]: CardName.MAN_MADE_VOLCANO,
  [TileType.NEW_HOLLAND]: CardName.NEW_HOLLAND,
} as const;

export const HAZARD_TILES = new Set([TileType.DUST_STORM_MILD, TileType.DUST_STORM_SEVERE, TileType.EROSION_MILD, TileType.EROSION_SEVERE]);
export const OCEAN_UPGRADE_TILES = new Set([TileType.OCEAN_CITY, TileType.OCEAN_FARM, TileType.OCEAN_SANCTUARY, TileType.NEW_HOLLAND]);
export const CITY_TILES = new Set([TileType.CITY, TileType.CAPITAL, TileType.OCEAN_CITY, TileType.RED_CITY, TileType.NEW_HOLLAND]);
export const OCEAN_TILES = new Set([TileType.OCEAN, TileType.OCEAN_CITY, TileType.OCEAN_FARM, TileType.OCEAN_SANCTUARY, TileType.WETLANDS, TileType.NEW_HOLLAND]);
export const BASE_OCEAN_TILES = new Set([TileType.OCEAN, TileType.WETLANDS]);
export const GREENERY_TILES = new Set([TileType.GREENERY, TileType.WETLANDS]);
