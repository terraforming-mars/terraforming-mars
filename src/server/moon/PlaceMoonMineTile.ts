import {ISpace} from '../boards/ISpace';
import {Player} from '../Player';
import {BasePlaceMoonTile} from './BasePlaceMoonTile';
import {IMoonData} from './IMoonData';
import {MoonExpansion} from './MoonExpansion';

export class PlaceMoonMineTile extends BasePlaceMoonTile {
  private cb: (space: ISpace) => void = () => {};

  constructor(
    player: Player,
    spaces?: Array<ISpace>,
    title: string = 'Select a space on The Moon for a mining tile.',
  ) {
    super(player, spaces, title);
  }

  public andThen(cb: (space: ISpace) => void) {
    this.cb = cb;
    return this;
  }

  protected getSpaces(moonData: IMoonData) {
    return moonData.moon.getAvailableSpacesForMine(this.player);
  }

  public placeTile(space: ISpace) {
    MoonExpansion.addMineTile(this.player, space.id);
    MoonExpansion.raiseMiningRate(this.player);
    this.cb(space);
    return undefined;
  }
}
