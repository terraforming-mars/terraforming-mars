
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
        return new AndOptions(
            () => {
                return undefined;
            },
            new SelectPlayer(this.name, game.getPlayers(), "Select player to remove resources from", (selectedPlayer: Player) => {
                foundPlayer = selectedPlayer;
                return undefined;
            }),
            new OrOptions(
                new SelectAmount(this.name, "Remove 3 titanium", (amount: number) => {
                    foundPlayer.titanium = Math.max(0, foundPlayer.titanium - amount);
                    return undefined;
                }, 3),
                new SelectAmount(this.name, "Remove 4 steel", (amount: number) => {
                    foundPlayer.steel = Math.max(0, foundPlayer.steel - amount);
                    return undefined;
                }, 4),
                new SelectAmount(this.name, "Remove 7 mega credits", (amount: number) => {
                    foundPlayer.megaCredits = Math.max(0, foundPlayer.megaCredits - amount);
                    return undefined;
                }, 7)
            )
        );
    }
}

