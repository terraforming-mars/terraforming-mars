import {Game} from '../Game';
import * as constants from '../constants';
import {Player} from '../Player';
import {SelectSpace} from '../inputs/SelectSpace';
import {ISpace} from '../ISpace';
import {SpaceType} from '../SpaceType';
import {DeferredAction} from './DeferredAction';

export class PlaceOceanTile implements DeferredAction {
  constructor(
        public player: Player,
        public game: Game,
        public title: string = 'Select space for ocean tile',
  ) {}

  public execute() {
    if (this.game.board.getOceansOnBoard() >= constants.MAX_OCEAN_TILES) {
      return undefined;
    }

    return new SelectSpace(
        this.title,
        this.game.board.getAvailableSpacesForOcean(this.player),
        (space: ISpace) => {
          this.game.addOceanTile(this.player, space.id, SpaceType.OCEAN);
          return undefined;
        },
    );
  }
}
