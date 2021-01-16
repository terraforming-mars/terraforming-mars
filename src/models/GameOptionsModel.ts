import {BoardName} from '../boards/BoardName';
import {RandomMAOptionType} from '../RandomMAOptionType';
import {AgendaStyle} from '../turmoil/PoliticalAgendas';

export interface GameOptionsModel {
  aresExtension: boolean,
  boardName: BoardName,
  coloniesExtension: boolean,
  corporateEra: boolean,
  initialDraftVariant: boolean,
  moonExpansion: boolean,
  preludeExtension: boolean,
  politicalAgendasExtension: AgendaStyle,
  showOtherPlayersVP: boolean,
  showTimers: boolean,
  randomMA: RandomMAOptionType,
  turmoilExtension: boolean,
  venusNextExtension: boolean,
}
