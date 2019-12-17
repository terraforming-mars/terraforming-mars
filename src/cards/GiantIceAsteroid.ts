
import { AndOptions } from "../inputs/AndOptions";
import { SelectPlayer } from "../inputs/SelectPlayer";
import { SelectSpace } from "../inputs/SelectSpace";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { ISpace } from "../ISpace";
import * as constants from "../constants";

export class GiantIceAsteroid implements IProjectCard {
    public cost: number = 36;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: string = "Giant Ice Asteroid";
    public cardType: CardType = CardType.EVENT;
    public canPlay(): boolean {
        return true;
    }

    private isAnyOtherPlayerHasPlants(currentPlayer: Player, game: Game): boolean {
        if (game.getPlayers().length < 2) return false;

        for (const player of game.getPlayers()) {
          if (player.id === currentPlayer.id) continue;
          if (player.plants > 0) return true;
        }
        return false;
    }

    public play(player: Player, game: Game) {
        var opts: Array<SelectPlayer | SelectSpace> = [];

        if (this.isAnyOtherPlayerHasPlants(player, game)) {
            opts.push(
                new SelectPlayer(game.getPlayers(), "Select player to remove up to 6 plants from", (foundPlayer: Player) => {
                    foundPlayer.removePlants(player, 6);
                    return undefined;
                })
            )
        }

        let oceansCount = game.getOceansOnBoard();

        if (oceansCount + 1 <= constants.MAX_OCEAN_TILES) {
            opts.push(
                new SelectSpace("Select space for ocean tile", game.getAvailableSpacesForOcean(player), (space: ISpace) => {
                    game.addOceanTile(player, space.id);
                    return undefined;
                })
            )
        }

        if (oceansCount + 2 <= constants.MAX_OCEAN_TILES) {
            opts.push(
                new SelectSpace("Select space for second ocean tile", game.getAvailableSpacesForOcean(player), (space: ISpace) => {
                    game.addOceanTile(player, space.id);
                    return undefined;
                })
            )
        }

        return new AndOptions(
            () => {
                return game.increaseTemperature(player, 2);
            },
            ...opts
        );
    }
}
