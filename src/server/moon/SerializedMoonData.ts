import {SerializedBoard} from '../boards/SerializedBoard';
import {PlayerId} from '../../common/Types';

export interface SerializedMoonData {
  moon: SerializedBoard;
  habitatRate: number;
  miningRate: number;
  logisticRate: number;
  lunaFirstPlayerId: PlayerId | undefined;
  lunaProjectOfficeLastGeneration: number | undefined;
}
