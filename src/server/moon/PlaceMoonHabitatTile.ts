import {Space} from '@/server/boards/Space';
import {IPlayer} from '@/server/IPlayer';
import {BasePlaceMoonTile} from '@/server/moon/BasePlaceMoonTile';
import {MoonData} from '@/server/moon/MoonData';
import {MoonExpansion} from '@/server/moon/MoonExpansion';

export class PlaceMoonHabitatTile extends BasePlaceMoonTile {
  constructor(
    player: IPlayer,
    spaces?: Array<Space>,
    title: string = 'Select a space on The Moon for a habitat tile.',
  ) {
    super(player, spaces, title);
  }

  protected getSpaces(moonData: MoonData): ReadonlyArray<Space> {
    return moonData.moon.getAvailableSpacesOnLand(this.player);
  }

  protected placeTile(space: Space) {
    MoonExpansion.addHabitatTile(this.player, space.id);
    MoonExpansion.raiseHabitatRate(this.player);
    return undefined;
  }
}
