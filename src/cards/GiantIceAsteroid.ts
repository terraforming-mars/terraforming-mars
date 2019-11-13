
import { AndOptions } from "../inputs/AndOptions";
import { SelectPlayer } from "../inputs/SelectPlayer";
import { SelectSpace } from "../inputs/SelectSpace";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { ISpace } from "../ISpace";

export class GiantIceAsteroid implements IProjectCard {
    public cost: number = 36;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: string = "Giant Ice Asteroid";
    public cardType: CardType = CardType.EVENT;
    public text: string = "Raise temperature 2 steps and place 2 ocean tiles. Remove up to 6 plants from any player.";
    public requirements: undefined;
    public description: string = "Crash it. The bigger, the better";
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, game: Game) {
        if (game.getPlayers().length == 1) {
            return new AndOptions(
                () => {
                    return game.increaseTemperature(player, 2);
                },
                new SelectSpace("Select first space for ocean tile", game.getAvailableSpacesForOcean(player), (space: ISpace) => {
                    game.addOceanTile(player, space.id);
                    return undefined;
                }),
                new SelectSpace("Select second space for ocean tile", game.getAvailableSpacesForOcean(player), (space: ISpace) => {
                    game.addOceanTile(player, space.id);
                    return undefined;
                })
            );
        }

        return new AndOptions(
            () => {
                return game.increaseTemperature(player, 2);
            },
            new SelectPlayer(game.getPlayers(), "Select player to remove up to 6 plants from", (foundPlayer: Player) => {
                foundPlayer.removePlants(player, 6);
                return undefined;
            }),
            new SelectSpace("Select first space for ocean tile", game.getAvailableSpacesForOcean(player), (space: ISpace) => {
                game.addOceanTile(player, space.id);
                return undefined;
            }),
            new SelectSpace("Select second space for ocean tile", game.getAvailableSpacesForOcean(player), (space: ISpace) => {
                game.addOceanTile(player, space.id);
                return undefined;
            })
        );
    }
}
