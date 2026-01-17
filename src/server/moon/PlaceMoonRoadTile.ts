import {Space} from '@/server/boards/Space';
import {IPlayer} from '@/server/IPlayer';
import {BasePlaceMoonTile} from '@/server/moon/BasePlaceMoonTile';
import {MoonData} from '@/server/moon/MoonData';
import {MoonExpansion} from '@/server/moon/MoonExpansion';

export class PlaceMoonRoadTile extends BasePlaceMoonTile {
  constructor(
    player: IPlayer,
    spaces?: Array<Space>,
    title = 'Select a space on The Moon for a road tile.',
  ) {
    super(player, spaces, title);
  }

  protected getSpaces(moonData: MoonData) {
    return moonData.moon.getAvailableSpacesOnLand(this.player);
  }

  protected placeTile(space: Space) {
    MoonExpansion.addRoadTile(this.player, space.id);
    MoonExpansion.raiseLogisticRate(this.player);
    return undefined;
  }
}
