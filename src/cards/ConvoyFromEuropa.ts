
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { ISpace } from "../ISpace";
import { SelectSpace } from "../inputs/SelectSpace";

export class ConvoyFromEuropa implements IProjectCard {
    public cost: number = 15;
    public tags: Array<Tags> = [Tags.SPACE];
    public cardType: CardType = CardType.EVENT;
    public name: string = "Convoy From Europa";
    public text: string = "Place 1 ocean tile and draw 1 card";
    public description: string = "Bringing ice and other key supplies from the Jovian moon Europa";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            player.setWaitingFor(new SelectSpace(this, "Select space for ocean tile", (space: ISpace) => {
                try { game.addOceanTile(player, space.id); }
                catch (err) { reject(err); return; }
                player.cardsInHand.push(game.dealer.getCards(1)[0]);
                resolve();
            }));
        });
    }
}
