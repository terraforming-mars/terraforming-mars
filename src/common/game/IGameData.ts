import {GameId} from '../Types';

// TODO(kberg): rename to something like IGameCloneMetadata
export interface IGameData {
  gameId: GameId;
  playerCount: number;
}
