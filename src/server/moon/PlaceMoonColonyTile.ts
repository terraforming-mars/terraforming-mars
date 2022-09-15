import {ISpace} from '../boards/ISpace';
import {Player} from '../Player';
import {BasePlaceMoonTile} from './BasePlaceMoonTile';
import {IMoonData} from './IMoonData';
import {MoonExpansion} from './MoonExpansion';

export class PlaceMoonColonyTile extends BasePlaceMoonTile {
  constructor(
    player: Player,
    spaces?: Array<ISpace>,
    title: string = 'Select a space on The Moon for a colony tile.',
  ) {
    super(player, spaces, title);
  }

  protected getSpaces(moonData: IMoonData) {
    return moonData.moon.getAvailableSpacesOnLand(this.player);
  }

  protected placeTile(space: ISpace) {
    MoonExpansion.addColonyTile(this.player, space.id);
    MoonExpansion.raiseColonyRate(this.player);
    return undefined;
  }
}
