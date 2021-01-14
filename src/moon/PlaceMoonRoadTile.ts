import {DeferredAction} from '../deferredActions/DeferredAction';
import {SelectSpace} from '../inputs/SelectSpace';
import {Player} from '../Player';
import {Resources} from '../Resources';
import {MoonExpansion} from './MoonExpansion';

export class PlaceMoonRoadTile implements DeferredAction {
  constructor(
    public player: Player,
    public title: string = 'Select a space on the Moon for a road tile.',
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
        MoonExpansion.addRoadTile(this.player, space.id);
        MoonExpansion.raiseLogisticRate(this.player);
        this.player.addProduction(Resources.MEGACREDITS, 1, this.player.game);
        return undefined;
      });
  }
}
