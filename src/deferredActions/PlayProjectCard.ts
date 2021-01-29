import {Player} from '../Player';
import {DeferredAction, Priority} from './DeferredAction';

export class PlayProjectCard implements DeferredAction {
  public priority = Priority.DEFAULT;
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
