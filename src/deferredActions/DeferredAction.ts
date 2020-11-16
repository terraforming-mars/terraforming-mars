import {Player} from '../Player';
import {PlayerInput} from '../PlayerInput';

export class DeferredAction {
  constructor(
        public player: Player,
        public execute: () => PlayerInput | undefined,
  ) {}
}
