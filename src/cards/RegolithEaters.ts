
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { OrOptions } from "../inputs/OrOptions";
import { SelectOption } from "../inputs/SelectOption";

export class RegolithEaters implements IProjectCard {
    public cost: number = 13;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.MICROBES];
    public name: string = "Regolith Eaters";
    public cardType: CardType = CardType.ACTIVE;
    public text: string = "";
    public actionText: string = "Add 1 microbe to this card, or remove 2 microbes from this card to raise oxygen level 1 step.";
    public description: string = "Living on the rocks and excreting oxygen.";
    public microbes: number = 0;
    public canPlay(): boolean {
        return true;
    }
    public play(_player: Player, _game: Game) {
        return undefined;
    }
    public action(player: Player, game: Game) {
        if (this.microbes < 2) {
            this.microbes++;
            return undefined;
        }
        return new OrOptions(
            new SelectOption(this.name, "Add 1 microbe to this card", () => {
                this.microbes++;
                return undefined;
            }),
            new SelectOption(this.name, "Remove 2 microbes to raise oxygen level 1 step", () => {
                this.microbes -= 2;
                return game.increaseOxygenLevel(player, 1);
            })
        );
    }
}
