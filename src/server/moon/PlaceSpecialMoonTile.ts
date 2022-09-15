import {DeferredAction, Priority} from '../deferredActions/DeferredAction';
import {SelectSpace} from '../inputs/SelectSpace';
import {Tile} from '../Tile';
import {Player} from '../Player';
import {MoonExpansion} from './MoonExpansion';

export class PlaceSpecialMoonTile extends DeferredAction {
  constructor(
    player: Player,
    public tile: Tile,
    public title: string = 'Select a space on The Moon for this tile.',
  ) {
    super(player, Priority.DEFAULT);
  }

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
        MoonExpansion.addTile(this.player, space.id, this.tile);
        return undefined;
      });
  }
}
