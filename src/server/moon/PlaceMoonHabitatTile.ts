import {ISpace} from '../boards/ISpace';
import {IPlayer} from '../IPlayer';
import {BasePlaceMoonTile} from './BasePlaceMoonTile';
import {IMoonData} from './IMoonData';
import {MoonExpansion} from './MoonExpansion';

export class PlaceMoonHabitatTile extends BasePlaceMoonTile {
  constructor(
    player: IPlayer,
    spaces?: Array<ISpace>,
    title: string = 'Select a space on The Moon for a habitat tile.',
  ) {
    super(player, spaces, title);
  }

  protected getSpaces(moonData: IMoonData): ReadonlyArray<ISpace> {
    return moonData.moon.getAvailableSpacesOnLand(this.player);
  }

  protected placeTile(space: ISpace) {
    MoonExpansion.addHabitatTile(this.player, space.id);
    MoonExpansion.raiseHabitatRate(this.player);
    return undefined;
  }
}
