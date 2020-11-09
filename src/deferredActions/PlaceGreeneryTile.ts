import {Game} from '../Game';
import {Player} from '../Player';
import {SelectSpace} from '../inputs/SelectSpace';
import {ISpace} from '../ISpace';
import {DeferredAction} from './DeferredAction';

export class PlaceGreeneryTile implements DeferredAction {
  constructor(
        public player: Player,
        public game: Game,
        public title: string = 'Select space for greenery tile',
  ) {}

  public execute() {
    const availableSpaces = this.game.board.getAvailableSpacesForGreenery(this.player);
    if (availableSpaces.length === 0) {
      return undefined;
    }

    return new SelectSpace(
        this.title,
        availableSpaces,
        (space: ISpace) => {
          this.game.addGreenery(this.player, space.id);
          return undefined;
        },
    );
  }
}
