import {Game} from '../Game';

export type BonusId = string;

export interface Bonus {
  id: BonusId;
  description: string;
  isDefault: boolean;
  grant: (game: Game) => void;
}
