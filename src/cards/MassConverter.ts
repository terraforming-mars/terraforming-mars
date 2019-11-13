
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
    public requirements: undefined;
    public description: string = "E=mc^2. 1 kg = a LOT of energy";
    public canPlay(player: Player): boolean {
        return player.getTagCount(Tags.SCIENCE) >= 5;
    }
    public getCardDiscount(_player: Player, _game: Game, card: IProjectCard) {
        if (card.tags.indexOf(Tags.SPACE) !== -1) {
            return 2;
        }
        return 0;
    }
    public play(player: Player) {
        player.energyProduction += 6;
        return undefined;
    }
}
