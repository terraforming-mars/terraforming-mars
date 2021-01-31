import {ISpace} from '../boards/ISpace';
import {DeferredAction, Priority} from '../deferredActions/DeferredAction';
import {SelectSpace} from '../inputs/SelectSpace';
import {Player} from '../Player';
import {MoonExpansion} from './MoonExpansion';

export class PlaceMoonMineTile implements DeferredAction {
  public priority = Priority.DEFAULT;

  public andThen(cb: (space: ISpace) => void) {
    this.cb = cb;
    return this;
  };

  private cb: (space: ISpace) => void = () => {};

  constructor(
    public player: Player,
    public title: string = 'Select a space on the Moon for a mining tile.',
  ) {}

  public execute() {
    const moonData = MoonExpansion.moonData(this.player.game);
    const spaces = moonData.moon.getAvailableSpacesForMine(this.player);

    if (spaces.length === 0) {
      return undefined;
    }
    return new SelectSpace(
      this.title,
      spaces,
      (space) => {
        MoonExpansion.addMineTile(this.player, space.id);
        MoonExpansion.raiseMiningRate(this.player);
        this.cb(space);
        return undefined;
      });
  }
}
