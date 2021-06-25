import {BoardName} from '../boards/BoardName';
import {RandomMAOptionType} from '../RandomMAOptionType';
import {AgendaStyle} from '../turmoil/PoliticalAgendas';
import {CardName} from '../CardName';

export interface GameOptionsModel {
  aresExtension: boolean,
  boardName: BoardName,
  cardsBlackList: Array<CardName>;
  coloniesExtension: boolean,
  communityCardsOption: boolean,
  corporateEra: boolean,
  draftVariant: boolean,
  fastModeOption: boolean,
  includeVenusMA: boolean,
  initialDraftVariant: boolean,
  moonExpansion: boolean,
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
  turmoilExtension: boolean,
  venusNextExtension: boolean,
  requiresMoonTrackCompletion: boolean,
  requiresVenusTrackCompletion: boolean,
  undoOption: boolean,
}
