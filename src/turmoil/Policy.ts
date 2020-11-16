import {IProjectCard} from '../cards/IProjectCard';
import {Game} from '../Game';
import {OrOptions} from '../inputs/OrOptions';
import {ISpace} from '../ISpace';
import {Player} from '../Player';

export interface Policy {
  id: string;
  description: string;
  isDefault?: boolean;
  onTilePlaced?: (player: Player, space: ISpace, game: Game) => void;
  onCardPlayed?: (player: Player, card: IProjectCard) => void;
  action?: (player: Player, game: Game) => OrOptions | undefined;
  canAct?: (player: Player, game: Game) => boolean;
  apply?: (game: Game) => void;
}
