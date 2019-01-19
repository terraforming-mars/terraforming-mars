
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class ArtificialPhotosynthesis implements IProjectCard {
    public cost: number = 12;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public cardType: CardType = CardType.AUTOMATED;
    public name: string = "Artficial Photosynthesis";
    public text: string = "Increase your plant production 1 step or your energy production 2 steps.";
    public description: string = "Artificial photosynthesis was achieved chemically by prof Akermark et. al. in 2021. Its application to terraforming remains to be seen.";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            player.setWaitingFor({
                initiator: "card",
                card: this,
                type: "SelectAmount",
                message: "1 - increase plant production, 2 - increase energy production"
            }, (amount: string) => {
                const option = parseInt(amount);
                if (option === 1) {
                    player.plantProduction++;
                } else if (option === 2) {
                    player.energyProduction += 2;
                } else {
                    reject("Unknown option");
                    return;
                }
                resolve();
            });
        });
    }
}
