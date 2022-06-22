import {IProjectCard} from '../cards/IProjectCard';
import {Game} from '../Game';
import {ISpace} from '../boards/ISpace';
import {Player} from '../Player';
import {PlayerInput} from '../PlayerInput';

type Party = 'mf' | 's' | 'u' | 'k' | 'r' | 'g';
type Suffix = 'p01' | 'p02' | 'p03' | 'p04';
export type PolicyId = `${Party}${Suffix}`

export interface Policy {
  id: PolicyId;
  description: string | ((player: Player | undefined) => string);
  isDefault: boolean;
  onTilePlaced?: (player: Player, space: ISpace) => void;
  onCardPlayed?: (player: Player, card: IProjectCard) => void;
  action?: (player: Player) => PlayerInput | undefined;
  canAct?: (player: Player) => boolean;
  apply?: (game: Game) => void;
}
