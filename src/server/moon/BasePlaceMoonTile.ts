import {Space} from '../boards/Space';
import {DeferredAction} from '../deferredActions/DeferredAction';
import {Priority} from '../deferredActions/Priority';
import {SelectSpace} from '../inputs/SelectSpace';
import {IPlayer} from '../IPlayer';
import {PlayerInput} from '../PlayerInput';
import {MoonData} from './MoonData';
import {MoonExpansion} from './MoonExpansion';

export abstract class BasePlaceMoonTile extends DeferredAction<Space> {
  constructor(
    player: IPlayer,
    public spaces?: Array<Space>,
    public title: string = 'Select a space for a tile',
  ) {
    super(player, Priority.DEFAULT);
  }

  protected abstract getSpaces(moonData: MoonData): ReadonlyArray<Space>;
  protected abstract placeTile(space: Space): PlayerInput | undefined;

  public execute() {
    const spaces = this.spaces !== undefined ? this.spaces : this.getSpaces(MoonExpansion.moonData(this.player.game));

    if (spaces.length === 0) {
      return undefined;
    }
    return new SelectSpace(this.title, spaces)
      .andThen((space) => {
        this.placeTile(space);
        this.cb(space);
        return undefined;
      });
  }
}
