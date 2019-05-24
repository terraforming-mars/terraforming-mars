
import { IActionCard } from "./ICard";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { OrOptions } from "../inputs/OrOptions";
import { SelectOption } from "../inputs/SelectOption";

export class NitriteReducingBacteria implements IActionCard, IProjectCard {
    public cost: number = 11;
    public microbes: number = 0;
    public tags: Array<Tags> = [Tags.MICROBES];
    public cardType: CardType = CardType.ACTIVE;
    public name: string = "Nitrite Reducing Bacteria";
    public text: string = "Add 3 microbes to this card.";
    public actionText: string = "Add 1 microbe to this card, or remove 3 microbes to increase your terraform rating 1 step.";
    public description: string = "Making use of the nitrites in the ground to release nitrogen into the atmosphere.";
    public canPlay(): boolean {
        return true;
    }
    public play(_player: Player, _game: Game) {
        this.microbes += 3;
        return undefined;
    }
    public canAct(): boolean {
        return false;
    }
    public action(player: Player, _game: Game) {
        if (this.microbes < 3) {
            this.microbes++;
            return undefined;
        }
        return new OrOptions(
            new SelectOption("Add 1 microbe to this card", () => {
                this.microbes++;
                return undefined;
            }),
            new SelectOption("Remove 3 microbes to increase your terraform rating 1 step", () => {
                this.microbes -= 3;
                player.terraformRating++;
                return undefined;
            })
        );
    }
}
