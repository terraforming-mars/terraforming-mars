import {BoardName} from '../boards/BoardName';
import {RandomMAOptionType} from '../ma/RandomMAOptionType';
import {AgendaStyle} from '../turmoil/Types';
import {CardName} from '../cards/CardName';
import {Expansion} from '../cards/GameModule';

export type GameOptionsModel = {
  aresExtremeVariant: boolean,
  altVenusBoard: boolean,
  boardName: BoardName,
  bannedCards: ReadonlyArray<CardName>;
  expansions: Record<Expansion, boolean>,
  draftVariant: boolean,
  escapeVelocityMode: boolean,
  escapeVelocityThreshold?: number,
  escapeVelocityBonusSeconds?: number,
  escapeVelocityPeriod?: number,
  escapeVelocityPenalty?: number,
  fastModeOption: boolean,
  includedCards: ReadonlyArray<CardName>;
  includeFanMA: boolean,
  initialDraftVariant: boolean,
  preludeDraftVariant: boolean,
  politicalAgendasExtension: AgendaStyle,
  removeNegativeGlobalEvents: boolean,
  showOtherPlayersVP: boolean,
  showTimers: boolean,
  shuffleMapOption: boolean,
  solarPhaseOption: boolean,
  soloTR: boolean,
  randomMA: RandomMAOptionType,
  requiresMoonTrackCompletion: boolean,
  requiresVenusTrackCompletion: boolean,
  twoCorpsVariant: boolean,
  undoOption: boolean,
}
