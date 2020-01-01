
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from "../Resources";

export class LunarBeam implements IProjectCard {
    public cost: number = 13;
    public tags: Array<Tags> = [Tags.EARTH, Tags.ENERGY];
    public name: string = "Lunar Beam";
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(player: Player, _game: Game): boolean {
        return player.megaCreditProduction >= -3;
    }
    public play(player: Player, _game: Game) {
        player.megaCreditProduction -= 2;
        player.setProduction(Resources.HEAT,2);
        player.setProduction(Resources.ENERGY,2);
        return undefined;
    }
}
