import {Player} from '../Player';
import {SelectSpace} from '../inputs/SelectSpace';
import {ISpace} from '../boards/ISpace';
import {DeferredAction, Priority} from './DeferredAction';

export class PlaceCityTile extends DeferredAction {
  constructor(
    player: Player,
    public title: string = 'Select space for city tile',
    public spaces: Array<ISpace> | undefined = undefined,
  ) {
    super(player, Priority.DEFAULT);
  }

  public execute() {
    const spaces = this.spaces !== undefined ? this.spaces : this.player.game.board.getAvailableSpacesForCity(this.player);
    if (spaces.length === 0) {
      return undefined;
    }
    return new SelectSpace(
      this.title,
      spaces,
      (space: ISpace) => {
        this.player.game.addCityTile(this.player, space.id);
        return undefined;
      },
    );
  }
}
