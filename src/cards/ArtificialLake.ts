import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {ISpace} from '../ISpace';
import {SelectSpace} from '../inputs/SelectSpace';
import {SpaceType} from '../SpaceType';
import * as constants from '../constants';
import { CardName } from '../CardName';

export class ArtificialLake implements IProjectCard {
    public cost: number = 15;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = CardName.ARTIFICIAL_LAKE;
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player, game: Game): boolean {
      return game.getTemperature() >= -6 - (
        player.getRequirementsBonus(game) * 2
      );
    }
    public play(player: Player, game: Game) {

      if (game.board.getOceansOnBoard() >= constants.MAX_OCEAN_TILES) return undefined;

      return new SelectSpace(
          'Select a land space to place an ocean',
          game.board.getAvailableSpacesOnLand(player),
          (foundSpace: ISpace) => {
            game.addOceanTile(player, foundSpace.id, SpaceType.LAND);
            return undefined;
          }
      );
    }
    public getVictoryPoints() {
      return 1;
    }
}
