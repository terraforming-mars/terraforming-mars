
import { Game } from "../Game";
import { Player } from "../Player";
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Tags } from "./Tags";

export class HiredRaiders implements IProjectCard {
    public cost: number = 1;
    public tags: Array<Tags> = [];
    public cardType: CardType = CardType.EVENT;
    public name: string = "Hired Raiders";
    public text: string = "Steal up to 2 steel, or 3 mega credit from any player.";
    public description: string = "We have a better use for those resources.";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            player.setWaitingFor({
                initiator: "card",
                card: this,
                type: "SelectAPlayerAndOption"
            }, (playerId: string, option: string) => {
                const foundPlayer = game.getPlayer(playerId);
                if (foundPlayer === undefined) {
                    reject("Player not found");
                    return;
                }
                if (option === "0") {
                    const starting = foundPlayer.steel;
                    foundPlayer.steel = Math.max(0, foundPlayer.steel - 2);
                    player.steel += starting - foundPlayer.steel;
                } else if (option === "1") {
                    const starting = foundPlayer.megaCredits;
                    foundPlayer.megaCredits = Math.max(0, foundPlayer.megaCredits - 3);
                    player.megaCredits += starting - foundPlayer.megaCredits;
                }
                resolve();
            });
        });
    }
}

