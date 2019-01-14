
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class PowerSupplyConsortium implements IProjectCard {
    public cost: number = 5;
    public tags: Array<Tags> = [Tags.ENERGY];
    public name: string = "Power Supply Consortium";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Requires 2 power tags. Decrease any energy production 1 step and increase your own 1 step.";
    public description: string = "Dominating the energy market allows you to make hostile takeovers.";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            if (player.getTagCount(Tags.ENERGY) < 2) {
                reject("Requires 2 power tags.");
                return;
            }
            player.setWaitingFor({
                initiator: "card",
                card: this,
                type: "SelectAPlayer",
                players: game.getPlayers()
            }, (playerId: string) => {
                const foundPlayer = game.getPlayerById(playerId);
                if (foundPlayer === undefined) {
                    reject("Player not found");
                    return;
                }
                if (foundPlayer.energyProduction < 1) {
                    reject("Player must have energy production to remove");
                    return;
                }
                foundPlayer.energyProduction--;
                player.energyProduction++;
                resolve();
            });
        });
    }
}
