
import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";

export class AntiGravityTechnology implements IProjectCard {
    public cost: number = 14;
    public tags: Array<Tags> = [Tags.SCIENCE];
    public name: string = "Anti-Gravity Technology";
    public cardType: CardType = CardType.ACTIVE;
    public text: string = "Requires 7 science tags, when you play a card, you pay 2 mega credit less for it.";
    public description: string = "Finally successful, anti-gravity will revolutionize everything, from households to industry and space travel.";
    public play(player: Player, _game: Game) {
        if (player.getTagCount(Tags.SCIENCE) < 7) {
            throw "Requires 7 science tags";
        }
        player.addCardDiscount(() => {
            return 2;
        });
        player.victoryPoints += 3;
        return undefined;
    }
}
