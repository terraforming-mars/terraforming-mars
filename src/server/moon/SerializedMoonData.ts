import {SerializedBoard} from '../boards/SerializedBoard';
import {PlayerId} from '../../common/Types';

export interface SerializedMoonData {
  moon: SerializedBoard;
  colonyRate: number;
  miningRate: number;
  logisticRate: number;
  lunaFirstPlayerId: PlayerId | undefined;
  lunaProjectOfficeLastGeneration: number | undefined;
}
