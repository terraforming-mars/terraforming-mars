
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
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.EARTH, Tags.STEEL];
    public cardType: CardType = CardType.ACTIVE;
    public resourceType: ResourceType = ResourceType.SCIENCE;
    public name: string = "Olympus Conference";
    public text: string = "When you play a science tag, including this, either add a science resource to this card, or remove a science resource from this card to draw a card. Gain 1 victory point.";
    public description: string = "The scientific elite, assembled on the top of Olympus Mons, the highest spot in the solar system";
    public canPlay(): boolean {
        return true;
    }
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
    public play(player: Player) {
        player.victoryPoints++;
        return undefined;
    }
}
