
import { Game } from "../Game";
import { Player } from "../Player";
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Tags } from "./Tags";
import { AndOptions } from "../inputs/AndOptions";
import { OrOptions } from "../inputs/OrOptions";
import { SelectPlayer } from "../inputs/SelectPlayer";
import { SelectOption } from "../inputs/SelectOption";

export class HiredRaiders implements IProjectCard {
    public cost: number = 1;
    public tags: Array<Tags> = [];
    public cardType: CardType = CardType.EVENT;
    public name: string = "Hired Raiders";
    public text: string = "Steal up to 2 steel, or 3 mega credit from any player.";
    public description: string = "We have a better use for those resources.";
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, game: Game) {
		
        if (game.getPlayers().length == 1) {
		    return new OrOptions(
                new SelectOption("Steal 2 steel", () => {
                    player.steel += 2;
                    return undefined;
                }),
                new SelectOption("Steal 3 mega credit", () => {
                    player.megaCredits += 3;
                    return undefined;
                })
            );
        } 
		
        let selectedPlayer: Player;
        return new AndOptions(
            () => { return undefined; },
            new SelectPlayer(game.getPlayers(), "Select player to steal from", (foundPlayer: Player) => {
                selectedPlayer = foundPlayer;
                return undefined;
            }),
            new OrOptions(
                new SelectOption("Steal up to 2 steel", () => {
                    const starting = selectedPlayer.steel;
                    selectedPlayer.steel = Math.max(0, selectedPlayer.steel - 2);
                    player.steel += starting - selectedPlayer.steel;
                    return undefined;
                }),
                new SelectOption("Steal up to 3 mega credit", () => {
                    const starting = selectedPlayer.megaCredits;
                    selectedPlayer.megaCredits = Math.max(0, selectedPlayer.megaCredits - 3);
                    player.megaCredits += starting - selectedPlayer.megaCredits;
                    return undefined;
                })
            )
        );
    }
}

