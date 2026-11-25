import * as constants from '../../common/constants';
import {BoardName} from '../../common/boards/BoardName';
import {CardName} from '../../common/cards/CardName';
import {ColonyName} from '../../common/colonies/ColonyName';
import {GameId} from '../../common/Types';
import {RandomMAOptionType} from '../../common/ma/RandomMAOptionType';
import {AgendaStyle} from '../../common/turmoil/Types';
import {DEFAULT_EXPANSIONS, Expansions} from '../../common/cards/GameModule';
import {EscapeVelocityOptions} from '../../common/game/NewGameConfig';
import {CustomMA} from '../../common/ma/CustomMA';
import {ShowVP} from '../../common/game/ShowVP';

export type GameOptions = {
  boardName: BoardName;
  clonedGamedId: GameId | undefined;

  // Configuration
  undoOption: boolean;
  showTimers: boolean;
  fastModeOption: boolean;
  showVP: ShowVP;

  // Expansion options
  aresHazards: boolean;
  aresExtremeVariant: boolean;
  politicalAgendasExtension: AgendaStyle;
  solarPhaseOption: boolean;
  removeNegativeGlobalEventsOption: boolean;

  expansions: Expansions,

  // Variants
  draftVariant: boolean;
  initialDraftVariant: boolean;
  preludeDraftVariant: boolean;
  ceosDraftVariant: boolean;
  // corporationsDraft: boolean;
  startingCorporations: number;
  shuffleMapOption: boolean;
  randomMA: RandomMAOptionType;
  includeFanMA: boolean;
  modularMA: boolean;
  /** Solo victory by getting TR 63 by game end */
  soloTR: boolean;
  /** A 1 player game played against MarsBot */
  automa: boolean;
  customCorporationsList: ReadonlyArray<CardName>;
  bannedCards: ReadonlyArray<CardName>;
  includedCards: ReadonlyArray<CardName>;
  customColoniesList: ReadonlyArray<ColonyName>;
  customPreludes: ReadonlyArray<CardName>;
  customCeos: ReadonlyArray<CardName>;
  /** Preselected milestones and awards, used instead of the board's. Only valid when randomMA is MANUAL. */
  customMA?: CustomMA;
  startingCeos: number;
  startingPreludes: number;
  /** Moon must be completed to end the game */
  requiresMoonTrackCompletion: boolean;
  /** Venus must be completed to end the game */
  requiresVenusTrackCompletion: boolean;
  /** Standard projects cost more MC and do not require steel or titanium */
  moonStandardProjectVariant: boolean;
  /** Standard projects can be paid for with steel or titanium at a 1MC loss per alloy */
  moonStandardProjectVariant1: boolean;
  altVenusBoard: boolean;
  escapeVelocity?: EscapeVelocityOptions;
  twoCorpsVariant: boolean;
}

export const DEFAULT_GAME_OPTIONS: GameOptions = {
  altVenusBoard: false,
  aresHazards: true,
  aresExtremeVariant: false,
  boardName: BoardName.THARSIS,
  bannedCards: [],
  includedCards: [],
  clonedGamedId: undefined,
  customCeos: [],
  customColoniesList: [],
  customCorporationsList: [],
  customMA: undefined,
  customPreludes: [],
  draftVariant: false,
  escapeVelocity: undefined,
  expansions: {...DEFAULT_EXPANSIONS},
  fastModeOption: false,
  includeFanMA: false,
  initialDraftVariant: false,
  modularMA: false,
  moonStandardProjectVariant: false,
  moonStandardProjectVariant1: false,
  politicalAgendasExtension: 'Standard',
  preludeDraftVariant: false,
  ceosDraftVariant: false,
  randomMA: RandomMAOptionType.NONE,
  requiresMoonTrackCompletion: false,
  removeNegativeGlobalEventsOption: false,
  requiresVenusTrackCompletion: false,
  showVP: 'yours',
  showTimers: true,
  shuffleMapOption: false,
  solarPhaseOption: false,
  soloTR: false,
  startingCeos: constants.CEO_CARDS_DEALT_PER_PLAYER,
  startingCorporations: constants.CORPORATION_CARDS_DEALT_PER_PLAYER,
  startingPreludes: constants.PRELUDE_CARDS_DEALT_PER_PLAYER,
  automa: false,
  undoOption: false,
  twoCorpsVariant: false,
};
