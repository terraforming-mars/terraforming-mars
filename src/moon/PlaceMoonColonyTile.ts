import {DeferredAction, Priority} from '../deferredActions/DeferredAction';
import {SelectSpace} from '../inputs/SelectSpace';
import {Player} from '../Player';
import {MoonExpansion} from './MoonExpansion';

export class PlaceMoonColonyTile implements DeferredAction {
  public priority = Priority.DEFAULT;
  constructor(
    public player: Player,
    public title: string = 'Select a space on the Moon for a colony tile.',
  ) {}

  public execute() {
    const moonData = MoonExpansion.moonData(this.player.game);
    const spaces = moonData.moon.getAvailableSpacesOnLand(this.player);

    if (spaces.length === 0) {
      return undefined;
    }
    return new SelectSpace(
      this.title,
      spaces,
      (space) => {
        MoonExpansion.addColonyTile(this.player, space.id);
        MoonExpansion.raiseColonyRate(this.player);
        return undefined;
      });
  }
}
