import * as constants from '../../common/constants';
import {BoardName} from '../../common/boards/BoardName';
import {CardName} from '../../common/cards/CardName';
import {ColonyName} from '../../common/colonies/ColonyName';
import {GameId} from '../../common/Types';
import {RandomMAOptionType} from '../../common/ma/RandomMAOptionType';
import {AgendaStyle} from '../../common/turmoil/Types';

export type GameOptions = {
  boardName: BoardName;
  clonedGamedId: GameId | undefined;

  // Configuration
  undoOption: boolean;
  showTimers: boolean;
  fastModeOption: boolean;
  showOtherPlayersVP: boolean;

  // Extensions
  corporateEra: boolean;
  venusNextExtension: boolean;
  coloniesExtension: boolean;
  preludeExtension: boolean;
  prelude2Expansion: boolean;
  turmoilExtension: boolean;
  promoCardsOption: boolean;
  communityCardsOption: boolean;
  aresExtension: boolean;
  aresHazards: boolean;
  politicalAgendasExtension: AgendaStyle;
  solarPhaseOption: boolean;
  removeNegativeGlobalEventsOption: boolean;
  includeVenusMA: boolean;
  moonExpansion: boolean;
  pathfindersExpansion: boolean;
  ceoExtension: boolean;
  starWarsExpansion: boolean;
  underworldExpansion: boolean;

  // Variants
  draftVariant: boolean;
  initialDraftVariant: boolean;
  preludeDraftVariant: boolean;
  // corporationsDraft: boolean;
  startingCorporations: number;
  shuffleMapOption: boolean;
  randomMA: RandomMAOptionType;
  includeFanMA: boolean;
  soloTR: boolean; // Solo victory by getting TR 63 by game end
  customCorporationsList: Array<CardName>;
  bannedCards: Array<CardName>;
  includedCards: Array<CardName>;
  customColoniesList: Array<ColonyName>;
  customPreludes: Array<CardName>;
  customCeos: Array<CardName>;
  startingCeos: number;
  /** Moon must be completed to end the game */
  requiresMoonTrackCompletion: boolean;
  /** Venus must be completed to end the game */
  requiresVenusTrackCompletion: boolean;
  /** Standard projects cost more MC and do not require steel or titanium */
  moonStandardProjectVariant: boolean;
  /** Standard projects can be paid for with steel or titanium at a 1MC loss per alloy */
  moonStandardProjectVariant1: boolean;
  altVenusBoard: boolean;
  escapeVelocityMode: boolean;
  escapeVelocityThreshold?: number;
  escapeVelocityBonusSeconds?: number;
  escapeVelocityPeriod?: number;
  escapeVelocityPenalty?: number;
  twoCorpsVariant: boolean;
}

export const DEFAULT_GAME_OPTIONS: GameOptions = {
  altVenusBoard: false,
  aresExtension: false,
  aresHazards: true,
  boardName: BoardName.THARSIS,
  bannedCards: [],
  includedCards: [],
  ceoExtension: false,
  clonedGamedId: undefined,
  coloniesExtension: false,
  communityCardsOption: false,
  corporateEra: true,
  customCeos: [],
  customColoniesList: [],
  customCorporationsList: [],
  customPreludes: [],
  draftVariant: false,
  escapeVelocityMode: false, // When true, escape velocity is enabled.
  escapeVelocityThreshold: constants.DEFAULT_ESCAPE_VELOCITY_THRESHOLD, // Time in minutes a player has to complete a game.
  escapeVelocityBonusSeconds: constants.DEFAULT_ESCAPE_VELOCITY_BONUS_SECONDS, // Number of seconds a player gets back with every action.
  escapeVelocityPeriod: constants.DEFAULT_ESCAPE_VELOCITY_PERIOD, // VP a player loses for every `escapeVelocityPenalty` minutes after `escapeVelocityThreshold`.
  escapeVelocityPenalty: constants.DEFAULT_ESCAPE_VELOCITY_PENALTY,
  fastModeOption: false,
  includeVenusMA: true,
  includeFanMA: false,
  initialDraftVariant: false,
  moonExpansion: false,
  moonStandardProjectVariant: false,
  moonStandardProjectVariant1: false,
  pathfindersExpansion: false,
  politicalAgendasExtension: AgendaStyle.STANDARD,
  preludeDraftVariant: false,
  preludeExtension: false,
  prelude2Expansion: false,
  promoCardsOption: false,
  randomMA: RandomMAOptionType.NONE,
  requiresMoonTrackCompletion: false,
  removeNegativeGlobalEventsOption: false,
  requiresVenusTrackCompletion: false,
  showOtherPlayersVP: false,
  showTimers: true,
  shuffleMapOption: false,
  solarPhaseOption: false,
  soloTR: false,
  startingCeos: 3,
  startingCorporations: 2,
  starWarsExpansion: false,
  turmoilExtension: false,
  underworldExpansion: false,
  undoOption: false,
  venusNextExtension: false,
  twoCorpsVariant: false,
};
