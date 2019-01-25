
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class MassConverter implements IProjectCard {
    public cost: number = 8;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.ENERGY];
    public name: string = "Mass Converter";
    public cardType: CardType = CardType.ACTIVE;
    public text: string = "When you play a space card, you pay 2 mega credit less for it. Requires 5 science tags. Increase your energy production 6 steps.";
    public description: string = "E=mc^2. 1 kg = a LOT of energy";
    public play(player: Player, _game: Game): Promise<void> {
        if (player.getTagCount(Tags.SCIENCE) < 5) {
            return Promise.reject("Requires 5 science tags.");
        }
        player.energyProduction += 6;
        player.addCardDiscount((card: IProjectCard) => {
            if (card.tags.indexOf(Tags.SPACE) !== -1) {
                return 2;
            }
            return 0;
        });
        return Promise.resolve();
    }
}
