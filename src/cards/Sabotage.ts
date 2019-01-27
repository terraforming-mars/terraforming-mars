
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectPlayer } from "../inputs/SelectPlayer";
import { SelectAmount } from "../inputs/SelectAmount";
import { AndOptions } from "../inputs/AndOptions";

export class Sabotage implements IProjectCard {
    public cost: number = 1;
    public tags: Array<Tags> = [];
    public cardType: CardType = CardType.EVENT;
    public name: string = "Sabotage";
    public text: string = "Remove up to 3 titanium from any player, or 4 steel, or 7 mega credit.";
    public description: string = "Nobody will know who did it.";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            let foundPlayer: Player;
            let foundAmount: number;
            player.setWaitingFor(
                new AndOptions(
                    () => {
                        if (foundAmount === 3) {
                            foundPlayer.titanium = Math.max(0, foundPlayer.titanium - 3);
                        } else if (foundAmount === 4) {
                            foundPlayer.steel = Math.max(0, foundPlayer.steel - 4);
                        } else if (foundAmount === 7) {
                            foundPlayer.megaCredits = Math.max(0, foundPlayer.megaCredits - 7);
                        } else {
                            reject("Unknown option");
                            return;
                        }
                        resolve();
                    },
                    new SelectPlayer(this, game.getPlayers(), "Select player to remove resources from", (selectedPlayer: Player) => {
                        foundPlayer = selectedPlayer;
                    }),
                    new SelectAmount(this, "3 to remove titanium, 4 to remove steel, 7 to remove mega credit", (amount: number) => {
                        foundAmount = amount;
                    })
                )
            );
        });
    }
}

