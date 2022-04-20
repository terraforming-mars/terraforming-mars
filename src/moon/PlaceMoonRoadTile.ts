import {ISpace} from '../boards/ISpace';
import {DeferredAction, Priority} from '../deferredActions/DeferredAction';
import {SelectSpace} from '../inputs/SelectSpace';
import {Player} from '../Player';
import {MoonExpansion} from './MoonExpansion';

export class PlaceMoonRoadTile extends DeferredAction {
  constructor(
    player: Player,
    public title: string = 'Select a space on the Moon for a road tile.',
    public spaces?: Array<ISpace>,
  ) {
    super(player, Priority.DEFAULT);
  }

  public execute() {
    const moonData = MoonExpansion.moonData(this.player.game);
    const spaces = this.spaces !== undefined ?
      this.spaces:
      moonData.moon.getAvailableSpacesOnLand(this.player);

    if (spaces.length === 0) {
      return undefined;
    }
    return new SelectSpace(
      this.title,
      spaces,
      (space) => {
        MoonExpansion.addRoadTile(this.player, space.id);
        MoonExpansion.raiseLogisticRate(this.player);
        return undefined;
      });
  }
}
