import {DeferredAction, Priority} from '../deferredActions/DeferredAction';
import {SelectSpace} from '../inputs/SelectSpace';
import {Player} from '../Player';
import {MoonExpansion} from './MoonExpansion';

export class PlaceMoonColonyTile extends DeferredAction {
  constructor(
    player: Player,
    public title: string = 'Select a space on the Moon for a colony tile.',
  ) {
    super(player, Priority.DEFAULT);
  }

  protected getSpaces() {
    const moonData = MoonExpansion.moonData(this.player.game);
    return moonData.moon.getAvailableSpacesOnLand(this.player);
  }

  public execute() {
    const spaces = this.getSpaces();

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
