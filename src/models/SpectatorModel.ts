import {SpectatorId} from '../Game';
import {Color} from '../Color';
import {AppModel} from './PlayerModel';

export interface SpectatorModel extends AppModel {
  id: SpectatorId;
  color: Color;

}
