import {MilestoneName} from '../ma/MilestoneName';
import {AwardName} from '../ma/AwardName';
import {BoardName} from '../boards/BoardName';

type MapSetOptions = {
  readonly boardName: BoardName;
  readonly modularMA: boolean;
};

/**
 * The map whose rules MarsBot follows for its milestones and awards, or undefined with the
 * Milestones & Awards expansion. That expansion has its own MarsBot rules, written against the
 * Tharsis board whatever map the game is played on. With random milestones and awards the map's
 * rules still apply to each of the map's own milestones and awards that come up, because the
 * overrides are keyed by map and name; any other one uses the generic rule.
 */
export function marsBotMapSet(options: MapSetOptions): BoardName | undefined {
  return options.modularMA ? undefined : options.boardName;
}

/** MarsBot-specific descriptions for how milestones are evaluated. */
export const MARSBOT_MILESTONE_DESCRIPTIONS: Partial<Record<MilestoneName, string>> = {
  // Tharsis
  'Terraformer': 'TR ≥ 35',
  'Mayor': '3+ city tiles on board',
  'Gardener': '3+ greenery tiles on board',
  'Builder': 'Building track ≥ 8',
  'Planner': 'All tracks ≥ 4 (except Venus)',
  // Hellas
  'Diversifier': 'Space 3+ on every track (7 of 8 with Venus)',
  'Tactician': '35+ MC',
  'Energizer': 'Energy track ≥ 6',
  'Rim Settler': 'Energy track ≥ 5',
  'Polar Explorer': '3+ tiles in the two bottom rows',
  // Elysium
  'Generalist': 'All tracks ≥ 2 (except Venus)',
  'Specialist': 'Any track ≥ 10',
  'Ecologist': 'Bio track ≥ 4',
  'Tycoon': '15 green/blue cards in played pile',
  'Legend': '5 red cards in played pile',
  // Terra Cimmeria Nova
  'Architect': 'Science/City track ≥ 6',
  'Coastguard': '4+ tiles adjacent to ocean',
  'C. Forester': 'Bio track ≥ 10',
  // Utopia Planitia
  'Land Specialist': '3+ bonus cards destroyed',
  'Tradesman': 'Energy, Earth and Venus tracks ≥ 2',
  'Smith': 'Building + Space tracks ≥ 7',
  // Vastitas Borealis Nova
  'Agronomist': 'Bio track ≥ 4',
  'V. Spacefarer': 'Space track ≥ 5',
  'Geologist': '3+ tiles on or next to volcanic areas',
  // Venus Next
  'Hoverlord': '7+ floaters on its Venus board',
  // Modular
  'Briber': '20+ MC (loses 12 MC on claim)',
  'Builder7': 'Building track ≥ 7',
  'Engineer': 'Energy + Earth tracks ≥ 10',
  'Farmer': 'Bio track ≥ 7',
  'Forester': 'Bio track ≥ 6',
  'Fundraiser': 'Event track ≥ 8',
  'Hydrologist': '4 oceans placed',
  'Landshaper': '1+ city, 1+ greenery, Building track ≥ 5',
  'Legend4': '4 red cards in played pile',
  'Lobbyist': 'Chairman and 2+ Party Leaders',
  'Merchant': 'All tracks ≥ 2 (except Venus)',
  'Metallurgist': 'Building + Space tracks ≥ 9',
  'Philantropist': '5 cards with non-negative VP',
  'Pioneer': '4+ colonies (cubes on Space #7, #10 and Energy #8 each build a colony)',
  'Planetologist': 'Two of Energy, Earth and Venus tracks ≥ 3',
  'Producer': 'Any 3 tracks (except Venus) ≥ 16',
  'Researcher': 'Science track ≥ 4',
  'Spacefarer4': 'Space track ≥ 4',
  'Sponsor': '3 cards costing 20+ MC in played pile (events included)',
  'Tactician4': '30+ MC',
  'Terran': 'Earth track ≥ 5',
  'Terran5': 'Earth track ≥ 5',
  'Thawer': 'Raised temperature 5+ times',
  'Trader': 'Bio, Earth and Venus tracks ≥ 2',
  'Tycoon10': '10 blue/green cards in played pile',
};

