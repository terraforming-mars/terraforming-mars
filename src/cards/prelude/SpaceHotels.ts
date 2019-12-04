
import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from "../../Game";

export class SpaceHotels implements IProjectCard {
    public cost: number = 12;
    public tags: Array<Tags> = [Tags.SPACE, Tags.EARTH];
    public name: string = "Space Hotels";
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player): boolean {
       return player.getTagCount(Tags.EARTH) >= 2; 
    }
    public play(player: Player, _game: Game) {
        player.megaCreditProduction +=4;
        return undefined;
    }
}
