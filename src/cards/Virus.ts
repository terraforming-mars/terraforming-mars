
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SelectCard } from "../inputs/SelectCard";
import { SelectPlayer } from "../inputs/SelectPlayer";
import { OrOptions } from "../inputs/OrOptions";

export class Virus implements IProjectCard {
    public cost: number = 1;
    public tags: Array<Tags> = [Tags.MICROBES];
    public name: string = "Virus";
    public cardType: CardType = CardType.EVENT;
    public text: string = "Remove up to 2 animals or 5 plants from any player.";
    public description: string = "The virus is transient, changing from liquid to air-borne to blood transfusion.";
    public play(player: Player, game: Game): Promise<void> {
        const allCardsWithResources: Array<IProjectCard> = [];
        game.getPlayers().forEach((o) => {
            if (o !== player) {
                o.getCardsWithResources().forEach((cardWithResource) => {
                    allCardsWithResources.push(cardWithResource);
                });
            }
        });
        return new Promise((resolve, reject) => {
            player.setWaitingFor(
                new OrOptions(
                    new SelectCard(this, "Select card to remove 2 animals", allCardsWithResources),
                    new SelectPlayer(this, game.getPlayers(), "Select player to remove 5 plants")
                ), (inputs: {[x: string]: string}) => {
                    if (inputs.option === "1") {
                        const foundPlayer = game.getPlayer(inputs.option1);
                        if (foundPlayer === undefined) {
                            reject("Player not found");
                            return;
                        }
                        foundPlayer.plants = Math.max(0, foundPlayer.plants - 5);
                    } else if (inputs.option === "0") {
                        const foundCard = game.getCard(inputs.cardName);
                        if (foundCard === undefined) {
                            reject("Card not found");
                            return;
                        }
                        if (foundCard.animals === undefined) {
                            reject("No animals on selected card");
                            return;
                        }
                        foundCard.animals = Math.max(0, foundCard.animals - 2);
                    } else {
                        reject("Unknown selection");
                        return;
                    }
                    resolve();
                }
            );
        });
    }
}
