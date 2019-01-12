
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
 
export class ConvoyFromEuropa implements IProjectCard {
    public cost: number = 15;
    public tags: Array<Tags> = [Tags.SPACE];
    public cardType: CardType = CardType.EVENT;
    public name: string = "Convoy From Europa";
    public text: string = "Place 1 ocean tile and draw 1 card";
    public description: string = "Bringing ice and other key supplies from the Jovian moon Europa";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            player.setWaitingFor({
                initiator: "card",
                card: this,
                type: "SelectASpace"
            }, (spaceId: string) => {
                try { game.addOceanTile(player, spaceId); }
                catch (err) { reject(err); return; }
                player.cardsInHand.push(game.dealer.getCards(1)[0]);
                resolve();
            });
        });
    }    
}
