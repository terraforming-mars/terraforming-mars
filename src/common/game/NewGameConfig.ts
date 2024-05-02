import {BoardName} from '../boards/BoardName';
import {RandomBoardOption} from '../boards/RandomBoardOption';
import {CardName} from '../cards/CardName';
import {ColonyName} from '../colonies/ColonyName';
import {Color} from '../Color';
import {RandomMAOptionType} from '../ma/RandomMAOptionType';
import {AgendaStyle} from '../turmoil/Types';
import {GameId} from '../Types';

export type BoardNameType = BoardName | RandomBoardOption;

export interface NewPlayerModel {
  name: string;
  color: Color;
  beginner: boolean;
  handicap: number;
  first: boolean;
}

/**
 * Like GameOptions, but the data structure sent from the new game page.
 */
export interface NewGameConfig {
  players: Array<NewPlayerModel>;
  prelude: boolean;
  venusNext: boolean;
  colonies: boolean;
  turmoil: boolean;
  board: BoardNameType;
  seed: number;
  randomFirstPlayer: boolean;

  // boardName: BoardName;
  clonedGamedId: GameId | undefined;

  // Configuration
  undoOption: boolean;
  showTimers: boolean;
  fastModeOption: boolean;
  showOtherPlayersVP: boolean;

  // Extensions
  corporateEra: boolean;
  // venusNextExtension: boolean;
  // coloniesExtension: boolean;
  // preludeExtension: boolean;
  // turmoilExtension: boolean;
  prelude2Expansion: boolean;
  promoCardsOption: boolean;
  communityCardsOption: boolean;
  aresExtension: boolean;
  // aresHazards: boolean;
  politicalAgendasExtension: AgendaStyle;
  solarPhaseOption: boolean;
  removeNegativeGlobalEventsOption: boolean;
  includeVenusMA: boolean;
  moonExpansion: boolean;
  pathfindersExpansion: boolean;
  ceoExtension: boolean;

  // Variants
  draftVariant: boolean;
  initialDraft: boolean; // initialDraftVariant: boolean;
  preludeDraftVariant: boolean;
  startingCorporations: number;
  shuffleMapOption: boolean;
  randomMA: RandomMAOptionType;
  includeFanMA: boolean,
  soloTR: boolean; // Solo victory by getting TR 63 by game end
  customCorporationsList: Array<CardName>;
  bannedCards: Array<CardName>;
  includedCards: Array<CardName>;
  customColoniesList: Array<ColonyName>;
  customPreludes: Array<CardName>;
  requiresMoonTrackCompletion: boolean; // Moon must be completed to end the game
  requiresVenusTrackCompletion: boolean; // Venus must be completed to end the game
  moonStandardProjectVariant: boolean;
  altVenusBoard: boolean;
  escapeVelocityMode: boolean;
  escapeVelocityThreshold: number | undefined;
  escapeVelocityBonusSeconds: number | undefined;
  escapeVelocityPeriod: number | undefined;
  escapeVelocityPenalty: number | undefined;
  twoCorpsVariant: boolean;
  customCeos: Array<CardName>;
  startingCeos: number;
  starWarsExpansion: boolean,
  underworldExpansion: boolean,
}
