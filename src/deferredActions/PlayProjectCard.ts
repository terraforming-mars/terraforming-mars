import {Player} from '../Player';
import {DeferredAction} from './DeferredAction';

export class PlayProjectCard implements DeferredAction {
  constructor(
        public player: Player,
  ) {}

  public execute() {
    if (this.player.getPlayableCards().length === 0) {
      return undefined;
    }
    return this.player.playProjectCard();
  }
}
