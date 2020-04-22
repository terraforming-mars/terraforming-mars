
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { OrOptions } from "../inputs/OrOptions";
import { SelectOption } from "../inputs/SelectOption";
import { CardName } from '../CardName';

export class ViralEnhancers implements IProjectCard {
    public cost: number = 9;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.MICROBES];
    public name: CardName = CardName.VIRAL_ENHANCERS;
    public cardType: CardType = CardType.ACTIVE;

    public onCardPlayed(player: Player, _game: Game, card: IProjectCard) {
        let resourceCount = card.tags.filter((tag) => tag === Tags.ANIMAL || tag === Tags.PLANT || tag === Tags.MICROBES).length;
        if (resourceCount > 0 && card.resourceType !== undefined) {
            return new OrOptions(
                new SelectOption("Add one resource to card " + card.name, () => {
                    player.addResourceTo(card, 1);
                    return undefined;
                }),
                new SelectOption("Gain 1 plant", () => {
                    player.plants += 1;
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
