import {Space} from '../boards/Space';
import {IPlayer} from '../IPlayer';
import {BasePlaceMoonTile} from './BasePlaceMoonTile';
import {IMoonData} from './IMoonData';
import {MoonExpansion} from './MoonExpansion';

export class PlaceMoonMineTile extends BasePlaceMoonTile {
  private cb: (space: Space) => void = () => {};

  constructor(
    player: IPlayer,
    spaces?: Array<Space>,
    title: string = 'Select a space on The Moon for a mining tile.',
  ) {
    super(player, spaces, title);
  }

  public andThen(cb: (space: Space) => void) {
    this.cb = cb;
    return this;
  }

  protected getSpaces(moonData: IMoonData) {
    return moonData.moon.getAvailableSpacesForMine(this.player);
  }

  public placeTile(space: Space) {
    MoonExpansion.addMineTile(this.player, space.id);
    MoonExpansion.raiseMiningRate(this.player);
    this.cb(space);
    return undefined;
  }
}
