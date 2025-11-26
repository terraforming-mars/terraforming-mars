import {IProjectCard} from '@/server/cards/IProjectCard';
import {SelectProjectCardToPlay} from '@/server/inputs/SelectProjectCardToPlay';
import {IPlayer} from '@/server/IPlayer';
import {DeferredAction} from '@/server/deferredActions/DeferredAction';
import {Priority} from '@/server/deferredActions/Priority';

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
