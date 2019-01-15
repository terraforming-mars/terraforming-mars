
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardType } from "./CardType";

export class BiomassCombustors implements IProjectCard {
    public cost: number = 4;
    public cardType: CardType = CardType.AUTOMATED;
    public tags: Array<Tags> = [Tags.ENERGY, Tags.STEEL];
    public name: string = "Biomass Combustors";
    public text: string = "Requires 6% oxygen. Decrease any plant production 1 step and increse your energy production 2 steps.";
    public description: string = "Burning wood is easy";
    public play(player: Player, game: Game): Promise<void> {
        if (game.getOxygenLevel() < 6) {
            return Promise.reject("Requires 6% oxygen");
        }
        return new Promise((resolve, reject) => {
            const onInput = (input: string) => {
                const otherPlayer = game.getPlayerById(input);
                if (otherPlayer === undefined) {
                    reject("Player not found");
                } else if (otherPlayer.plantProduction < 1) {
                    reject("No plant production to decrease for selected player");
                } else {
                    otherPlayer.plantProduction--;
                    player.energyProduction++;
                    resolve();
                    player.victoryPoints--;
                }
            };
            player.setWaitingFor({
                initiator: "card",
                card: this,
                type: "SelectAPlayer"
            }, onInput);
        });
    }

}
