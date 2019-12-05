
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { OrOptions } from "../inputs/OrOptions";
import { SelectOption } from "../inputs/SelectOption";

export class ViralEnhancers implements IProjectCard {
    public cost: number = 9;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.MICROBES];
    public name: string = "Viral Enhancers";
    public cardType: CardType = CardType.ACTIVE;
    public canPlay(): boolean {
        return true;
    }
    public onCardPlayed(player: Player, _game: Game, card: IProjectCard) {
        if (card.tags.find((tag) => tag === Tags.ANIMAL || tag === Tags.PLANT || tag === Tags.MICROBES) !== undefined) {
            return new OrOptions(
                new SelectOption("Add resource to card " + card.name, () => {
                    player.addResourceTo(card);
                    return undefined;
                }),
                new SelectOption("Gain 1 plant", () => {
                    player.plants++;
                    return undefined;
                })
            );
        }
        return undefined;
    }
    public play() {
        return undefined;
    }
}
