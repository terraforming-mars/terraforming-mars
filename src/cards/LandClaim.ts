
import {AresHandler} from '../ares/AresHandler';
import {CardType} from './CardType';
import {IProjectCard} from './IProjectCard';
import {Player} from '../Player';
import {Game} from '../Game';
import {SelectSpace} from '../inputs/SelectSpace';
import {ISpace} from '../ISpace';
import {CardName} from '../CardName';
import {LogHelper} from '../components/LogHelper';
import {SpaceName} from '../SpaceName';
import {SpaceType} from '../SpaceType';

export class LandClaim implements IProjectCard {
    public cost = 1;
    public tags = [];
    public name = CardName.LAND_CLAIM;
    public cardType = CardType.EVENT;
    public hasRequirements = false;
    public canPlay(player: Player, game: Game): boolean {
      return game.board.getAvailableSpacesOnLand(player).length > 0;
    }
    private getNonReservedLandSpaces(game: Game): Array<ISpace> {
      return game.board.spaces.filter((space) => {
        return space.spaceType === SpaceType.LAND && (
          space.tile === undefined ||
            AresHandler.hasHazardTile(space)
        ) && space.player === undefined &&
             space.id !== SpaceName.NOCTIS_CITY;
      });
    }
    public play(player: Player, game: Game) {
      return new SelectSpace(
          'Select space for claim',
          this.getNonReservedLandSpaces(game),
          (foundSpace: ISpace) => {
            foundSpace.player = player;
            LogHelper.logBoardTileAction(game, player, foundSpace, 'land claim');
            return undefined;
          },
      );
    }
}
