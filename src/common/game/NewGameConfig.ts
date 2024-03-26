import {z} from 'zod';
import {BoardName} from '../boards/BoardName';
import {RandomBoardOption} from '../boards/RandomBoardOption';
import {CardName} from '../cards/CardName';
import {ColonyName} from '../colonies/ColonyName';
import {Color} from '../Color';
import {RandomMAOptionType} from '../ma/RandomMAOptionType';
import {AgendaStyle} from '../turmoil/Types';
import {isGameId} from '../Types';

export type BoardNameType = BoardName | RandomBoardOption;

export const NewPlayerModel = z.object({
  // TODO(kberg): Remove index, which is only used in CreateGameForm.vue
  index: z.number().default(1),
  name: z.string(),
  color: z.nativeEnum(Color),
  beginner: z.boolean().default(false),
  handicap: z.number().default(0),
  first: z.boolean().default(false),
});

export type NewPlayerModel = z.infer<typeof NewPlayerModel>;

export const NewGameConfig = z.object({
  players: z.array(NewPlayerModel),
  prelude: z.boolean().default(false),
  venusNext: z.boolean().default(false),
  colonies: z.boolean().default(false),
  turmoil: z.boolean().default(false),
  board: z.nativeEnum(BoardName).or(z.nativeEnum(RandomBoardOption)).default(BoardName.THARSIS),
  /** @deprecated */ seed: z.number().optional(), // I don't think this is used anywhere.
  initialDraft: z.boolean().default(false),
  /** @deprecated */ randomFirstPlayer: z.boolean().optional(), // I don't think this is used anywhere.

  // boardName: BoardName;
  clonedGamedId: z.string().refine(isGameId).optional(),

  // Configuration
  undoOption: z.boolean().default(false),
  showTimers: z.boolean().default(false),
  fastModeOption: z.boolean().default(false),
  showOtherPlayersVP: z.boolean().default(false),

  // Extensions
  corporateEra: z.boolean().default(true), // One of the few that has a default of true
  // venusNextExtension: z.boolean(),
  // coloniesExtension: z.boolean(),
  // preludeExtension: z.boolean(),
  // turmoilExtension: z.boolean(),
  prelude2Expansion: z.boolean().default(false),
  promoCardsOption: z.boolean().default(false),
  communityCardsOption: z.boolean().default(false),
  aresExtension: z.boolean().default(false),
  // aresHazards: z.boolean(),
  politicalAgendasExtension: z.nativeEnum(AgendaStyle).default(AgendaStyle.STANDARD),
  solarPhaseOption: z.boolean().default(false),
  removeNegativeGlobalEventsOption: z.boolean().default(false),
  includeVenusMA: z.boolean().default(false),
  moonExpansion: z.boolean().default(false),
  pathfindersExpansion: z.boolean().default(false),
  ceoExtension: z.boolean().default(false),

  // Variants
  draftVariant: z.boolean().default(false),
  // initialDraftVariant: z.boolean(),
  startingCorporations: z.number().default(2),
  shuffleMapOption: z.boolean().default(false),
  randomMA: z.nativeEnum(RandomMAOptionType).default(RandomMAOptionType.NONE),
  includeFanMA: z.boolean().default(false),
  soloTR: z.boolean().default(false), // Solo victory by getting TR 63 by game end
  customCorporationsList: z.array(z.nativeEnum(CardName)).default([]),
  bannedCards: z.array(z.nativeEnum(CardName)).default([]),
  customColoniesList: z.array(z.nativeEnum(ColonyName)).default([]),
  customPreludes: z.array(z.nativeEnum(CardName)).default([]),
  requiresMoonTrackCompletion: z.boolean().default(false), // Moon must be completed to end the game
  requiresVenusTrackCompletion: z.boolean().default(false), // Venus must be completed to end the game
  moonStandardProjectVariant: z.boolean().default(false),
  altVenusBoard: z.boolean().default(false),
  escapeVelocityMode: z.boolean().default(false),
  escapeVelocityThreshold: z.number().optional(),
  escapeVelocityBonusSeconds: z.number().optional(),
  escapeVelocityPeriod: z.number().optional(),
  escapeVelocityPenalty: z.number().optional(),
  twoCorpsVariant: z.boolean().default(false),
  customCeos: z.array(z.nativeEnum(CardName)).default([]),
  startingCeos: z.number().default(2),
  starWarsExpansion: z.boolean().default(false),
  underworldExpansion: z.boolean().default(false),
});

export type NewGameConfig = z.infer<typeof NewGameConfig>;
