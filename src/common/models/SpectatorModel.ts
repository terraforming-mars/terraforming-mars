import {SpectatorId} from '../Types';
import {ViewModel} from './PlayerModel';

export interface SpectatorModel extends ViewModel {
  id?: SpectatorId;
  color: 'neutral';
}
