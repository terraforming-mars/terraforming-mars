import {Player} from '../Player';
import {SelectSpace} from '../inputs/SelectSpace';
import {ISpace} from '../boards/ISpace';
import {DeferredAction, Priority} from './DeferredAction';

export class PlaceCityTile implements DeferredAction {
  public priority = Priority.DEFAULT;
  constructor(
        public player: Player,
        public title: string = 'Select space for city tile',
        public spaces: Array<ISpace> = player.game.board.getAvailableSpacesForCity(player),
  ) {}

  public execute() {
    if (this.spaces.length === 0) {
      return undefined;
    }
    return new SelectSpace(
      this.title,
      this.spaces,
      (space: ISpace) => {
        this.player.game.addCityTile(this.player, space.id);
        return undefined;
      },
    );
  }
}
