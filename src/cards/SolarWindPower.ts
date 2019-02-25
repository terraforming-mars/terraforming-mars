
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
    public text: string = "Increase your energy production 1 step and gain 2 titanium";
    public description: string = "Working those solar storms to your advantage.";
    public play(player: Player, _game: Game) {
        player.energyProduction++;
        player.titanium += 2;
        return undefined;
    }
}
