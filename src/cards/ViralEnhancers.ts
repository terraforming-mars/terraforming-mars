
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { OrOptions } from "../inputs/OrOptions";
import { SelectOption } from "../inputs/SelectOption";
import { CardName } from "../CardName";
import { ResourceType } from "../ResourceType";

export class ViralEnhancers implements IProjectCard {
    public cost: number = 9;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.MICROBES];
    public name: CardName = CardName.VIRAL_ENHANCERS;
    public cardType: CardType = CardType.ACTIVE;
    private applyCardBonus(player: Player, game: Game, card: IProjectCard, resourceCount: number): void {
        if (resourceCount <= 0) {
            return;
        }

        game.interrupts.push({
            player: player,
            playerInput: new OrOptions(
                new SelectOption("Add resource to card " + card.name, "Add resource", () => {
                    player.addResourceTo(card);
                    this.applyCardBonus(player, game, card, resourceCount - 1);
                    return undefined;
                }),
                new SelectOption("Gain plant", "Save",() => {
                    player.plants++;
                    this.applyCardBonus(player, game, card, resourceCount - 1);
                    return undefined;
                })
            )
        });
    }
    public onCardPlayed(player: Player, game: Game, card: IProjectCard) {
        const resourceCount = card.tags.filter((tag) => tag === Tags.ANIMAL || tag === Tags.PLANT || tag === Tags.MICROBES).length;
        if (resourceCount > 0) {
            if (card.resourceType === ResourceType.ANIMAL || card.resourceType === ResourceType.MICROBE) {
                this.applyCardBonus(player, game, card, resourceCount);
            } else {
                player.plants += resourceCount;
            }
        }
        return undefined;
    }
    public play() {
        return undefined;
    }
}
