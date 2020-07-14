import { Player } from '../Player';
import { PlayerInput } from '../PlayerInput';
export interface PlayerInterrupt {
    player: Player,
    playerInput: PlayerInput,
    beforeAction?(): void
  }