
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectPlayer } from "../inputs/SelectPlayer";
import { SelectAmount } from "../inputs/SelectAmount";
import { AndOptions } from "../inputs/AndOptions";
import { OrOptions } from "../inputs/OrOptions";

export class Sabotage implements IProjectCard {
    public cost: number = 1;
    public tags: Array<Tags> = [];
    public cardType: CardType = CardType.EVENT;
    public name: string = "Sabotage";
    public text: string = "Remove up to 3 titanium from any player, or 4 steel, or 7 mega credit.";
    public description: string = "Nobody will know who did it.";
    public play(_player: Player, game: Game) {
        let foundPlayer: Player;
        let foundAmount: number;
        return new AndOptions(
            () => {
                if (foundAmount === 3) {
                    foundPlayer.titanium = Math.max(0, foundPlayer.titanium - 3);
                } else if (foundAmount === 4) {
                    foundPlayer.steel = Math.max(0, foundPlayer.steel - 4);
                } else if (foundAmount === 7) {
                    foundPlayer.megaCredits = Math.max(0, foundPlayer.megaCredits - 7);
                } else {
                    throw "Unknown option";
                }
                return undefined;
            },
            new SelectPlayer(this.name, game.getPlayers(), "Select player to remove resources from", (selectedPlayer: Player) => {
                foundPlayer = selectedPlayer;
                return undefined;
            }),
            new OrOptions(
                new SelectAmount(this.name, "Remove 3 titanium", () => {
                    foundAmount = 3;
                    return undefined;
                }),
                new SelectAmount(this.name, "Remove 4 steel", () => {
                    foundAmount = 4;
                    return undefined;
                }),
                new SelectAmount(this.name, "Remove 7 mega credits", () => {
                    foundAmount = 7;
                    return undefined;
                })
            )
        );
    }
}

