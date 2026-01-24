import {Space} from '../boards/Space';
import {IPlayer} from '../IPlayer';
import {BasePlaceMoonTile} from './BasePlaceMoonTile';
import {MoonData} from './MoonData';
import {MoonExpansion} from './MoonExpansion';

export class PlaceMoonMineTile extends BasePlaceMoonTile {
  constructor(
    player: IPlayer,
    spaces?: Array<Space>,
    title: string = 'Select a space on The Moon for a mining tile.',
  ) {
    super(player, spaces, title);
  }

  protected getSpaces(moonData: MoonData) {
    return moonData.moon.getAvailableSpacesForMine(this.player);
  }

  public placeTile(space: Space) {
    MoonExpansion.addMineTile(this.player, space.id);
    MoonExpansion.raiseMiningRate(this.player);
    return undefined;
  }
}
