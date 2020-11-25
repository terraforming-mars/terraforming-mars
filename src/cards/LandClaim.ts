import {CardType} from './CardType';
import {IProjectCard} from './IProjectCard';
import {Player} from '../Player';
import {Game} from '../Game';
import {SelectSpace} from '../inputs/SelectSpace';
import {ISpace} from '../ISpace';
import {CardName} from '../CardName';
import {LogHelper} from '../components/LogHelper';

export class LandClaim implements IProjectCard {
    public cost = 1;
    public tags = [];
    public name = CardName.LAND_CLAIM;
    public cardType = CardType.EVENT;
    public hasRequirements = false;
    public canPlay(_player: Player, game: Game): boolean {
      return game.board.getNonReservedLandSpaces().length > 0;
    }
    public play(player: Player, game: Game) {
      return new SelectSpace(
        'Select space for claim',
        game.board.getNonReservedLandSpaces(),
        (foundSpace: ISpace) => {
          foundSpace.player = player;
          LogHelper.logBoardTileAction(game, player, foundSpace, 'land claim');
          return undefined;
        },
      );
    }
}
