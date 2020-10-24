import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { OrOptions } from "../inputs/OrOptions";
import { SelectOption } from "../inputs/SelectOption";
import { ResourceType } from "../ResourceType";
import { CardName } from "../CardName";
import { IResourceCard } from "./ICard";
import { SimpleDeferredAction } from "../deferredActions/SimpleDeferredAction";

export class OlympusConference implements IProjectCard, IResourceCard {
    public cost: number = 10;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.EARTH, Tags.STEEL];
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.SCIENCE;
    public resourceCount: number = 0;
    public name: CardName = CardName.OLYMPUS_CONFERENCE;

    public onCardPlayed(player: Player, game: Game, card: IProjectCard) {
        const scienceTags = card.tags.filter((tag) => tag === Tags.SCIENCE).length;
        for (let i = 0; i < scienceTags; i++) {
            game.defer(new SimpleDeferredAction(
                player,
                () => {
                    // Can't remove a resource
                    if (this.resourceCount === 0) {
                        this.resourceCount++;
                        return undefined;
                    }
                    return new OrOptions(
                        new SelectOption("Remove a science resource from this card to draw a card", "Remove resource", () => {
                            player.removeResourceFrom(this);
                            player.cardsInHand.push(game.dealer.dealCard());
                            return undefined;
                        }),
                        new SelectOption("Add a science resource to this card", "Add resource", () => {
                            this.resourceCount++;
                            return undefined;
                        })
                    );
                }
            ), true); // Unshift that deferred action
        }
        return undefined;
    }
    public play() {
        return undefined;
    }
    public getVictoryPoints() {
        return 1;
    }
}
