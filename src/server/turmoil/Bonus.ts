import {IGame} from '../IGame';
import {IPlayer} from '../IPlayer';
import {BonusId} from '../../common/turmoil/Types';

export interface Bonus {
  id: BonusId;
  description: string;
  grant(game: IGame): void;
  getScore(player: IPlayer): number;
}
