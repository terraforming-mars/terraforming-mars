
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class GreatEscarpmentConsortium implements IProjectCard {
    public cost: number = 6;
    public tags: Array<Tags> = [];
    public name: string = "Great Escarpment Consortium";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Requires that you have steel production. Decrease any steel production 1 step and increase your own 1 step.";
    public description: string = "The border between the northern plains and the southern highlands is rich in minerals. Control it, and you will control the global mining business.";
    public play(player: Player, game: Game): Promise<void> {
        if (player.steelProduction < 1) {
            return Promise.reject("Requires that you have steel production.");
        }
        return new Promise((resolve, reject) => {
            player.setWaitingFor({
                initiator: "card",
                card: this,
                type: "SelectAPlayer"
            }, (playerId: string) => {
                const foundPlayer = game.getPlayerById(playerId);
                if (foundPlayer === undefined) {
                    reject("Player not found");
                    return;
                }
                foundPlayer.steelProduction = Math.max(0, foundPlayer.steelProduction - 1);
                player.steelProduction++;
                resolve();
            });
        });
    }
}
