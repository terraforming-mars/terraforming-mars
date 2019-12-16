
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectPlayer } from "../inputs/SelectPlayer";
import { OrOptions } from "../inputs/OrOptions";

export class Sabotage implements IProjectCard {
    public cost: number = 1;
    public tags: Array<Tags> = [];
    public cardType: CardType = CardType.EVENT;
    public name: string = "Sabotage";
    public canPlay(): boolean {
        return true;
    }
    public play(_player: Player, game: Game) {
        if (game.getPlayers().length == 1)  return undefined;
        return new OrOptions(
                new SelectPlayer(game.getPlayers(), "Select player to remove up to 3 titanium", (selectedPlayer: Player) => {
                    selectedPlayer.titanium = Math.max(0, selectedPlayer.titanium - 3);
                    return undefined;
                }),
                new SelectPlayer(game.getPlayers(), "Select player to remove up to 4 steel", (selectedPlayer: Player) => {
                    selectedPlayer.steel = Math.max(0, selectedPlayer.steel - 4);
                    return undefined;
                }),
                new SelectPlayer(game.getPlayers(), "Select player to remove up to 7 mega credits", (selectedPlayer: Player) => {
                    selectedPlayer.megaCredits = Math.max(0, selectedPlayer.megaCredits - 7);
                    return undefined;
                })
        );
    }
}

