
import { Player } from "../Player";
import { Game } from "../Game";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";

export class LargeConvoy implements IProjectCard {
    public cost: number = 36;
    public tags: Array<Tags> = [Tags.EARTH, Tags.SPACE];
    public name: string = "Large Convoy";
    public cardType: CardType = CardType.EVENT;
    public text: string = "Place an ocean tile and draw 2 cards. Gain 5 plants, or add 4 animals to ANOTHER card. 2 Victory Points.";
    public description: string = "Huge delivery from Earth";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            player.setWaitingFor({
                initiator: "card",
                card: this,
                type: "SelectASpace"
            }, (spaceId: string) => {
                try { game.addOceanTile(player, spaceId); }
                catch (err) { reject(err); return; }
                player.setWaitingFor({
                    initiator: "card",
                    card: this,
                    type: "Gain5PlantsOrAdd4Animals"
                }, (input: string) => {
                    if (input === "0") {
                        player.plants += 5;
                    } else {
                        const foundCard = game.getCard(input);
                        if (foundCard === undefined) {
                            reject("card not found");
                            return;
                        }
                        foundCard.animals += 4;
                    }
                    player.cardsInHand.push(game.dealer.getCards(1)[0]);
                    player.cardsInHand.push(game.dealer.getCards(1)[0]);
                    player.victoryPoints += 2;
                    resolve();
                });
            });
        });
    }
}
