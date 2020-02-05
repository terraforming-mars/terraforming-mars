
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { OrOptions } from "../inputs/OrOptions";
import { SelectOption } from "../inputs/SelectOption";
import { ResourceType } from "../ResourceType";

export class OlympusConference implements IProjectCard {
    public cost: number = 10;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.EARTH, Tags.STEEL];
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.SCIENCE;
    public name: string = "Olympus Conference";

    public onCardPlayed(player: Player, game: Game, card: IProjectCard) {
        const gainAScienceResource = () => {
            player.addResourceTo(this);
            return undefined;
        }
        if (card.tags.filter((tag) => tag === Tags.SCIENCE).length > 0) {
            if (player.getResourcesOnCard(this) > 0) {
                return new OrOptions(
                    new SelectOption("Add a science resource to this card", gainAScienceResource),
                    new SelectOption("Remove a science resource from this card to draw a card", () => {
                        player.removeResourceFrom(this);
                        player.cardsInHand.push(game.dealer.dealCard());
                        return undefined;
                    })
                );
            }
            return gainAScienceResource();
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
