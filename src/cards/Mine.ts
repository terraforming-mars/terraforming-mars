
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class Mine implements IProjectCard {
    public cost: number = 4;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: string = "Mine";
    public cardType: CardType = CardType.AUTOMATED;
    public text: string = "Increase your steel production 1 step";
    public description: string = "Mars' main export industry also supplies the planet with construction materials";
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, _game: Game) {
        player.steelProduction++;
        return undefined;
    }
}
