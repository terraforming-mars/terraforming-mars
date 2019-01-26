
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";

export class Sabotage implements IProjectCard {
    public cost: number = 1;
    public tags: Array<Tags> = [];
    public cardType: CardType = CardType.EVENT;
    public name: string = "Sabotage";
    public text: string = "Remove up to 3 titanium from any player, or 4 steel, or 7 mega credit.";
    public description: string = "Nobody will know who did it.";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            player.setWaitingFor({
                initiator: "card",
                card: this,
                type: "SelectAPlayer"
            }, (options: {[x: string]: string}) => {
                const foundPlayer = game.getPlayer(options.option1);
                if (foundPlayer === undefined) {
                    reject("Player not found");
                    return;
                }
                player.setWaitingFor(undefined);
                player.setWaitingFor({
                    initiator: "card",
                    card: this,
                    type: "SelectAmount",
                    message: "3 to remove titanium, 4 to remove steel, 7 to remove mega credit"
                }, (amount: string) => {
                    const foundAmount = parseInt(amount);
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
                });
            });
        });
    }
}