/** Where a map's own milestone set words a rule differently from the modular one above. */
export const MARSBOT_MAP_MILESTONE_DESCRIPTIONS: Partial<Record<BoardName, Partial<Record<MilestoneName, string>>>> = {
  [BoardName.HELLAS]: {
    'Rim Settler': 'Science/Jovian track ≥ 6',
  },
  [BoardName.UTOPIA_PLANITIA]: {
    'Pioneer': '4+ colonies',
  },
  [BoardName.TERRA_CIMMERIA_NOVA]: {
    'Coastguard': '3+ tiles adjacent to ocean',
    'Fundraiser': 'Event track ≥ 10',
    'Planetologist': 'Earth/Jovian + Venus tracks ≥ 5',
  },
  [BoardName.VASTITAS_BOREALIS_NOVA]: {
    'Agronomist': 'Plant/Animal track ≥ 4',
    'Engineer': 'Earth/Jovian + Energy/City tracks ≥ 10',
    'Farmer': 'Science/Microbe track or Bio track ≥ 6',
  },
};

/** MarsBot-specific descriptions for how awards are scored. */
export const MARSBOT_AWARD_DESCRIPTIONS: Partial<Record<AwardName, string>> = {
  // Tharsis
  'Landlord': 'Total tiles on board',
  'Banker': 'Building + Event track',
  'Scientist': 'Science track',
  'Thermalist': 'Energy track + 5',
  'Miner': 'Space track + 5',
  // Hellas
  'Cultivator': 'Greenery owned (unchanged)',
  'Magnate': 'Green cards in played pile',
  'Space Baron': 'Space track',
  'Excentric': 'Every 5 MC = 1 resource',
  'Contractor': 'Building track',
  // Elysium
  'Celebrity': 'Cards costing 20+ MC (including events)',
  'Industrialist': 'Energy track + 5',
  'Benefactor': 'TR minus 15',
  'Desert Settler': 'Tiles south of the equator (unchanged)',
  'Estate Dealer': 'Tiles next to ocean (unchanged)',
  // Terra Cimmeria
  'Electrician': 'Energy track',
  'Founder': 'Tiles next to special tiles (Neural Instance counts for MarsBot)',
  'Mogul': 'Highest track × 2',
  'A. Zoologist': 'Bio track + 5',
  'Forecaster': 'Every 7 MC = 1 card with requirement',
  // Utopia Planitia
  'Investor': 'Earth/City track',
  'Botanist': 'Bio track minus 2',
  'Incorporator': 'Cards costing 10 MC or less (including events)',
  'Metropolist': 'Cities owned (unchanged)',
  'Suburbian': 'Tiles on the edge of the board (unchanged)',
  // Vastitas Borealis Nova
  'Traveller': 'Higher of Earth or Jovian track + 5',
  'Manufacturer': 'Building + Energy track',
  'Blacksmith': 'Building OR Space track (higher)',
  'Promoter': 'Event track',
  'Landscaper': 'Largest group of connected tiles (unchanged)',
  'Highlander': 'Tiles not next to ocean (unchanged)',
  // Venus Next
  'Venuphile': 'Venus track',
  // Modular
  'Administrator': 'Cards without tags in played pile + 2',
  'Biologist': 'Bio track + 5',
  'Collector': 'Tracks at space 3+',
  'Constructor': 'Cities + colonies (cubes on Space #7, #10 and Energy #8 each build a colony)',
  'Politician': 'Always 5',
  'Visionary': 'Lowest track × 2 (second lowest with Venus)',
};

/** Where a map's own award set words a rule differently from the modular one above. */
export const MARSBOT_MAP_AWARD_DESCRIPTIONS: Partial<Record<BoardName, Partial<Record<AwardName, string>>>> = {
  [BoardName.VASTITAS_BOREALIS_NOVA]: {
    'Traveller': 'Earth/Jovian track + 5',
  },
};

/** How MarsBot evaluates a milestone, for the map set in play or undefined for the modular rules. */
export function marsBotMilestoneRule(name: MilestoneName, mapSet?: BoardName): string | undefined {
  return (mapSet !== undefined ? MARSBOT_MAP_MILESTONE_DESCRIPTIONS[mapSet]?.[name] : undefined) ??
    MARSBOT_MILESTONE_DESCRIPTIONS[name];
}

/** How MarsBot scores an award, for the map set in play or undefined for the modular rules. */
export function marsBotAwardRule(name: AwardName, mapSet?: BoardName): string | undefined {
  return (mapSet !== undefined ? MARSBOT_MAP_AWARD_DESCRIPTIONS[mapSet]?.[name] : undefined) ??
    MARSBOT_AWARD_DESCRIPTIONS[name];
}
