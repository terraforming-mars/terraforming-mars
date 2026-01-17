import {Space} from '@/server/boards/Space';
import {DeferredAction} from '@/server/deferredActions/DeferredAction';
import {Priority} from '@/server/deferredActions/Priority';
import {SelectSpace} from '@/server/inputs/SelectSpace';
import {IPlayer} from '@/server/IPlayer';
import {PlayerInput} from '@/server/PlayerInput';
import {MoonData} from '@/server/moon/MoonData';
import {MoonExpansion} from '@/server/moon/MoonExpansion';

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
