
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { OrOptions } from "../inputs/OrOptions";
import { SelectOption } from "../inputs/SelectOption";

export class OlympusConference implements IProjectCard {
    public cost: number = 10;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.EARTH, Tags.STEEL];
    public cardType: CardType = CardType.ACTIVE;
    public scienceResources: number = 0;
    public name: string = "Olympus Conference";
    public text: string = "When you play a science tag, including this, either add a science resource to this card, or remove a science resource from this card to draw a card.";
    public description: string = "The scientific elite, assembled on the top of Olympus Mons, the highest spot in the solar system";
    public play(player: Player, game: Game): Promise<void> {
        const cardPlayedHandler = (playedCard: IProjectCard) => {
            if (playedCard.tags.filter((tag) => tag === Tags.SCIENCE).length > 0) {
                if (this.scienceResources) {
                    return new Promise((resolve) => {
                        player.setWaitingFor(new OrOptions(new SelectOption(this.name, "Add a science resource to this card", () => {
                            this.scienceResources++;
                            resolve();
                        }), new SelectOption(this.name, "Remove a science resource from this card to draw a card", () => {
                            this.scienceResources--;
                            player.cardsInHand.push(game.dealer.getCards(1)[0]);
                        })));
                    });
                } else {
                    this.scienceResources++;
                }
            }
            return undefined;
        };
        player.addCardPlayedHandler(cardPlayedHandler);
        player.victoryPoints++;
        return Promise.resolve();
    }
}
