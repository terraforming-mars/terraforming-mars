
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
    public text: string = "Requires 2 Earth tags. Increase MC production 4 steps";
    public description: string = "Space tourism was one of the most important sources of income for the space industry";
    public canPlay(player: Player): boolean {
       return player.getTagCount(Tags.EARTH) >= 2; 
    }
    public play(player: Player, _game: Game) {
        player.megaCreditProduction +=4;
        return undefined;
    }
}
