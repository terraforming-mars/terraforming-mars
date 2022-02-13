import {Game} from '../Game';
import {Player} from '../Player';
import {BonusId} from '../common/turmoil/Types';

export interface Bonus {
  id: BonusId;
  description: string;
  isDefault: boolean;
  grant: (game: Game) => void;
  getScore: (player: Player) => number;
}
