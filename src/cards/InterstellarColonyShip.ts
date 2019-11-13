
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class InterstellarColonyShip implements IProjectCard {
    public cost: number = 24;
    public nonNegativeVPIcon: boolean = true;
    public tags: Array<Tags> = [Tags.EARTH, Tags.SPACE];
    public cardType: CardType = CardType.EVENT;
    public name: string = "Interstellar Colony Ship";
    public text: string = "Requires 5 science tags. Gain 4 victory points.";
    public requirements: string = "5 Science";
    public description: string = "To new horizons and an unknown galaxy.";
    public canPlay(player: Player): boolean {
        return player.getTagCount(Tags.SCIENCE) >= 5;
    }
    public play(player: Player, _game: Game) {
        if (player.getTagCount(Tags.SCIENCE) < 5) {
            throw "Requires 5 science tags.";
        }
        player.victoryPoints += 4;
        return undefined;
    }
}
