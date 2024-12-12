import {GameModule} from '../cards/GameModule';
import {AwardName} from './AwardName';
import {MilestoneName} from './MilestoneName';
import {BoardName} from '../boards/BoardName';
import {OneOrArray} from '../utils/types';

export type CompatibilityDetails = {
  /* Components this MA needs to function */
  // TODO(kberg): Rename to module (modules?)
  compatibility?: GameModule,
  /* Map or maps this is assigned to */
  map?: OneOrArray<BoardName>,
  /* If true, this is a modular MA. */
  modular?: boolean,
};

export const MILESTONE_COMPATIBILITY: Record<MilestoneName, CompatibilityDetails> = {
  'Terraformer': {map: BoardName.THARSIS},
  'Mayor': {map: BoardName.THARSIS, modular: true},
  'Gardener': {map: BoardName.THARSIS, modular: true},
  'Planner': {map: BoardName.THARSIS, modular: true},
  'Builder': {map: BoardName.THARSIS},
  'Generalist': {map: BoardName.ELYSIUM, modular: true},
  'Specialist': {map: BoardName.ELYSIUM},
  'Ecologist': {map: BoardName.ELYSIUM, modular: true},
  'Tycoon': {map: BoardName.ELYSIUM},
  'Legend': {map: BoardName.ELYSIUM},
  'Diversifier': {map: BoardName.HELLAS, modular: true},
  'Tactician': {map: BoardName.HELLAS},
  'Polar Explorer': {map: BoardName.HELLAS},
  'Energizer': {map: BoardName.HELLAS, modular: true},
  'Rim Settler': {map: BoardName.HELLAS, modular: true},
  'Hoverlord': {compatibility: 'venus'},
  'Networker': {compatibility: 'ares'},
  'One Giant Step': {compatibility: 'moon'},
  'Lunarchitect': {compatibility: 'moon'},
  'Colonizer': {map: BoardName.AMAZONIS, compatibility: 'colonies'},
  'Farmer': {map: BoardName.AMAZONIS},
  'Minimalist': {map: BoardName.AMAZONIS},
  'Terran': {map: BoardName.AMAZONIS},
  'Tropicalist': {map: BoardName.AMAZONIS},
  'Economizer': {map: BoardName.ARABIA_TERRA},
  'Pioneer': {map: BoardName.ARABIA_TERRA, compatibility: 'colonies'},
  'Land Specialist': {map: BoardName.ARABIA_TERRA},
  'Martian': {map: BoardName.ARABIA_TERRA, compatibility: 'pathfinders'},
  'Businessperson': {map: BoardName.ARABIA_TERRA},
  'T. Collector': {map: BoardName.TERRA_CIMMERIA},
  'Firestarter': {map: BoardName.TERRA_CIMMERIA},
  'Terra Pioneer': {map: BoardName.TERRA_CIMMERIA},
  'Spacefarer': {map: BoardName.TERRA_CIMMERIA},
  'Gambler': {map: BoardName.TERRA_CIMMERIA},
  'V. Electrician': {map: BoardName.VASTITAS_BOREALIS},
  'Smith': {map: BoardName.VASTITAS_BOREALIS},
  'Tradesman': {map: BoardName.VASTITAS_BOREALIS},
  'Irrigator': {map: BoardName.VASTITAS_BOREALIS},
  'Capitalist': {map: BoardName.VASTITAS_BOREALIS},
  'Tunneler': {compatibility: 'underworld'},
  'Risktaker': {compatibility: 'underworld'},
  'Fundraiser': {modular: true},
  'Geologist': {modular: true},
  'Landshaper': {modular: true},
  'Lobbyist': {compatibility: 'turmoil', modular: true},
  'Philantropist': {modular: true},
  'Planetologist': {modular: true},
  'Producer': {modular: true},
  'Researcher': {modular: true},
  'Sponsor': {modular: true},
  'Breeder': {modular: true},
  // 'Briber': {modular: true},
  // 'Merchant': {modular: true},
  'ThermoEngineer': {modular: true},
  'Hydrologist': {modular: true},
  'Thawer': {modular: true},
};

export const AWARD_COMPATIBILITY: Record<AwardName, CompatibilityDetails> = {
  'Landlord': {map: BoardName.THARSIS, modular: true},
  'Scientist': {map: BoardName.THARSIS, modular: true},
  'Banker': {map: BoardName.THARSIS, modular: true},
  'Thermalist': {map: BoardName.THARSIS, modular: true},
  'Miner': {map: BoardName.THARSIS, modular: true},
  'Celebrity': {map: BoardName.ELYSIUM, modular: true},
  'Industrialist': {map: BoardName.ELYSIUM, modular: true},
  'Desert Settler': {map: BoardName.ELYSIUM},
  'Estate Dealer': {map: BoardName.ELYSIUM, modular: true},
  'Benefactor': {map: BoardName.ELYSIUM, modular: true},
  'Cultivator': {map: BoardName.HELLAS},
  'Excentric': {map: BoardName.HELLAS, modular: true},
  'Magnate': {map: BoardName.HELLAS, modular: true},
  'Space Baron': {map: BoardName.HELLAS, modular: true},
  'Contractor': {map: BoardName.HELLAS, modular: true},
  'Venuphile': {compatibility: 'venus'},
  'Entrepreneur': {compatibility: 'ares'},
  'Full Moon': {compatibility: 'moon'},
  'Lunar Magnate': {compatibility: 'moon'},
  'Curator': {map: BoardName.AMAZONIS},
  'A. Engineer': {map: BoardName.AMAZONIS},
  'Promoter': {map: [BoardName.AMAZONIS, BoardName.ARABIA_TERRA], modular: true},
  'Tourist': {map: BoardName.AMAZONIS},
  'A. Zoologist': {map: BoardName.AMAZONIS, modular: true},
  'Cosmic Settler': {map: BoardName.ARABIA_TERRA},
  'Botanist': {map: BoardName.ARABIA_TERRA, modular: true},
  'Zoologist': {map: BoardName.ARABIA_TERRA},
  'A. Manufacturer': {map: BoardName.ARABIA_TERRA},
  'Biologist': {map: BoardName.TERRA_CIMMERIA, modular: true},
  'T. Economizer': {map: BoardName.TERRA_CIMMERIA},
  'T. Politician': {map: BoardName.TERRA_CIMMERIA, compatibility: 'turmoil'},
  'Urbanist': {map: BoardName.TERRA_CIMMERIA},
  'Warmonger': {map: BoardName.TERRA_CIMMERIA},
  'Forecaster': {map: BoardName.VASTITAS_BOREALIS, modular: true},
  'Edgedancer': {map: BoardName.VASTITAS_BOREALIS},
  'Visionary': {map: BoardName.VASTITAS_BOREALIS, modular: true},
  'Naturalist': {map: BoardName.VASTITAS_BOREALIS},
  'Voyager': {map: BoardName.VASTITAS_BOREALIS},
  'Kingpin': {compatibility: 'underworld'},
  'EdgeLord': {compatibility: 'underworld'},
  'Administrator': {modular: true},
  'Constructor': {modular: true},
  'Founder': {modular: true},
  'Highlander': {modular: true},
  'Investor': {modular: true},
  'Incorporator': {modular: true},
  'Landscaper': {modular: true},
  'Metropolist': {modular: true},
  'Mogul': {modular: true},
  'Traveller': {modular: true},
  'Collector': {modular: true},
  'Electrician': {modular: true},
  'Manufacturer': {modular: true},
  'Suburbian': {modular: true},
  'Politician': {compatibility: 'turmoil', modular: true},
};
