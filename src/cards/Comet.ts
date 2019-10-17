
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectPlayer } from "../inputs/SelectPlayer";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";
import { AndOptions } from "../inputs/AndOptions";

export class Comet implements IProjectCard {
    public cost: number = 21;
    public tags: Array<Tags> = [Tags.SPACE];
    public name: string = "Comet";
    public cardType: CardType = CardType.EVENT;
    public text: string = "Raise temperature 1 step and place an ocean tile. Remove up to 3 plants from any player.";
    public description: string = "Prepare to be catered!";
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, game: Game) {
        return new AndOptions(
            () => {
                return game.increaseTemperature(player, 1);
            },
            new SelectSpace("Select space for ocean tile", game.getAvailableSpacesForOcean(player), (space: ISpace) => {
                game.addOceanTile(player, space.id);
                return undefined;
            }),
            new SelectPlayer(game.getPlayersOrNeutral(), "Select player to remove up to 3 plants from", (foundPlayer: Player) => {
                foundPlayer.removePlants(player, 3);
                return undefined;
            })
        );
    }
}
