import {ISpace} from '../boards/ISpace';
import {Player} from '../Player';
import {BasePlaceMoonTile} from './BasePlaceMoonTile';
import {IMoonData} from './IMoonData';
import {MoonExpansion} from './MoonExpansion';

export class PlaceMoonRoadTile extends BasePlaceMoonTile {
  constructor(
    player: Player,
    spaces?: Array<ISpace>,
    title = 'Select a space on The Moon for a road tile.',
  ) {
    super(player, spaces, title);
  }

  protected getSpaces(moonData: IMoonData) {
    return moonData.moon.getAvailableSpacesOnLand(this.player);
  }

  protected placeTile(space: ISpace) {
    MoonExpansion.addRoadTile(this.player, space.id);
    MoonExpansion.raiseLogisticRate(this.player);
    return undefined;
  }
}
