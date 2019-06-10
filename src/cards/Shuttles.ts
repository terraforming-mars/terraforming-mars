
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
    public text: string = "Requires 5% oxygen. Decrease your energy production 1 step and increase your mega credit production 2 steps. When you play a space card, you pay 2 less for it. Gain 1 victory point.";
    public description: string = "Aided by low gravity going up, and by the increasing atmosphere when gliding down for landing.";
    public canPlay(player: Player, game: Game): boolean {
        return game.getOxygenLevel() >= 5 - player.getRequirementsBonus(game) && player.energyProduction >= 1;
    }
    public getCardDiscount(_player: Player, _game: Game, card: IProjectCard) {
        if (card.tags.indexOf(Tags.SPACE) !== -1) {
            return 2;
        }
        return 0;
    }
    public play(player: Player) {
        player.energyProduction -= 1;
        player.megaCreditProduction += 2;
        player.victoryPoints++;
        return undefined;
    }    
}
