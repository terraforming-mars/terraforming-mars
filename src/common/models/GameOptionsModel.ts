import {BoardName} from '../boards/BoardName';
import {RandomMAOptionType} from '../ma/RandomMAOptionType';
import {AgendaStyle} from '../turmoil/Types';
import {CardName} from '../cards/CardName';
import {EscapeVelocityOptions} from '../game/NewGameConfig';
import {ColonyName} from '../colonies/ColonyName';
import {GameId} from '../Types';
import {ShowVP} from '../game/ShowVP';
import {Expansions} from '@/common/cards/GameModule';

export type GameOptionsModel = {
  aresExtremeVariant: boolean,
  altVenusBoard: boolean,
  boardName: BoardName,
  bannedCards: ReadonlyArray<CardName>;
  expansions: Expansions,
  draftVariant: boolean,
  escapeVelocity?: EscapeVelocityOptions,
  fastModeOption: boolean,
  includedCards: ReadonlyArray<CardName>;
  includeFanMA: boolean,
  initialDraftVariant: boolean,
  preludeDraftVariant: boolean,
  ceosDraftVariant: boolean,
  politicalAgendasExtension: AgendaStyle,
  removeNegativeGlobalEvents: boolean,
  showVP: ShowVP,
  showTimers: boolean,
  shuffleMapOption: boolean,
  solarPhaseOption: boolean,
  soloTR: boolean,
  randomMA: RandomMAOptionType,
  requiresMoonTrackCompletion: boolean,
  requiresVenusTrackCompletion: boolean,
  twoCorpsVariant: boolean,
  undoOption: boolean,

  // These are only supplied for the JSON, and
  // some of them can be a bit large.
  aresHazards: boolean,
  clonedGamedId?: GameId,
  customCeos: ReadonlyArray<CardName>;
  customColoniesList: ReadonlyArray<ColonyName>;
  customCorporationsList: ReadonlyArray<CardName>;
  customPreludes: ReadonlyArray<CardName>;
  modularMA: boolean,
  moonStandardProjectVariant: boolean,
  moonStandardProjectVariant1: boolean,
  startingCeos: number,
  startingCorporations: number,
  startingPreludes: number,
}
