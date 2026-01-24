import {IProjectCard} from '../cards/IProjectCard';
import {SelectProjectCardToPlay} from '../inputs/SelectProjectCardToPlay';
import {IPlayer} from '../IPlayer';
import {DeferredAction} from './DeferredAction';
import {Priority} from './Priority';

export class PlayProjectCard extends DeferredAction<IProjectCard | undefined> {
  constructor(player: IPlayer) {
    super(player, Priority.DEFAULT);
  }

  public execute() {
    const playableCards = this.player.getPlayableCards();
    if (playableCards.length === 0) {
      this.cb(undefined);
      return undefined;
    }
    return new SelectProjectCardToPlay(this.player, playableCards).andThen((card) => {
      this.cb(card);
      return undefined;
    });
  }
}
