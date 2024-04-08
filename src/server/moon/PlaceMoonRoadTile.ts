import {Space} from '../boards/Space';
import {IPlayer} from '../IPlayer';
import {BasePlaceMoonTile} from './BasePlaceMoonTile';
import {MoonData} from './MoonData';
import {MoonExpansion} from './MoonExpansion';

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
