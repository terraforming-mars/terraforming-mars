import {Space} from '../boards/Space';
import {DeferredAction, Priority} from '../deferredActions/DeferredAction';
import {SelectSpace} from '../inputs/SelectSpace';
import {IPlayer} from '../IPlayer';
import {PlayerInput} from '../PlayerInput';
import {IMoonData} from './IMoonData';
import {MoonExpansion} from './MoonExpansion';

export abstract class BasePlaceMoonTile extends DeferredAction {
  constructor(
    player: IPlayer,
    public spaces?: Array<Space>,
    public title: string = 'Select a space for a tile',
  ) {
    super(player, Priority.DEFAULT);
  }

  protected abstract getSpaces(moonData: IMoonData): ReadonlyArray<Space>;
  protected abstract placeTile(space: Space): PlayerInput | undefined;

  public execute() {
    const spaces = this.spaces !== undefined ? this.spaces : this.getSpaces(MoonExpansion.moonData(this.player.game));

    if (spaces.length === 0) {
      return undefined;
    }
    return new SelectSpace(this.title, spaces, (space) => this.placeTile(space));
  }
}
