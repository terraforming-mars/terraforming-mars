import {Game} from '../Game';
import {Player} from '../Player';
import {SelectSpace} from '../inputs/SelectSpace';
import {ISpace} from '../ISpace';
import {DeferredAction} from './DeferredAction';

export class PlaceCityTile implements DeferredAction {
  constructor(
        public player: Player,
        public game: Game,
        public title: string = 'Select space for city tile',
        public spaces: Array<ISpace> = game.board.getAvailableSpacesForCity(player),
  ) {}

  public execute() {
    if (this.spaces.length === 0) {
      return undefined;
    }
    return new SelectSpace(
      this.title,
      this.spaces,
      (space: ISpace) => {
        this.game.addCityTile(this.player, space.id);
        return undefined;
      },
    );
  }
}
