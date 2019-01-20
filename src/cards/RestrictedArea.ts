
import { IActiveProjectCard } from "./IActiveProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { TileType } from "../TileType";

export class RestrictedArea implements IActiveProjectCard {
    public cost: number = 11;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public cardType: CardType = CardType.ACTIVE;
    public name: string = "Restricted Area";
    public actionText: string = "Spend 2 mega credit to draw a card";
    public text: string = "Place a special tile";
    public description: string = "A place to conduct secret research, preventing the wrong people from getting in. Or out";
    public play(player: Player, game: Game): Promise<void> {
        return new Promise((resolve, reject) => {
            player.setWaitingFor({
                initiator: "card",
                card: this,
                type: "SelectASpace"
            }, (spaceId: string) => {
                const foundSpace = game.getSpace(spaceId);
                if (foundSpace === undefined) {
                    reject("Space not found");
                    return;
                }
                try { game.addTile(player, foundSpace.spaceType, foundSpace, { tileType: TileType.SPECIAL }); }
                catch (err) { reject(err); return; }
            });
        });
    }
    public action(player: Player, game: Game): Promise<void> {
        if (player.megaCredits < 2) {
            return Promise.reject("Must have 2 mega credits");
        }
        player.megaCredits -= 2;
        player.cardsInHand.push(game.dealer.getCards(1)[0]);
        return Promise.resolve();
    }
}
