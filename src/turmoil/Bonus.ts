import {Game} from '../Game';

export interface Bonus {
  id: string;
  description: string;
  isDefault?: boolean;
  grant: (game: Game) => void;
}