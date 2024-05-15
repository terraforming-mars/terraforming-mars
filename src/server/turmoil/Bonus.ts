import {IGame} from '../IGame';
import {IPlayer} from '../IPlayer';
import {BonusId} from '../../common/turmoil/Types';

export interface Bonus {
  id: BonusId;
  description: string;
  grant(game: IGame, player?: IPlayer): void;
  getScore(player: IPlayer): number;
}
