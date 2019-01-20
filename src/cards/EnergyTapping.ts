
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class EnergyTapping implements IProjectCard {
    public cost: number = 3;
    public tags: Array<Tags> = [Tags.ENERGY];
    public name: string = "Energy Tapping";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Decrease any energy production 1 step and increase your own 1 step. Lose 1 victory point.";
    public description: string = "They need it. But we need it more.";
    public play(player: Player, game: Game): Promise<void> {
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
                if (foundPlayer.energyProduction < 1) {
                    reject("Selected player has no energy production");
                    return;
                }
                foundPlayer.energyProduction--;
                player.energyProduction++;
                player.victoryPoints--;
                resolve();
            });
        });
    }
}
