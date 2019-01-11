
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class Shuttles implements IProjectCard {
    public cost: number = 10;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public cardType: CardType = CardType.ACTIVE;
    public name: string = "Shuttles";
    public text: string = "Requires 5% oxygen. Decrease your energy production 1 step and increase your mega credit production 2 steps.";
    public description: "Aided by low gravity going up, and by the increasing atmosphere when gliding down for landing.";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            if (game.oxygenLevel < 5) {
                reject("Requires 5% oxygen");
                return;
            }
            if (player.energyProduction < 1) {
                reject("Must have energy to decrease");
                return;
            }
            player.addCardDiscount((card) => {
                if (card.tags.indexOf(Tags.SPACE) !== -1) {
                    return 2;
                }
                return 0;
            });
            player.energyProduction -= 1;
            player.megaCreditProduction += 2;
            player.victoryPoints++;
        });
    }    
}
