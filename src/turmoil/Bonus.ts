import {Game} from '../Game';
import {Player} from '../Player';

export type BonusId = string;

export interface Bonus {
  id: BonusId;
  description: string;
  isDefault: boolean;
  grant: (game: Game) => void;
  getScore: (player: Player) => number;
}
