import {IProjectCard} from '../cards/IProjectCard';
import {IGame} from '../IGame';
import {Space} from '../boards/Space';
import {IPlayer} from '../IPlayer';
import {PlayerInput} from '../PlayerInput';

type Party = 'mf' | 's' | 'u' | 'k' | 'r' | 'g';
type Suffix = 'p01' | 'p02' | 'p03' | 'p04';
export type PolicyId = `${Party}${Suffix}`

export interface Policy {
  id: PolicyId;
  description: string | ((player: IPlayer | undefined) => string);
  isDefault: boolean;
  onTilePlaced?: (player: IPlayer, space: Space) => void;
  onCardPlayed?: (player: IPlayer, card: IProjectCard) => void;
  action?: (player: IPlayer) => PlayerInput | undefined;
  canAct?: (player: IPlayer) => boolean;
  apply?: (game: IGame) => void;
}
