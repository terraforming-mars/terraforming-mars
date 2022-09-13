import {ISpace} from '../boards/ISpace';
import {DeferredAction, Priority} from '../deferredActions/DeferredAction';
import {SelectSpace} from '../inputs/SelectSpace';
import {Player} from '../Player';
import {PlayerInput} from '../PlayerInput';
import {IMoonData} from './IMoonData';
import {MoonExpansion} from './MoonExpansion';

export abstract class BasePlaceMoonTile extends DeferredAction {
  constructor(
    player: Player,
    public spaces?: Array<ISpace>,
    public title: string = 'Select a space for a tile',
  ) {
    super(player, Priority.DEFAULT);
  }

  protected abstract getSpaces(moonData: IMoonData): Array<ISpace>;
  protected abstract placeTile(space: ISpace): PlayerInput | undefined;

  public execute() {
    const spaces = this.spaces !== undefined ? this.spaces : this.getSpaces(MoonExpansion.moonData(this.player.game));

    if (spaces.length === 0) {
      return undefined;
    }
    return new SelectSpace(this.title, spaces, (space) => this.placeTile(space));
  }
}
