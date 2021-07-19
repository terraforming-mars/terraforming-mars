import {GameModel} from './GameModel';
import {PublicPlayerModel} from './PlayerModel';

export interface SpectatorViewModel {
  game: GameModel;
  players: Array<PublicPlayerModel>;
}
