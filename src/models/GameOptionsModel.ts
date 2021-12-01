import {BoardName} from '../boards/BoardName';
import {RandomMAOptionType} from '../RandomMAOptionType';
import {AgendaStyle} from '../turmoil/PoliticalAgendas';
import {CardName} from '../CardName';

export interface GameOptionsModel {
  aresExtension: boolean,
  altVenusBoard: boolean,
  boardName: BoardName,
  cardsBlackList: Array<CardName>;
  coloniesExtension: boolean,
  communityCardsOption: boolean,
  corporateEra: boolean,
  draftVariant: boolean,
  escapeVelocityMode: boolean,
  escapeVelocityThreshold?: number,
  escapeVelocityPeriod?: number,
  escapeVelocityPenalty?: number,
  fastModeOption: boolean,
  includeVenusMA: boolean,
  initialDraftVariant: boolean,
  moonExpansion: boolean,
  pathfindersExpansion: boolean,
  preludeExtension: boolean,
  promoCardsOption: boolean,
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
  turmoilExtension: boolean,
  venusNextExtension: boolean,
  undoOption: boolean,
}
