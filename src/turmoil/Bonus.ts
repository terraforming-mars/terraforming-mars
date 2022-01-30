import {Game} from '../Game';
import {Player} from '../Player';

export type Party = 'm' | 's' | 'u' | 'k' | 'r' | 'g';
export type Suffix = 'b01' | 'b02';
export type BonusId = `${Party}${Suffix}` | 'hello';

export interface Bonus {
  id: BonusId;
  description: string;
  isDefault: boolean;
  grant: (game: Game) => void;
  getScore: (player: Player) => number;
}
