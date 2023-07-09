import {SerializedBoard} from '../boards/SerializedBoard';
import {PlayerId} from '../../common/Types';

export interface SerializedMoonData {
  moon: SerializedBoard;
  // TODO(kberg): Remove colonyRate (and ? on habitatRate) by 2023-09-01
  colonyRate?: number,
  habitatRate?: number;
  miningRate: number;
  logisticRate: number;
  lunaFirstPlayerId: PlayerId | undefined;
  lunaProjectOfficeLastGeneration: number | undefined;
}
