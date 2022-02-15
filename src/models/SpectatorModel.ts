import {SpectatorId} from '../common/Types';
import {Color} from '../common/Color';
import {ViewModel} from '../common/models/PlayerModel';

export interface SpectatorModel extends ViewModel {
  id: SpectatorId;
  color: Color;
}
