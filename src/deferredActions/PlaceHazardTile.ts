import {Game} from '../Game';
import {Player} from '../Player';
import {SelectSpace} from '../inputs/SelectSpace';
import {ISpace} from '../ISpace';
import {DeferredAction} from './DeferredAction';
import {AresHandler} from '../ares/AresHandler';
import {LogHelper} from '../components/LogHelper';
import {TileType} from '../TileType';

export class PlaceHazardTile implements DeferredAction {
  constructor(
        public player: Player,
        public game: Game,
        public title: string = 'Select space for hazard tile',
        public spaces: Array<ISpace> = [],
  ) {}

  public execute() {
    if (this.spaces.length === 0) {
      return undefined;
    }

    return new SelectSpace(this.title, this.spaces, (foundSpace: ISpace) => {
      const tileType = Math.floor(Math.random() * 2) === 0 ? TileType.DUST_STORM_MILD : TileType.EROSION_MILD;

      AresHandler.putHazardAt(foundSpace, tileType);
      foundSpace.bonus.forEach((spaceBonus) => this.game.grantSpaceBonus(this.player, spaceBonus));
      LogHelper.logTilePlacement(this.game, this.player, foundSpace, tileType);

      return undefined;
    });
  }
}
