import {Game} from '../Game';
import {IPlayer} from '../IPlayer';
import {BonusId} from '../../common/turmoil/Types';

export interface Bonus {
  id: BonusId;
  description: string;
  isDefault: boolean;
  grant: (game: Game) => void;
  getScore: (player: IPlayer) => number;
}
