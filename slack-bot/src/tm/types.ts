/**
 * Types duplicated from the terraforming-mars source tree.
 *
 * These intentionally avoid importing from `../../../src/common/` so the
 * slack-bot package builds standalone. Keep in sync manually with:
 *   - src/common/Color.ts                (PLAYER_COLORS, Color)
 *   - src/common/cards/GameModule.ts     (EXPANSIONS, DEFAULT_EXPANSIONS, Expansion)
 *   - src/common/boards/BoardName.ts     (BoardName)
 *   - src/common/boards/RandomBoardOption.ts (RandomBoardOption)
 *   - src/common/ma/RandomMAOptionType.ts (RandomMAOptionType)
 *   - src/common/turmoil/Types.ts        (AgendaStyle)
 *   - src/common/game/NewGameConfig.ts   (NewPlayerModel, NewGameConfig, EscapeVelocityOptions)
 *   - src/common/models/SimpleGameModel.ts (SimpleGameModel)
 */

export const PLAYER_COLORS = [
  'red', 'green', 'yellow', 'blue', 'black', 'purple', 'orange', 'pink',
] as const;
export type PlayerColor = typeof PLAYER_COLORS[number];

export const EXPANSIONS = [
  'corpera',
  'promo',
  'venus',
  'colonies',
  'prelude',
  'prelude2',
  'turmoil',
  'community',
  'ares',
  'moon',
  'pathfinders',
  'ceo',
  'starwars',
  'underworld',
  'deltaProject',
] as const;
export type Expansion = typeof EXPANSIONS[number];

export const EXPANSION_LABELS: Record<Expansion, string> = {
  corpera: 'Corporate Era',
  promo: 'Promo',
  venus: 'Venus Next',
  colonies: 'Colonies',
  prelude: 'Prelude',
  prelude2: 'Prelude 2',
  turmoil: 'Turmoil',
  community: 'Community',
  ares: 'Ares',
  moon: 'The Moon',
  pathfinders: 'Pathfinders',
  ceo: 'CEOs',
  starwars: 'Star Wars',
  underworld: 'Underworld',
  deltaProject: 'Delta Project',
};

export const DEFAULT_EXPANSIONS: Record<Expansion, boolean> = {
  corpera: true,
  promo: true,
  venus: true,
  colonies: true,
  prelude: true,
  prelude2: true,
  turmoil: false,
  community: false,
  ares: false,
  moon: false,
  pathfinders: false,
  ceo: false,
  starwars: false,
  underworld: false,
  deltaProject: false,
};

export const BOARDS = [
  {value: 'tharsis', label: 'Tharsis'},
  {value: 'hellas', label: 'Hellas'},
  {value: 'elysium', label: 'Elysium'},
  {value: 'utopia planitia', label: 'Utopia Planitia'},
  {value: 'vastitas borealis nova', label: 'Vastitas Borealis Nova'},
  {value: 'terra cimmeria nova', label: 'Terra Cimmeria Nova'},
  {value: 'arabia terra', label: 'Arabia Terra'},
  {value: 'vastitas borealis', label: 'Vastitas Borealis'},
  {value: 'amazonis p.', label: 'Amazonis Planitia'},
  {value: 't. cimmeria', label: 'Terra Cimmeria'},
  {value: 'Hollandia', label: 'Hollandia'},
  {value: 'random official', label: 'Random (official boards)'},
  {value: 'random all', label: 'Random (all boards)'},
] as const;
export type BoardNameType = typeof BOARDS[number]['value'];

export type AgendaStyle = 'Standard' | 'Random' | 'Chairman';

export type RandomMAOptionType =
  | 'No randomization'
  | 'Limited synergy'
  | 'Full random';

export interface NewPlayerModel {
  name: string;
  color: PlayerColor;
  beginner: boolean;
  handicap: number;
  first: boolean;
}

export interface EscapeVelocityOptions {
  thresholdMinutes: number;
  bonusSectionsPerAction: number;
  penaltyPeriodMinutes: number;
  penaltyVPPerPeriod: number;
}

export const DEFAULT_ESCAPE_VELOCITY: EscapeVelocityOptions = {
  thresholdMinutes: 20,
  bonusSectionsPerAction: 2,
  penaltyPeriodMinutes: 2,
  penaltyVPPerPeriod: 1,
};

export interface NewGameConfig {
  players: Array<NewPlayerModel>;
  expansions: Record<Expansion, boolean>;
  board: BoardNameType;
  seed: number;
  randomFirstPlayer: boolean;

  clonedGamedId: string | undefined;

  undoOption: boolean;
  showTimers: boolean;
  fastModeOption: boolean;
  showOtherPlayersVP: boolean;

  aresExtremeVariant: boolean;
  politicalAgendasExtension: AgendaStyle;
  solarPhaseOption: boolean;
  removeNegativeGlobalEventsOption: boolean;
  modularMA: boolean;

  draftVariant: boolean;
  initialDraft: boolean;
  preludeDraftVariant: boolean;
  ceosDraftVariant: boolean;
  startingCorporations: number;
  shuffleMapOption: boolean;
  randomMA: RandomMAOptionType;
  includeFanMA: boolean;
  soloTR: boolean;
  customCorporationsList: Array<string>;
  bannedCards: Array<string>;
  includedCards: Array<string>;
  customColoniesList: Array<string>;
  customPreludes: Array<string>;
  requiresMoonTrackCompletion: boolean;
  requiresVenusTrackCompletion: boolean;
  moonStandardProjectVariant: boolean;
  moonStandardProjectVariant1: boolean;
  altVenusBoard: boolean;
  escapeVelocity: EscapeVelocityOptions | undefined;
  twoCorpsVariant: boolean;
  customCeos: Array<string>;
  startingCeos: number;
  startingPreludes: number;
}

export interface SimplePlayerModel {
  color: PlayerColor;
  id: string;
  name: string;
}

export interface SimpleGameModel {
  activePlayer: PlayerColor;
  id: string;
  name: string;
  phase: string;
  players: Array<SimplePlayerModel>;
  spectatorId: string | undefined;
  gameOptions: Record<string, unknown>;
  lastSoloGeneration: number;
  expectedPurgeTimeMs: number;
}
