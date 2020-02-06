
import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {Player} from '../Player';
import {Game} from '../Game';
import {CardType} from './CardType';
import {SelectPlayer} from '../inputs/SelectPlayer';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {SelectSpace} from '../inputs/SelectSpace';
import {ISpace} from '../ISpace';

export class Flooding implements IProjectCard {
  public cardType: CardType = CardType.EVENT;
  public cost: number = 7;
  public name: string = 'Flooding';
  public tags: Array<Tags> = [];
  public play(player: Player, game: Game) {
    return new SelectSpace(
        'Select space for ocean tile',
        game.board.getAvailableSpacesForOcean(player),
        (space: ISpace) => {
          const adjacentPlayers: Array<Player> = [];
          game.addOceanTile(player, space.id);
          game.board.getAdjacentSpaces(space).forEach((space) => {
            if (space.player) {
              adjacentPlayers.push(space.player);
            }
          });
          if (adjacentPlayers.length > 0) {
            return new OrOptions(
                new SelectPlayer(
                    adjacentPlayers,
                    'Select adjacent player to remove 4 mega credits from',
                    (selectedPlayer: Player) => {
                      selectedPlayer.megaCredits = Math.max(
                          0,
                          selectedPlayer.megaCredits - 4
                      );
                      return undefined;
                    }
                ),
                new SelectOption(
                    'Don\'t remove mega credits from adjacent player',
                    () => {
                      return undefined;
                    }
                )
            );
          }
          return undefined;
        }
    );
  }
  public getVictoryPoints() {
    return -1;
  }
}
