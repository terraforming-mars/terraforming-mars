
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";

export class SolarWindPower implements IProjectCard {
    public cost: number = 11;
    public tags: Array<Tags> = [Tags.SCIENCE, Tags.SPACE, Tags.ENERGY];
    public name: string = "Solar Wind Power";
    public cardType: CardType = CardType.AUTOMATED;
    public canPlay(): boolean {
        return true;
    }
    public play(player: Player, _game: Game) {
        player.energyProduction++;
        player.titanium += 2;
        return undefined;
    }
}
