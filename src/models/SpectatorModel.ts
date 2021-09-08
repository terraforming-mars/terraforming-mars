import {GameModel} from './GameModel';
import {PublicPlayerModel} from './PlayerModel';
import {SpectatorId} from '../Game';
import {Color} from '../Color';

export interface SpectatorModel {
  id: SpectatorId;
  color: Color;
  game: GameModel;
  players: Array<PublicPlayerModel>;
}
