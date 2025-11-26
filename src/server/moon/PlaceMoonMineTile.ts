import {Space} from '@/server/boards/Space';
import {IPlayer} from '@/server/IPlayer';
import {BasePlaceMoonTile} from '@/server/moon/BasePlaceMoonTile';
import {MoonData} from '@/server/moon/MoonData';
import {MoonExpansion} from '@/server/moon/MoonExpansion';

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
