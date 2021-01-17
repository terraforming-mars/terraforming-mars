import {IProjectCard} from '../cards/IProjectCard';
import {Game} from '../Game';
import {OrOptions} from '../inputs/OrOptions';
import {ISpace} from '../boards/ISpace';
import {Player} from '../Player';

export type PolicyId = string;

export interface Policy {
  id: PolicyId;
  description: string;
  isDefault: boolean;
  onTilePlaced?: (player: Player, space: ISpace) => void;
  onCardPlayed?: (player: Player, card: IProjectCard) => void;
  action?: (player: Player) => OrOptions | undefined;
  canAct?: (player: Player) => boolean;
  apply?: (game: Game) => void;
}
