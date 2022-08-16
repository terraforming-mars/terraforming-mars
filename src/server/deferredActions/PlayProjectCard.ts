import {Player} from '../Player';
import {DeferredAction, Priority} from './DeferredAction';

export class PlayProjectCard extends DeferredAction {
  constructor(player: Player) {
    super(player, Priority.DEFAULT);
  }

  public execute() {
    const playableCards = this.player.getPlayableCards();
    if (playableCards.length === 0) {
      return undefined;
    }
    return this.player.getPlayProjectCardInput(playableCards);
  }
}
