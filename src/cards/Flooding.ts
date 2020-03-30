
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
import { CardName } from '../CardName';
import { Resources } from '../Resources';

export class Flooding implements IProjectCard {
  public cardType: CardType = CardType.EVENT;
  public cost: number = 7;
  public name: CardName = CardName.FLOODING;
  public tags: Array<Tags> = [];
  public play(player: Player, game: Game) {
    if (game.getPlayers().length === 1) {
      game.addOceanInterrupt(player);
      return undefined;
    }
    return new SelectSpace(
        'Select space for ocean tile',
        game.board.getAvailableSpacesForOcean(player),
        (space: ISpace) => {
          const adjacentPlayers: Array<Player> = [];
          game.addOceanTile(player, space.id);
          game.board.getAdjacentSpaces(space).forEach((space) => {
            if (space.player && space.player != player) {
              adjacentPlayers.push(space.player);
            }
          });
          if (adjacentPlayers.length > 0) {
            return new OrOptions(
                new SelectPlayer(
                    adjacentPlayers,
                    'Select adjacent player to remove 4 mega credits from',
                    (selectedPlayer: Player) => {
                      selectedPlayer.setResource(Resources.MEGACREDITS, -4, game, player);
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
