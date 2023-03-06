import {IProjectCard} from '../cards/IProjectCard';
import {SelectProjectCardToPlay} from '../inputs/SelectProjectCardToPlay';
import {Player} from '../Player';
import {DeferredAction, Priority} from './DeferredAction';

export class PlayProjectCard extends DeferredAction {
  constructor(player: Player, private cb?: (card: IProjectCard) => void) {
    super(player, Priority.DEFAULT);
  }

  public execute() {
    const playableCards = this.player.getPlayableCards();
    if (playableCards.length === 0) {
      return undefined;
    }
    return new SelectProjectCardToPlay(this.player, playableCards, {cb: this.cb});
  }
}
