import {IProjectCard} from "./IProjectCard";
import {Tags} from "./Tags";
import {Player} from "../Player";
import {Game} from "../Game";
import {CardType} from "./CardType";
import {SelectPlayer} from "../inputs/SelectPlayer";
import {OrOptions} from "../inputs/OrOptions";
import {SelectOption} from "../inputs/SelectOption";
import {SelectSpace} from "../inputs/SelectSpace";
import {ISpace} from "../ISpace";
import { CardName } from "../CardName";
import { Resources } from "../Resources";
import { MAX_OCEAN_TILES, REDS_RULING_POLICY_COST } from "../constants";
import { PartyHooks } from "../turmoil/parties/PartyHooks";
import { PartyName } from "../turmoil/parties/PartyName";

export class Flooding implements IProjectCard {
  public cardType: CardType = CardType.EVENT;
  public cost: number = 7;
  public name: CardName = CardName.FLOODING;
  public tags: Array<Tags> = [];
  public hasRequirements = false;

  public canPlay(player: Player, game: Game): boolean {
    const oceansMaxed = game.board.getOceansOnBoard() === MAX_OCEAN_TILES;

    if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !oceansMaxed) {
      return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST);
    }

    return true;
  }

  public play(player: Player, game: Game) {
    if (game.isSoloMode()) {
      game.addOceanInterrupt(player);
      return undefined;
    }
    return new SelectSpace(
        "Select space for ocean tile",
        game.board.getAvailableSpacesForOcean(player),
        (space: ISpace) => {
          const adjacentPlayers: Set<Player> = new Set<Player>();
          game.addOceanTile(player, space.id);
          game.board.getAdjacentSpaces(space).forEach((space) => {
            if (space.player && space.player !== player) {
              adjacentPlayers.add(space.player);
            }
          });
          if (adjacentPlayers.size > 0) {
            return new OrOptions(
                new SelectPlayer(
                    Array.from(adjacentPlayers),
                    "Select adjacent player to remove 4 mega credits from",
                    "Remove credits",
                    (selectedPlayer: Player) => {
                      selectedPlayer.setResource(Resources.MEGACREDITS, -4, game, player);
                      return undefined;
                    }
                ),
                new SelectOption(
                    "Don't remove mega credits from adjacent player",
                    "Confirm",
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
