import {GameModel} from './GameModel';
import {PublicPlayerModel} from './PlayerModel';
import {SpectatorId} from '../Game';

export interface SpectatorModel {
  id: SpectatorId;
  game: GameModel;
  players: Array<PublicPlayerModel>;
}
