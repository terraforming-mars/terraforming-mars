import {SpectatorId} from '../Types';
import {Color} from '../Color';
import {ViewModel} from './PlayerModel';

export interface SpectatorModel extends ViewModel {
  id?: SpectatorId;
  color: Color;
}
