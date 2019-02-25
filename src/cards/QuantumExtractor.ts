
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class QuantumExtractor implements IProjectCard {
    public cost: number = 13;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.ENERGY];
    public name: string = "Quantum Extractor";
    public cardType: CardType = CardType.ACTIVE;
    public text: string = "Requires 4 science tags. Increase your energy production 4 steps. When you play a space card, you pay 2 mega credit less for it.";
    public description: string = "Tapping the very fabric of space";
    public play(player: Player, _game: Game) {
        if (player.getTagCount(Tags.SCIENCE) < 4) {
            throw "Requires 4 science tags";
        }
        player.energyProduction += 4;
        player.addCardDiscount((card) => {
            if (card.tags.indexOf(Tags.SCIENCE) !== -1) {
                return 2;
            }
            return 0;
        }); 
        return undefined;
    }
}
