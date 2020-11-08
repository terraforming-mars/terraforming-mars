import { CardName } from "../../CardName";
import { Game } from "../../Game";
import { Player } from "../../Player";
import { ResourceType } from "../../ResourceType";
import { CardType } from "../CardType";
import { IActionCard, IResourceCard } from "../ICard";
import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { ICard } from "../../cards/ICard";
import { SelectCard } from "../../inputs/SelectCard";
import { DeferredAction } from "../../deferredActions/DeferredAction";

export class BioengineeringEnclosure implements IProjectCard, IActionCard, IResourceCard {
    public cost = 7;
    public tags = [Tags.ANIMAL];
    public cardType = CardType.ACTIVE;
    public name = CardName.BIOENGINEERING_ENCLOSURE;
    public resourceType = ResourceType.ANIMAL;
    public resourceCount = 0;

    public canPlay(player: Player, _game: Game): boolean {
        return player.getTagCount(Tags.SCIENCE) >= 1;
    }

    public play(player: Player, _game: Game) {
        player.addResourceTo(this, 2);

        return undefined;
    }

    public canAct(player: Player): boolean {
        // >1 because this player already has bioengineering enclosure.
        return this.resourceCount > 0 && player.getResourceCards(this.resourceType).length > 1;
    }

    public action(player: Player, game: Game) {
        game.defer(new DeferredAction(
            player,
            () => {
                const resourceCards = player.getResourceCards(this.resourceType).filter(card => card.name !== CardName.BIOENGINEERING_ENCLOSURE);

                if (resourceCards.length === 0) {
                    return undefined;
                }

                if (resourceCards.length === 1) {
                    this.resourceCount--;
                    player.addResourceTo(resourceCards[0], 1);
                    game.log("${0} moved 1 animal from Bioengineering Enclosure to ${1}.", b => b.player(player).card(resourceCards[0]));
                    return undefined;
                }

                return new SelectCard(
                    "Select card to add 1 animal",
                    "Add animal",
                    resourceCards,
                    (foundCards: Array<ICard>) => {
                        this.resourceCount--;
                        player.addResourceTo(foundCards[0], 1);
                        game.log("${0} moved 1 animal from Bioengineering Enclosure to ${1}.", b => b.player(player).card(foundCards[0]));
                        return undefined;
                    }
                );
            }
        ));
        return undefined;
    }
}
